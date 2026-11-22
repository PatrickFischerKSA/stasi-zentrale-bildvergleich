export type Block={id:string;kind:'text'|'heading'|'image'|'video'|'quote'|'divider';text:string;url:string;alt:string;caption:string;order:number};
export type SitePage={id:string;title:string;blocks:Block[];order:number};
export type NavItem={id:string;kind:'page'|'link';target:string;label:string;visible:boolean;order:number};
export type SectionLayout={id:string;order:number;visible:boolean};
export type SiteData={version:1;pages:SitePage[];navigation:NavItem[];sections:SectionLayout[]};
export const defaultSite=():SiteData=>({version:1,pages:[{id:'home',title:'Startseite',blocks:[],order:0}],navigation:[{id:'home',kind:'page',target:'home',label:'',visible:true,order:0}],sections:[]});
const rec=(x:unknown):Record<string,unknown>=>x&&typeof x==='object'&&!Array.isArray(x)?x as Record<string,unknown>:{};
const str=(x:unknown,f='')=>typeof x==='string'?x:f;
const rank=(x:unknown,f:number)=>typeof x==='number'&&Number.isFinite(x)?x:f;
export function normalizeSite(value:unknown):SiteData {
 const r=rec(value);if(!Array.isArray(r.pages))return defaultSite();
 const pages=r.pages.map((x,i)=>{const p=rec(x);return {id:str(p.id),title:str(p.title,'Neue Seite'),order:rank(p.order,i),blocks:(Array.isArray(p.blocks)?p.blocks:[]).map((x,j)=>{const b=rec(x);return {id:str(b.id),kind:str(b.kind,'text') as Block['kind'],text:str(b.text),url:str(b.url),alt:str(b.alt),caption:str(b.caption),order:rank(b.order,j)};})};}).filter(p=>p.id);
 if(!pages.some(p=>p.id==='home'))pages.unshift(defaultSite().pages[0]);
 return {version:1,pages,navigation:(Array.isArray(r.navigation)?r.navigation:defaultSite().navigation).map((x,i)=>{const n=rec(x);return {id:str(n.id),kind:str(n.kind,'page') as NavItem['kind'],target:str(n.target),label:str(n.label),visible:n.visible!==false,order:rank(n.order,i)};}),sections:(Array.isArray(r.sections)?r.sections:[]).map((x,i)=>{const s=rec(x);return {id:str(s.id),visible:s.visible!==false,order:rank(s.order,i)};})};
}
export const sorted=<T extends {id:string;order:number}>(items:T[])=>[...items].sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
export function moveItem<T extends {id:string;order:number}>(items:T[],id:string,direction:number):T[]{const list=sorted(items),i=list.findIndex(x=>x.id===id),j=i+direction;if(i<0||j<0||j>=list.length)return items;[list[i],list[j]]=[list[j],list[i]];return list.map((x,order)=>({...x,order}));}
export function newBlock(kind:Block['kind'],order:number):Block{return {id:crypto.randomUUID(),kind,text:'',url:'',alt:'',caption:'',order};}
export function pageHref(id:string,href=location.href){const u=new URL(href);if(id==='home')u.searchParams.delete('page');else u.searchParams.set('page',id);return u.pathname+u.search+u.hash;}
export function safeLink(value:string){return /^https?:\/\/[^\s]+$/i.test(value)||/^#[a-zA-Z][\w-]*$/.test(value);}
