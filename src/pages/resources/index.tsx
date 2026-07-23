import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { SEO } from '../../components/seo';
import { NebulaCloud } from '../../components/3d/NebulaCloud';
import { Search, Star, Zap, Clock, Flame, ArrowRight, ChevronDown, Wrench, BarChart3, GraduationCap, Target, Calculator, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { INTERACTIVE_TOOLS, PLACEHOLDER_TOOLS, FEATURED_TOOLS, POPULAR_TOOLS, RECENTLY_UPDATED_TOOLS, TOOL_CATEGORIES } from './toolData';
import type { InteractiveTool } from './toolData';

// ─── Floating icons that animate in the hero ─────────────────────────────────
const FLOATING_ICONS = [
  { icon: <GraduationCap size={20} />, delay: 0,    x: '15%',  y: '30%',  color: 'text-primary' },
  { icon: <Calculator size={18} />,   delay: 0.4,  x: '80%',  y: '25%',  color: 'text-accent' },
  { icon: <Target size={20} />,       delay: 0.8,  x: '10%',  y: '68%',  color: 'text-emerald-400' },
  { icon: <BarChart3 size={18} />,    delay: 0.2,  x: '85%',  y: '65%',  color: 'text-amber-400' },
  { icon: <BookOpen size={18} />,     delay: 0.6,  x: '50%',  y: '15%',  color: 'text-purple-400' },
  { icon: <Wrench size={16} />,       delay: 1.0,  x: '70%',  y: '78%',  color: 'text-rose-400' },
];

// ─── Tool card ────────────────────────────────────────────────────────────────
function ToolCard({ tool, index }: { tool: InteractiveTool; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={tool.route}>
        <div className="group relative flex flex-col p-5 rounded-2xl bg-card border border-white/10 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:shadow-[0_4px_28px_rgba(79,140,255,0.12)]">
          {tool.badge && (
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              {tool.badge}
            </span>
          )}
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
          </div>
          <h3 className="font-bold mb-1.5 group-hover:text-primary transition-colors text-sm leading-snug">{tool.name}</h3>
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 flex-1 mb-4">{tool.desc}</p>
          <span className="inline-flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-1.5 transition-all">
            <Wrench size={11} /> Open Tool <ArrowRight size={11} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Coming Soon card ─────────────────────────────────────────────────────────
function ComingSoonCard({ tool, index }: { tool: { name: string; desc: string; icon: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 0.55, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-dashed border-primary/20 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl opacity-60">{tool.icon}</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-muted-foreground">Soon</span>
      </div>
      <h3 className="font-bold mb-1 text-foreground/60 text-sm">{tool.name}</h3>
      <p className="text-muted-foreground/60 text-xs leading-relaxed line-clamp-2 flex-1">{tool.desc}</p>
    </motion.div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ icon, title, count, accent }: { icon: React.ReactNode; title: string; count?: number; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className={accent || 'text-primary'}>{icon}</span>
      <h2 className="text-lg font-display font-bold">{title}</h2>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{count}</span>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TechToolkit() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return INTERACTIVE_TOOLS.filter(t => {
      if (filter !== 'All' && t.category !== filter) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.desc.toLowerCase().includes(q) && !t.tags.some(tag => tag.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, filter]);

  const showDiscovery = !search && filter === 'All';

  return (
    <>
      <SEO
        title="Tech Toolkit | Smart Picks Daily"
        description="Compare products, calculate your CGPA, plan your studies, manage your goals, and make smarter tech decisions—all in one place. Free interactive tools, no signup required."
        url="/resources"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[62vh] md:h-[68vh] w-full border-b border-white/5 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <NebulaCloud isMobile={isMobile} />
        </div>

        {/* Extra gradient overlay for depth */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/20 via-transparent to-background pointer-events-none" />

        {/* Animated floating tool icons */}
        {FLOATING_ICONS.map((item, i) => (
          <motion.div
            key={i}
            className={`absolute z-[2] pointer-events-none ${item.color}`}
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0.7, 0.5], y: [10, 0, -6, 0] }}
            transition={{ delay: item.delay, duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              {item.icon}
            </div>
          </motion.div>
        ))}

        {/* Hero content */}
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary mb-5"
          >
            <Zap size={11} className="text-primary" />
            Tech Toolkit — {INTERACTIVE_TOOLS.length} Tools · Free · No Signup
          </motion.div>

          {/* Main heading with animated gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-5 leading-tight"
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #fff 0%, #4f8cff 40%, #a78bfa 70%, #fff 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 4s ease infinite',
              }}
            >
              Everything you need.
            </span>
            <br />
            <span className="text-foreground">One toolkit.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Compare products, calculate your CGPA, plan your studies, manage your goals, and make smarter tech decisions—all in one place.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 pointer-events-auto"
          >
            <Link href="/resources/product-comparison">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(79,140,255,0.5)] transition-all duration-300 cursor-pointer">
                <BarChart3 size={15} />
                Compare Products
              </div>
            </Link>
            <Link href="/resources/cgpa-calculator">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/8 border border-white/15 text-foreground font-bold text-sm hover:bg-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer">
                <GraduationCap size={15} />
                CGPA Calculator
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-1 text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[10px] uppercase tracking-widest">Explore</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Quick Access bar ──────────────────────────────────────────────── */}
      <section className="border-b border-white/5 bg-muted/10 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs text-muted-foreground font-semibold shrink-0 mr-1">Quick Access:</span>
            {INTERACTIVE_TOOLS.map(tool => (
              <Link key={tool.id} href={tool.route}>
                <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer whitespace-nowrap">
                  <span>{tool.icon}</span>
                  {tool.name.replace('Advanced ', '').replace('Smart ', '')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discovery: Search + filter ────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 py-3 space-y-2">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="search"
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {TOOL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(79,140,255,0.4)]'
                    : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 md:px-6 space-y-16">

          {search || filter !== 'All' ? (
            /* ── Filtered results ── */
            <div>
              <SectionHeading
                icon={<Search size={17} />}
                title={filter !== 'All' ? filter : `Results for "${search}"`}
                count={filtered.length}
              />
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <Search size={22} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">No tools found</h3>
                  <button
                    onClick={() => { setSearch(''); setFilter('All'); }}
                    className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                </div>
              )}
            </div>
          ) : (
            /* ── Discovery mode ── */
            <>
              {/* Featured Tools */}
              <div>
                <SectionHeading icon={<Star size={17} />} title="Featured Tools" count={FEATURED_TOOLS.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {FEATURED_TOOLS.map((tool, i) => (
                    <motion.div key={tool.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <Link href={tool.route}>
                        <div className="group relative flex flex-col p-5 rounded-2xl bg-gradient-to-b from-primary/8 to-transparent border border-primary/15 hover:border-primary/40 hover:from-primary/12 hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:shadow-[0_4px_24px_rgba(79,140,255,0.15)]">
                          {tool.badge && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{tool.badge}</span>
                          )}
                          <div className="flex items-start mb-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
                          </div>
                          <h3 className="font-bold mb-1.5 group-hover:text-primary transition-colors text-sm">{tool.name}</h3>
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 flex-1 mb-3">{tool.desc}</p>
                          <span className="inline-flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                            Open Tool <ArrowRight size={11} />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Popular Tools */}
              <div>
                <SectionHeading icon={<Flame size={17} />} title="Popular Tools" count={POPULAR_TOOLS.length} accent="text-amber-400" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {POPULAR_TOOLS.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                </div>
              </div>

              {/* Recently Updated */}
              <div>
                <SectionHeading icon={<Clock size={17} />} title="Recently Updated" count={RECENTLY_UPDATED_TOOLS.length} accent="text-emerald-400" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {RECENTLY_UPDATED_TOOLS.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                </div>
              </div>

              {/* All Tools */}
              <div>
                <SectionHeading icon={<Wrench size={17} />} title="All Tools" count={INTERACTIVE_TOOLS.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {INTERACTIVE_TOOLS.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
                </div>
              </div>

              {/* Coming Soon */}
              <div>
                <SectionHeading icon={<Zap size={17} />} title="Coming Soon" count={PLACEHOLDER_TOOLS.length} accent="text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-6">More tools are in development and will launch here soon.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {PLACEHOLDER_TOOLS.map((tool, i) => <ComingSoonCard key={tool.id} tool={tool} index={i} />)}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}
