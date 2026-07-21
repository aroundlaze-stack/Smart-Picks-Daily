import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ChevronDown,
  Star,
  Zap,
  Cpu,
  Award,
  Brain,
  BookOpen,
  BarChart3,
  TrendingDown,
} from 'lucide-react';
import { SEO } from '../components/seo';
import { AIIntelligenceCore } from '../components/3d/AIIntelligenceCore';

// ── Feature strip cards ──────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Brain,
    label: 'AI Recommendations',
    gradient: 'from-blue-500/25 to-blue-500/5',
    border: 'border-blue-500/25',
    hoverShadow: 'hover:shadow-[0_0_22px_rgba(79,140,255,0.35)]',
  },
  {
    icon: Award,
    label: 'Expert Reviews',
    gradient: 'from-purple-500/25 to-purple-500/5',
    border: 'border-purple-500/25',
    hoverShadow: 'hover:shadow-[0_0_22px_rgba(124,58,237,0.35)]',
  },
  {
    icon: BookOpen,
    label: 'Buying Guides',
    gradient: 'from-cyan-500/25 to-cyan-500/5',
    border: 'border-cyan-500/25',
    hoverShadow: 'hover:shadow-[0_0_22px_rgba(6,182,212,0.35)]',
  },
  {
    icon: BarChart3,
    label: 'Verified Benchmarks',
    gradient: 'from-green-500/25 to-green-500/5',
    border: 'border-green-500/25',
    hoverShadow: 'hover:shadow-[0_0_22px_rgba(34,197,94,0.35)]',
  },
  {
    icon: TrendingDown,
    label: 'Price Tracking',
    gradient: 'from-orange-500/25 to-orange-500/5',
    border: 'border-orange-500/25',
    hoverShadow: 'hover:shadow-[0_0_22px_rgba(249,115,22,0.35)]',
  },
] as const;

// ── Stats bar ────────────────────────────────────────────────────────────────

const STATS = [
  { value: '500+',  label: 'Products Tested'    },
  { value: '150+',  label: 'Expert Reviews'     },
  { value: '50K+',  label: 'Monthly Readers'    },
  { value: '98%',   label: 'Reader Satisfaction'},
];

// ── Category cards ───────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    title: 'Mechanical Keyboards',
    desc: 'Switches, keycaps & layouts explained.',
    icon: <Cpu className="text-primary" size={32} />,
    border: 'border-primary/20',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(79,140,255,0.18)]',
    href: '/products?category=Keyboards',
  },
  {
    title: 'High-Refresh Monitors',
    desc: 'Pixel-perfect clarity for competitive gaming.',
    icon: <Zap className="text-secondary" size={32} />,
    border: 'border-secondary/20',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(124,58,237,0.18)]',
    href: '/products?category=Monitors',
  },
  {
    title: 'Wireless Audio',
    desc: 'Latency-free headsets that actually sound good.',
    icon: <Star className="text-accent" size={32} />,
    border: 'border-accent/20',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.18)]',
    href: '/products?category=Audio',
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    text: "Smart Picks Daily saved me from dropping $200 on a terrible 'gaming' headset. Their alternative was $80 and sounds incredible.",
    author: 'Alex R.',
    role: 'Competitive Gamer',
  },
  {
    text: 'The only site I check before buying tech. The way they break down specs into actual human benefits is unmatched.',
    author: 'Sarah M.',
    role: 'Software Engineer',
  },
];

