import {validSite,preserveSiteSettings} from './site-schema.mjs';
const ORIGINS = new Set(['https://patrickfischerksa.github.io','http://127.0.0.1:5178','http://127.0.0.1:5173','http://localhost:5173']);
const TYPES = new Set(['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm','video/quicktime','video/ogg']);
function json(body, status=200) {return Response.json(body,{status,headers:{'Cache-Control':'no-store'}});}
async function authorized(request,env) {
 const token=request.headers.get('Authorization')?.replace(/^Bearer /,'') || '';
 if(!token || !env.EDIT_TOKEN_HASH) return false;
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 return hash===env.EDIT_TOKEN_HASH;
}
export function validState(s,origin) {
 if(!validSite(s?.site,origin))return false;
 if(!s || typeof s.heading!=='string' || typeof s.intro!=='string' || !s.book || !s.media || !Array.isArray(s.pairs) || s.pairs.length>50) return false;
 const strings=(o,keys)=>keys.every(k=>typeof o?.[k]==='string' && o[k].length<=50000);
 const media=(v)=>!v || (typeof v==='string' && new RegExp('^'+origin.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'/media/[a-f0-9-]{36}$').test(v));
 return strings(s.book,['heading','title','author','text']) && strings(s.media,['heading','text']) && ['video','image1','image2'].every(k=>strings(s.media[k],['data','caption']) && media(s.media[k].data)) && new Set(s.pairs.map(p=>p.id)).size===s.pairs.length && s.pairs.every(p=>strings(p,['id','title','location','note']) && /^[a-f0-9-]{36}$/.test(p.id) && ['past','now'].every(k=>strings(p[k],['label','date','source','image']) && media(p[k].image)));
}
export async function handle(request,env) {
 const url=new URL(request.url);
 if(url.pathname==='/health')return json({ok:true});
 if(url.pathname==='/api/state' && request.method==='GET') {
  const row=await env.DB.prepare('SELECT * FROM project WHERE id=1').first();
  return json({revision:row.revision,state:row.state?JSON.parse(row.state):null,updatedAt:row.updated_at});
 }
 if(url.pathname.startsWith('/media/') && ['GET','HEAD'].includes(request.method)) {
  const key=url.pathname.slice(7); if(!/^[a-f0-9-]{36}$/.test(key))return json({error:'Nicht gefunden'},404);
  const obj=await env.MEDIA.get(key,{range:request.headers}); if(!obj)return json({error:'Nicht gefunden'},404);
  const headers=new Headers({'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','Content-Security-Policy':"default-src 'none'; sandbox"});obj.writeHttpMetadata(headers);headers.set('ETag',obj.httpEtag);
  let status=200;
  if(request.headers.has('Range') && obj.range && 'offset' in obj.range){status=206;headers.set('Content-Range',`bytes ${obj.range.offset}-${obj.range.offset+obj.range.length-1}/${obj.size}`);headers.set('Content-Length',String(obj.range.length));}else headers.set('Content-Length',String(obj.size));
  return new Response(request.method==='HEAD'?null:obj.body,{status,headers});
 }
 if(!await authorized(request,env))return json({error:'Bearbeitungslink erforderlich oder ungültig.'},401);
 if(url.pathname==='/api/auth')return json({ok:true});
 if(url.pathname==='/api/upload' && request.method==='POST') {
  const type=(request.headers.get('content-type')||'').split(';')[0];
  const length=Number(request.headers.get('content-length'));
  if(!TYPES.has(type))return json({error:'Unterstützt: JPG, PNG, WebP, GIF, AVIF, MP4, WebM, MOV, OGG.'},415);
  const limit=type.startsWith('image/')?15*1024*1024:60*1024*1024;
  if(!length || length>limit)return json({error:'Datei zu groß (Bild max. 15 MB, Video max. 60 MB).'},413);
  const key=crypto.randomUUID();await env.MEDIA.put(key,request.body,{httpMetadata:{contentType:type}});
  return json({url:url.origin+'/media/'+key},201);
 }
 if(url.pathname==='/api/state' && request.method==='PUT') {
  if(Number(request.headers.get('content-length'))>600000)return json({error:'Projekt zu groß'},413);
  const raw=await request.text();if(raw.length>600000)return json({error:'Projekt zu groß'},413);
  let data;try{data=JSON.parse(raw);}catch{return json({error:'Ungültige Daten'},400);}
  // Preserve new site management data when an older open client saves legacy fields.
  if(data?.state && typeof data.state==='object' && !Array.isArray(data.state)){
   const existing=await env.DB.prepare('SELECT state FROM project WHERE id=1').first();if(existing?.state){const previous=JSON.parse(existing.state);if(previous.site)data.state.site=data.state.site===undefined?previous.site:preserveSiteSettings(data.state.site,previous.site);}
  }
  if(!Number.isSafeInteger(data.revision)||!validState(data.state,url.origin))return json({error:'Ungültige Projektdaten oder Medienadressen'},400);
  const state=JSON.stringify(data.state), now=new Date().toISOString();
  // Snapshot and compare-and-swap update are one transaction. A stale revision changes nothing.
  const results=await env.DB.batch([
   env.DB.prepare('INSERT OR IGNORE INTO history(revision,state,updated_at) SELECT revision,state,updated_at FROM project WHERE id=1 AND revision=? AND state IS NOT NULL').bind(data.revision),
   env.DB.prepare('UPDATE project SET state=?, revision=revision+1, updated_at=? WHERE id=1 AND revision=? RETURNING revision').bind(state,now,data.revision),
   env.DB.prepare('DELETE FROM history WHERE revision < (SELECT revision FROM project WHERE id=1)-50')
  ]);
  if(!results[1].results.length)return json({error:'Die gemeinsame Version wurde inzwischen geändert.'},409);
  return json({revision:data.revision+1,state:data.state,updatedAt:now});
 }
 if(url.pathname==='/api/history' && request.method==='GET')return json({versions:(await env.DB.prepare('SELECT revision,updated_at FROM history ORDER BY revision DESC LIMIT 50').all()).results});
 if(/^\/api\/history\/\d+$/.test(url.pathname) && request.method==='GET'){
  const row=await env.DB.prepare('SELECT * FROM history WHERE revision=?').bind(Number(url.pathname.split('/').pop())).first();
  return row?json({revision:row.revision,state:JSON.parse(row.state),updatedAt:row.updated_at}):json({error:'Version nicht gefunden'},404);
 }
 return json({error:'Nicht gefunden'},404);
}
export default {async fetch(request,env){
 const origin=request.headers.get('Origin');
 if(origin && !ORIGINS.has(origin))return json({error:'Origin nicht erlaubt'},403);
 let response;
 try{response=request.method==='OPTIONS'?new Response(null,{status:204}):await handle(request,env);}catch(error){console.error(error);response=json({error:'Online-Speicher momentan nicht verfügbar. Bitte erneut versuchen.'},500);}
 const headers=new Headers(response.headers);
 if(origin){headers.set('Access-Control-Allow-Origin',origin);headers.set('Vary','Origin');}
 headers.set('Access-Control-Allow-Methods','GET, HEAD, PUT, POST, OPTIONS');headers.set('Access-Control-Allow-Headers','Authorization, Content-Type');headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','no-referrer');
 return new Response(response.body,{status:response.status,headers});
}};
