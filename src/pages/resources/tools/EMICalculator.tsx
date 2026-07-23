import { useState, useMemo } from 'react';
import { IndianRupee, Calendar, Percent } from 'lucide-react';

export default function EMICalculator() {
  const [amount, setAmount] = useState(50000);
  const [rate, setRate] = useState(14);
  const [months, setMonths] = useState(12);
  const emi = useMemo(() => {
    const r = rate / 12 / 100;
    if (r === 0) return amount / months;
    return Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  }, [amount, rate, months]);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - amount;
  const fmt = (n:number) => '\u20b9'+n.toLocaleString('en-IN');
  return (<div className="space-y-5">
    <div className="space-y-3">
      <div><div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">Loan Amount</span><span className="text-sm font-bold text-primary">{fmt(amount)}</span></div><input type="range" min={5000} max={500000} step={1000} value={amount} onChange={e=>setAmount(+e.target.value)} className="w-full accent-primary"/></div>
      <div><div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">Interest Rate</span><span className="text-sm font-bold text-primary">{rate}% p.a.</span></div><input type="range" min={5} max={30} step={0.5} value={rate} onChange={e=>setRate(+e.target.value)} className="w-full accent-primary"/></div>
      <div><div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">Tenure</span><span className="text-sm font-bold text-primary">{months} months</span></div><input type="range" min={3} max={60} step={1} value={months} onChange={e=>setMonths(+e.target.value)} className="w-full accent-primary"/></div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[{icon:<IndianRupee size={16} className="text-primary mx-auto mb-1"/>,label:'Monthly EMI',val:fmt(emi)},{icon:<Calendar size={16} className="text-amber-400 mx-auto mb-1"/>,label:'Total Payment',val:fmt(totalPayment)},{icon:<Percent size={16} className="text-red-400 mx-auto mb-1"/>,label:'Total Interest',val:fmt(totalInterest)}].map((s,i)=>(<div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"><div>{s.icon}</div><div className="text-lg font-bold tabular-nums">{s.val}</div><div className="text-[10px] text-muted-foreground uppercase">{s.label}</div></div>))}
    </div>
  </div>);
}
