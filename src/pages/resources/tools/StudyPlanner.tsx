import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, BookOpen, Clock } from 'lucide-react';

interface Subject { id: number; name: string; hours: number; done: boolean; }

export default function StudyPlanner() {
  const [subjects,setSubjects]=useState<Subject[]>([]);
  const [name,setName]=useState('');const [hours,setHours]=useState(2);const [nextId,setNextId]=useState(1);
  const add=()=>{if(!name.trim())return;setSubjects([...subjects,{id:nextId,name:name.trim(),hours,done:false}]);setName('');setNextId(n=>n+1);};
  const toggle=(id:number)=>setSubjects(ss=>ss.map(s=>s.id===id?{...s,done:!s.done}:s));
  const remove=(id:number)=>setSubjects(ss=>ss.filter(s=>s.id!==id));
  const totalH=subjects.reduce((s,sub)=>s+sub.hours,0);
  const doneH=subjects.filter(s=>s.done).reduce((s,sub)=>s+sub.hours,0);
  const pct=totalH?Math.round((doneH/totalH)*100):0;
  return (<div className="space-y-4">
    <div className="flex gap-2"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Subject name..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"/><div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3"><Clock size={14} className="text-muted-foreground"/><input type="number" value={hours} onChange={e=>setHours(+e.target.value||1)} min={1} max={12} className="w-12 bg-transparent text-sm text-center text-foreground"/><span className="text-xs text-muted-foreground">hrs</span></div><button onClick={add} className="px-4 bg-primary/15 border border-primary/30 text-primary rounded-xl font-bold text-sm hover:bg-primary/25"><Plus size={16}/></button></div>
    {subjects.length>0&&<><div className="flex items-center gap-3"><div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden"><motion.div className="h-full rounded-full bg-emerald-500" initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.5}}/></div><span className="text-xs text-muted-foreground">{doneH}h / {totalH}h</span></div>
    <div className="space-y-1.5">{subjects.map(s=>(<motion.div key={s.id} initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 group"><button onClick={()=>toggle(s.id)}>{s.done?<CheckCircle2 size={18} className="text-green-400"/>:<Circle size={18} className="text-muted-foreground"/>}</button><BookOpen size={14} className="text-muted-foreground"/><span className={`flex-1 text-sm ${s.done?'line-through text-muted-foreground/50':'text-foreground'}`}>{s.name}</span><span className="text-xs text-muted-foreground">{s.hours}h</span><button onClick={()=>remove(s.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400"><Trash2 size={14}/></button></motion.div>))}</div></>}
    {subjects.length===0&&<div className="py-8 text-center text-muted-foreground"><BookOpen size={32} className="mx-auto mb-2 opacity-50"/><p className="text-sm">Add subjects above to build your plan</p></div>}
  </div>);
}
