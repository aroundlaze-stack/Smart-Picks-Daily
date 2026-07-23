import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check } from 'lucide-react';

const CHARS={upper:'ABCDEFGHJKLMNPQRSTUVWXYZ',lower:'abcdefghijkmnpqrstuvwxyz',digits:'23456789',symbols:'!@#$%^&*()_+-=[]{}|;:,.<>?'};

function generate(len:number,u:boolean,l:boolean,d:boolean,s:boolean):string{
  let p='';if(u)p+=CHARS.upper;if(l)p+=CHARS.lower;if(d)p+=CHARS.digits;if(s)p+=CHARS.symbols;if(!p)p=CHARS.lower+CHARS.digits;
  let r='';for(let i=0;i<len;i++)r+=p[Math.floor(Math.random()*p.length)];return r;
}

export default function PasswordGenerator() {
  const [len,setLen]=useState(16);const [u,setU]=useState(true);const [l,setL]=useState(true);const [d,setD]=useState(true);const [s,setS]=useState(true);const [copied,setCopied]=useState(false);
  const [pass,setPass]=useState(()=>generate(16,true,true,true,true));
  const regen=()=>{setPass(generate(len,u,l,d,s));setCopied(false);};
  const copyP=async()=>{await navigator.clipboard.writeText(pass);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return (<div className="space-y-4">
    <div className="flex items-center gap-2"><div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono tracking-wider text-center select-all text-foreground truncate">{pass}</div><button onClick={copyP} className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" title="Copy">{copied?<Check size={18}/>:<Copy size={18}/>}</button><button onClick={regen} className="p-3 rounded-xl bg-white/5 text-muted-foreground border border-white/10 hover:text-foreground" title="Generate"><RefreshCw size={18}/></button></div>
    <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Length: <strong className="text-foreground">{len}</strong></span></div>
    <input type="range" min={6} max={32} value={len} onChange={e=>{setLen(+e.target.value);setPass(generate(+e.target.value,u,l,d,s));}} className="w-full accent-primary"/>
    <div className="grid grid-cols-2 gap-2">{[[u,setU,'A-Z Uppercase'],[l,setL,'a-z Lowercase'],[d,setD,'0-9 Digits'],[s,setS,'!@# Symbols']].map(([v,fn,label]:any,i)=>(<label key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer text-xs text-muted-foreground hover:text-foreground"><input type="checkbox" checked={v} onChange={e=>{fn(e.target.checked);setPass(generate(len,u,l,d,s));}} className="accent-primary"/>{label}</label>))}</div>
  </div>);
}
