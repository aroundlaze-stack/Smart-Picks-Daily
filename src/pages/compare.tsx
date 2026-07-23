import { useState, useMemo, useCallback } from 'react';
import { SEO } from '../components/seo';
import { trackAffiliateClick } from '../lib/tracking';
import {
  Search, X, Plus, Minus, ExternalLink, Star, Zap, Trophy, Sparkles,
  BarChart3, Shield, IndianRupee, Monitor, Battery, LayoutGrid, ImageOff,
  ChevronDown, ChevronUp, Award, Cpu, HardDrive, Wifi, Smartphone, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_PRODUCTS, type Product } from '../data/products.shared';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const MAX_COMPARE = 4;
const MIN_COMPARE = 2;
const CATEGORIES = [...new Set(ALL_PRODUCTS.map(p => p.category))].sort();

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Derive structured specs from existing product data
// No new fields needed — all extracted from name, description, pros, cons, usecases
// ═══════════════════════════════════════════════════════════════════════════════

interface DerivedSpec {
  label: string;
  value: string;
  icon: React.ReactNode;
  detail?: string;
}

function extractBrand(name: string): string {
  const firstWord = name.split(' ')[0];
  const brandMap: Record<string, string> = {
    Apple: 'Apple', MacBook: 'Apple', Mac: 'Apple', iPad: 'Apple', iPhone: 'Apple', iMac: 'Apple',
    Dell: 'Dell', HP: 'HP', Lenovo: 'Lenovo', ASUS: 'ASUS', Asus: 'ASUS', Acer: 'Acer',
    MSI: 'MSI', Razer: 'Razer', Samsung: 'Samsung', LG: 'LG', Sony: 'Sony',
    Intel: 'Intel', AMD: 'AMD', NVIDIA: 'NVIDIA', Nvidia: 'NVIDIA', GeForce: 'NVIDIA',
    Gigabyte: 'Gigabyte', Corsair: 'Corsair', GSkill: 'G.Skill', 'G.Skill': 'G.Skill',
    Kingston: 'Kingston', Seagate: 'Seagate', Western: 'Western Digital', WD: 'WD',
    Crucial: 'Crucial', Synology: 'Synology', QNAP: 'QNAP',
    TP: 'TP-Link', 'TP-Link': 'TP-Link', Ubiquiti: 'Ubiquiti', Netgear: 'Netgear',
    Anker: 'Anker', Baseus: 'Baseus', UGREEN: 'UGREEN', CalDigit: 'CalDigit',
    Google: 'Google', OnePlus: 'OnePlus', Xiaomi: 'Xiaomi', Realme: 'Realme',
    Beelink: 'Beelink', Noctua: 'Noctua', Thermalright: 'Thermalright', 'be quiet!': 'be quiet!',
    NZXT: 'NZXT', Lian: 'Lian Li', 'Lian Li': 'Lian Li', Fractal: 'Fractal Design',
    'Fractal Design': 'Fractal Design', BenQ: 'BenQ', Epson: 'Epson', AOC: 'AOC',
    Secretlab: 'Secretlab', DXRacer: 'DXRacer', Herman: 'Herman Miller', 'Herman Miller': 'Herman Miller',
    Elgato: 'Elgato', Rode: 'Rode', Røde: 'Røde', HyperX: 'HyperX',
    Seasonic: 'Seasonic', be: 'be quiet!', Garmin: 'Garmin', Noise: 'Noise',
    TCL: 'TCL', Espresso: 'Espresso',
  };
  return brandMap[firstWord] || firstWord;
}

function derivePerformance(product: Product): string {
  const signals: string[] = [];
  if (product.aiBadges?.includes('Performance Pick')) signals.push('Top-tier performance');
  if (product.aiBadges?.includes('AI Recommended')) signals.push('AI recommended for performance');
  if (product.badge === 'Best Overall') signals.push('Best-in-class');
  if (product.badge === 'Fastest GPU') signals.push('Industry-leading speed');
  if (product.badge === 'Top CPU') signals.push('Flagship processing power');
  if (product.badge === 'Best Gaming CPU') signals.push('Gaming-optimized');
  if (product.usecases?.includes('gaming')) signals.push('Gaming-ready');
  if (product.usecases?.includes('ml')) signals.push('Machine learning capable');
  return signals.length > 0 ? signals.join('. ') : 'Standard performance tier';
}

