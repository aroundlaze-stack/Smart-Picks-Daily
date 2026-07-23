import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { SEO } from '../../../../components/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Target, RefreshCw, TrendingUp, Star, Flag, Award } from 'lucide-react';

interface Milestone {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  milestones: Milestone[];
  createdAt: string;
}

const CATEGORIES = ['Career', 'Education', 'Health', 'Finance', 'Personal', 'Tech', 'Other'];
const PRIORITY_COLORS = {
  high: 'text-red-400 border-red-400/30 bg-red-400/10',
  medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  low: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
};
const CATEGORY_ICONS: Record<string, string> = {
  Career: '💼', Education: '📚', Health: '💪', Finance: '💰',
  Personal: '🌟', Tech: '💻', Other: '🎯',
};

let nextGoalId = 1;
let nextMilestoneId = 100;

export default function GoalPlannerPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);

  // New goal form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [showNewGoal, setShowNewGoal] = useState(false);

  // New milestone form per goal
  const [milestoneText, setMilestoneText] = useState<Record<number, string>>({});
  const [milestonePriority, setMilestonePriority] = useState<Record<number, 'high' | 'medium' | 'low'>>({});
  const [milestoneDue, setMilestoneDue] = useState<Record<number, string>>({});

  const overallStats = useMemo(() => {
    const total = goals.reduce((s, g) => s + g.milestones.length, 0);
    const done = goals.reduce((s, g) => s + g.milestones.filter(m => m.done).length, 0);
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [goals]);

  function addGoal() {
    if (!newTitle.trim()) return;
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const g: Goal = { id: nextGoalId++, title: newTitle.trim(), description: newDesc.trim(), category: newCategory, milestones: [], createdAt: today };
    setGoals(prev => [...prev, g]);
    setActiveGoalId(g.id);
    setNewTitle(''); setNewDesc(''); setShowNewGoal(false);
  }

  function removeGoal(id: number) {
    setGoals(prev => prev.filter(g => g.id !== id));
    if (activeGoalId === id) setActiveGoalId(null);
  }

  function addMilestone(goalId: number) {
    const text = milestoneText[goalId]?.trim();
    if (!text) return;
    const priority = milestonePriority[goalId] || 'medium';
    const dueDate = milestoneDue[goalId] || undefined;
    setGoals(prev => prev.map(g => g.id === goalId ? {
      ...g,
      milestones: [...g.milestones, { id: nextMilestoneId++, text, done: false, priority, dueDate }],
    } : g));
    setMilestoneText(prev => ({ ...prev, [goalId]: '' }));
    setMilestoneDue(prev => ({ ...prev, [goalId]: '' }));
  }

  function toggleMilestone(goalId: number, mId: number) {
    setGoals(prev => prev.map(g => g.id !== goalId ? g : {
      ...g, milestones: g.milestones.map(m => m.id === mId ? { ...m, done: !m.done } : m),
    }));
  }

  function removeMilestone(goalId: number, mId: number) {
    setGoals(prev => prev.map(g => g.id !== goalId ? g : {
      ...g, milestones: g.milestones.filter(m => m.id !== mId),
    }));
  }

  const activeGoal = goals.find(g => g.id === activeGoalId);

  return (
    <>
      <SEO title="Advanced Goal Planner | Tech Toolkit" description="Break down big goals into milestones, track daily progress, and achieve your goals systematically." url="/resources/goal-planner" />

      <div className="border-b border-white/5 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link href="/resources">
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={15} /> Tech Toolkit
            </div>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">Advanced Goal Planner</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
        {/* Title */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center text-2xl">🎯</div>
            <div>
              <h1 className="text-2xl font-display font-bold">Advanced Goal Planner</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Goals · Milestones · Progress tracking</p>
            </div>
          </div>
          {goals.length > 0 && (
            <button onClick={() => { setGoals([]); setActiveGoalId(null); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground transition-all">
              <RefreshCw size={13} /> Reset
            </button>
          )}
        </div>

        {/* Stats bar */}
        {goals.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-violet-400/10 via-primary/5 to-transparent border border-violet-400/20">
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Goals</div>
                <div className="text-2xl font-display font-bold">{goals.length}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Milestones</div>
                <div className="text-2xl font-display font-bold">{overallStats.total}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Completed</div>
                <div className="text-2xl font-display font-bold text-emerald-400">{overallStats.done}</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Overall</span><span>{overallStats.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-primary"
                    initial={{ width: 0 }} animate={{ width: `${overallStats.pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Left: goal list */}
          <div className="space-y-2">
            <button
              onClick={() => setShowNewGoal(!showNewGoal)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-sm font-semibold hover:bg-primary/20 transition-all"
            >
              <Plus size={15} /> New Goal
            </button>

            <AnimatePresence>
              {showNewGoal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-card border border-white/10 space-y-3">
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addGoal()}
                      placeholder="Goal title..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
                    />
                    <input
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
                    />
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={addGoal} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">Add</button>
                      <button onClick={() => setShowNewGoal(false)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {goals.length === 0 && !showNewGoal && (
              <div className="py-10 text-center text-muted-foreground">
                <Target size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs">Click "New Goal" to get started</p>
              </div>
            )}

            {goals.map(g => {
              const done = g.milestones.filter(m => m.done).length;
              const total = g.milestones.length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              const isActive = activeGoalId === g.id;
              return (
                <motion.button
                  key={g.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setActiveGoalId(isActive ? null : g.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isActive ? 'border-primary/40 bg-primary/8' : 'border-white/10 bg-card hover:border-white/20 hover:bg-white/4'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{CATEGORY_ICONS[g.category] || '🎯'}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{g.title}</div>
                        <div className="text-[10px] text-muted-foreground">{g.category}</div>
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); removeGoal(g.id); }} className="shrink-0 p-1 text-muted-foreground hover:text-red-400 transition-colors" aria-label="Remove goal">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {total > 0 && (
                    <div className="mt-2.5">
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{done}/{total} milestones · {pct}%</div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right: active goal milestones */}
          {activeGoal ? (
            <div>
              {/* Goal header */}
              <div className="p-5 rounded-2xl bg-card border border-white/10 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{CATEGORY_ICONS[activeGoal.category]}</span>
                  <h2 className="text-lg font-display font-bold">{activeGoal.title}</h2>
                </div>
                {activeGoal.description && <p className="text-sm text-muted-foreground">{activeGoal.description}</p>}
                <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Flag size={10} /> {activeGoal.category}</span>
                  <span>Created {activeGoal.createdAt}</span>
                </div>
              </div>

              {/* Add milestone */}
              <div className="p-4 rounded-2xl bg-card border border-white/10 mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Plus size={11} /> Add Milestone</div>
                <div className="space-y-2">
                  <input
                    value={milestoneText[activeGoal.id] || ''}
                    onChange={e => setMilestoneText(prev => ({ ...prev, [activeGoal.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addMilestone(activeGoal.id)}
                    placeholder="Milestone description..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/50"
                  />
                  <div className="flex gap-2">
                    <select
                      value={milestonePriority[activeGoal.id] || 'medium'}
                      onChange={e => setMilestonePriority(prev => ({ ...prev, [activeGoal.id]: e.target.value as 'high'|'medium'|'low' }))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none cursor-pointer"
                    >
                      <option value="high">🔴 High priority</option>
                      <option value="medium">🟡 Medium priority</option>
                      <option value="low">🟢 Low priority</option>
                    </select>
                    <input
                      type="date"
                      value={milestoneDue[activeGoal.id] || ''}
                      onChange={e => setMilestoneDue(prev => ({ ...prev, [activeGoal.id]: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => addMilestone(activeGoal.id)}
                      className="px-4 py-2 bg-primary/15 border border-primary/30 text-primary rounded-xl text-sm font-bold hover:bg-primary/25 transition-all"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Milestone list */}
              {activeGoal.milestones.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Target size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Add milestones to track your progress</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {activeGoal.milestones.map(m => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-card border border-white/10 hover:bg-white/3 group transition-colors"
                      >
                        <button onClick={() => toggleMilestone(activeGoal.id, m.id)} className="mt-0.5 shrink-0">
                          {m.done
                            ? <CheckCircle2 size={18} className="text-emerald-400" />
                            : <Circle size={18} className="text-muted-foreground" />
                          }
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${m.done ? 'line-through text-muted-foreground/50' : 'text-foreground'}`}>{m.text}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${PRIORITY_COLORS[m.priority]}`}>
                              {m.priority}
                            </span>
                            {m.dueDate && (
                              <span className="text-[10px] text-muted-foreground">
                                Due {new Date(m.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeMilestone(activeGoal.id, m.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-400 transition-all"
                          aria-label="Remove milestone"
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {activeGoal.milestones.every(m => m.done) && activeGoal.milestones.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-400/15 to-transparent border border-emerald-400/30 text-center"
                    >
                      <Award size={28} className="mx-auto mb-1.5 text-emerald-400" />
                      <p className="text-sm font-bold">Goal achieved! 🎉</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          ) : goals.length > 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <div className="text-center">
                <Star size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Select a goal to manage its milestones</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
