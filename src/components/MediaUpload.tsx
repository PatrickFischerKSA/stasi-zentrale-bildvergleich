import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
export function MediaUpload({value,onChange,kind,label}: {value:string;onChange:(value:string)=>void;kind:'image'|'video';label:string}) {
 const input=useRef<HTMLInputElement>(null); const [busy,setBusy]=useState(false);
 async function read(file?: File) {
  if(!file) return;
  if(!file.type.startsWith(kind+'/')) { toast.error(`Bitte eine ${kind==='image'?'Bild':'Video'}datei wählen.`); return; }
  if(file.size > (kind==='image'?15:100)*1024*1024) { toast.error(kind==='image'?'Bild zu groß (max. 15 MB).':'Video zu groß (max. 100 MB).'); return; }
  setBusy(true);
  try { const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);}); onChange(data); } catch {toast.error('Datei konnte nicht gelesen werden.');} finally {setBusy(false);if(input.current)input.current.value='';}
 }
 return <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();void read(e.dataTransfer.files[0]);}}>
  <input ref={input} type="file" accept={kind+'/*'} className="hidden" aria-label={label} onChange={e=>void read(e.target.files?.[0])}/>
  {value ? kind==='image' ? <img src={value} alt={label} className="h-56 w-full object-contain bg-ink/5"/> : <video src={value} controls preload="metadata" className="h-56 w-full bg-ink"/> : <button type="button" disabled={busy} onClick={()=>input.current?.click()} className="empty-slot flex min-h-48 w-full flex-col items-center justify-center gap-2 border border-dashed border-input p-4"><span className="file-label">{busy?'Datei wird geladen …':label+' einfügen'}</span><span className="text-xs text-muted-foreground">Klicken oder Datei hierher ziehen</span></button>}
  <div className="my-2 flex gap-2 print:hidden">{value && <><Button disabled={busy} onClick={()=>input.current?.click()} aria-label={label+' ersetzen'}>Ersetzen</Button><Button onClick={()=>onChange('')} aria-label={label+' entfernen'}>Entfernen</Button></>}</div>
 </div>;
}