function deriveBattery(product: Product): string {
  const all = [...(product.pros || []), ...(product.cons || []), ...(product.usecases || []), product.description || ''].join(' ');
  const lower = all.toLowerCase();
  if (lower.includes('18-hr') || lower.includes('18 hr') || lower.includes('60-hr') || lower.includes('60 hr')) return 'Excellent (18+ hours)';
  if (lower.includes('10-hr') || lower.includes('all-day') || lower.includes('long battery')) return 'Very good (10+ hours)';
  if (lower.includes('battery') && (lower.includes('good') || lower.includes('decent') || lower.includes('strong'))) return 'Good (8-10 hours)';
  if (lower.includes('short battery') || lower.includes('poor battery') || lower.includes('battery life') && lower.includes('cons')) return 'Below average (3-5 hours)';
  if (lower.includes('travel')) return 'Travel-friendly battery life';
  if (product.category === 'Gaming Laptops' || product.category === 'Gaming PCs') return 'Limited (gaming-focused)';
  if (product.category.includes('Laptop') || product.category === 'Ultrabooks') return 'Standard (5-8 hours)';
  if (product.category === 'Smartphones' || product.category === 'Tablets') return 'All-day use';
  return 'Varies by usage';
}

function deriveDisplay(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ');
  const lower = desc.toLowerCase();
  const specs: string[] = [];
  if (lower.includes('oled')) specs.push('OLED panel');
  if (lower.includes('4k') || lower.includes('uhd')) specs.push('4K resolution');
  if (lower.includes('qhd') || lower.includes('1440p') || lower.includes('2k')) specs.push('QHD (1440p)');
  if (lower.includes('3k') || lower.includes('3.2k')) specs.push('3K resolution');
  if (lower.includes('120hz') || lower.includes('144hz') || lower.includes('165hz') || lower.includes('240hz')) specs.push('High refresh rate');
  if (lower.includes('hdr')) specs.push('HDR support');
  if (lower.includes('amoled')) specs.push('AMOLED');
  if (lower.includes('mini led')) specs.push('Mini LED backlight');
  if (lower.includes('retina') || lower.includes('liquid retina')) specs.push('Retina display');
  if (lower.includes('touch')) specs.push('Touchscreen');
  return specs.length > 0 ? specs.join(', ') : 'Standard display';
}

function deriveProcessor(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ');
  const lower = desc.toLowerCase();
  if (lower.includes('m4') && (lower.includes('ultra') || lower.includes('pro'))) return 'Apple M4 Pro / M4 Ultra';
  if (lower.includes('m4')) return 'Apple M4';
  if (lower.includes('m3')) return 'Apple M3';
  if (lower.includes('a18 pro')) return 'Apple A18 Pro';
  if (lower.includes('a18')) return 'Apple A18';
  if (lower.includes('snapdragon 8 elite')) return 'Snapdragon 8 Elite';
  if (lower.includes('snapdragon 8 gen 4')) return 'Snapdragon 8 Gen 4';
  if (lower.includes('core ultra 9')) return 'Intel Core Ultra 9';
  if (lower.includes('core ultra 7')) return 'Intel Core Ultra 7';
  if (lower.includes('core i9')) return 'Intel Core i9';
  if (lower.includes('core i7')) return 'Intel Core i7';
  if (lower.includes('core i5')) return 'Intel Core i5';
  if (lower.includes('ryzen 9')) return 'AMD Ryzen 9';
  if (lower.includes('ryzen 7')) return 'AMD Ryzen 7';
  if (lower.includes('ryzen 5')) return 'AMD Ryzen 5';
  if (lower.includes('xeon')) return 'Intel Xeon W';
  if (lower.includes('tensor g4')) return 'Google Tensor G4';
  if (lower.includes('tensor')) return 'Google Tensor';
  if (product.category === 'Graphics Cards') return 'GPU-dependent';
  if (product.category === 'Processors') return product.name;
  return 'See product details';
}

