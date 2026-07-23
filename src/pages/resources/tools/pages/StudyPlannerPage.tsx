import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { SEO } from '../../../../components/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, BookOpen, Clock, RefreshCw, Target, TrendingUp, Award } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  plannedHours: number;
  completedHours: number;
  priority: 'high' | 'medium' | 'low';
  sessions: Session[];
}

interface Session {
  id: number;
  date: string;
  hours: number;
  note: string;
}

const PRIORITY_COLORS = {
  high: 'text-red-400 border-red-400/30 bg-red-400/10',
  medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  low: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
};

const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

let nextSubId = 1;
let nextSessionId = 100;

export default function StudyPlannerPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newName, setNewName] = useState('');
  const [newHours, setNewHours] = useState(10);
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sessionHours, setSessionHours] = useState<Record<number, string>>({});
  const [sessionNote, setSessionNote] = useState<Record<number, string>>({});

  const totals = useMemo(() => {
    const planned = subjects.reduce((s, sub) => s + sub.plannedHours, 0);
    const completed = subjects.reduce((s, sub) => s + sub.completedHours, 0);
    const pct = planned ? Math.round((completed / planned) * 100) : 0;
    return { planned, completed, pct };
  }, [subjects]);

  function addSubject() {
    if (!newName.trim()) return;
    setSubjects(prev => [...prev, {
      id: nextSubId++, name: newName.trim(),
      plannedHours: newHours, completedHours: 0,
      priority: newPriority, sessions: [],
    }]);
    setNewName('');
  }

  function removeSubject(id: number) {
    setSubjects(prev => prev.filter(s => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function logSession(subId: number) {
    const hrs = parseFloat(sessionHours[subId] || '0');
    if (!hrs || hrs <= 0) return;
    const note = sessionNote[subId] || '';
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    setSubjects(prev => prev.map(s => s.id === subId ? {
      ...s,
      completedHours: Math.min(s.completedHours + hrs, s.plannedHours),
      sessions: [...s.sessions, { id: nextSessionId++, date: today, hours: hrs, note }],
    } : s));
    setSessionHours(prev => ({ ...prev, [subId]: '' }));
    setSessionNote(prev => ({ ...prev, [subId]: '' }));
  }

  function removeSession(subId: number, sessionId: number) {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subId) return s;
      const session = s.sessions.find(sess => sess.id === sessionId);
      return {
        ...s,
        completedHours: Math.max(0, s.completedHours - (session?.hours || 0)),
        sessions: s.sessions.filter(sess => sess.id !== sessionId),
      };
    }));
  }

  const sortedSubjects = [...subjects].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <>
      <SEO title="Advanced Study Planner | Tech Toolkit" description="Plan study sessions by subject, track hours, log progress, and hit your academic goals." url="/resources/study-planner" />

      <div className="border-b border-white/5 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link href="/resources">
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={15} /> Tech Toolkit
            </div>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">Advanced Study Planner</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        {/* Title */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-2xl">📚</div>
            <div>
              <h1 className="text-2xl font-display font-bold">Advanced Study Planner</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Track subjects · Log sessions · Hit your goals</p>
            </div>
          </div>
          {subjects.length > 0 && (
            <button onClick={() => setSubjects([])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground transition-all">
              <RefreshCw size={13} /> Reset
            </button>
          )}
        </div>

        {/* Overall progress */}
        {subjects.length > 0 && (
          <motion.div layout className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-400/10 via-transparent to-transparent border border-emerald-400/20">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Target size={11} /> Planned</div>
                <div className="text-2xl font-display font-bold">{totals.planned}h</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><CheckCircle2 size={11} /> Completed</div>
                <div className="text-2xl font-display font-bold text-emerald-400">{totals.completed.toFixed(1)}h</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><TrendingUp size={11} /> Progress</div>
                <div className="text-2xl font-display font-bold">{totals.pct}%</div>
              </div>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                initial={{ width: 0 }}
                animate={{ width: `${totals.pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Add subject form */}
        <div className="mb-6 p-5 rounded-2xl bg-card border border-white/10">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><BookOpen size={14} /> Add Subject</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSubject()}
              placeholder="Subject name..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
            />
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <Clock size={13} className="text-muted-foreground" />
                <input
                  type="number" value={newHours} onChange={e => setNewHours(Math.max(1, +e.target.value))}
                  min={1} max={999} className="w-14 bg-transparent text-sm text-center focus:outline-none"
                  aria-label="Planned hours"
                />
                <span className="text-xs text-muted-foreground">hrs</span>
              </div>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none cursor-pointer"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
              <button
                onClick={addSubject}
                className="px-4 py-2 bg-primary/15 border border-primary/30 text-primary rounded-xl font-bold text-sm hover:bg-primary/25 transition-all"
                aria-label="Add subject"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {subjects.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Add subjects above to build your study plan</p>
          </div>
        )}

        {/* Subject list */}
        <div className="space-y-3">
          <AnimatePresence>
            {sortedSubjects.map(sub => {
              const pct = sub.plannedHours ? Math.round((sub.completedHours / sub.plannedHours) * 100) : 0;
              const isExpanded = expandedId === sub.id;
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl bg-card border border-white/10 overflow-hidden"
                >
                  {/* Subject row */}
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/2 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                  >
                    {pct >= 100
                      ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                      : <Circle size={18} className="text-muted-foreground shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm truncate">{sub.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${PRIORITY_COLORS[sub.priority]}`}>
                          {PRIORITY_LABELS[sub.priority]}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden max-w-[160px]">
                          <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{sub.completedHours.toFixed(1)}h / {sub.plannedHours}h ({pct}%)</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removeSubject(sub.id); }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      aria-label="Remove subject"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Expanded: log session */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-3">
                          <div className="pt-3">
                            <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Plus size={11} /> Log Study Session</div>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={sessionHours[sub.id] || ''}
                                onChange={e => setSessionHours(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                placeholder="Hours"
                                min={0.5} step={0.5}
                                className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                              />
                              <input
                                value={sessionNote[sub.id] || ''}
                                onChange={e => setSessionNote(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                placeholder="Optional note..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
                              />
                              <button
                                onClick={() => logSession(sub.id)}
                                className="px-3 py-2 bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-400/25 transition-all"
                              >
                                Log
                              </button>
                            </div>
                          </div>

                          {sub.sessions.length > 0 && (
                            <div>
                              <div className="text-xs font-semibold text-muted-foreground mb-1.5">Sessions</div>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {[...sub.sessions].reverse().map(sess => (
                                  <div key={sess.id} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-white/3 border border-white/5 group">
                                    <span className="text-muted-foreground">{sess.date}</span>
                                    <span className="text-emerald-400 font-semibold">{sess.hours}h</span>
                                    {sess.note && <span className="text-muted-foreground flex-1 truncate">{sess.note}</span>}
                                    <button
                                      onClick={() => removeSession(sub.id, sess.id)}
                                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                                      aria-label="Remove session"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {subjects.length > 0 && totals.pct === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-400/15 to-transparent border border-emerald-400/30 text-center"
          >
            <Award size={32} className="mx-auto mb-2 text-emerald-400" />
            <h3 className="font-bold text-lg mb-1">All done! 🎉</h3>
            <p className="text-sm text-muted-foreground">You've completed your entire study plan. Excellent work!</p>
          </motion.div>
        )}
      </div>
    </>
  );
}
