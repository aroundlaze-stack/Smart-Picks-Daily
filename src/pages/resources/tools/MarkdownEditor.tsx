import { useState } from 'react';
import { Eye, Edit3 } from 'lucide-react';

function renderMd(md:string):string {
  return md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^### (.+)$/gm,'<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm,'<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm,'<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^- (.+)$/gm,'<li class="ml-4 text-foreground/80">$1</li>')
    .replace(/\n/g,'<br>');
}

export default function MarkdownEditor() {
  const [text,setText]=useState('# Welcome\n\n## Getting Started\n\n- Write in **Markdown**\n- See live *preview*\n- Take notes easily\n\n> Simple and fast.');
  const [preview,setPreview]=useState(false);
  return (<div className="space-y-3">
    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
      <button onClick={()=>setPreview(false)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold ${!preview?'bg-white/10 text-foreground':'text-muted-foreground'}`}><Edit3 size={13}/>Write</button>
      <button onClick={()=>setPreview(true)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold ${preview?'bg-white/10 text-foreground':'text-muted-foreground'}`}><Eye size={13}/>Preview</button>
    </div>
    {preview?<div className="min-h-[240px] p-4 rounded-xl bg-white/5 border border-white/10 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html:renderMd(text)}}/>:<textarea value={text} onChange={e=>setText(e.target.value)} className="w-full min-h-[240px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 resize-y"/>}
  </div>);
}