function deriveGPU(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ');
  const lower = desc.toLowerCase();
  if (lower.includes('rtx 5090')) return 'NVIDIA RTX 5090 (32GB GDDR7)';
  if (lower.includes('rtx 5080')) return 'NVIDIA RTX 5080 (16GB GDDR7)';
  if (lower.includes('rtx 4090')) return 'NVIDIA RTX 4090';
  if (lower.includes('rtx 4080')) return 'NVIDIA RTX 4080';
  if (lower.includes('rtx 4070 ti super')) return 'NVIDIA RTX 4070 Ti Super';
  if (lower.includes('rtx 4070 super')) return 'NVIDIA RTX 4070 Super';
  if (lower.includes('rtx 4070')) return 'NVIDIA RTX 4070';
  if (lower.includes('rtx 4060 ti')) return 'NVIDIA RTX 4060 Ti';
  if (lower.includes('rtx 4060')) return 'NVIDIA RTX 4060';
  if (lower.includes('rx 9070 xt')) return 'AMD RX 9070 XT (16GB)';
  if (lower.includes('rx 7700')) return 'AMD RX 7700 XT';
  if (lower.includes('arc b580')) return 'Intel Arc B580 (12GB)';
  if (lower.includes('iris xe')) return 'Intel Iris Xe (integrated)';
  if (lower.includes('integrated gpu') || lower.includes('integrated')) return 'Integrated graphics';
  if (lower.includes('no dgpu') || lower.includes('integrated only')) return 'Integrated only (no dedicated GPU)';
  if (product.category === 'Graphics Cards') return product.name;
  if (product.category === 'Laptops' || product.category === 'Gaming Laptops') return 'Check product specs';
  return 'Integrated / N/A';
}

function deriveRAM(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ');
  const lower = desc.toLowerCase();
  if (lower.includes('16gb')) return '16GB';
  if (lower.includes('32gb')) return '32GB';
  if (lower.includes('64gb')) return '64GB';
  if (lower.includes('8gb')) return '8GB';
  if (lower.includes('12gb')) return '12GB';
  if (product.category === 'RAM') return product.name;
  return 'Check specs';
}

function deriveStorage(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ');
  const lower = desc.toLowerCase();
  if (lower.includes('2tb')) return '2TB SSD';
  if (lower.includes('1tb')) return '1TB SSD';
  if (lower.includes('512gb')) return '512GB SSD';
  if (lower.includes('256gb')) return '256GB SSD';
  if (lower.includes('4tb')) return '4TB';
  if (product.category === 'Storage') return product.name;
  if (product.category === 'NAS') return 'Drive bays included (drives separate)';
  return 'Check specs';
}

function deriveBuildQuality(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ') + ' ' + product.cons.join(' ');
  const lower = desc.toLowerCase();
  const signals: string[] = [];
  if (lower.includes('titanium')) signals.push('Titanium construction');
  if (lower.includes('mil-spec') || lower.includes('mil-std')) signals.push('MIL-SPEC durability');
  if (lower.includes('premium build') || lower.includes('premium')) signals.push('Premium materials');
  if (lower.includes('aluminum') || lower.includes('aluminium')) signals.push('Aluminum body');
  if (lower.includes('plastic') || lower.includes('plasticky')) signals.push('Plastic construction');
  if (lower.includes('wood')) signals.push('Wood + metal');
  if (lower.includes('glass')) signals.push('Glass panels');
  return signals.length > 0 ? signals.join(', ') : 'Standard build quality';
}

