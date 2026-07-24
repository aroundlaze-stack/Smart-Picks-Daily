import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ChevronDown,
  Star,
  Zap,
  Cpu,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingCart,
} from 'lucide-react';
import { SEO } from '../components/seo';
import { AIIntelligenceCore } from '../components/3d/AIIntelligenceCore';
import { ALL_PRODUCTS } from '../data/products.shared';

// ── Trust badges ────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { label: 'Honest Reviews' },
  { label: 'AI Recommendations' },
  { label: 'Buying Guides' },
  { label: 'Updated Weekly' },
] as const;

// ── Stats bar ────────────────────────────────────────────────────────────────

const STATS = [
  { value: 'Growing',         label: 'Product Database'    },
  { value: 'Independent',     label: 'Buying Guides'       },
  { value: 'India-First',     label: 'Audience Focus'      },
  { value: 'Research-Driven', label: 'Recommendations'     },
];

// ── Featured products ─────────────────────────────────────────────────────────

const FEATURED_PRODUCTS = [
  {
    name: 'Sony WH-1000XM5',
    category: 'Wireless Headphones',
    price: '₹24,990',
    rating: 4.8,
    reviews: 12840,
    badge: 'Best Headphones',
    badgeColor: 'text-accent border-accent/30 bg-accent/10',
    image: 'https://m.media-amazon.com/images/I/61vG9Iu0VIL._AC_SL1500_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
    blurb: 'Industry-leading ANC with 30-hour battery. The one to beat.',
  },
  {
    name: 'Apple MacBook Air 15" (M3)',
    category: 'Ultrabooks',
    price: '₹1,34,900',
    rating: 4.9,
    reviews: 8320,
    badge: 'Best Value',
    badgeColor: 'text-primary border-primary/30 bg-primary/10',
    image: 'https://m.media-amazon.com/images/I/31d9GFLKHDL._AC_SL1000_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B0CX239WHB',
    blurb: 'Fanless silence, all-day battery, gorgeous 15″ Liquid Retina display.',
  },
  {
    name: 'Keychron K2 Pro',
    category: 'Mechanical Keyboards',
    price: '₹8,999',
    rating: 4.7,
    reviews: 5610,
    badge: 'Top Keyboard',
    badgeColor: 'text-secondary border-secondary/30 bg-secondary/10',
    image: 'https://m.media-amazon.com/images/I/71tF6Hdo1bL._AC_SL1500_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B0C3MXCX1L',
    blurb: 'Hot-swappable switches, QMK/VIA support, and Bluetooth 5.1.',
  },
  {
    name: 'LG UltraGear 27GP850-B',
    category: 'Gaming Monitors',
    price: '₹32,999',
    rating: 4.6,
    reviews: 9140,
    badge: "Editor's Pick",
    badgeColor: 'text-accent border-accent/30 bg-accent/10',
    image: 'https://m.media-amazon.com/images/I/81L9sp6gEEL._AC_SL1500_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B096VH7DZQ',
    blurb: '27″ Nano IPS, 165 Hz, 1 ms — buttery smooth at 1440p.',
  },
  {
    name: 'Logitech MX Master 3S',
    category: 'Wireless Mice',
    price: '₹8,995',
    rating: 4.7,
    reviews: 7280,
    badge: 'Best Mouse',
    badgeColor: 'text-primary border-primary/30 bg-primary/10',
    image: 'https://m.media-amazon.com/images/I/61aNhLXiL0L._AC_SL1500_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B09HMKFDXC',
    blurb: '8K-DPI MagSpeed scroll, whisper-quiet clicks, 70-day battery.',
  },
  {
    name: 'ASUS ROG Zephyrus G14 (2024)',
    category: 'Gaming Laptops',
    price: '₹1,58,000',
    rating: 4.5,
    reviews: 3920,
    badge: "Editor's Pick",
    badgeColor: 'text-secondary border-secondary/30 bg-secondary/10',
    image: 'https://m.media-amazon.com/images/I/81PmJl9r3fL._AC_SL1500_.jpg',
    amazonUrl: 'https://www.amazon.in/dp/B0CYYPQNMK',
    blurb: 'Compact 14″ powerhouse — RTX 4060 Ti meets the AniMe Matrix lid.',
  },
] as const;

