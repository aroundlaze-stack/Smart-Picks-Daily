import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { SEO } from '../../../../components/seo';
import { motion } from 'framer-motion';
import { ArrowLeft, IndianRupee, Calendar, Percent, RefreshCw, TrendingDown, PieChart } from 'lucide-react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const fmtK = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className={`p-5 rounded-2xl bg-white/4 border border-white/10 flex flex-col gap-2`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color || 'bg-primary/10 text-primary'}`}>{icon}</div>
      <div className="text-xl font-display font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange, display }: {
  label: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void; display: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-bold text-primary">{display}</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-violet-400"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          aria-label={label}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
        <span>{typeof min === 'number' && min >= 1000 ? fmtK(min) : min}</span>
        <span>{typeof max === 'number' && max >= 1000 ? fmtK(max) : max}</span>
      </div>
    </div>
  );
}

export default function EMICalculatorPage() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(36);
  const [loanType, setLoanType] = useState<'reducing' | 'flat'>('reducing');

  const { emi, totalPayment, totalInterest, schedule } = useMemo(() => {
    let emi = 0;
    if (loanType === 'flat') {
      const totalInt = (amount * rate * (months / 12)) / 100;
      emi = (amount + totalInt) / months;
    } else {
      const r = rate / 12 / 100;
      if (r === 0) {
        emi = amount / months;
      } else {
        emi = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      }
    }
    const totalPayment = emi * months;
    const totalInterest = totalPayment - amount;

    // Amortization schedule (first 6 months)
    const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
    let balance = amount;
    const r = rate / 12 / 100;
    for (let i = 1; i <= Math.min(months, 12); i++) {
      const intPart = loanType === 'flat' ? (amount * rate) / (12 * 100) : balance * r;
      const prinPart = emi - intPart;
      balance = Math.max(0, balance - prinPart);
      schedule.push({ month: i, principal: prinPart, interest: intPart, balance });
    }
    return { emi, totalPayment, totalInterest, schedule };
  }, [amount, rate, months, loanType]);

  const principalPct = Math.round((amount / totalPayment) * 100);
  const interestPct = 100 - principalPct;

  return (
    <>
      <SEO title="Advanced EMI Calculator | Tech Toolkit" description="Calculate monthly EMI, total interest, and amortization schedule for any loan. Reducing balance and flat rate supported." url="/resources/emi-calculator" />

      <div className="border-b border-white/5 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link href="/resources">
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={15} /> Tech Toolkit
            </div>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">Advanced EMI Calculator</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
        {/* Title */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-2xl">💰</div>
            <div>
              <h1 className="text-2xl font-display font-bold">Advanced EMI Calculator</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Monthly EMI · Total interest · Amortization schedule</p>
            </div>
          </div>
          <button
            onClick={() => { setAmount(500000); setRate(12); setMonths(36); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: inputs */}
          <div className="space-y-6">
            {/* Loan type toggle */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Interest Method</div>
              <div className="flex gap-2">
                {(['reducing', 'flat'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setLoanType(type)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                      loanType === type
                        ? 'bg-primary text-primary-foreground shadow-[0_0_12px_rgba(79,140,255,0.35)]'
                        : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type === 'reducing' ? 'Reducing Balance' : 'Flat Rate'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-5">
              <Slider label="Loan Amount" min={10000} max={5000000} step={10000} value={amount} onChange={setAmount} display={fmt(amount)} />
              <Slider label="Interest Rate (p.a.)" min={1} max={30} step={0.5} value={rate} onChange={setRate} display={`${rate}%`} />
              <Slider label="Tenure" min={3} max={360} step={3} value={months} onChange={setMonths} display={months < 12 ? `${months} mo` : `${(months / 12).toFixed(1)} yr`} />
            </div>
          </div>

          {/* Right: results */}
          <div className="space-y-4">
            {/* EMI hero */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Monthly EMI</div>
              <motion.div
                key={Math.round(emi)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-5xl font-display font-bold text-primary tabular-nums"
              >
                {fmt(emi)}
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat icon={<IndianRupee size={16} />} label="Principal" value={fmtK(amount)} color="bg-primary/10 text-primary" />
              <Stat icon={<Calendar size={16} />} label="Total Payment" value={fmtK(totalPayment)} color="bg-amber-400/10 text-amber-400" />
              <Stat icon={<Percent size={16} />} label="Total Interest" value={fmtK(totalInterest)} color="bg-red-400/10 text-red-400" />
            </div>

            {/* Principal vs Interest donut-style bar */}
            <div className="p-4 rounded-2xl bg-white/3 border border-white/8">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3"><PieChart size={14} className="text-muted-foreground" /> Breakdown</div>
              <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
                <div className="bg-primary rounded-l-full" style={{ width: `${principalPct}%` }} title={`Principal ${principalPct}%`} />
                <div className="bg-red-400 rounded-r-full flex-1" title={`Interest ${interestPct}%`} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Principal {principalPct}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Interest {interestPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization schedule */}
        <div className="mt-10">
          <div className="flex items-center gap-2 text-sm font-semibold mb-4">
            <TrendingDown size={15} className="text-muted-foreground" />
            Amortization Schedule <span className="text-xs text-muted-foreground font-normal">(first 12 months)</span>
          </div>
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Month</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">EMI</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Principal</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Interest</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(row => (
                    <tr key={row.month} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="py-2.5 px-4 text-muted-foreground">{row.month}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums">{fmt(emi)}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-primary">{fmt(row.principal)}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-red-400">{fmt(row.interest)}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {months > 12 && (
              <div className="py-3 text-center text-xs text-muted-foreground border-t border-white/5">
                Showing first 12 of {months} months
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
