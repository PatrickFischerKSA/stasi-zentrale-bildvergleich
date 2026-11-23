import {newBlock,type Block,type SitePage} from './site-model';
export type PageLayout='article'|'image-text'|'gallery'|'poster';
export const pageTemplates=[
 {id:'blank',name:'Leere Seite',description:'Ohne vorgegebene Inhalte beginnen.',layout:'article',kinds:[]},
 {id:'article',name:'Artikel',description:'Überschrift, Einleitung, Bild und Fliesstext.',layout:'article',kinds:['heading','text','image','text']},
 {id:'image-text',name:'Bild mit Text',description:'Bild und sichtbarer Text nebeneinander; auf Mobilgeräten untereinander.',layout:'image-text',kinds:['image','text']},
 {id:'gallery',name:'Galerie',description:'Mehrere Bilder mit Bildunterschriften in einem Raster.',layout:'gallery',kinds:['image','image','image']},
 {id:'poster',name:'Vorstellungsplakat',description:'Ein grosses Bild mit Steckbrief und sichtbarer Beschreibung.',layout:'poster',kinds:['image','heading','text','quote']},
] as const;
export type TemplateId=typeof pageTemplates[number]['id'];
export function templateBlocks(id:TemplateId):Block[]{const template=pageTemplates.find(t=>t.id===id)||pageTemplates[0];return template.kinds.map((kind,order)=>({...newBlock(kind,order),text:kind==='heading'?'Überschrift ergänzen':kind==='text'?(id==='poster'?'Name / Figur:\nHintergrund:\nZiele und Beziehungen:\n\nBeschreibung ergänzen.':'Ihren sichtbaren Text hier eingeben.'):kind==='quote'?'Zitat und Quelle ergänzen.':''}));}
export function duplicatePage(page:SitePage,order:number):SitePage{return {...page,id:crypto.randomUUID(),title:(page.title+' – Kopie').slice(0,200),order,blocks:page.blocks.map(b=>({...b,id:crypto.randomUUID()}))};}
export function appendTemplate(page:SitePage,id:TemplateId):SitePage{const offset=page.blocks.length?Math.max(...page.blocks.map(b=>b.order))+1:0;const blocks=templateBlocks(id).map(b=>({...b,order:b.order+offset}));return {...page,layout:pageTemplates.find(t=>t.id===id)?.layout||'article',blocks:[...page.blocks,...blocks]};}
