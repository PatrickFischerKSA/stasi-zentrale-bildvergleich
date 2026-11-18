export const API = 'https://stasi-zentrale-gemeinsam.patrick-fischer.workers.dev';
export function editToken() {
 const hash=new URLSearchParams(location.hash.slice(1));const token=hash.get('edit');
 if(token) sessionStorage.setItem('stasi-edit-token',token);
 return token || sessionStorage.getItem('stasi-edit-token') || '';
}
export async function api(path:string,init:RequestInit={}) {
 const response=await fetch(API+path,{...init,headers:{...(init.body && typeof init.body==='string'?{'Content-Type':'application/json'}:{}),...(editToken()?{Authorization:'Bearer '+editToken()}:{}),...init.headers}});
 if(!response.ok){const body=await response.json().catch(()=>({}));throw Object.assign(new Error(body.error || 'Verbindung fehlgeschlagen'),{status:response.status});}
 return response;
}
export async function uploadMedia(file:File):Promise<string> {
 const response=await api('/api/upload',{method:'POST',headers:{'Content-Type':file.type},body:file});return (await response.json()).url;
}

export async function importLocalMedia(state:import('./comparison-store').TemplateState) {
 const next=structuredClone(state);
 async function uploadData(value:string) {
  if(!value || value.startsWith(API+'/media/'))return value;
  if(!value.startsWith('data:'))throw new Error('Ein altes Medium hat eine nicht unterstützte Adresse. Bitte neu hochladen.');
  const blob=await (await fetch(value)).blob();return uploadMedia(new File([blob],'medium',{type:blob.type}));
 }
 for(const key of ['video','image1','image2'] as const)next.media[key].data=await uploadData(next.media[key].data);
 for(const pair of next.pairs)for(const key of ['past','now'] as const)pair[key].image=await uploadData(pair[key].image);
 return next;
}
