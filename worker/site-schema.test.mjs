import {it,expect} from 'vitest';
import {validSite} from './site-schema.mjs';
const origin='https://own.example';
const site=()=>({version:1,pages:[{id:'home',title:'Start',blocks:[],order:0}],navigation:[{id:'home',kind:'page',target:'home',label:'',visible:true,order:0}],sections:[]});
it('akzeptiert alte Stände und gültige neue Seiten',()=>{expect(validSite(undefined,origin)).toBe(true);expect(validSite(site(),origin)).toBe(true);});
it('verweigert Skriptadressen, fremde Medien und kaputte Seitenziele',()=>{const s=site();s.navigation[0]={...s.navigation[0],kind:'link',target:'javascript:alert(1)'};expect(validSite(s,origin)).toBe(false);s.navigation[0]={...s.navigation[0],kind:'page',target:'missing'};expect(validSite(s,origin)).toBe(false);s.navigation=[];s.pages[0].blocks=[{id:'b',kind:'image',text:'',url:'https://other.example/media/11111111-1111-1111-1111-111111111111',alt:'',caption:'',order:0}];expect(validSite(s,origin)).toBe(false);});
it('akzeptiert ausschliesslich Medien des jeweiligen Projekts',()=>{const s=site();s.pages[0].blocks=[{id:'b',kind:'video',text:'',url:origin+'/media/11111111-1111-1111-1111-111111111111',alt:'Video',caption:'Quelle',order:0}];expect(validSite(s,origin)).toBe(true);});
it('verweigert doppelte Seiten, fehlende Startseite und übergrosse Inhalte',()=>{const s=site();s.pages.push({...s.pages[0]});expect(validSite(s,origin)).toBe(false);s.pages=[];expect(validSite(s,origin)).toBe(false);const t=site();t.pages[0].title='x'.repeat(201);expect(validSite(t,origin)).toBe(false);});
