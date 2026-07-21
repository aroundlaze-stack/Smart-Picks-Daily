import { useState } from 'react';
import { SEO } from '../components/seo';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, GraduationCap, Gamepad2, Briefcase, Plane,
  Cpu, Video, Building2, Brain, Camera,
  ChevronRight, Sparkles, ArrowLeft
} from 'lucide-react';

// ─── Use-case definitions ─────────────────────────────────────────────────────

interface UseCase {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;     // which Products category to filter
  gradient: string;
  border: string;
  shadow: string;
}

const USE_CASES: UseCase[] = [
  {
    id: "programming",
    label: "Programming",
    icon: <Code2 size={28} />,
    description: "Software development, IDEs, compiling, Docker",
    category: "Ultrabooks",
    gradient: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(59,130,246,0.25)]",
  },
  {
    id: "college",
    label: "College",
    icon: <GraduationCap size={28} />,
    description: "Notes, assignments, Zoom, Office apps",
    category: "Ultrabooks",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(52,211,153,0.25)]",
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: <Gamepad2 size={28} />,
    description: "AAA titles, esports, high refresh rate",
    category: "Gaming Laptops",
    gradient: "from-red-500/20 to-red-500/5",
    border: "border-red-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(239,68,68,0.25)]",
  },
  {
    id: "business",
    label: "Business",
    icon: <Briefcase size={28} />,
    description: "Meetings, spreadsheets, presentations, CRM",
    category: "Laptops",
    gradient: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(139,92,246,0.25)]",
  },
  {
    id: "travel",
    label: "Travel",
    icon: <Plane size={28} />,
    description: "Ultra-portable, long battery, lightweight",
    category: "Ultrabooks",
    gradient: "from-sky-500/20 to-sky-500/5",
    border: "border-sky-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(56,189,248,0.25)]",
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: <Cpu size={28} />,
    description: "CAD, simulations, MATLAB, SolidWorks",
    category: "Workstations",
    gradient: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(249,115,22,0.25)]",
  },
  {
    id: "editing",
    label: "Editing",
    icon: <Video size={28} />,
    description: "4K video editing, Premiere Pro, DaVinci",
    category: "Workstations",
    gradient: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(236,72,153,0.25)]",
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: <Building2 size={28} />,
    description: "AutoCAD, Revit, Rhino, rendering",
    category: "Workstations",
    gradient: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(245,158,11,0.25)]",
  },
  {
    id: "ml",
    label: "Machine Learning",
    icon: <Brain size={28} />,
    description: "Training models, CUDA, PyTorch, TensorFlow",
    category: "Gaming Laptops",
    gradient: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(168,85,247,0.25)]",
  },
  {
    id: "content",
    label: "Content Creation",
    icon: <Camera size={28} />,
    description: "YouTube, streaming, Photoshop, podcasting",
    category: "Laptops",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/30",
    shadow: "hover:shadow-[0_0_28px_rgba(6,182,212,0.25)]",
  },
];

// ─── Floating background particles ───────────────────────────────────────────

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Grid lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(79,140,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LaptopFinder() {
  const [selected, setSelected] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [, setLocation] = useLocation();

  const handleFind = () => {
    if (!selected) return;
    const uc = USE_CASES.find(u => u.id === selected);
    if (!uc) return;

    setNavigating(true);

    // Build URL params
    const params = new URLSearchParams({
      category: uc.category,
      usecase: uc.id,
      scroll: 'products',
    });

    setTimeout(() => {
      setLocation(`/products?${params.toString()}`);
    }, 600);
  };

  const selectedUC = USE_CASES.find(u => u.id === selected);

  return (
    <>
      <SEO
        title="Smart Laptop Finder | Smart Picks Daily"
        description="Tell us what you do and we'll recommend the best laptops for your needs. Programming, gaming, travel, ML, and more."
        url="/laptop-finder"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Smart Laptop Finder — Smart Picks Daily',
          url: 'https://smartpicksdaily.com/laptop-finder',
          description: "Tell us what you do and we\u2019ll recommend the best laptops for your needs.",
          applicationCategory: 'ShoppingApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
              { '@type': 'ListItem', position: 2, name: 'Laptop Finder', item: 'https://smartpicksdaily.com/laptop-finder' }
            ]
          }
        }}
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden">
        <FloatingParticles />

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(79,140,255,0.08) 0%, transparent 65%), radial-gradient(ellipse at 80% 70%, rgba(124,58,237,0.06) 0%, transparent 55%)',
        }} />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6">

          {/* Back link */}
          <motion.a
            href="/products"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={15} /> Back to Products
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary mb-5">
              <Sparkles size={12} className="animate-pulse" />
              AI-Powered Recommendations
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">
              Smart{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Laptop Finder
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              What do you use your laptop for?
            </p>
          </motion.div>

          {/* Use Case Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10"
          >
            {USE_CASES.map((uc, i) => (
              <motion.button
                key={uc.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                onClick={() => setSelected(uc.id === selected ? null : uc.id)}
                className={`group relative flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl border transition-all duration-300 text-center ${
                  selected === uc.id
                    ? `bg-gradient-to-b ${uc.gradient} ${uc.border} border-2 scale-105 shadow-2xl`
                    : `bg-white/3 border-white/10 hover:bg-white/7 hover:border-white/20 ${uc.shadow}`
                }`}
                whileHover={{ y: selected === uc.id ? 0 : -4 }}
                whileTap={{ scale: 0.96 }}
              >
                {/* Selected ring */}
                {selected === uc.id && (
                  <motion.div
                    layoutId="selected-ring"
                    className="absolute inset-0 rounded-2xl border-2 border-current opacity-50"
                    style={{ borderColor: 'currentColor' }}
                    initial={false}
                  />
                )}

                <div className={`transition-colors duration-300 ${
                  selected === uc.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {uc.icon}
                </div>
                <div>
                  <div className={`font-bold text-sm transition-colors ${
                    selected === uc.id ? 'text-foreground' : 'text-foreground/80'
                  }`}>
                    {uc.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                    {uc.description}
                  </div>
                </div>

                {selected === uc.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Selection preview */}
          <AnimatePresence mode="wait">
            {selectedUC && (
              <motion.div
                key={selectedUC.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`mb-8 p-4 rounded-2xl border ${selectedUC.border} bg-gradient-to-r ${selectedUC.gradient} backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-foreground/80">{selectedUC.icon}</div>
                  <div>
                    <div className="text-sm font-bold">{selectedUC.label}</div>
                    <div className="text-xs text-muted-foreground">
                      We'll show you <span className="text-foreground font-semibold">{selectedUC.category}</span> — ideal for {selectedUC.description.toLowerCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleFind}
              disabled={!selected || navigating}
              whileHover={selected ? { scale: 1.04 } : {}}
              whileTap={selected ? { scale: 0.97 } : {}}
              className={`relative flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                selected && !navigating
                  ? 'bg-primary text-primary-foreground shadow-[0_0_28px_rgba(79,140,255,0.5)] hover:shadow-[0_0_40px_rgba(79,140,255,0.7)]'
                  : 'bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed'
              }`}
            >
              <AnimatePresence mode="wait">
                {navigating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                    />
                    Finding your laptop…
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <Sparkles size={20} />
                    Find My Laptop
                    <ChevronRight size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            You'll be taken to our product database, filtered for your use case.
          </p>
        </div>
      </div>
    </>
  );
}
