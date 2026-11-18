import {describe,it,expect} from 'vitest';
import worker from './index.mjs';
const origin='https://stasi-zentrale-gemeinsam.patrick-fischer.workers.dev';
describe('Online API Schutz und Medien',()=>{
 it('verweigert Schreiben ohne Schlüssel',async()=>{const r=await worker.fetch(new Request(origin+'/api/state',{method:'PUT',body:'{}'}),{});expect(r.status).toBe(401);});
 it('verweigert fremde Browser-Origins',async()=>{const r=await worker.fetch(new Request(origin+'/api/state',{headers:{Origin:'https://example.org'}}),{});expect(r.status).toBe(403);});
 it('erlaubt die Pages-Origin im CORS-Preflight',async()=>{const r=await worker.fetch(new Request(origin+'/api/state',{method:'OPTIONS',headers:{Origin:'https://patrickfischerksa.github.io'}}),{});expect(r.status).toBe(204);expect(r.headers.get('Access-Control-Allow-Origin')).toBe('https://patrickfischerksa.github.io');});
 it('verweigert falsche Schlüssel',async()=>{const r=await worker.fetch(new Request(origin+'/api/auth',{headers:{Authorization:'Bearer wrong'}}),{EDIT_TOKEN_HASH:'x'});expect(r.status).toBe(401);});
 it('liefert komplette Medien mit HTTP 200',async()=>{const r=await worker.fetch(new Request(origin+'/media/11111111-1111-1111-1111-111111111111'),{MEDIA:{get:async()=>({body:'png',size:3,range:{offset:0,length:3},httpEtag:'"a"',writeHttpMetadata(h){h.set('Content-Type','image/png');}})}});expect(r.status).toBe(200);expect(await r.text()).toBe('png');});
 it('liefert angeforderte Videoabschnitte mit HTTP 206',async()=>{const r=await worker.fetch(new Request(origin+'/media/11111111-1111-1111-1111-111111111111',{headers:{Range:'bytes=2-4'}}),{MEDIA:{get:async()=>({body:'vid',size:10,range:{offset:2,length:3},httpEtag:'"a"',writeHttpMetadata(h){h.set('Content-Type','video/mp4');}})}});expect(r.status).toBe(206);expect(r.headers.get('Content-Range')).toBe('bytes 2-4/10');});
});
