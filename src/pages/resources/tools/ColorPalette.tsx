import { useState, useMemo } from 'react';
import { Copy } from 'lucide-react';

function hslToHex(h:number,s:number,l:number):string {
  s/=100;l/=100;const a=s*Math.min(l,1-l);
  const f=(n:number)=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0');};
  return '#'+f(0)+f(8)+f(4);
}

export default function ColorPalette() {
  const [hue,setHue]=useState(219);const [sat,setSat]=useState(90);const [light,setLight]=useState(48);const [copied,setCopied]=useState('');
  const base=hslToHex(hue,sat,light);
  const palette=useMemo(()=>{const s=[];for(let i=0;i<8;i++)s.push({hex:hslToHex(hue,sat,Math.max(5,Math.min(98,light+(i-3)*8)))});return s;},[hue,sat,light]);
  const copyHex=async(h:string)=>{await navigator.clipboard.writeText(h);setCopied(h);setTimeout(()=>setCopied(''),1500);};
  return (<div className="space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl border-2 border-white/20 shadow-lg" style={{background:base}}/>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground"><span>Hue: {hue}\u00b0</span><span>Sat: {sat}%</span><span>Light: {light}%</span></div>
        <input type="range" min={0} max={360} value={hue} onChange={e=>setHue(+e.target.value)} className="w-full accent-primary"/>
        <input type="range" min={0} max={100} value={sat} onChange={e=>setSat(+e.target.value)} className="w-full accent-primary"/>
        <input type="range" min={5} max={95} value={light} onChange={e=>setLight(+e.target.value)} className="w-full accent-primary"/>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">{palette.map((sh,i)=>(<div key={i} onClick={()=>copyHex(sh.hex)} className="group relative h-16 rounded-xl border border-white/10 hover:scale-105 transition-transform overflow-hidden cursor-pointer" style={{background:sh.hex}}><div className="absolute inset-0 flex items-end justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"><span className="text-[10px] font-bold text-white">{sh.hex}</span></div></div>))}</div>
    <div className="flex items-center justify-between"><code className="bg-white/10 px-2 py-1 rounded text-sm font-mono">{base}</code><button onClick={()=>copyHex(base)} className="flex items-center gap-1 text-xs text-primary hover:underline"><Copy size={12}/>{copied===base?'Copied!':'Copy'}</button></div>
  </div>);
}
