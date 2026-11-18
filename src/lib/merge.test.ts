import {describe,it,expect} from 'vitest';
import {mergeChanges} from './merge';
describe('gleichzeitige Bearbeitung',()=>{
 it('führt Änderungen an verschiedenen Feldern zusammen',()=>{expect(mergeChanges({a:'alt',b:'alt'},{a:'neu',b:'alt'},{a:'alt',b:'anders'})).toEqual({value:{a:'neu',b:'anders'},conflicts:[]});});
 it('meldet widersprüchliche Änderungen am selben Feld',()=>{const m=mergeChanges({a:'alt'},{a:'meins'},{a:'deins'});expect(m.conflicts).toEqual(['/a']);expect(m.value.a).toBe('meins');});
 it('führt verschiedene Bildpaare per ID zusammen',()=>{const base=[{id:'a',title:'A'},{id:'b',title:'B'}];const m=mergeChanges(base,[{id:'a',title:'Mein A'},base[1]],[base[0],{id:'b',title:'Dein B'}]);expect(m.conflicts).toEqual([]);expect(m.value.map(p=>p.title)).toEqual(['Mein A','Dein B']);});
 it('erhält gleichzeitig hinzugefügte Vergleiche',()=>{const m=mergeChanges([],[{id:'a'}],[{id:'b'}]);expect(m.value).toEqual([{id:'b'},{id:'a'}]);expect(m.conflicts).toEqual([]);});
 it('übernimmt Löschungen unveränderter Vergleiche',()=>{const b=[{id:'a',title:'A'}];expect(mergeChanges(b,[],b).value).toEqual([]);});
 it('meldet Löschen gegen gleichzeitiges Bearbeiten als Konflikt',()=>{const m=mergeChanges([{id:'a',title:'A'}],[],[{id:'a',title:'Neu'}]);expect(m.conflicts).toEqual(['/a']);});
});
