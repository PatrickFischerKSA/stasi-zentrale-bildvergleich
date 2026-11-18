export type MergeResult<T> = { value: T; conflicts: string[] };
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const object=(x:unknown): x is Record<string,unknown> => !!x && typeof x==='object' && !Array.isArray(x);
// Three-way merge by field, with comparison pairs matched by stable IDs.
export function mergeChanges<T>(base:T, local:T, remote:T): MergeResult<T> {
 const conflicts:string[]=[];
 function merge(b:unknown,l:unknown,r:unknown,path:string):unknown {
  if(same(l,b))return r;if(same(r,b)||same(l,r))return l;
  if(Array.isArray(b)&&Array.isArray(l)&&Array.isArray(r)) {
   const keyed=(arr:unknown[])=>arr.every(x=>object(x)&&typeof x.id==='string');
   if(keyed(b)&&keyed(l)&&keyed(r)){
    const map=(a:unknown[])=>new Map(a.map(x=>[(x as {id:string}).id,x]));const bm=map(b),lm=map(l),rm=map(r);
    const ids=[...new Set([...r,...l].map(x=>(x as {id:string}).id))];
    return ids.map(id=>merge(bm.get(id),lm.get(id),rm.get(id),path+'/'+id)).filter(x=>x!==undefined);
   }
  }
  if(object(b)&&object(l)&&object(r)) {
   const result:Record<string,unknown>={};for(const k of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){const v=merge(b[k],l[k],r[k],path+'/'+k);if(v!==undefined)result[k]=v;}return result;
  }
  conflicts.push(path);return l;
 }
 return {value:merge(base,local,remote,'') as T,conflicts};
}
