import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const CONVS: Record<string,{label:string;units:string[];multipliers:number[]}> = {
  storage:{label:'Storage',units:['B','KB','MB','GB','TB'],multipliers:[1,1024,1048576,1073741824,1099511627776]},
  data:{label:'Data Rate',units:['bps','Kbps','Mbps','Gbps'],multipliers:[1,1000,1000000,1000000000]},
};

const RESOLUTIONS = [
  {name:'1080p FHD',pixels:2073600},{name:'1440p QHD',pixels:3686400},
  {name:'4K UHD',pixels:8294400},{name:'8K UHD',pixels:33177600},
];

export default function UnitConverter() {
  const [mode,setMode]=useState<'storage'|'data'|'resolution'>('storage');
  const [value,setValue]=useState(1);const [fromU,setFromU]=useState(3);const [toU,setToU]=useState(2);
  const result=useMemo(()=>{if(mode==='resolution')return 0;const c=CONVS[mode];return(value*c.multipliers[fromU])/c.multipliers[toU];},[mode,value,fromU,toU]);
  const c=CONVS[mode];
  return (<div className="space-y-4">
    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">{Object.entries(CONVS).map(([k,v])=>(<button key={k} onClick={()=>setMode(k as any)} className={`flex-1 py-2 rounded-lg text-xs font-semibold ${mode===k?'bg-white/10 text-foreground':'text-muted-foreground'}`}>{v.label}</button>))}<button onClick={()=>setMode('resolution')} className={`flex-1 py-2 rounded-lg text-xs font-semibold ${mode==='resolution'?'bg-white/10 text-foreground':'text-muted-foreground'}`}>Resolution</button></div>
    {mode!=='resolution'?<div className="flex items-center gap-3"><div className="flex-1"><div className="flex gap-2"><input type="number" value={value} onChange={e=>setValue(+e.target.value||0)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"/><select value={fromU} onChange={e=>setFromU(+e.target.value)} className="w-20 bg-white/5 border border-white/10 rounded-lg px-1 py-2 text-sm text-foreground cursor-pointer">{c.units.map((u,i)=><option key={u} value={i}>{u}</option>)}</select></div></div><ArrowRightLeft size={16} className="text-muted-foreground flex-shrink-0"/><div className="flex-1"><div className="flex gap-2"><div className="flex-1 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-sm font-bold text-primary tabular-nums">{result.toFixed(4)}</div><select value={toU} onChange={e=>setToU(+e.target.value)} className="w-20 bg-white/5 border border-white/10 rounded-lg px-1 py-2 text-sm text-foreground cursor-pointer">{c.units.map((u,i)=><option key={u} value={i}>{u}</option>)}</select></div></div></div>:<div className="grid grid-cols-2 gap-3">{RESOLUTIONS.map((r,i)=>(<div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10"><div className="text-sm font-bold">{r.name}</div><div className="text-lg font-bold text-primary mt-2">{(r.pixels/1000000).toFixed(2)} MP</div></div>))}</div>}
  </div>);
}
