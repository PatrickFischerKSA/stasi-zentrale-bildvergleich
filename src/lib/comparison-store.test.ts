import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { createDefaultState, createPair, normalizeState, saveState, loadState, clearState } from './comparison-store';
describe('Vorlage und lokale Speicherung',()=>{
 beforeEach(async()=>{await clearState();});
 it('ergänzt neue Abschnitte und erhält alte Inhalte',()=>{const s=normalizeState({heading:'Eigener Titel',pairs:[{title:'Archiv',past:{image:'data:image/png;base64,abc'}}]});expect(s.heading).toBe('Eigener Titel');expect(s.book.title).toBe('');expect(s.media.video.data).toBe('');expect(s.pairs[0].past.image).toContain('base64,abc');expect(s.pairs[0].now.label).toBe('Heute');});
 it('fängt beschädigte Felder ab und erhält leere Vergleichslisten',()=>{const s=normalizeState({heading:42,book:null,media:[],pairs:[]});expect(s.heading).toContain('Stasi');expect(s.pairs).toEqual([]);expect(s.media.image1.caption).toBe('');});
 it('speichert Texte und Medien dauerhaft und setzt sie zurück',async()=>{expect(await loadState()).toBeNull();const s=createDefaultState();s.heading='Mein Projekt';s.pairs[0].past.image='data:image/png;base64,abc';s.media.video.data='data:video/mp4;base64,xyz';await saveState(s);expect(await loadState()).toEqual(s);await clearState();expect(await loadState()).toBeNull();});
 it('erzeugt unabhängige Vergleichspaare',()=>{const a=createPair(),b=createPair();expect(a.id).not.toBe(b.id);a.past.source='Archiv';expect(b.past.source).toBe('');});
});
