import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Target } from 'lucide-react';

interface Task { id: number; text: string; done: boolean; }

export default function GoalPlanner() {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(1);
  const add = () => { if(!text.trim())return; setTasks([...tasks,{id:nextId,text:text.trim(),done:false}]);setText('');setNextId(n=>n+1); };
  const toggle = (id:number) => setTasks(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t));
  const remove = (id:number) => setTasks(ts=>ts.filter(t=>t.id!==id));
  const done = tasks.filter(t=>t.done).length;
  const pct = tasks.length?Math.round((done/tasks.length)*100):0;
  return (<div className="space-y-4">
    <div className="flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Add a milestone..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"/><button onClick={add} className="px-4 py-2.5 bg-primary/15 border border-primary/30 text-primary rounded-xl font-bold text-sm hover:bg-primary/25"><Plus size={16}/></button></div>
    {tasks.length>0&&<><div className="flex items-center gap-3"><div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden"><motion.div className="h-full rounded-full bg-primary" initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.5}}/></div><span className="text-xs font-bold">{pct}%</span></div>
    <div className="space-y-1.5">{tasks.map(t=>(<motion.div key={t.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 group"><button onClick={()=>toggle(t.id)}>{t.done?<CheckCircle2 size={18} className="text-green-400"/>:<Circle size={18} className="text-muted-foreground"/>}</button><span className={`flex-1 text-sm ${t.done?'line-through text-muted-foreground/50':'text-foreground'}`}>{t.text}</span><button onClick={()=>remove(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400"><Trash2 size={14}/></button></motion.div>))}</div></>}
    {tasks.length===0&&<div className="py-8 text-center text-muted-foreground"><Target size={32} className="mx-auto mb-2 opacity-50"/><p className="text-sm">Add milestones above to get started</p></div>}
  </div>);
}