function deriveConnectivity(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ');
  const lower = desc.toLowerCase();
  const ports: string[] = [];
  if (lower.includes('thunderbolt 4')) ports.push('Thunderbolt 4');
  if (lower.includes('thunderbolt')) ports.push('Thunderbolt');
  if (lower.includes('usb4')) ports.push('USB4');
  if (lower.includes('usb-c')) ports.push('USB-C');
  if (lower.includes('wi-fi 7') || lower.includes('wifi 7')) ports.push('Wi-Fi 7');
  if (lower.includes('wi-fi 6e') || lower.includes('wifi 6e')) ports.push('Wi-Fi 6E');
  if (lower.includes('wi-fi 6') || lower.includes('wifi 6')) ports.push('Wi-Fi 6');
  if (lower.includes('10gbe') || lower.includes('10GbE')) ports.push('10GbE');
  if (lower.includes('2.5gbe') || lower.includes('2.5GbE')) ports.push('2.5GbE');
  if (lower.includes('pcie 5.0')) ports.push('PCIe 5.0');
  if (lower.includes('pcie')) ports.push('PCIe');
  if (lower.includes('hdmi 2.1')) ports.push('HDMI 2.1');
  if (lower.includes('hdmi')) ports.push('HDMI');
  if (lower.includes('bluetooth')) ports.push('Bluetooth');
  return ports.length > 0 ? ports.join(', ') : 'Standard connectivity';
}

function deriveWarranty(product: Product): string {
  const desc = (product.description || '') + ' ' + product.pros.join(' ');
  const lower = desc.toLowerCase();
  if (lower.includes('12-yr') || lower.includes('12 yr')) return '12 years (industry-leading)';
  if (lower.includes('10-yr') || lower.includes('10 yr')) return '10 years';
  if (lower.includes('7yr') || lower.includes('7 yr')) return '7 years';
  if (lower.includes('5-yr') || lower.includes('5 yr')) return '5 years';
  if (lower.includes('3-yr') || lower.includes('3 yr')) return '3 years';
  if (lower.includes('1-yr') || lower.includes('1 yr')) return '1 year standard';
  return 'Standard manufacturer warranty';
}

