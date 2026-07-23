import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const MODES = [
  { label: 'Focus', mins: 25, color: 'text-blue-400' },
  { label: 'Short Break', mins: 5, color: 'text-green-400' },
  { label: 'Long Break', mins: 15, color: 'text-purple-400' },
];

export default function PomodoroTimer() {
  const [modeIdx, setModeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intRef = useRef<number | null>(null);
  const mode = MODES[modeIdx];
  const totalSecs = mode.mins * 60;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  useEffect(() => { if (running) { intRef.current = window.setInterval(() => setTimeLeft(t => { if (t <= 1) { setRunning(false); if (modeIdx === 0) setSessions(s => s + 1); return totalSecs; } return t - 1; }), 1000); } return () => { if (intRef.current) clearInterval(intRef.current); }; }, [running, modeIdx, totalSecs]);

  const reset = () => { setTimeLeft(totalSecs); setRunning(false); };
  const skip = () => { if (modeIdx === 0) setSessions(s => s + 1); setTimeLeft(0); setRunning(false); };

  return (<div className="space-y-6">
    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">{MODES.map((m,i) => <button key={i} onClick={()=>{setModeIdx(i);setTimeLeft(MODES[i].mins*60);setRunning(false);}} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${i===modeIdx?'bg-white/10 text-foreground':'text-muted-foreground hover:text-foreground'}`}>{m.label}</button>)}</div>
    <div className="flex justify-center"><div className="w-48 h-48 rounded-full border-2 border-white/10 flex items-center justify-center"><div className="text-center"><div className="text-4xl font-display font-bold tracking-tighter">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div><div className="text-xs text-muted-foreground mt-1">{mode.label}</div></div></div></div>
    <div className="flex justify-center gap-3">
      <button onClick={()=>setRunning(!running)} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${running?'bg-amber-500/20 text-amber-400 border border-amber-500/30':'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'}`}>{running?<><Pause size={16}/>Pause</>:<><Play size={16}/>Start</>}</button>
      <button onClick={reset} className="p-3 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground" title="Reset"><RotateCcw size={16}/></button>
      <button onClick={skip} className="p-3 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground" title="Skip"><SkipForward size={16}/></button>
    </div>
    {sessions>0&&<div className="text-center text-sm text-muted-foreground"><strong className="text-foreground">{sessions}</strong> session{sessions!==1?'s':''} completed today</div>}
  </div>);
}
