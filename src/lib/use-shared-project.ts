import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { createDefaultState, normalizeState, type TemplateState } from './comparison-store';
import { api, editToken } from './online';
import { mergeChanges } from './merge';
type Snapshot={revision:number;state:TemplateState;updatedAt:string};
type Conflict={remote:Snapshot;ancestor:TemplateState;paths:string[]};
export function useSharedProject(){
 const [state,render]=useState<TemplateState>(createDefaultState), current=useRef(state), base=useRef<Snapshot|null>(null),busy=useRef(false),stop=useRef(false);
 const [loaded,setLoaded]=useState(false),[canEdit,setCanEdit]=useState(false),[status,setStatus]=useState('Verbindung wird hergestellt …'),[error,setError]=useState(''),[conflict,setConflict]=useState<Conflict|null>(null);
 const editor=useRef(false), conflictRef=useRef<Conflict|null>(null);
 const apply=(next:TemplateState)=>{current.current=next;render(next);};
 const setState:Dispatch<SetStateAction<TemplateState>>=useCallback(next=>{if(!editor.current)return;const value=typeof next==='function'?next(current.current):next;current.current=value;render(value);setStatus('Änderungen werden gespeichert …');},[]);
 const sync=useCallback(async()=>{
  if(busy.current||conflictRef.current)return;busy.current=true;
  try{
   const raw=await (await api('/api/state')).json(); if(stop.current)return;
   const remote:Snapshot={...raw,state:normalizeState(raw.state)};
   if(!base.current){base.current=remote;apply(remote.state);setLoaded(true);}
   else if(!editor.current){base.current=remote;apply(remote.state);}
   else {
    const result=mergeChanges(base.current.state,current.current,remote.state);
    if(result.conflicts.length){const c={remote,ancestor:base.current.state,paths:result.conflicts};conflictRef.current=c;setConflict(c);setStatus('Gleichzeitige Änderungen – Entscheidung nötig');return;}
    base.current=remote;apply(result.value);
   }
   if(editor.current && JSON.stringify(current.current)!==JSON.stringify(remote.state)){
    const sent=current.current;
    const saved=await (await api('/api/state',{method:'PUT',body:JSON.stringify({revision:remote.revision,state:sent})})).json();
    if(stop.current)return;
    base.current={...saved,state:sent};setStatus(JSON.stringify(sent)===JSON.stringify(current.current)?'Online gespeichert':'Änderungen werden gespeichert …');
   }else setStatus('Gemeinsame Version · aktuell');
   setError('');
  }catch(e){if((e as {status?:number}).status===409){setStatus('Änderungen werden abgeglichen …');}else{setError((e as Error).message);setStatus('Nicht gespeichert · erneut versuchen');}}
  finally{busy.current=false;}
 },[]);
 useEffect(()=>{
  stop.current=false;
  const start=async()=>{if(editToken()){try{await api('/api/auth');editor.current=true;setCanEdit(true);}catch{setError('Bearbeitungslink ungültig. Die Ansicht bleibt lesbar.');}}await sync();};void start();
  const timer=setInterval(()=>void sync(),2000);const onFocus=()=>void sync();window.addEventListener('focus',onFocus);
  const unload=(e:BeforeUnloadEvent)=>{if(base.current && JSON.stringify(current.current)!==JSON.stringify(base.current.state)){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',unload);
  return()=>{stop.current=true;clearInterval(timer);window.removeEventListener('focus',onFocus);window.removeEventListener('beforeunload',unload);};
 },[sync]);
 const resolve=(choice:'remote'|'local')=>{const c=conflictRef.current;if(!c)return;const merged=mergeChanges(c.ancestor,current.current,c.remote.state).value;base.current=c.remote;apply(choice==='remote'?c.remote.state:merged);conflictRef.current=null;setConflict(null);void sync();};
 return {state,setState,loaded,canEdit,status,error,conflict,resolve,sync};
}
