import { useCanEdit } from '@/lib/editing';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { uploadMedia } from '@/lib/online';
export function MediaUpload({value,onChange,kind,label}: {value:string;onChange:(value:string)=>void;kind:'image'|'video';label:string}) {
 const canEdit=useCanEdit();
 const change=useRef(onChange); change.current=onChange;
 const input=useRef<HTMLInputElement>(null); const [busy,setBusy]=useState(false);
 async function read(file?: File) {
  if(!file || !canEdit) return;
  if(!file.type.startsWith(kind+'/')) { toast.error(`Bitte eine ${kind==='image'?'Bild':'Video'}datei wählen.`); return; }
  if(file.size > (kind==='image'?15:60)*1024*1024) { toast.error(kind==='image'?'Bild zu groß (max. 15 MB).':'Video zu groß (max. 60 MB).'); return; }
  setBusy(true);
  try { const data=await uploadMedia(file); change.current(data); } catch(e) {toast.error((e as Error).message || 'Datei konnte nicht hochgeladen werden.');} finally {setBusy(false);if(input.current)input.current.value='';}
 }
 return <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();void read(e.dataTransfer.files[0]);}}>
  <input disabled={!canEdit} ref={input} type="file" accept={kind+'/*'} className="hidden" aria-label={label} onChange={e=>void read(e.target.files?.[0])}/>
  {value ? kind==='image' ? <img src={value} alt={label} className="block h-auto max-h-[70vh] w-full max-w-full object-contain bg-ink/5"/> : <video src={value} controls preload="metadata" className="h-auto max-h-[70vh] w-full max-w-full bg-ink"/> : <button type="button" disabled={busy || !canEdit} onClick={()=>input.current?.click()} className="empty-slot flex min-h-48 w-full flex-col items-center justify-center gap-2 border border-dashed border-input p-4"><span className="file-label">{!canEdit ? label+" · noch kein Medium" : busy?'Datei wird geladen …':label+' einfügen'}</span><span className="text-xs text-muted-foreground">{canEdit?"Klicken oder Datei hierher ziehen":"Mit Bearbeitungslink können Medien eingefügt werden"}</span></button>}
  <div className="my-2 flex gap-2 print:hidden">{value && canEdit && <><Button disabled={busy || !canEdit} onClick={()=>input.current?.click()} aria-label={label+' ersetzen'}>Ersetzen</Button><Button onClick={()=>onChange('')} aria-label={label+' entfernen'}>Entfernen</Button></>}</div>
 </div>;
}
