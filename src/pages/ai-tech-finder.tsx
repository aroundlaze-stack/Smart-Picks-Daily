import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { SEO } from '../components/seo';
import {
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2,
  Monitor, Cpu, Wifi, Smartphone, ShoppingBag,
  ArrowRight, Zap, RotateCcw, Keyboard
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuestionOption {
  label: string;
  value: string;
  icon?: string;
}

interface Question {
  id: string;
  question: string;
  subtitle?: string;
  options: QuestionOption[];
}

interface SubCategory {
  label: string;
  category: string;
  icon: string;
  desc: string;
}

interface MainCategory {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  gradient: string;
  border: string;
  glow: string;
  textColor: string;
  count: number;
  subs: SubCategory[];
}

// ─── Category Config ──────────────────────────────────────────────────────────

const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: 'computers',
    label: 'Computers',
    emoji: '💻',
    desc: 'Laptops, desktops & workstations',
    gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
    border: 'border-blue-500/30',
    glow: 'rgba(59,130,246,0.25)',
    textColor: 'text-blue-400',
    count: 7,
    subs: [
      { label: 'Laptops', category: 'Laptops', icon: '💻', desc: 'General-purpose notebooks' },
      { label: 'Gaming Laptops', category: 'Gaming Laptops', icon: '🎮', desc: 'High-performance gaming rigs' },
      { label: 'Ultrabooks', category: 'Ultrabooks', icon: '✈️', desc: 'Thin, light & long battery' },
      { label: 'Mini PCs', category: 'Mini PCs', icon: '📦', desc: 'Compact desktop computers' },
      { label: 'Gaming PCs', category: 'Gaming PCs', icon: '🖥️', desc: 'Pre-built gaming desktops' },
      { label: 'Workstations', category: 'Workstations', icon: '⚙️', desc: 'Professional compute power' },
      { label: 'NAS', category: 'NAS', icon: '🗄️', desc: 'Network attached storage' },
    ],
  },
  {
    id: 'components',
    label: 'PC Components',
    emoji: '🧩',
    desc: 'GPUs, CPUs, RAM, storage & more',
    gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
    border: 'border-purple-500/30',
    glow: 'rgba(124,58,237,0.25)',
    textColor: 'text-purple-400',
    count: 9,
    subs: [
      { label: 'Graphics Cards', category: 'Graphics Cards', icon: '🎨', desc: 'GPU for gaming & rendering' },
      { label: 'Processors', category: 'Processors', icon: '⚡', desc: 'CPU — the brain of your PC' },
      { label: 'Motherboards', category: 'Motherboards', icon: '🔌', desc: 'The backbone of every build' },
      { label: 'RAM', category: 'RAM', icon: '💾', desc: 'System memory modules' },
      { label: 'NVMe SSD', category: 'Storage', icon: '🚀', desc: 'Fast NVMe solid-state drives' },
      { label: 'Power Supplies', category: 'Power Supplies', icon: '🔋', desc: 'PSU for stable power delivery' },
      { label: 'Cases', category: 'Cases', icon: '🏠', desc: 'PC chassis & enclosures' },
      { label: 'Cooling', category: 'Cooling', icon: '❄️', desc: 'CPU coolers & case fans' },
      { label: 'Docking Stations', category: 'Docking Stations', icon: '🔗', desc: 'USB-C & Thunderbolt hubs' },
    ],
  },
  {
    id: 'displays',
    label: 'Displays',
    emoji: '🖥️',
    desc: 'Monitors, TVs & projectors',
    gradient: 'from-cyan-500/20 via-cyan-500/10 to-transparent',
    border: 'border-cyan-500/30',
    glow: 'rgba(6,182,212,0.25)',
    textColor: 'text-cyan-400',
    count: 4,
    subs: [
      { label: 'Monitors', category: 'Monitors', icon: '🖥️', desc: 'Desktop monitors for all uses' },
      { label: 'Portable Monitors', category: 'Portable Monitors', icon: '📺', desc: 'On-the-go secondary screens' },
      { label: 'TVs', category: 'TVs', icon: '📡', desc: 'Smart TVs & OLED panels' },
      { label: 'Projectors', category: 'Projectors', icon: '🎬', desc: 'Home cinema projectors' },
    ],
  },
  {
    id: 'peripherals',
    label: 'Peripherals',
    emoji: '⌨️',
    desc: 'Keyboards, mice, audio & more',
    gradient: 'from-green-500/20 via-green-500/10 to-transparent',
    border: 'border-green-500/30',
    glow: 'rgba(34,197,94,0.25)',
    textColor: 'text-green-400',
    count: 12,
    subs: [
      { label: 'Keyboards', category: 'Keyboards', icon: '⌨️', desc: 'Mechanical & membrane keyboards' },
      { label: 'Gaming Mouse', category: 'Mouse', icon: '🖱️', desc: 'Precision gaming mice' },
      { label: 'Headphones', category: 'Headphones', icon: '🎧', desc: 'Over-ear headphones & ANC' },
      { label: 'Earbuds', category: 'Earbuds', icon: '🎵', desc: 'True wireless earbuds' },
      { label: 'Speakers', category: 'Speakers', icon: '🔊', desc: 'Bluetooth & desktop speakers' },
      { label: 'Microphones', category: 'Microphones', icon: '🎙️', desc: 'USB & XLR microphones' },
      { label: 'Webcams', category: 'Webcams', icon: '📷', desc: 'HD & 4K webcams' },
      { label: 'Capture Cards', category: 'Capture Cards', icon: '🎮', desc: 'Game capture & streaming' },
    ],
  },
  {
    id: 'networking',
    label: 'Networking',
    emoji: '🌐',
    desc: 'Routers, mesh WiFi & switches',
    gradient: 'from-orange-500/20 via-orange-500/10 to-transparent',
    border: 'border-orange-500/30',
    glow: 'rgba(249,115,22,0.25)',
    textColor: 'text-orange-400',
    count: 4,
    subs: [
      { label: 'WiFi Routers', category: 'Networking', icon: '📡', desc: 'Single-unit WiFi routers' },
      { label: 'Mesh WiFi', category: 'Networking', icon: '🌐', desc: 'Whole-home mesh systems' },
      { label: 'Switches & APs', category: 'Networking', icon: '🔀', desc: 'Managed switches & access points' },
      { label: 'NAS Storage', category: 'NAS', icon: '🗄️', desc: 'Network attached storage' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile Devices',
    emoji: '📱',
    desc: 'Phones, tablets & wearables',
    gradient: 'from-pink-500/20 via-pink-500/10 to-transparent',
    border: 'border-pink-500/30',
    glow: 'rgba(236,72,153,0.25)',
    textColor: 'text-pink-400',
    count: 5,
    subs: [
      { label: 'Smartphones', category: 'Smartphones', icon: '📱', desc: 'Latest flagship phones' },
      { label: 'Tablets', category: 'Tablets', icon: '📟', desc: 'iPads & Android tablets' },
      { label: 'Smartwatches', category: 'Smartwatches', icon: '⌚', desc: 'Fitness & smart wearables' },
      { label: 'Power Banks', category: 'Power Banks', icon: '🔋', desc: 'Portable charging banks' },
      { label: 'Chargers', category: 'Chargers', icon: '⚡', desc: 'GaN fast chargers' },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    emoji: '🎒',
    desc: 'Stands, hubs, chairs & more',
    gradient: 'from-yellow-500/20 via-yellow-500/10 to-transparent',
    border: 'border-yellow-500/30',
    glow: 'rgba(234,179,8,0.25)',
    textColor: 'text-yellow-400',
    count: 7,
    subs: [
      { label: 'Docking Stations', category: 'Docking Stations', icon: '🔗', desc: 'Multi-port USB-C hubs' },
      { label: 'Streaming Gear', category: 'Streaming Equipment', icon: '🎥', desc: 'Stream decks & gear' },
      { label: 'Gaming Chairs', category: 'Gaming Chairs', icon: '🪑', desc: 'Ergonomic gaming chairs' },
      { label: 'Desk Accessories', category: 'Accessories', icon: '🖊️', desc: 'Stands, pads & organizers' },
      { label: 'External SSDs', category: 'Storage', icon: '💽', desc: 'Portable external drives' },
    ],
  },
];

// ─── Questions per product type ───────────────────────────────────────────────

const LAPTOP_QUESTIONS: Question[] = [
  {
    id: 'purpose',
    question: 'What will you primarily use this laptop for?',
    subtitle: 'Select the best match — this shapes every recommendation',
    options: [
      { label: '💻 Programming', value: 'programming' },
      { label: '🎓 College / Study', value: 'college' },
      { label: '🎮 Gaming', value: 'gaming' },
      { label: '💼 Business', value: 'business' },
      { label: '✈️ Travel', value: 'travel' },
      { label: '🎬 Video Editing', value: 'editing' },
      { label: '🏗️ Architecture / CAD', value: 'architecture' },
      { label: '⚙️ Engineering', value: 'engineering' },
      { label: '🤖 Machine Learning', value: 'ml' },
      { label: '🌐 General Use', value: 'general' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    subtitle: 'We\'ll find the best quality within your range',
    options: [
      { label: 'Under ₹50,000', value: 'under50k' },
      { label: '₹50K – ₹1 Lakh', value: '50k-1l' },
      { label: '₹1L – ₹1.5L', value: '1l-1-5l' },
      { label: '₹1.5L – ₹2L', value: '1-5l-2l' },
      { label: '₹2L+', value: '2l-plus' },
    ],
  },
  {
    id: 'brand',
    question: 'Any preferred brand?',
    subtitle: 'We\'ll prioritize your choice but still show alternatives',
    options: [
      { label: '🔤 No Preference', value: 'any' },
      { label: '🍎 Apple', value: 'apple' },
      { label: '💻 Dell', value: 'dell' },
      { label: '🖥️ HP', value: 'hp' },
      { label: '🔵 Lenovo', value: 'lenovo' },
      { label: '⚡ ASUS', value: 'asus' },
      { label: '🎯 MSI', value: 'msi' },
      { label: '🌟 Samsung', value: 'samsung' },
    ],
  },
  {
    id: 'battery',
    question: 'How important is battery life?',
    options: [
      { label: '🔋 Critical — I need all-day battery', value: 'critical' },
      { label: '⚡ Important — 6+ hours minimum', value: 'important' },
      { label: '🔌 Not important — I\'m usually plugged in', value: 'not-important' },
    ],
  },
  {
    id: 'os',
    question: 'Which operating system do you prefer?',
    options: [
      { label: '🪟 Windows', value: 'windows' },
      { label: '🍎 macOS', value: 'macos' },
      { label: '🐧 Linux', value: 'linux' },
      { label: '🤷 No Preference', value: 'any' },
    ],
  },
];

const GPU_QUESTIONS: Question[] = [
  {
    id: 'purpose',
    question: 'What will you use the GPU for?',
    options: [
      { label: '🎮 Gaming', value: 'gaming' },
      { label: '🎨 3D Rendering', value: 'rendering' },
      { label: '🤖 Machine Learning / AI', value: 'ml' },
      { label: '🎬 Video Editing', value: 'editing' },
      { label: '🖥️ General Compute', value: 'general' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your GPU budget?',
    options: [
      { label: 'Under ₹20,000', value: 'under20k' },
      { label: '₹20K – ₹50K', value: '20k-50k' },
      { label: '₹50K – ₹1 Lakh', value: '50k-1l' },
      { label: '₹1L – ₹1.5L', value: '1l-1-5l' },
      { label: '₹1.5L+', value: '1-5l-plus' },
    ],
  },
  {
    id: 'brand',
    question: 'Preferred GPU brand?',
    options: [
      { label: '🟢 NVIDIA (DLSS/RTX)', value: 'nvidia' },
      { label: '🔴 AMD (FSR/RX)', value: 'amd' },
      { label: '🔵 Intel Arc', value: 'intel' },
      { label: '🤷 No Preference', value: 'any' },
    ],
  },
  {
    id: 'raytracing',
    question: 'Do you need Ray Tracing?',
    options: [
      { label: '✅ Yes — important to me', value: 'yes' },
      { label: '💡 Nice to have', value: 'nice' },
      { label: '❌ No — pure raster performance', value: 'no' },
    ],
  },
  {
    id: 'power',
    question: 'Power consumption tolerance?',
    options: [
      { label: '🌱 Efficient — under 150W', value: 'low' },
      { label: '⚡ Medium — 150–250W', value: 'medium' },
      { label: '🔥 High — maximum performance', value: 'high' },
    ],
  },
];

const MONITOR_QUESTIONS: Question[] = [
  {
    id: 'purpose',
    question: 'What will you primarily use this monitor for?',
    options: [
      { label: '🎮 Gaming', value: 'gaming' },
      { label: '💼 Office / Productivity', value: 'office' },
      { label: '💻 Programming', value: 'programming' },
      { label: '🎬 Video / Photo Editing', value: 'editing' },
      { label: '🌐 General Use', value: 'general' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your monitor budget?',
    options: [
      { label: 'Under ₹20,000', value: 'under20k' },
      { label: '₹20K – ₹40K', value: '20k-40k' },
      { label: '₹40K – ₹70K', value: '40k-70k' },
      { label: '₹70K – ₹1L', value: '70k-1l' },
      { label: '₹1L+', value: '1l-plus' },
    ],
  },
  {
    id: 'refresh',
    question: 'What refresh rate do you need?',
    options: [
      { label: '🖥️ 60Hz — Standard productivity', value: '60hz' },
      { label: '⚡ 144Hz — Smooth gaming entry', value: '144hz' },
      { label: '🚀 165–240Hz — Competitive gaming', value: '165hz-plus' },
      { label: '💡 Highest possible', value: 'max' },
    ],
  },
  {
    id: 'resolution',
    question: 'Which resolution?',
    options: [
      { label: '1080p — Fast & affordable', value: '1080p' },
      { label: '1440p QHD — Sweet spot', value: '1440p' },
      { label: '4K UHD — Maximum clarity', value: '4k' },
      { label: '21:9 Ultrawide', value: 'ultrawide' },
    ],
  },
  {
    id: 'panel',
    question: 'Panel preference?',
    options: [
      { label: '🔮 OLED — Perfect blacks', value: 'oled' },
      { label: '💡 IPS — Colour accuracy', value: 'ips' },
      { label: '🕹️ VA — Deep contrast', value: 'va' },
      { label: '🤷 No Preference', value: 'any' },
    ],
  },
];

const KEYBOARD_QUESTIONS: Question[] = [
  {
    id: 'purpose',
    question: 'What will you mainly use this keyboard for?',
    options: [
      { label: '🎮 Gaming', value: 'gaming' },
      { label: '💻 Programming', value: 'programming' },
      { label: '💼 Office / Productivity', value: 'office' },
      { label: '🎨 Creative Work', value: 'creative' },
    ],
  },
  {
    id: 'type',
    question: 'Keyboard type preference?',
    options: [
      { label: '⌨️ Mechanical — tactile & clicky', value: 'mechanical' },
      { label: '🤫 Low-profile — slim & quiet', value: 'low-profile' },
      { label: '🔕 Membrane — soft & silent', value: 'membrane' },
      { label: '🤷 Open to anything', value: 'any' },
    ],
  },
  {
    id: 'wireless',
    question: 'Wired or wireless?',
    options: [
      { label: '📡 Wireless preferred', value: 'wireless' },
      { label: '🔌 Wired for reliability', value: 'wired' },
      { label: '🔄 Either is fine', value: 'any' },
    ],
  },
  {
    id: 'rgb',
    question: 'Do you want RGB lighting?',
    options: [
      { label: '🌈 Yes — the more the better', value: 'yes' },
      { label: '💡 Subtle backlight only', value: 'subtle' },
      { label: '🚫 No RGB needed', value: 'no' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    options: [
      { label: 'Under ₹3,000', value: 'under3k' },
      { label: '₹3K – ₹7K', value: '3k-7k' },
      { label: '₹7K – ₹15K', value: '7k-15k' },
      { label: '₹15K+', value: '15k-plus' },
    ],
  },
];

const SMARTPHONE_QUESTIONS: Question[] = [
  {
    id: 'purpose',
    question: 'What do you value most in a smartphone?',
    options: [
      { label: '📸 Camera quality', value: 'camera' },
      { label: '⚡ Performance / gaming', value: 'performance' },
      { label: '🔋 Battery life', value: 'battery' },
      { label: '💼 Productivity & ecosystem', value: 'productivity' },
      { label: '📐 Compact & premium', value: 'compact' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    options: [
      { label: 'Under ₹20,000', value: 'under20k' },
      { label: '₹20K – ₹40K', value: '20k-40k' },
      { label: '₹40K – ₹70K', value: '40k-70k' },
      { label: '₹70K – ₹1L', value: '70k-1l' },
      { label: '₹1L+', value: '1l-plus' },
    ],
  },
  {
    id: 'brand',
    question: 'Preferred brand?',
    options: [
      { label: '🍎 Apple (iOS)', value: 'apple' },
      { label: '🌟 Samsung', value: 'samsung' },
      { label: '1️⃣ OnePlus', value: 'oneplus' },
      { label: '📸 Google Pixel', value: 'google' },
      { label: '🤷 No Preference', value: 'any' },
    ],
  },
  {
    id: 'os',
    question: 'Which ecosystem do you prefer?',
    options: [
      { label: '🍎 iOS (Apple)', value: 'ios' },
      { label: '🤖 Android', value: 'android' },
      { label: '🤷 No Preference', value: 'any' },
    ],
  },
];

const GENERIC_QUESTIONS: Question[] = [
  {
    id: 'purpose',
    question: 'What is your primary use case?',
    options: [
      { label: '🎮 Gaming', value: 'gaming' },
      { label: '💼 Professional / Work', value: 'professional' },
      { label: '🎓 Student', value: 'student' },
      { label: '🎬 Creative / Content', value: 'creative' },
      { label: '🌐 General Use', value: 'general' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    options: [
      { label: 'Under ₹10,000', value: 'under10k' },
      { label: '₹10K – ₹25K', value: '10k-25k' },
      { label: '₹25K – ₹50K', value: '25k-50k' },
      { label: '₹50K – ₹1L', value: '50k-1l' },
      { label: '₹1L+', value: '1l-plus' },
    ],
  },
  {
    id: 'priority',
    question: 'What do you value most?',
    options: [
      { label: '🏆 Best performance', value: 'performance' },
      { label: '💰 Best value for money', value: 'value' },
      { label: '🎨 Premium build quality', value: 'build' },
      { label: '🔋 Energy efficiency', value: 'efficiency' },
    ],
  },
];

const QUESTIONS_MAP: Record<string, Question[]> = {
  'Laptops': LAPTOP_QUESTIONS,
  'Gaming Laptops': LAPTOP_QUESTIONS,
  'Ultrabooks': LAPTOP_QUESTIONS,
  'Graphics Cards': GPU_QUESTIONS,
  'Monitors': MONITOR_QUESTIONS,
  'Portable Monitors': MONITOR_QUESTIONS,
  'Keyboards': KEYBOARD_QUESTIONS,
  'Smartphones': SMARTPHONE_QUESTIONS,
  'Tablets': SMARTPHONE_QUESTIONS,
};

// ─── Background canvas ────────────────────────────────────────────────────────

function FinderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number; alpha: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        hue: Math.random() * 80 + 200,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(79,140,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Floating particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const a = p.alpha * (Math.sin(t * 0.008 + p.x * 0.01) * 0.3 + 0.7);
        ctx.fillStyle = `hsla(${p.hue},80%,65%,${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      // Radial glow
      const g = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.35, 0, canvas.width / 2, canvas.height * 0.35, canvas.width * 0.6);
      g.addColorStop(0, `rgba(79,140,255,${0.05 + Math.sin(t * 0.004) * 0.02})`);
      g.addColorStop(0.5, 'rgba(124,58,237,0.025)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      t++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i < current ? 'hsl(213 94% 68%)' : i === current ? 'hsl(213 94% 68%)' : 'rgba(255,255,255,0.15)',
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Stage = 'intro' | 'category' | 'questions' | 'finding';

export default function AiTechFinder() {
  const [stage, setStage] = useState<Stage>('intro');
  const [selectedGroup, setSelectedGroup] = useState<MainCategory | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [, setLocation] = useLocation();

  const questions = selectedSub
    ? (QUESTIONS_MAP[selectedSub.category] ?? GENERIC_QUESTIONS)
    : GENERIC_QUESTIONS;
  const totalQ = questions.length;
  const currentQuestion = questions[currentQ];

  const handleAnswer = (qId: string, value: string) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (currentQ < totalQ - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 250);
    }
  };

  const handleFind = () => {
    setStage('finding');
    const params = new URLSearchParams();
    if (selectedSub) params.set('category', selectedSub.category);
    params.set('ai', '1');
    if (answers.purpose) params.set('purpose', answers.purpose);
    if (answers.budget) params.set('budget', answers.budget);
    if (answers.brand) params.set('brand', answers.brand);
    params.set('scroll', 'products');
    setTimeout(() => setLocation(`/products?${params.toString()}`), 2200);
  };

  const handleGroupClick = (g: MainCategory) => {
    setExpandedGroup(expandedGroup === g.id ? null : g.id);
    setSelectedGroup(g);
    setSelectedSub(null);
  };

  const handleSubClick = (sub: SubCategory) => {
    setSelectedSub(sub);
    setAnswers({});
    setCurrentQ(0);
    setStage('questions');
  };

  const restart = () => {
    setStage('intro');
    setSelectedGroup(null);
    setSelectedSub(null);
    setExpandedGroup(null);
    setAnswers({});
    setCurrentQ(0);
  };

  const isComplete = currentQ === totalQ - 1 && answers[currentQuestion?.id];

  return (
    <>
      <SEO
        title="AI Tech Finder | Smart Picks Daily"
        description="Find your perfect tech in minutes. Answer a few smart questions and get AI-powered recommendations tailored exactly to your needs."
        url="/ai-tech-finder"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'AI Tech Finder — Smart Picks Daily',
          url: 'https://smartpicksdaily.com/ai-tech-finder',
          description: 'Find your perfect tech in minutes. Answer a few smart questions and get AI-powered recommendations tailored exactly to your needs.',
          applicationCategory: 'ShoppingApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
              { '@type': 'ListItem', position: 2, name: 'AI Tech Finder', item: 'https://smartpicksdaily.com/ai-tech-finder' }
            ]
          }
        }}
      />

      <div className="relative min-h-screen overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 pointer-events-none">
          <FinderBackground />
        </div>
        <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20">
          <AnimatePresence mode="wait">

            {/* ── INTRO ── */}
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center pt-8 md:pt-16"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  Smart Picks Daily · Flagship Experience
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
                >
                  AI{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                    Tech Finder
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed"
                >
                  Stop spending hours researching. Answer a few smart questions and get expert recommendations tailored exactly to your needs, workflow, and budget.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground/60 mb-12"
                >
                  7 categories · 40+ product types · Smart filtering
                </motion.p>

                {/* Feature pills */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap justify-center gap-3 mb-12"
                >
                  {[
                    { icon: <Cpu size={13} />, label: 'Intelligent Questions' },
                    { icon: <Zap size={13} />, label: 'Instant Recommendations' },
                    { icon: <CheckCircle2 size={13} />, label: 'Budget Aware' },
                    { icon: <Sparkles size={13} />, label: 'AI-Powered Matching' },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-muted-foreground">
                      <span className="text-primary">{f.icon}</span>
                      {f.label}
                    </div>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStage('category')}
                  className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(79,140,255,0.45)] hover:shadow-[0_0_50px_rgba(79,140,255,0.65)]"
                >
                  Start Finding Your Perfect Tech
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {/* ── CATEGORY SELECTION ── */}
            {stage === 'category' && (
              <motion.div
                key="category"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto"
              >
                <div className="text-center mb-10">
                  <p className="text-sm text-primary font-medium mb-2 flex items-center justify-center gap-2">
                    <Sparkles size={14} /> Step 1 of 3
                  </p>
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-3">
                    What are you looking for?
                  </h2>
                  <p className="text-muted-foreground">Choose a category, then select the specific product type</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {MAIN_CATEGORIES.map((group, i) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex flex-col"
                    >
                      {/* Group card */}
                      <motion.button
                        onClick={() => handleGroupClick(group)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative text-left p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                          expandedGroup === group.id
                            ? `bg-gradient-to-br ${group.gradient} ${group.border} shadow-[0_0_24px_var(--glow)]`
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                        style={{ '--glow': group.glow } as React.CSSProperties}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">{group.emoji}</span>
                          <motion.div
                            animate={{ rotate: expandedGroup === group.id ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight size={16} className="text-muted-foreground" />
                          </motion.div>
                        </div>
                        <h3 className="font-display font-bold text-base mb-1">{group.label}</h3>
                        <p className="text-xs text-muted-foreground">{group.desc}</p>
                        <div className={`mt-2 text-xs font-medium ${expandedGroup === group.id ? group.textColor : 'text-muted-foreground/50'}`}>
                          {group.count} product types
                        </div>
                      </motion.button>

                      {/* Subcategory expansion */}
                      <AnimatePresence>
                        {expandedGroup === group.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 flex flex-col gap-1.5">
                              {group.subs.map((sub, j) => (
                                <motion.button
                                  key={sub.category}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: j * 0.04 }}
                                  onClick={() => handleSubClick(sub)}
                                  whileHover={{ x: 4 }}
                                  className="flex items-center justify-between text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-base">{sub.icon}</span>
                                    <div>
                                      <div className="text-sm font-semibold">{sub.label}</div>
                                      <div className="text-[11px] text-muted-foreground">{sub.desc}</div>
                                    </div>
                                  </div>
                                  <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button onClick={() => setStage('intro')} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 mx-auto">
                    <ChevronLeft size={14} /> Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── QUESTIONS ── */}
            {stage === 'questions' && currentQuestion && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <p className="text-sm text-primary font-medium mb-2 flex items-center justify-center gap-2">
                    <Sparkles size={14} /> Step 2 of 3 · {selectedSub?.label}
                  </p>
                  <div className="flex items-center justify-between mb-4 max-w-md mx-auto">
                    <span className="text-xs text-muted-foreground">Question {currentQ + 1} of {totalQ}</span>
                    <StepDots current={currentQ} total={totalQ} />
                    <span className="text-xs text-muted-foreground">{Math.round(((currentQ) / totalQ) * 100)}% done</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full max-w-md mx-auto overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      animate={{ width: `${((currentQ) / totalQ) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Question card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm mb-6"
                  >
                    <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
                      {currentQuestion.question}
                    </h2>
                    {currentQuestion.subtitle && (
                      <p className="text-sm text-muted-foreground mb-6">{currentQuestion.subtitle}</p>
                    )}
                    {!currentQuestion.subtitle && <div className="mb-6" />}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = answers[currentQuestion.id] === opt.value;
                        return (
                          <motion.button
                            key={opt.value}
                            onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative text-left px-4 py-3.5 rounded-xl border font-medium text-sm transition-all duration-200 ${
                              isSelected
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_16px_rgba(79,140,255,0.25)]'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25 text-foreground'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2.5 right-2.5 text-primary"
                              >
                                <CheckCircle2 size={14} />
                              </motion.div>
                            )}
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Already answered summary */}
                {Object.keys(answers).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {Object.entries(answers).map(([qId, val]) => {
                      const q = questions.find(q => q.id === qId);
                      const opt = q?.options.find(o => o.value === val);
                      return opt ? (
                        <span key={qId} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                          <CheckCircle2 size={10} /> {opt.label}
                        </span>
                      ) : null;
                    })}
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (currentQ > 0) setCurrentQ(q => q - 1);
                      else setStage('category');
                    }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft size={15} /> Back
                  </button>

                  <AnimatePresence>
                    {isComplete && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleFind}
                        className="flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(79,140,255,0.4)]"
                      >
                        <Sparkles size={15} />
                        Find My Perfect {selectedSub?.label ?? 'Product'}
                        <ArrowRight size={15} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {!isComplete && currentQ < totalQ - 1 && (
                    <button
                      onClick={() => answers[currentQuestion.id] && setCurrentQ(q => q + 1)}
                      disabled={!answers[currentQuestion.id]}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Skip <ChevronRight size={15} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── FINDING ── */}
            {stage === 'finding' && (
              <motion.div
                key="finding"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg mx-auto text-center py-20"
              >
                {/* Pulsing orb */}
                <div className="relative w-32 h-32 mx-auto mb-10">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-primary/30"
                      animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_rgba(79,140,255,0.6)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={32} className="text-white" />
                    </motion.div>
                  </div>
                </div>

                <motion.h2
                  className="text-3xl font-display font-bold mb-4"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  Analysing your requirements…
                </motion.h2>

                <p className="text-muted-foreground mb-8">
                  Matching your answers against our curated database of {selectedSub?.label ?? 'products'} to find the perfect picks.
                </p>

                {/* Analysis steps */}
                {['Reading your preferences', 'Matching categories', 'Ranking recommendations', 'Preparing your results'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="flex items-center gap-3 text-sm text-left max-w-xs mx-auto mb-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, delay: i * 0.4 + 0.2 }}
                      className="w-4 h-4 rounded-full bg-primary/20 border border-primary/50 flex-shrink-0 flex items-center justify-center"
                    >
                      <CheckCircle2 size={10} className="text-primary" />
                    </motion.div>
                    <span className="text-muted-foreground">{step}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Restart button (when not on intro/finding) */}
          {(stage === 'category' || stage === 'questions') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="fixed bottom-6 left-6 z-20"
            >
              <button
                onClick={restart}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-md border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
              >
                <RotateCcw size={12} /> Start Over
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