const getImage = (name: string, fallback?: string) => {
  const normalize = (s: string) => s.replace(/["']/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const target = normalize(name);
  const p = ALL_PRODUCTS.find((x) => {
    const n = normalize(x.name);
    return n === target || n.includes(target) || target.includes(n);
  });
  return (p && p.image) ? p.image : fallback ?? '/placeholder.png';
};

const getSharedProduct = (name: string) => {
  const normalize = (s: string) => s.replace(/["']/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const target = normalize(name);
  return ALL_PRODUCTS.find((x) => {
    const n = normalize(x.name);
    return n === target || n.includes(target) || target.includes(n);
  });
};

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
    text: "Was about to spend ₹15,000 on a gaming headset I saw on Amazon. Smart Picks Daily pointed me to a better one for ₹7,500 that sounds incredible. Wish I'd found this site sooner.",
    author: 'Arjun Mehta',
    role: 'Competitive Gamer, Pune',
  },
  {
    text: "Needed a programming laptop under ₹80,000 and was completely lost. The buying guide here broke down exactly what specs matter. Ended up with a ThinkPad I absolutely love.",
    author: 'Priya Nair',
    role: 'Software Developer, Bengaluru',
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
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6 backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Expert-led tech reviews &amp; guides
                </motion.div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-display font-bold leading-tight tracking-tighter mb-6 text-balance">
                  Find the Right Tech{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    with Confidence
                  </span>
                  .
                </h1>

                {/* Sub-copy */}
                <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  Expert reviews, in-depth buying guides, AI-powered recommendations,
                  and honest product comparisons — so you can make informed decisions
                  without the marketing noise.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-[0_0_24px_rgba(79,140,255,0.35)] hover:shadow-[0_0_38px_rgba(79,140,255,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Zap size={18} />
                      Explore Products
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/ai-tech-finder"
                      className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 hover:border-white/25 px-7 py-4 rounded-full font-bold text-base md:text-lg transition-all backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Sparkles size={18} />
                      Try AI Finder
                    </Link>
                  </motion.div>
                </div>

                {/* ── Trust badges ── */}
                <div className="flex flex-wrap gap-3">
                  {TRUST_BADGES.map((badge, i) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                      <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">
                        {badge.label}
                      </span>
                    </motion.div>
                  ))}
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
      <section data-force-dark className="py-20 border-y border-white/5 bg-muted/30 backdrop-blur-sm">
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
                <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 mb-2">
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
                  <div className="mb-6 w-16 h-16 rounded-xl bg-background border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
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

      {/* ═══ FEATURED PRODUCTS — BENTO SHOWCASE ══════════════════════════ */}
      <section className="py-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">

          {/* ── Section header ── */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6"
            >
              <ShoppingCart size={13} />
              Smart Picks Daily Recommends
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              Featured Picks
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hand-tested and independently recommended — the best tech across
              every budget, curated just for you.
            </p>
          </div>

          {/* ── Bento grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">

            {/* ── CARD 1: Sony WH-1000XM5 — full-width hero, horizontal ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-6 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/8 via-background to-primary/5 hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_48px_rgba(6,182,212,0.12)] min-h-[260px] md:min-h-[300px]"
            >
              {/* Ambient glow */}
              <div className="absolute top-0 right-1/3 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center h-full">
                {/* Text side */}
                <div className="flex-1 p-7 md:p-10 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border border-accent/30 bg-accent/10 text-accent mb-4">
                    {FEATURED_PRODUCTS[0].badge}
                  </span>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                    {FEATURED_PRODUCTS[0].category}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                    {FEATURED_PRODUCTS[0].name}
                  </h3>
                  <p className="text-muted-foreground mb-5 max-w-md leading-relaxed">
                    {FEATURED_PRODUCTS[0].blurb}
                  </p>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-primary">
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="currentColor" />)}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{FEATURED_PRODUCTS[0].rating}</span>
                    <span className="text-sm text-muted-foreground">({FEATURED_PRODUCTS[0].reviews.toLocaleString('en-IN')} reviews)</span>
                  </div>
                  {/* pros / cons from shared dataset */}
                  {(() => {
                    const shared = getSharedProduct(FEATURED_PRODUCTS[0].name);
                    if (!shared) return null;
                    return (
                      <div className="mb-6 max-w-md">
                        {shared.pros?.length ? (
                          <ul className="flex flex-wrap gap-3 mb-2">
                            {shared.pros.slice(0,3).map((p, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                                <span className="leading-snug">{p}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {shared.cons?.length ? (
                          <ul className="flex flex-wrap gap-3">
                            {shared.cons.slice(0,3).map((c, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="text-red-400">●</span>
                                <span className="leading-snug">{c}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-5">
                    <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      {FEATURED_PRODUCTS[0].price}
                    </span>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(79,140,255,0.3)] hover:shadow-[0_0_30px_rgba(79,140,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ShoppingCart size={14} />
                      View Deal
                    </Link>
                  </div>
                </div>
                {/* Image side */}
                <div className="w-full md:w-80 lg:w-96 h-56 md:h-full flex items-center justify-center p-6 md:p-8 flex-shrink-0">
                  <img
                    src={getImage(FEATURED_PRODUCTS[0].name, FEATURED_PRODUCTS[0].image)}
                    alt={FEATURED_PRODUCTS[0].name}
                    loading="lazy"
                    className="max-h-52 md:max-h-64 w-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── CARDS 2–4: three vertical cards ── */}
            {([1, 2, 3] as const).map((idx, i) => (
              <motion.div
                key={FEATURED_PRODUCTS[idx].name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.55 }}
                whileHover={{ y: -6 }}
                className="md:col-span-2 group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/8 hover:border-white/20 hover:shadow-[0_0_28px_rgba(79,140,255,0.11)] flex flex-col"
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${FEATURED_PRODUCTS[idx].badgeColor}`}>
                    {FEATURED_PRODUCTS[idx].badge}
                  </span>
                </div>
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
                  <img
                    src={getImage(FEATURED_PRODUCTS[idx].name, FEATURED_PRODUCTS[idx].image)}
                    alt={FEATURED_PRODUCTS[idx].name}
                    loading="lazy"
                    className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-108"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                {/* Body */}
                <div className="flex flex-col flex-1 p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
                    {FEATURED_PRODUCTS[idx].category}
                  </p>
                  <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
                    {FEATURED_PRODUCTS[idx].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                    {FEATURED_PRODUCTS[idx].blurb}
                  </p>
                  {(() => {
                    const shared = getSharedProduct(FEATURED_PRODUCTS[idx].name);
                    if (!shared) return null;
                    return (
                      <div className="mb-3">
                        {shared.pros?.length ? (
                          <ul className="flex flex-wrap gap-3 mb-2">
                            {shared.pros.slice(0,2).map((p, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {shared.cons?.length ? (
                          <ul className="flex flex-wrap gap-3">
                            {shared.cons.slice(0,2).map((c, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="text-red-400">●</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex text-primary">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={11} fill={s <= Math.round(FEATURED_PRODUCTS[idx].rating) ? 'currentColor' : 'none'} className={s <= Math.round(FEATURED_PRODUCTS[idx].rating) ? '' : 'opacity-25'} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{FEATURED_PRODUCTS[idx].rating}</span>
                    <span className="text-xs text-muted-foreground">({FEATURED_PRODUCTS[idx].reviews.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      {FEATURED_PRODUCTS[idx].price}
                    </span>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1.5 bg-primary/12 hover:bg-primary/22 border border-primary/30 hover:border-primary/60 text-primary px-3.5 py-2 rounded-full text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ShoppingCart size={11} />
                      View Deal
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* ── CARD 5: ASUS ROG Zephyrus — wide (4/6) horizontal ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-secondary/8 via-background to-primary/5 hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_48px_rgba(124,58,237,0.13)] min-h-[260px]"
            >
              <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-secondary/10 blur-[70px] rounded-full pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center h-full">
                {/* Image side — left on wide card */}
                <div className="w-full sm:w-64 md:w-72 h-52 sm:h-full flex items-center justify-center p-6 flex-shrink-0">
                  <img
                    src={getImage(FEATURED_PRODUCTS[5].name, FEATURED_PRODUCTS[5].image)}
                    alt={FEATURED_PRODUCTS[5].name}
                    loading="lazy"
                    className="max-h-44 w-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                {/* Text side */}
                <div className="flex-1 p-7 md:p-8 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border border-secondary/30 bg-secondary/10 text-secondary mb-4">
                    {FEATURED_PRODUCTS[5].badge}
                  </span>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                    {FEATURED_PRODUCTS[5].category}
                  </p>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                    {FEATURED_PRODUCTS[5].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {FEATURED_PRODUCTS[5].blurb}
                  </p>
                  {(() => {
                    const shared = getSharedProduct(FEATURED_PRODUCTS[5].name);
                    if (!shared) return null;
                    return (
                      <div className="mb-4">
                        {shared.pros?.length ? (
                          <ul className="flex flex-wrap gap-3 mb-2">
                            {shared.pros.slice(0,3).map((p, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {shared.cons?.length ? (
                          <ul className="flex flex-wrap gap-3">
                            {shared.cons.slice(0,3).map((c, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="text-red-400">●</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-5">
                    <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                      {FEATURED_PRODUCTS[5].price}
                    </span>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                      <ShoppingCart size={14} />
                      View Deal
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── CARD 6: LG UltraGear — tall (2/6) vertical ── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="md:col-span-2 group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/8 hover:border-white/20 hover:shadow-[0_0_28px_rgba(79,140,255,0.11)] flex flex-col"
            >
              <div className="absolute top-3 left-3 z-10">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${FEATURED_PRODUCTS[4].badgeColor}`}>
                  {FEATURED_PRODUCTS[4].badge}
                </span>
              </div>
              <div className="relative w-full flex-1 min-h-[200px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
                <img
                  src={getImage(FEATURED_PRODUCTS[4].name, FEATURED_PRODUCTS[4].image)}
                  alt={FEATURED_PRODUCTS[4].name}
                  loading="lazy"
                  className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-108"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
                  {FEATURED_PRODUCTS[4].category}
                </p>
                <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
                  {FEATURED_PRODUCTS[4].name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {FEATURED_PRODUCTS[4].blurb}
                </p>
                {(() => {
                  const shared = getSharedProduct(FEATURED_PRODUCTS[4].name);
                  if (!shared) return null;
                  return (
                    <div className="mb-3">
                      {shared.pros?.length ? (
                        <ul className="flex flex-wrap gap-3 mb-2">
                          {shared.pros.slice(0,2).map((p, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {shared.cons?.length ? (
                        <ul className="flex flex-wrap gap-3">
                          {shared.cons.slice(0,2).map((c, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="text-red-400">●</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })()}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex text-primary">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={11} fill={s <= Math.round(FEATURED_PRODUCTS[4].rating) ? 'currentColor' : 'none'} className={s <= Math.round(FEATURED_PRODUCTS[4].rating) ? '' : 'opacity-25'} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{FEATURED_PRODUCTS[4].rating}</span>
                  <span className="text-xs text-muted-foreground">({FEATURED_PRODUCTS[4].reviews.toLocaleString('en-IN')})</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    {FEATURED_PRODUCTS[4].price}
                  </span>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 bg-primary/12 hover:bg-primary/22 border border-primary/30 hover:border-primary/60 text-primary px-3.5 py-2 rounded-full text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ShoppingCart size={11} />
                    View Deal
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>{/* /bento grid */}

          {/* ── Browse all link ── */}
          <div className="text-center mt-12">
            <motion.div whileHover={{ x: 5 }} className="inline-block">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-base"
              >
                Browse all products
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ═══ TRUST & TESTIMONIALS ══════════════════════════════════════════ */}
      <section data-force-dark className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border-y border-white/10 relative overflow-hidden">
        {/* Ambient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Copy */}
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent mb-6">
                <Award size={14} />
                Independent &amp; Unbiased
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                We buy it, we test it, we break it.
              </h2>
              <p className="text-slate-300 text-lg mb-8">
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
                  className="bg-card/80 border border-border p-6 rounded-2xl backdrop-blur-md transition-shadow hover:shadow-[0_0_22px_rgba(79,140,255,0.1)]"
                >
                  <div className="flex text-primary mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6 text-card-foreground/90">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
                    <div>
                      <div className="font-bold text-foreground">{t.author}</div>
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
              Join fellow Indian tech buyers getting our weekly breakdown of new
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
                className="flex-1 bg-background border border-white/20 focus:border-primary rounded-full px-6 py-4 text-foreground outline-none transition-colors"
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