// ────────────────────────────────────────────────────────────────────────────────
// Home page
// ────────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      <SEO
        title="Smart Picks Daily | Expert Tech Reviews & Buying Guides"
        description="The cockpit of the internet's most obsessive tech buyers. Every gadget put through its paces so you don't have to guess."
        url="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Smart Picks Daily — Expert Tech Reviews & Buying Guides',
          url: 'https://smartpicksdaily.com/',
          description: "The cockpit of the internet\u2019s most obsessive tech buyers. Every gadget put through its paces so you don\u2019t have to guess.",
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' }
            ]
          }
        }}
      />

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] w-full flex items-center -mt-20 overflow-hidden">
        {/* Ambient gradient blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[72vh]">

            {/* ── Left: copy ── */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6 backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Updated July 2026
                </motion.div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-display font-bold leading-tight tracking-tighter mb-6 text-balance">
                  Navigate the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Tech Universe
                  </span>{' '}
                  with Certainty.
                </h1>

                {/* Sub-copy */}
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  Every gadget put through its paces. Every buying guide agonized
                  over. Stop guessing — start building your perfect setup.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(79,140,255,0.4)] hover:shadow-[0_0_36px_rgba(79,140,255,0.65)]"
                    >
                      <Zap size={20} />
                      Explore Top Picks
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/reviews"
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 hover:border-white/25 px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-md"
                    >
                      Read Expert Reviews
                    </Link>
                  </motion.div>
                </div>

                {/* ── Feature strip ── */}
                <div className="flex flex-wrap gap-2.5">
                  {FEATURES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.div
                        key={f.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                        whileHover={{ scale: 1.07, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-b ${f.gradient} border ${f.border} backdrop-blur-sm transition-all duration-300 ${f.hoverShadow} cursor-default`}
                      >
                        <Icon
                          size={13}
                          className="text-foreground/65 group-hover:text-foreground transition-colors"
                        />
                        <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground transition-colors whitespace-nowrap">
                          {f.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* ── Right: 3D AI Intelligence Core ── */}
            <div className="relative order-1 lg:order-2 h-[300px] md:h-[430px] lg:h-[570px] w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.78 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.3, delay: 0.28, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <AIIntelligenceCore isMobile={isMobile} />
              </motion.div>
              {/* Radial ambient glow behind the canvas */}
              <div
                className="absolute inset-0 -z-10 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(79,140,255,0.12) 0%, rgba(124,58,237,0.06) 50%, transparent 75%)',
                  filter: 'blur(24px)',
                  transform: 'scale(1.15)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{ delay: 1.8, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <ChevronDown size={26} />
        </motion.div>
      </section>

      {/* ═══ STATS BAR ══════════════════════════════════════════════════════ */}
      <section className="py-20 border-y border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x divide-white/5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-4"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/45 mb-2">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRENDING CATEGORIES ════════════════════════════════════════════ */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Trending Categories
            </h2>
            <p className="text-muted-foreground text-lg">
              Dive into our most popular component deep-dives and find the exact
              gear that fits your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  href={cat.href}
                  className={`block group relative bg-white/5 border ${cat.border} p-8 rounded-2xl transition-all duration-500 hover:bg-white/10 ${cat.shadow} overflow-hidden`}
                >
                  {/* Decorative corner sweep */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                  <div className="mb-6 w-16 h-16 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-muted-foreground">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST & TESTIMONIALS ══════════════════════════════════════════ */}
      <section className="py-24 bg-card border-y border-white/5 relative overflow-hidden">
        {/* Ambient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Copy */}
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent mb-6">
                <Award size={14} />
                Independent &amp; Unbiased
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                We buy it, we test it, we break it.
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                No sponsored reviews. No fluff. Just brutal honesty about what's
                worth your money and what belongs in the trash.
              </p>
              <ul className="space-y-4">
                {[
                  'Purchased with our own funds',
                  'Tested in real workflows for 30+ days',
                  'Compared against exact price competitors',
                  'Long-term durability follow-ups',
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs flex-shrink-0">
                      ✓
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10">
                <motion.div whileHover={{ x: 5 }}>
                  <Link
                    href="/about"
                    className="text-primary font-bold hover:underline inline-flex items-center gap-2"
                  >
                    Read our full methodology
                    <ChevronDown className="-rotate-90" size={16} />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Testimonial cards */}
            <div className="md:w-1/2 grid grid-cols-1 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.author}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.025, y: -3 }}
                  className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md transition-shadow hover:shadow-[0_0_22px_rgba(79,140,255,0.1)]"
                >
                  <div className="flex text-primary mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
                    <div>
                      <div className="font-bold">{t.author}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER CTA ════════════════════════════════════════════════ */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Don't miss the next leap.
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Join 50,000+ tech enthusiasts getting our weekly breakdown of new
              releases, deep-dive reviews, and exclusive deals.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter sign-up"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email address"
                required
                autoComplete="email"
                className="flex-1 bg-black/50 border border-white/20 focus:border-primary rounded-full px-6 py-4 text-foreground outline-none transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_16px_rgba(79,140,255,0.4)] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Subscribe
              </motion.button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
