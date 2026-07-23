import { useState, useMemo } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface Course { id: number; name: string; credits: number; grade: string; }
const GRADES: Record<string,number> = {'A+':10,'A':9,'B+':8,'B':7,'C+':6,'C':5,'D':4,'F':0};

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([{id:1,name:'',credits:3,grade:'A'}]);
  const [nextId, setNextId] = useState(2);
  const add = () => { setCourses([...courses,{id:nextId,name:'',credits:3,grade:'B'}]); setNextId(n=>n+1); };
  const remove = (id:number) => { if(courses.length>1) setCourses(courses.filter(c=>c.id!==id)); };
  const update = (id:number,f:keyof Course,v:string|number) => { setCourses(courses.map(c=>c.id===id?{...c,[f]:v}:c)); };
  const gpa = useMemo(() => {
    let tp=0, tc=0;
    courses.forEach(c=>{const p=GRADES[c.grade]||0;tp+=p*c.credits;tc+=c.credits;});
    return tc?(tp/tc).toFixed(2):'0.00';
  }, [courses]);
  return (<div className="space-y-4">
    <div className="space-y-2">{courses.map(c=>(<div key={c.id} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10"><input value={c.name} onChange={e=>update(c.id,'name',e.target.value)} placeholder="Course" className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50"/><input type="number" value={c.credits} onChange={e=>update(c.id,'credits',+e.target.value||1)} min={1} max={6} className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-center text-foreground"/><select value={c.grade} onChange={e=>update(c.id,'grade',e.target.value)} className="w-14 bg-white/5 border border-white/10 rounded-lg px-1 py-1 text-sm text-foreground cursor-pointer">{Object.keys(GRADES).map(g=><option key={g} value={g}>{g}</option>)}</select><button onClick={()=>remove(c.id)} className="p-1 text-muted-foreground hover:text-red-400"><Trash2 size={14}/></button></div>))}<button onClick={add} className="w-full flex items-center justify-center gap-1 py-2 rounded-xl border border-dashed border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30"><Plus size={14}/>Add Course</button></div>
    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-between"><div><div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Calculator size={14}/>Semester GPA</div><div className="text-4xl font-display font-bold text-primary">{gpa}</div></div><div className="text-right text-xs text-muted-foreground"><div>{courses.length} course{courses.length!==1?'s':''}</div><div>{courses.reduce((s,c)=>s+c.credits,0)} credits</div></div></div>
  </div>);
}
