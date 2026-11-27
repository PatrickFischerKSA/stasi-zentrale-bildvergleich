import type {ReactNode} from 'react';
import {storySections,type StoryStation} from '@/lib/story-sections';
import {HomeSection,HomeSections} from './site-manager';
import {sorted,type SectionLayout,type Block,type SitePage} from '@/lib/site-model';
import './kaelter-story.css';

function Copy({text}:{text:string}){
 return <>{text.split(/(https?:\/\/[^\s]+)/g).map((part,i)=>/^https?:\/\//.test(part)?<a key={i} href={part} target="_blank" rel="noreferrer">{part}</a>:part)}</>;
}
type Edit=(id:string)=>void;
function EditButton({block,onEdit}:{block:Block;onEdit?:Edit}){
 return onEdit?<button className="story-edit" type="button" onClick={()=>onEdit(block.id)} aria-label={'Bearbeiten: '+(block.alt||block.text).slice(0,65)}>Bearbeiten ↗</button>:null;
}
function Media({block,onEdit}:{block:Block;onEdit?:Edit}){
 return <figure className={'story-media story-media-'+block.kind+' story-width-'+(block.imageWidth||'full')} data-story-block={block.id}>
  <div className="story-media-frame">{block.kind==='video'?<video controls playsInline preload="metadata" src={block.url} aria-label={block.alt||'Video'}/>:<img loading="lazy" src={block.url} alt={block.alt} style={{objectFit:block.imageFit||'contain',...(block.imageAspect&&block.imageAspect!=='auto'?{aspectRatio:block.imageAspect.replace(':',' / ')}:{})}}/>}</div>
  {block.caption&&<figcaption><Copy text={block.caption}/></figcaption>}<EditButton block={block} onEdit={onEdit}/>
 </figure>;
}
function BodyBlock({block,onEdit}:{block:Block;onEdit?:Edit}){
 if(['image','video'].includes(block.kind))return <Media block={block} onEdit={onEdit}/>;
 return <div className={'story-copy-block story-kind-'+block.kind} data-story-block={block.id}>
  {block.kind==='quote'?<blockquote>{block.text.replace(/^[„"]|[“"]$/g,'')}</blockquote>:block.kind==='divider'?<hr/>:<p><Copy text={block.text}/></p>}
  <EditButton block={block} onEdit={onEdit}/>
 </div>;
}
function Station({station,onEdit,dark}:{station:StoryStation;onEdit?:Edit;dark:boolean}){
 const body:ReactNode[]=[];
 for(let i=0;i<station.blocks.length;i++){
  const block=station.blocks[i];
  // Consecutive photographs form visual comparisons rather than a stack of large images.
  if(block.kind==='image'&&station.blocks[i+1]?.kind==='image'){
   const next=station.blocks[++i];
   body.push(<div className="story-diptych" key={block.id}><Media block={block} onEdit={onEdit}/><Media block={next} onEdit={onEdit}/></div>);
  }else body.push(<BodyBlock key={block.id} block={block} onEdit={onEdit}/>);
 }
 return <section className={'story-station'+(dark?' story-dark':'')}>
  {station.heading&&<header className="story-station-header" data-story-block={station.heading.id}><h3>{station.heading.text}</h3><EditButton block={station.heading} onEdit={onEdit}/></header>}
  <div className="story-station-body">{body}</div>
 </section>;
}

export function KaelterStory({page,onEdit,layouts=[]}:{page:SitePage;onEdit?:Edit;layouts?:SectionLayout[]}){
 const {intro,chapters}=storySections(page.blocks);
 const deck=intro.find(b=>b.id==='story-hero-deck');
 const all=sorted(page.blocks);
 const cover=all.find(b=>b.kind==='image'&&b.alt.includes('Beleuchtetes Konzerthaus'))||all.find(b=>b.kind==='image');
 // The cover is used once: at the opening, then recalled by the contemporary comparison.
 const displayed=chapters.map(c=>({...c,stations:c.stations.map(s=>({...s,blocks:s.blocks.filter(b=>b.id!==cover?.id)}))}));
 return <main className="kaelter-story">
  <header className="story-hero" id="anfang">
   <div className="story-hero-copy"><p className="story-eyebrow">Andreas Pflüger · Berlin 1989 / 2026</p><h1>{page.title||'Kälter'}</h1><div className="story-deck" data-story-block={deck?.id}><p>{deck?.text||"Eine Stadt im Umbruch.\nEine Frau auf der Jagd."}</p>{deck&&<EditButton block={deck} onEdit={onEdit}/>}</div>
    {intro.filter(b=>b.id!==cover?.id&&b.id!==deck?.id).map(b=><BodyBlock key={b.id} block={b} onEdit={onEdit}/>)}
    <a className="story-start" href="#kapitel-1">Die Geschichte entdecken <span aria-hidden="true">↓</span></a>
   </div>
   {cover&&<div className="story-hero-picture"><Media block={cover} onEdit={onEdit}/><span className="story-cover-label" aria-hidden="true">Berlin. Damals und heute.</span></div>}
   <div className="story-hero-index" aria-hidden="true"><span>Literatur</span><span>Geschichte</span><span>Gegenwart</span></div>
  </header>
  <nav className="story-chapter-nav" aria-label="Kapitel der Scrollstory">{chapters.filter(c=>layouts.find(l=>l.id==='story-'+c.heading.id)?.visible!==false).sort((a,b)=>(layouts.find(l=>l.id==='story-'+a.heading.id)?.order??chapters.indexOf(a))-(layouts.find(l=>l.id==='story-'+b.heading.id)?.order??chapters.indexOf(b))).map(c=><a key={c.heading.id} href={'#kapitel-'+(c.number||'quellen')}><span>{c.number?c.number.padStart(2,'0'):'↗'}</span>{' '}{c.number?c.title:c.heading.text}</a>)}</nav>
  <HomeSections>{displayed.map((chapter,i)=><HomeSection key={chapter.heading.id} id={'story-'+chapter.heading.id} label={chapter.title}><div className={'story-chapter story-chapter-'+(chapter.number||'quellen')} id={'kapitel-'+(chapter.number||'quellen')}>
   <header className="story-chapter-heading" data-story-block={chapter.heading.id}><span className="story-chapter-number" aria-hidden="true">{chapter.number?chapter.number.padStart(2,'0'):'↗'}</span><div><p className="story-eyebrow">{chapter.number?'Kälter · Die Scrollstory':'Zum Weiterlesen'}</p><h2>{chapter.title}</h2><EditButton block={chapter.heading} onEdit={onEdit}/></div></header>
   {chapter.stations.map((station,j)=><Station key={station.heading?.id||'intro'} station={station} onEdit={onEdit} dark={chapter.number==='3'||chapter.number==='5'&&j===0||chapter.number==='2'&&j===1}/>)}
   {i<displayed.length-1&&<div className="story-chapter-end" aria-hidden="true">↓</div>}
  </div></HomeSection>)}</HomeSections>
  <footer className="story-footer"><span>Kälter · Andreas Pflüger</span><a href="#anfang">Zurück zum Anfang ↑</a></footer>
 </main>;
}
