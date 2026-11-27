import {sorted,type Block} from './site-model';
export type StoryStation={heading?:Block;blocks:Block[]};
export type StoryChapter={heading:Block;number:string;title:string;stations:StoryStation[]};
export function storySections(blocks:Block[]){
 const intro:Block[]=[],chapters:StoryChapter[]=[];
 let current:StoryChapter|undefined,station:StoryStation|undefined;
 for(const block of sorted(blocks)){
  const match=block.kind==='heading'&&block.text.match(/^(\d+)\s*[·.]\s*(.+)$/);
  if(match||block.kind==='heading'&&/^Quellen\b/.test(block.text)){
   current={heading:block,number:match?match[1]:'',title:match?match[2]:block.text,stations:[]};
   chapters.push(current);station=undefined;
  }else if(!current)intro.push(block);
  else if(block.kind==='heading'){
   station={heading:block,blocks:[]};current.stations.push(station);
  }else{
   if(!station){station={blocks:[]};current.stations.push(station);}
   station.blocks.push(block);
  }
 }
 return {intro,chapters};
}
