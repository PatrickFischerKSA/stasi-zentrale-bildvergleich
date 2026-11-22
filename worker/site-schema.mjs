const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const string=(x,max=50000)=>typeof x==='string'&&x.length<=max;
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(x);
const rank=x=>Number.isSafeInteger(x)&&Math.abs(x)<100000;
const unique=a=>new Set(a.map(x=>x?.id)).size===a.length;
export const safeLink=x=>typeof x==='string'&&(/^https?:\/\/[^\s]+$/i.test(x)||/^#[a-zA-Z][\w-]*$/.test(x));
export function validSite(s,origin){
 if(s===undefined)return true; // Legacy documents and older open clients remain supported.
 if(!object(s)||s.version!==1||!Array.isArray(s.pages)||s.pages.length>50||!s.pages.some(p=>p?.id==='home')||!unique(s.pages))return false;
 if(!s.pages.every(p=>object(p)&&id(p.id)&&string(p.title,200)&&rank(p.order)&&Array.isArray(p.blocks)&&p.blocks.length<=80&&unique(p.blocks)&&p.blocks.every(b=>object(b)&&id(b.id)&&['text','heading','image','video','quote','divider'].includes(b.kind)&&rank(b.order)&&string(b.text,20000)&&string(b.alt,1000)&&string(b.caption,5000)&&string(b.url,500)&&(!b.url||(b.url.startsWith(origin+'/media/')&&/^[a-f0-9-]{36}$/.test(b.url.slice((origin+'/media/').length)))))))return false;
 if(!Array.isArray(s.navigation)||s.navigation.length>100||!unique(s.navigation)||!s.navigation.every(n=>object(n)&&id(n.id)&&rank(n.order)&&typeof n.visible==='boolean'&&string(n.label,200)&&((n.kind==='page'&&s.pages.some(p=>p.id===n.target))||(n.kind==='link'&&safeLink(n.target)))))return false;
 return Array.isArray(s.sections)&&s.sections.length<=100&&unique(s.sections)&&s.sections.every(x=>object(x)&&id(x.id)&&rank(x.order)&&typeof x.visible==='boolean');
}
