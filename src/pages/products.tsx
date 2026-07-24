import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  trackProductCardClicked,
  trackAffiliateClick,
  trackCategoryFilter,
  trackSortOptionSelected,
  trackLoadMoreProducts,
  trackSearchCompleted,
  trackNoResults,
} from '../lib/tracking';
import { SEO } from '../components/seo';
import { HolographicShelf } from '../components/3d/HolographicShelf';
import { Search, Filter, ExternalLink, SlidersHorizontal, ChevronDown, X, Sparkles, Cpu, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { ALL_PRODUCTS, Product } from '../data/products.shared';


// ─── Category definitions ─────────────────────────────────────────────────────

const ALL_CATEGORIES = [
  "All",
  "Laptops", "Gaming Laptops", "Ultrabooks", "Mini PCs", "Gaming PCs", "Workstations", "NAS",
  "Processors", "Graphics Cards", "Motherboards", "RAM", "Storage", "Power Supplies", "Cooling", "Cases",
  "Monitors", "Portable Monitors", "TVs", "Projectors",
  "Keyboards", "Mouse", "Headphones", "Earbuds", "Speakers", "Microphones", "Webcams", "Capture Cards", "Streaming Equipment",
  "Networking",
  "Docking Stations",
  "Smartphones", "Tablets", "Smartwatches", "Power Banks", "Chargers",
  "Gaming Chairs",
  "Accessories",
];

const SORT_OPTIONS = [
  { value: "default", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
];

const PAGE_SIZE = 12;

// AI badge styling
const AI_BADGE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'AI Recommended': { label: '🤖 AI Recommended', color: 'text-blue-300', bg: 'bg-blue-500/20', border: 'border-blue-500/40' },
  'Best Value':     { label: '💰 Best Value',       color: 'text-green-300', bg: 'bg-green-500/20', border: 'border-green-500/40' },
  'Performance Pick': { label: '⚡ Performance Pick', color: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-500/40' },
  'Budget Pick':    { label: '🏷️ Budget Pick',     color: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' },
  "Editor's Choice": { label: '🏆 Editor\'s Choice', color: 'text-orange-300', bg: 'bg-orange-500/20', border: 'border-orange-500/40' },
  'Future Proof':   { label: '🚀 Future Proof',     color: 'text-cyan-300', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40' },
};

// ─── Arsenal Hero Background ─────────────────────────────────────────────────

function ArsenalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 60 + 200,
      });
    }

    const nodes: { x: number; y: number }[] = [];
    const COLS = 8, ROWS = 5;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        nodes.push({
          x: (c / (COLS - 1)) * canvas.width,
          y: (r / (ROWS - 1)) * canvas.height,
        });
      }
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(79,140,255,0.06)';
      ctx.lineWidth = 1;
      const CELL = 50;
      for (let x = 0; x < canvas.width; x += CELL) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += CELL) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      nodes.forEach((n, i) => {
        if (i % COLS === COLS - 1) return;
        const n2 = nodes[i + 1];
        const pulse = Math.sin(t * 0.02 + i * 0.5) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(79,140,255,${0.04 + pulse * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n2.x, n2.y); ctx.stroke();
      });

      nodes.forEach((n, i) => {
        const pulse = Math.sin(t * 0.015 + i * 0.7) * 0.5 + 0.5;
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 8 + pulse * 6);
        grd.addColorStop(0, `rgba(79,140,255,${0.4 + pulse * 0.4})`);
        grd.addColorStop(1, 'rgba(79,140,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(n.x, n.y, 8 + pulse * 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(180,210,255,${0.8 + pulse * 0.2})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2); ctx.fill();
      });

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const a = p.alpha * (Math.sin(t * 0.01 + p.x) * 0.3 + 0.7);
        ctx.fillStyle = `hsla(${p.hue},90%,70%,${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      const grd = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.3, canvas.width * 0.6
      );
      grd.addColorStop(0, `rgba(79,140,255,${0.04 + Math.sin(t * 0.005) * 0.02})`);
      grd.addColorStop(0.5, 'rgba(124,58,237,0.03)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Products() {
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [usecaseBanner, setUsecaseBanner] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState(false);
  const [aiPurpose, setAiPurpose] = useState<string | null>(null);
  const [aiBudget, setAiBudget] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const productGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const uc = params.get('usecase');
    const ai = params.get('ai');
    const purpose = params.get('purpose');
    const budget = params.get('budget');
    const scroll = params.get('scroll');

    if (cat && ALL_CATEGORIES.includes(cat)) setCategory(cat);
    if (uc) setUsecaseBanner(uc);
    if (ai === '1') { setAiMode(true); setAiPurpose(purpose); setAiBudget(budget); }
    if (scroll === 'products' || uc || ai) {
      setTimeout(() => {
        productGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, []);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description?.toLowerCase().includes(q) ?? false);
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.priceMin - b.priceMin);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.priceMax - a.priceMax);
    else if (sortBy === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc") list = [...list].sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [search, category, sortBy]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setActiveIndex(null);
  }, [search, category, sortBy]);

  // Debounced search tracking
  useEffect(() => {
    if (!search) return;
    const t = setTimeout(() => {
      if (filtered.length === 0) {
        trackNoResults(search, category);
      } else {
        trackSearchCompleted(search, filtered.length, category);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [search, filtered.length, category]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const shelfProducts = filtered.slice(0, 7);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => prev + PAGE_SIZE);
    trackLoadMoreProducts(category, filtered.length - visibleCount);
  }, [category, filtered.length, visibleCount]);

  const clearFilters = () => {
    setSearch(""); setCategory("All"); setSortBy("default");
    setUsecaseBanner(null); setAiMode(false); setAiPurpose(null); setAiBudget(null);
    setLocation('/products');
  };

  const USECASE_LABELS: Record<string, string> = {
    programming: "Programming & Development", college: "College / Student",
    gaming: "Gaming", business: "Business", travel: "Travel",
    engineering: "Engineering", editing: "Video Editing",
    architecture: "Architecture & CAD", ml: "Machine Learning & AI",
    content: "Content Creation", general: "General Use",
  };

  const PURPOSE_WHY: Record<string, string> = {
    gaming: "prioritising high refresh rate displays, powerful GPUs and fast storage",
    programming: "focusing on keyboard quality, display accuracy and RAM capacity",
    editing: "selecting products with colour-accurate displays and fast storage",
    ml: "recommending hardware with maximum VRAM and compute throughput",
    business: "highlighting reliability, battery life and build quality",
    college: "balancing portability, battery and value for money",
    travel: "prioritising lightweight, thin designs with long battery life",
    camera: "selecting devices with the best computational photography",
    performance: "recommending the highest benchmark scores in category",
    value: "finding the best price-to-performance ratio",
    battery: "selecting products rated highest for battery endurance",
  };

  return (
    <>
      <SEO
        title="Top Tech Gear & Gadgets | Arsenal"
        description="Browse our curated database of the best tech products across all categories. Prices in INR."
        url="/products"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'The Arsenal — Top Tech Gear & Gadgets',
            url: 'https://smartpicksdaily.com/products',
            description: 'Browse our curated database of the best tech products across all categories. Prices in INR.',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
                { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://smartpicksdaily.com/products' }
              ]
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Top Tech Products — Smart Picks Daily',
            url: 'https://smartpicksdaily.com/products',
            numberOfItems: ALL_PRODUCTS.length,
            itemListElement: ALL_PRODUCTS.slice(0, 10).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: p.link || 'https://smartpicksdaily.com/products',
              description: p.description
            }))
          }
        ]}
      />

      {/* ── Arsenal Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[38vh] md:h-[44vh] w-full border-b border-white/5 bg-gradient-to-b from-transparent to-background overflow-hidden">
        <ArsenalBackground />
        <div className="absolute inset-0 z-10">
          <HolographicShelf isMobile={isMobile} products={shelfProducts} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
        <div className="absolute inset-0 z-20 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(79,140,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(124,58,237,0.07) 0%, transparent 55%)'
        }} />

        <div className="absolute top-4 md:top-5 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none w-full px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="animate-pulse" />
              {ALL_PRODUCTS.length}+ Products · Prices in INR
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-3 drop-shadow-lg tracking-tight">
              The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-pulse">
                Arsenal
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto drop-shadow-md text-sm md:text-base">
              Interact with the holograms · Browse the full database
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 w-full max-w-5xl px-4 flex flex-col gap-2">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
              <input
                type="search"
                placeholder="Search products, categories…"
                aria-label="Search products and categories"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black/70 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-11 pr-10 focus:outline-none focus:border-primary/60 transition-colors text-foreground text-sm placeholder:text-muted-foreground/60"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={15} />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="h-full flex items-center gap-2 px-4 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium hover:border-primary/40 transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal size={15} />
                {isMobile ? '' : SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort'}
                <ChevronDown size={13} />
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 bottom-full mb-2 bg-card/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[180px]"
                  >
                    {SORT_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        onClick={() => { setSortBy(o.value); setShowSortDropdown(false); trackSortOptionSelected(o.value); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${sortBy === o.value ? 'text-primary font-medium' : 'text-foreground/80'}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="relative">
            {/* Left fade: shows there's more to scroll */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-black/70 to-transparent rounded-l" aria-hidden="true" />
            {/* Right fade: shows there's more to scroll */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-black/70 to-transparent rounded-r" aria-hidden="true" />
          <div className="overflow-x-auto pb-1 hide-scrollbar flex items-center gap-2" role="listbox" aria-label="Filter by product category">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); trackCategoryFilter(cat); }}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
                  category === cat
                    ? 'bg-primary text-primary-foreground shadow-[0_0_12px_rgba(79,140,255,0.5)]'
                    : 'bg-black/60 backdrop-blur-md border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
</div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ──────────────────────────────────────────────────── */}
      <section ref={productGridRef} className="py-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">

          {/* AI Analysis Banner */}
          <AnimatePresence>
            {aiMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border border-primary/20 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Brain size={17} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-primary">AI Tech Finder Analysis</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary font-medium">Active</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Showing recommendations for <strong className="text-foreground">{category !== 'All' ? category : 'all products'}</strong>
                        {aiPurpose && (
                          <>, {PURPOSE_WHY[aiPurpose] ?? `optimised for ${aiPurpose}`}</>
                        )}.
                        {' '}Look for badge labels on cards to identify the best picks for your needs.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {Object.entries(AI_BADGE_CONFIG).map(([key, cfg]) => (
                          <span key={key} className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={clearFilters} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header row */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              {usecaseBanner && USECASE_LABELS[usecaseBanner] && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary w-fit"
                >
                  <Cpu size={12} />
                  Smart Recommendations for: <strong>{USECASE_LABELS[usecaseBanner]}</strong>
                  <button onClick={clearFilters} className="ml-1 hover:text-white"><X size={11} /></button>
                </motion.div>
              )}
              <h2 className="text-2xl font-display font-bold">
                {category === "All" ? "All Equipment" : category}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} results · Prices in ₹ INR
              </p>
            </div>

            <Link
              href="/ai-tech-finder"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <Sparkles size={14} />
              AI Tech Finder
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProducts.map((product, i) => (
                <motion.div
                  key={product.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.4) }}
                  onClick={() => trackProductCardClicked({ name: product.name, category: product.category, price: product.price, priceMin: product.priceMin })}
                  className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 flex flex-col hover:shadow-[0_0_24px_rgba(79,140,255,0.12)] cursor-pointer"
                >
                  {/* Image area */}
                  <div className="h-44 bg-black/50 relative overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full p-5 flex items-center justify-center">
                        <div className="w-full h-full border border-dashed border-white/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <span className="font-display font-bold text-white/20 text-base text-center px-3 leading-snug">{product.name}</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
                      background: `radial-gradient(ellipse at center, rgba(79,140,255,0.4) 0%, transparent 70%)`
                    }} />

                    {product.badge && (
                      <span className="absolute top-3 right-3 z-30 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        {product.badge}
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 z-30 text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                      {product.category}
                    </span>
                    <span className="absolute bottom-3 right-3 z-30 font-display font-bold text-sm text-white">
                      {product.price}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-bold mb-2 leading-snug">{product.name}</h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{product.description}</p>
                    )}

                    {/* AI badges when in AI mode */}
                    {aiMode && product.aiBadges && product.aiBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.aiBadges.slice(0, 2).map(badge => {
                          const cfg = AI_BADGE_CONFIG[badge];
                          if (!cfg) return null;
                          return (
                            <span key={badge} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                              {cfg.label}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
                      <div>
                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider block mb-1.5">Pros</span>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {product.pros.map(pro => (
                            <li key={pro} className="flex items-start gap-1">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">+</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-1.5">Cons</span>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {product.cons.map(con => (
                            <li key={con} className="flex items-start gap-1">
                              <span className="text-red-500 mt-0.5 flex-shrink-0">−</span> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAffiliateClick({ name: product.name, category: product.category, price: product.price, priceMin: product.priceMin })}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-primary text-foreground hover:text-primary-foreground border border-white/10 hover:border-primary font-bold text-sm flex items-center justify-center gap-2 transition-all mt-auto group-hover:shadow-[0_0_12px_rgba(79,140,255,0.3)]"
                    >
                      View Deal <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <Filter size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">No hardware found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="mt-5 px-6 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Load More */}
          <AnimatePresence>
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-center mt-12"
              >
                <button
                  onClick={loadMore}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,140,255,0.25)]"
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✦
                  </motion.span>
                  Load More ({filtered.length - visibleCount} remaining)
                  <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
