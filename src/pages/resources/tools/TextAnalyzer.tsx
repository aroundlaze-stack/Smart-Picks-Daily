import { useState, useMemo } from 'react';
import { Type, Clock, Hash, BarChart3 } from 'lucide-react';

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const readingMins = Math.max(1, Math.ceil(words / 200));
    // Simple readability
    const readability = words ? Math.min(100, Math.max(0, Math.round(100 - (chars / Math.max(1, words)) * 2))) : 0;
    return { chars, words, sentences, readingMins, readability };
  }, [text]);
  return (<div className="space-y-4">
    <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste or type your text here to analyze..." className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-y placeholder:text-muted-foreground/50"/>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[{icon:<Type size={14}/>,label:'Words',val:stats.words},{icon:<Hash size={14}/>,label:'Characters',val:stats.chars},{icon:<Clock size={14}/>,label:'Read Time',val:stats.readingMins+' min'},{icon:<BarChart3 size={14}/>,label:'Readability',val:stats.readability}].map((s,i)=>(<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{s.icon}</div><div><div className="text-lg font-bold tabular-nums">{s.val}</div><div className="text-[10px] uppercase text-muted-foreground">{s.label}</div></div></div>))}
    </div>
    {stats.words>0&&<div className="p-4 rounded-2xl bg-primary/5 border border-primary/20"><p className="text-sm text-foreground/80">{stats.words} words, {stats.sentences} sentences. Takes about {stats.readingMins} minute{stats.readingMins!==1?'s':''} to read.</p></div>}
  </div>);
}
