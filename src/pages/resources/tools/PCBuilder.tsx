import { useState, useMemo } from 'react';
import { Cpu, Zap, MemoryStick, HardDrive, ShoppingCart } from 'lucide-react';

const COMPS = {
  cpu: [{name:'Intel Core i5-13400F',price:16500},{name:'AMD Ryzen 5 7600',price:18500},{name:'Intel i7-14700K',price:32000},{name:'AMD Ryzen 7 7800X3D',price:38000}],
  gpu: [{name:'RTX 4060 8GB',price:28000},{name:'RX 7700 XT 12GB',price:38000},{name:'RTX 4070 Super 12GB',price:55000},{name:'RTX 4080 Super 16GB',price:98000}],
  ram: [{name:'16GB DDR5-5600',price:5000},{name:'32GB DDR5-6000',price:9500},{name:'64GB DDR5-6400',price:18000}],
  storage: [{name:'1TB NVMe Gen4',price:5500},{name:'2TB NVMe Gen4',price:10500},{name:'4TB NVMe Gen4',price:22000}],
};
const LABELS: Record<string,{label:string;icon:React.ReactNode}> = {
  cpu:{label:'Processor',icon:<Cpu size={14}/>},gpu:{label:'Graphics Card',icon:<Zap size={14}/>},
  ram:{label:'Memory',icon:<MemoryStick size={14}/>},storage:{label:'Storage',icon:<HardDrive size={14}/>},
};

export default function PCBuilder() {
  const [sel, setSel] = useState<Record<string,number>>({cpu:0,gpu:0,ram:0,storage:0});
  const total = useMemo(() => (Object.keys(COMPS) as Array<keyof typeof COMPS>).reduce((s,k)=>s+COMPS[k][sel[k]].price,0), [sel]);
  const fmt = (n:number) => '\u20b9'+n.toLocaleString('en-IN');
  return (<div className="space-y-4">
    {(Object.keys(COMPS) as Array<keyof typeof COMPS>).map(cat=>(<div key={cat}><div className="flex items-center gap-2 mb-2 text-sm font-bold text-muted-foreground">{LABELS[cat].icon} {LABELS[cat].label}</div><div className="grid grid-cols-2 gap-2">{COMPS[cat].map((item,i)=>(<button key={i} onClick={()=>setSel(s=>({...s,[cat]:i}))} className={`p-3 rounded-xl text-left transition-all text-xs border ${sel[cat]===i?'bg-primary/15 border-primary/40 text-foreground':'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}><div className="font-semibold truncate">{item.name}</div><div className="mt-1 text-primary font-bold">{fmt(item.price)}</div></button>))}</div></div>))}
    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-between">
      <div><div className="text-xs text-muted-foreground mb-1">Estimated Build Cost</div><div className="text-3xl font-display font-bold">{fmt(total)}</div></div>
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"><ShoppingCart size={22} className="text-primary"/></div>
    </div>
    <p className="text-xs text-muted-foreground">*Case, PSU, motherboard not included. Estimated +\u20b915,000-25,000.</p>
  </div>);
}