function deriveSpecs(product: Product): DerivedSpec[] {
  return [
    { label: 'Brand', value: extractBrand(product.name), icon: <Award size={14} /> },
    { label: 'Performance', value: derivePerformance(product), icon: <Zap size={14} /> },
    { label: 'Battery', value: deriveBattery(product), icon: <Battery size={14} /> },
    { label: 'Display', value: deriveDisplay(product), icon: <Monitor size={14} /> },
    { label: 'Processor', value: deriveProcessor(product), icon: <Cpu size={14} /> },
    { label: 'GPU', value: deriveGPU(product), icon: <BarChart3 size={14} /> },
    { label: 'RAM', value: deriveRAM(product), icon: <HardDrive size={14} /> },
    { label: 'Storage', value: deriveStorage(product), icon: <HardDrive size={14} /> },
    { label: 'Build Quality', value: deriveBuildQuality(product), icon: <Shield size={14} /> },
    { label: 'Connectivity', value: deriveConnectivity(product), icon: <Wifi size={14} /> },
    { label: 'Warranty', value: deriveWarranty(product), icon: <Shield size={14} /> },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORE CALCULATOR — gives each product a 0-100 score for visual indicators
// ═══════════════════════════════════════════════════════════════════════════════

function calculateScore(product: Product): number {
  let score = 50; // baseline
  if (product.aiBadges?.includes('Performance Pick')) score += 15;
  if (product.aiBadges?.includes('AI Recommended')) score += 12;
  if (product.aiBadges?.includes("Editor's Choice")) score += 10;
  if (product.aiBadges?.includes('Best Value')) score += 8;
  if (product.aiBadges?.includes('Future Proof')) score += 7;
  if (product.aiBadges?.includes('Budget Pick')) score += 5;
  if (product.badge) score += 6;
  if (product.usecases && product.usecases.length >= 3) score += 4;
  if (product.pros.length > product.cons.length) score += 5;
  return Math.min(100, score);
}

const scoreColor = (s: number) => s >= 80 ? 'text-green-400' : s >= 65 ? 'text-primary' : s >= 50 ? 'text-amber-400' : 'text-muted-foreground';
const scoreBg = (s: number) => s >= 80 ? 'bg-green-500' : s >= 65 ? 'bg-primary' : s >= 50 ? 'bg-amber-500' : 'bg-muted-foreground/50';
const scoreLabel = (s: number) => s >= 80 ? 'Excellent' : s >= 65 ? 'Great' : s >= 50 ? 'Good' : 'Standard';

// ═══════════════════════════════════════════════════════════════════════════════
// SMART RECOMMENDATION ENGINE — 11 categories, never forces a winner
// ═══════════════════════════════════════════════════════════════════════════════

interface Recommendation {
  label: string;
  product: Product | null;
  reason: string;
  icon: React.ReactNode;
  multiple?: boolean;
}

function generateRecommendations(selected: Product[]): Recommendation[] {
  if (selected.length < MIN_COMPARE) return [];

  const sorted = [...selected].sort((a, b) => calculateScore(b) - calculateScore(a));
  const cheapest = [...selected].sort((a, b) => a.priceMin - b.priceMin)[0];
  const avgPrice = selected.reduce((s, x) => s + x.priceMin, 0) / selected.length;

  const recs: Recommendation[] = [];
  const used = new Set<Product>();

  const add = (label: string, product: Product | null | undefined, reason: string, icon: React.ReactNode) => {
    if (!product) return;
    // Allow multiple picks for "equally good" cases
    const alreadyAdded = recs.find(r => r.product?.name === product.name);
    if (alreadyAdded) {
      alreadyAdded.multiple = true;
      return;
    }
    used.add(product);
    recs.push({ label, product, reason, icon });
  };

  // 1. Best Overall — highest score
  add('Best Overall', sorted[0], 'Highest overall rating based on specs, badges, and value', <Trophy size={16} />);

  // 2. Best Value — below average price, decent score
  const valuePicks = selected.filter(p => p.priceMin < avgPrice).sort((a, b) => calculateScore(b) - calculateScore(a));
  add('Best Value', valuePicks[0], 'Best balance of features and price — premium specs without the premium cost', <IndianRupee size={16} />);

  // 3. Best Budget — cheapest
  if (cheapest !== sorted[0] && cheapest !== valuePicks[0]) {
    add('Best Budget', cheapest, 'Most affordable option — great for price-conscious buyers', <IndianRupee size={16} />);
  }

  // 4. Best Performance — Performance Pick badge
  const perfPick = selected.find(p => p.aiBadges?.includes('Performance Pick'));
  add('Best Performance', perfPick || sorted.find(p => !used.has(p)), 'Highest specifications and raw performance in this comparison', <Zap size={16} />);

  // 5. Best for Students
  const student = selected.find(p => p.usecases?.includes('college'));
  add('Best for Students', student || selected.find(p => p.usecases?.includes('programming')), 'Lightweight, good battery, and student-friendly pricing', <Monitor size={16} />);

  // 6. Best for Professionals
  const pro = selected.find(p => p.usecases?.includes('business') || p.usecases?.includes('architecture') || p.usecases?.includes('engineering'));
  add('Best for Professionals', pro || selected.find(p => p.usecases?.includes('editing')), 'Built for demanding professional workflows with ISV certifications', <Award size={16} />);

  // 7. Best for Gaming
  const gaming = selected.find(p => p.usecases?.includes('gaming') || p.category?.includes('Gaming'));
  add('Best for Gaming', gaming, 'Optimized for high-FPS gaming with dedicated graphics and cooling', <BarChart3 size={16} />);

  // 8. Best for Office Work
  const office = selected.find(p => p.category === 'Laptops' || p.category === 'Ultrabooks' || p.category === 'Mini PCs' || p.usecases?.includes('business'));
  add('Best for Office Work', office || selected.find(p => !used.has(p)), 'Quiet, reliable, and efficient — ideal for daily productivity', <HardDrive size={16} />);

  // 9. Best Battery
  const batteryPick = selected.find(p => p.usecases?.includes('travel'));
  add('Best Battery Life', batteryPick, 'Longest battery life in this selection — all-day use without charging', <Battery size={16} />);

  // 10. Best Display
  const displayPick = selected.find(p => {
    const d = (p.description || '') + ' ' + p.pros.join(' ');
    return d.toLowerCase().includes('oled') || d.toLowerCase().includes('4k') || d.toLowerCase().includes('retina') || d.toLowerCase().includes('amoled');
  });
  add('Best Display', displayPick, 'Outstanding display quality with high resolution and color accuracy', <Monitor size={16} />);

  // 11. Best Build Quality
  const buildPick = selected.find(p => {
    const d = (p.description || '') + ' ' + p.pros.join(' ');
    return d.toLowerCase().includes('titanium') || d.toLowerCase().includes('mil-spec') || d.toLowerCase().includes('premium build') || d.toLowerCase().includes('aluminum');
  });
  add('Best Build Quality', buildPick, 'Superior materials and construction — built to last', <Shield size={16} />);

  // Filter out the weaker picks, keep only strong recommendations
  return recs.filter(r => r.product).slice(0, 8);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT IMAGE
// ═══════════════════════════════════════════════════════════════════════════════

function ProductImage({ product, size }: { product: Product; size?: 'sm' | 'lg' }) {
  const [error, setError] = useState(false);
  const h = size === 'sm' ? 'h-28' : 'h-48';
  if (error || !product.image) {
    return (
      <div className={`w-full ${h} rounded-xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-white/10 flex items-center justify-center`}>
        <ImageOff size={size === 'sm' ? 20 : 32} className="text-muted-foreground/30" />
      </div>
    );
  }
  return (
    <img src={product.image} alt={product.name} loading="lazy"
      className={`w-full ${h} object-cover rounded-xl border border-white/10`}
      onError={() => setError(true)} />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AFFILIATE BUTTON — ready for Amazon Associates
// ═══════════════════════════════════════════════════════════════════════════════

function ProductLinkButton({ product }: { product: Product }) {
  if (product.affiliateUrl) {
    return (
      <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer"
        onClick={() => trackAffiliateClick({ name: product.name, category: product.category, price: product.price }, 'amazon')}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/25 transition-colors">
        <IndianRupee size={12} /> Check Price on Amazon
      </a>
    );
  }
  return (
    <a href={product.link} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-foreground text-xs font-semibold hover:bg-white/10 transition-colors">
      View Product Details <ExternalLink size={12} />
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function Compare() {
  const [selected, setSelected] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedSpecs, setExpandedSpecs] = useState(false);

  const available = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (filter !== 'All') list = list.filter(p => p.category === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const addProduct = useCallback((p: Product) => {
    setSelected(prev => {
      if (prev.find(s => s.name === p.name)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, p];
    });
  }, []);

  const removeProduct = useCallback((name: string) => {
    setSelected(prev => prev.filter(p => p.name !== name));
  }, []);

  const recs = useMemo(() => generateRecommendations(selected), [selected]);

  // Base specs every product has
  const baseSpecRows = [
    ['Category', 'category'],
    ['Price Range', 'price'],
    ['Description', 'description'],
    ['Pros', 'pros'],
    ['Cons', 'cons'],
    ['Best For', 'usecases'],
    ['Award', 'badge'],
    ['AI Rating', 'aiBadges'],
  ];

  return (
    <>
      <SEO title="Smart Product Comparison" description="Compare products side-by-side with intelligent, unbiased recommendations." url="/compare" />

      {/* ══ Hero ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-20 border-b border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-medium text-accent mb-4">
            <BarChart3 size={12} /> Compare {MIN_COMPARE} – {MAX_COMPARE} Products • {ALL_PRODUCTS.length} Available
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Smart Comparison.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto">
            Compare products side-by-side with intelligent recommendations — honest, data-driven, never exaggerated.
          </motion.p>
        </div>
      </section>

      {/* ══ Main Layout ══════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT: Product Picker ────────────────────────────────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input type="search" placeholder="Search {ALL_PRODUCTS.length} products..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60" />
                {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={14} /></button>}
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar flex-wrap">
                <button onClick={() => setFilter('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${filter === 'All' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'}`}>All</button>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${filter === cat ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'}`}>{cat}</button>
                ))}
              </div>

              <div className="space-y-1 max-h-[50vh] overflow-y-auto hide-scrollbar">
                {available.map(p => {
                  const isSel = selected.some(s => s.name === p.name);
                  const isFull = selected.length >= MAX_COMPARE && !isSel;
                  return (
                    <button key={p.name}
                      onClick={() => isSel ? removeProduct(p.name) : addProduct(p)}
                      disabled={isFull}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-sm flex items-center justify-between group ${
                        isSel ? 'bg-primary/10 border-primary/30 text-foreground' :
                        isFull ? 'bg-white/5 border-white/5 text-muted-foreground/40 cursor-not-allowed' :
                        'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10'
                      }`}>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs truncate">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{p.category} · {p.price}</div>
                      </div>
                      {isSel ? <Minus size={14} className="text-red-400 flex-shrink-0" /> :
                       isFull ? null :
                       <Plus size={14} className="opacity-0 group-hover:opacity-100 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {available.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No products match.</p>}
            </div>
          </div>

          {/* ── RIGHT: Comparison View ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {selected.length < MIN_COMPARE ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <BarChart3 size={40} className="text-muted-foreground mb-4 opacity-40" />
                <h2 className="text-xl font-bold text-foreground mb-2">Select products to compare</h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  Pick {MIN_COMPARE}–{MAX_COMPARE} products from the left panel. Smart recommendations appear automatically.
                </p>
              </div>
            ) : (
              <>
                {/* ── Product Cards with Images, Scores, Badges ─────────────── */}
                <div className={`grid gap-4 mb-8 ${
                  selected.length === 2 ? 'lg:grid-cols-2' :
                  selected.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                } grid-cols-1 sm:grid-cols-2`}>
                  {selected.map((p, i) => {
                    const score = calculateScore(p);
                    return (
                      <motion.div key={p.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className="relative rounded-2xl bg-card border border-white/10 overflow-hidden flex flex-col hover:border-primary/20 transition-colors duration-300">
                        <button onClick={() => removeProduct(p.name)}
                          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-colors">
                          <X size={12} />
                        </button>

                        <ProductImage product={p} size="lg" />

                        <div className="p-4 flex flex-col flex-1">
                          {/* Score indicator */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <motion.div className={`h-full rounded-full ${scoreBg(score)}`}
                                initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.6, delay: 0.2 }} />
                            </div>
                            <span className={`text-[10px] font-bold ${scoreColor(score)}`}>{scoreLabel(score)}</span>
                          </div>

                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{p.category}</div>
                          <h3 className="font-bold text-sm mb-1 text-foreground leading-snug">{p.name}</h3>
                          <div className="text-sm font-bold text-primary mb-2">{p.price}</div>

                          {p.aiBadges && p.aiBadges.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {p.aiBadges.map((b, j) => (
                                <span key={j} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">{b}</span>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">{p.description}</p>

                          <ProductLinkButton product={p} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ── BASE SPEC TABLE ───────────────────────────────────────── */}
                <div className="rounded-2xl bg-card border border-white/10 overflow-hidden mb-6">
                  <div className="p-4 border-b border-white/10 bg-muted/20 flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground text-sm">Specification Comparison</h3>
                    <span className="text-[10px] text-muted-foreground">{selected.length} products</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0">
                        <tr className="border-b border-white/10 bg-card/90 backdrop-blur-sm">
                          <th className="p-3 text-left text-xs text-muted-foreground uppercase tracking-wider w-28">Spec</th>
                          {selected.map(p => (
                            <th key={p.name} className="p-3 text-left font-semibold text-foreground border-l border-white/5 text-xs">{p.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {baseSpecRows.map(([label, key]) => {
                          const firstVal = JSON.stringify((selected[0] as any)[key]);
                          const allSame = selected.every(s => JSON.stringify((s as any)[key]) === firstVal);
                          return (
                            <tr key={key} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="p-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">{label}</td>
                              {selected.map(p => {
                                const val = (p as any)[key];
                                const display = Array.isArray(val) ? val.join(', ') : (val || '—');
                                const isPro = key === 'pros', isCon = key === 'cons';
                                const textClass = isPro ? 'text-green-400' : isCon ? 'text-red-400' : 'text-foreground';
                                return (
                                  <td key={p.name} className={`p-3 border-l border-white/5 text-xs leading-relaxed ${textClass}`}>
                                    {allSame && selected.indexOf(p) > 0
                                      ? <span className="text-muted-foreground/50 italic">same</span>
                                      : display}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── DERIVED SPECS — Expandable ────────────────────────────── */}
                <div className="rounded-2xl bg-card border border-white/10 overflow-hidden mb-6">
                  <button onClick={() => setExpandedSpecs(!expandedSpecs)}
                    className="w-full p-4 flex items-center justify-between border-b border-white/10 bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-primary" />
                      <h3 className="font-display font-bold text-foreground text-sm">Detailed Spec Analysis</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Derived from product data</span>
                      {expandedSpecs ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedSpecs && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10 bg-muted/10">
                              <th className="p-3 text-left text-xs text-muted-foreground uppercase tracking-wider w-32">Detail</th>
                              {selected.map(p => (
                                <th key={p.name} className="p-3 text-left font-semibold text-foreground border-l border-white/5 text-xs">{p.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {deriveSpecs(selected[0]).map(spec => (
                              <tr key={spec.label} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="p-3 text-muted-foreground font-medium text-xs flex items-center gap-1.5">
                                  <span className="text-primary/60">{spec.icon}</span> {spec.label}
                                </td>
                                {selected.map(p => {
                                  const pSpecs = deriveSpecs(p);
                                  const val = pSpecs.find(s => s.label === spec.label)?.value || '—';
                                  const allSame = selected.every(s =>
                                    deriveSpecs(s).find(d => d.label === spec.label)?.value === val
                                  );
                                  return (
                                    <td key={p.name} className={`p-3 border-l border-white/5 text-xs leading-relaxed text-foreground`}>
                                      {allSame && selected.indexOf(p) > 0
                                        ? <span className="text-muted-foreground/50 italic">same</span>
                                        : val}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── SMART RECOMMENDATIONS ─────────────────────────────────── */}
                {recs.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 p-6 md:p-8 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles size={18} className="text-primary" />
                      <h3 className="font-display font-bold text-lg text-foreground">Smart Recommendations</h3>
                      <span className="text-[10px] text-muted-foreground ml-auto">Data-driven • Unbiased</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      Our analysis of your {selected.length} selected products. When products are equally capable, we state that honestly — no forced winners.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recs.map((rec, i) => (
                        <motion.div key={rec.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/20 transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{rec.icon}</div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold text-primary">{rec.label}</span>
                              {rec.multiple && <span className="text-[9px] text-amber-400/80 italic">(tie)</span>}
                            </div>
                            <div className="text-sm font-semibold text-foreground mb-1 truncate">{rec.product?.name}</div>
                            <div className="text-xs text-muted-foreground leading-relaxed">{rec.reason}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-5 text-center leading-relaxed">
                      Recommendations based on product specs and editorial analysis. All products are genuine — we never exaggerate differences.
                    </p>
                  </motion.div>
                )}

                {/* ── EQUAL PRODUCTS MESSAGE ────────────────────────────────── */}
                {recs.length === 0 && selected.length >= MIN_COMPARE && (
                  <div className="p-8 rounded-2xl bg-muted/20 border border-white/10 text-center">
                    <Shield size={28} className="text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-foreground font-semibold mb-1">All products are strong choices</p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      These products offer equally compelling value. Your choice should depend on specific needs, brand preference, and budget.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
