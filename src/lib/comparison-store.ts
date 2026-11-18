export type Picture = { label: string; date: string; source: string; image: string };
export type Pair = { id: string; title: string; location: string; note: string; past: Picture; now: Picture };
export type Book = { heading: string; title: string; author: string; text: string };
export type MediaItem = { data: string; caption: string };
export type Media = { heading: string; text: string; video: MediaItem; image1: MediaItem; image2: MediaItem };
export type TemplateState = { heading: string; intro: string; book: Book; media: Media; pairs: Pair[] };
export const createPair = (title = 'Neuer Vergleich'): Pair => ({id: crypto.randomUUID(), title, location:'', note:'', past:{label:'1989',date:'1989',source:'',image:''}, now:{label:'Heute',date:String(new Date().getFullYear()),source:'',image:''}});
const bookDefault = (): Book => ({heading:'Zusammenhang mit dem Buch',title:'',author:'',text:''});
const mediaDefault = (): Media => ({heading:'Bilder und Video',text:'',video:{data:'',caption:''},image1:{data:'',caption:''},image2:{data:'',caption:''}});
export function createDefaultState(): TemplateState { return {heading:'Stasi-Zentrale: 1989 und heute',intro:'Ein Bildvergleich der ehemaligen Zentrale des Ministeriums für Staatssicherheit in Berlin-Lichtenberg. Ziehe den Regler, um zwischen damals und heute zu wechseln.', book:bookDefault(),media:mediaDefault(),pairs:[createPair('Haus 1 – Hof und Hauptgebäude'),createPair('Büro von Erich Mielke'),createPair('Eingang Normannenstraße')]}; }
function record(value: unknown): Record<string, unknown> { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function str(value: unknown, fallback = '') { return typeof value === 'string' ? value : fallback; }
function item(value: unknown): MediaItem { const r=record(value); return {data:str(r.data),caption:str(r.caption)}; }
function picture(value: unknown, fallback: Picture): Picture { const r=record(value); return {label:str(r.label,fallback.label),date:str(r.date,fallback.date),source:str(r.source),image:str(r.image)}; }
export function normalizeState(value: unknown): TemplateState {
 const r=record(value), defaults=createDefaultState(), b=record(r.book), m=record(r.media);
 return {heading:str(r.heading,defaults.heading),intro:str(r.intro,defaults.intro),book:{heading:str(b.heading,defaults.book.heading),title:str(b.title),author:str(b.author),text:str(b.text)},media:{heading:str(m.heading,defaults.media.heading),text:str(m.text),video:item(m.video),image1:item(m.image1),image2:item(m.image2)},pairs:Array.isArray(r.pairs) ? r.pairs.filter(v=>v && typeof v==='object').map(v=>{const x=record(v),d=createPair();return {id:str(x.id,d.id),title:str(x.title,d.title),location:str(x.location),note:str(x.note),past:picture(x.past,d.past),now:picture(x.now,d.now)};}) : defaults.pairs};
}
export function openDatabase(): Promise<IDBDatabase> {
 return new Promise((resolve,reject)=>{const request=indexedDB.open('stasi-zentrale-bildvergleich',1); request.onupgradeneeded=()=>request.result.createObjectStore('template'); request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error); request.onblocked=()=>reject(new Error('Speicher durch anderen Tab blockiert'));});
}
async function transact(mode: IDBTransactionMode, operation: (store: IDBObjectStore)=>IDBRequest): Promise<unknown> {
 const db=await openDatabase();
 try { return await new Promise((resolve,reject)=>{const tx=db.transaction('template',mode); const request=operation(tx.objectStore('template')); tx.oncomplete=()=>resolve(request.result); tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error ?? new Error('Speichern abgebrochen'));}); } finally { db.close(); }
}
export async function loadState(): Promise<TemplateState | null> { const value=await transact('readonly',s=>s.get('current')); return value ? normalizeState(value) : null; }
export async function saveState(state: TemplateState) { await transact('readwrite',s=>s.put(state,'current')); }
export async function clearState() { await transact('readwrite',s=>s.delete('current')); }
