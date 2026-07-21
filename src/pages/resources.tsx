import { useState } from 'react';
import { SEO } from '../components/seo';
import { NebulaCloud } from '../components/3d/NebulaCloud';
import {
  Code2, Video, Palette, Cloud, Shield, Gauge, Cpu, Wifi,
  Laptop, Wrench, ExternalLink, Search, X, Terminal, MonitorCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Resource {
  title: string;
  desc: string;
  url: string;
  category: string;
  free: boolean;
  platform?: string;
}

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; border: string; bg: string; glow: string }> = {
  Software: {
    icon: <Terminal size={18} />,
    color: "text-blue-400",
    border: "border-blue-500/25",
    bg: "bg-blue-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
  },
  Programming: {
    icon: <Code2 size={18} />,
    color: "text-green-400",
    border: "border-green-500/25",
    bg: "bg-green-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]",
  },
  "Video Editing": {
    icon: <Video size={18} />,
    color: "text-red-400",
    border: "border-red-500/25",
    bg: "bg-red-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  },
  "Graphic Design": {
    icon: <Palette size={18} />,
    color: "text-pink-400",
    border: "border-pink-500/25",
    bg: "bg-pink-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]",
  },
  "Cloud Storage": {
    icon: <Cloud size={18} />,
    color: "text-cyan-400",
    border: "border-cyan-500/25",
    bg: "bg-cyan-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]",
  },
  "Password Managers": {
    icon: <Shield size={18} />,
    color: "text-emerald-400",
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]",
  },
  "GPU Benchmarks": {
    icon: <Gauge size={18} />,
    color: "text-orange-400",
    border: "border-orange-500/25",
    bg: "bg-orange-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]",
  },
  "CPU Benchmarks": {
    icon: <Cpu size={18} />,
    color: "text-yellow-400",
    border: "border-yellow-500/25",
    bg: "bg-yellow-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]",
  },
  Drivers: {
    icon: <MonitorCheck size={18} />,
    color: "text-violet-400",
    border: "border-violet-500/25",
    bg: "bg-violet-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]",
  },
  Networking: {
    icon: <Wifi size={18} />,
    color: "text-sky-400",
    border: "border-sky-500/25",
    bg: "bg-sky-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]",
  },
  "Laptop Utilities": {
    icon: <Laptop size={18} />,
    color: "text-indigo-400",
    border: "border-indigo-500/25",
    bg: "bg-indigo-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
  },
  "Developer Tools": {
    icon: <Wrench size={18} />,
    color: "text-amber-400",
    border: "border-amber-500/25",
    bg: "bg-amber-500/5",
    glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG);

// ─── Resource Database ────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  // Software
  { title: "Visual Studio Code", desc: "The world's most popular free code editor. Built-in Git, extensions marketplace, debugging, IntelliSense, and remote development support.", url: "https://code.visualstudio.com", category: "Software", free: true, platform: "Win / Mac / Linux" },
  { title: "Notepad++", desc: "Lightweight, fast text & code editor for Windows with syntax highlighting for 70+ languages and powerful macro support.", url: "https://notepad-plus-plus.org", category: "Software", free: true, platform: "Windows" },
  { title: "VirtualBox", desc: "Free and open-source virtualization platform. Run Windows, Linux, and macOS VMs on your existing computer.", url: "https://www.virtualbox.org", category: "Software", free: true, platform: "Win / Mac / Linux" },
  { title: "7-Zip", desc: "High-compression ratio archiver that handles ZIP, RAR, 7Z, and 36 other formats. Open-source and completely free.", url: "https://www.7-zip.org", category: "Software", free: true, platform: "Windows" },

  // Programming
  { title: "GitHub", desc: "The world's leading software development platform. Host repositories, collaborate with teams, run CI/CD with Actions.", url: "https://github.com", category: "Programming", free: true, platform: "Web" },
  { title: "Node.js", desc: "JavaScript runtime built on Chrome's V8 engine. Build fast, scalable server-side and CLI applications.", url: "https://nodejs.org", category: "Programming", free: true, platform: "Win / Mac / Linux" },
  { title: "Python", desc: "General-purpose programming language loved for AI/ML, data science, scripting, and web development.", url: "https://python.org", category: "Programming", free: true, platform: "Win / Mac / Linux" },
  { title: "Docker Desktop", desc: "Containerize your apps and dev environments. Develop, ship, and run applications anywhere with Docker.", url: "https://www.docker.com/products/docker-desktop/", category: "Programming", free: true, platform: "Win / Mac / Linux" },
  { title: "Postman", desc: "Industry-standard API testing and collaboration tool. Send HTTP requests, write tests, document APIs.", url: "https://www.postman.com", category: "Programming", free: true, platform: "Win / Mac / Linux" },

  // Video Editing
  { title: "DaVinci Resolve", desc: "Professional-grade video editor used in Hollywood productions. Color grading, Fusion VFX, Fairlight audio — all free.", url: "https://www.blackmagicdesign.com/products/davinciresolve", category: "Video Editing", free: true, platform: "Win / Mac / Linux" },
  { title: "CapCut (Desktop)", desc: "Trending AI-powered video editor with auto-captions, trending effects, and one-click background removal.", url: "https://www.capcut.com/tools/desktop-video-editor", category: "Video Editing", free: true, platform: "Win / Mac" },
  { title: "Kdenlive", desc: "Open-source professional video editor with multi-track timeline, effects library, and proxy editing.", url: "https://kdenlive.org", category: "Video Editing", free: true, platform: "Win / Mac / Linux" },
  { title: "HandBrake", desc: "Free video transcoder for converting video files to virtually any format — H.264, H.265, AV1, and more.", url: "https://handbrake.fr", category: "Video Editing", free: true, platform: "Win / Mac / Linux" },

  // Graphic Design
  { title: "Figma", desc: "Browser-based UI/UX design tool with real-time collaboration, prototyping, and a huge community plugin library.", url: "https://www.figma.com", category: "Graphic Design", free: true, platform: "Web / App" },
  { title: "GIMP", desc: "Powerful open-source image editor — the free alternative to Photoshop. Supports layers, masks, filters, and scripting.", url: "https://www.gimp.org", category: "Graphic Design", free: true, platform: "Win / Mac / Linux" },
  { title: "Inkscape", desc: "Professional SVG vector graphics editor. Perfect for logos, icons, illustrations, and scalable artwork.", url: "https://inkscape.org", category: "Graphic Design", free: true, platform: "Win / Mac / Linux" },
  { title: "Canva", desc: "Easy drag-and-drop design platform for social media graphics, presentations, posters, and videos.", url: "https://www.canva.com", category: "Graphic Design", free: true, platform: "Web / App" },

  // Cloud Storage
  { title: "Google Drive", desc: "15 GB free cloud storage with Docs, Sheets, Slides. Seamlessly integrates with Gmail and Android.", url: "https://drive.google.com", category: "Cloud Storage", free: true, platform: "Web / App" },
  { title: "Dropbox", desc: "Pioneer of cloud sync. Smart Sync, Paper collaboration, and excellent third-party integrations.", url: "https://www.dropbox.com", category: "Cloud Storage", free: false, platform: "Win / Mac / Linux / App" },
  { title: "OneDrive", desc: "Microsoft's cloud storage — built into Windows 11 with 5 GB free. Best choice for Microsoft 365 users.", url: "https://onedrive.microsoft.com", category: "Cloud Storage", free: true, platform: "Win / Mac / App" },
  { title: "pCloud", desc: "Swiss-based privacy-focused cloud with a lifetime plan option. Client-side encryption via pCloud Crypto.", url: "https://www.pcloud.com", category: "Cloud Storage", free: true, platform: "Win / Mac / Linux" },

  // Password Managers
  { title: "Bitwarden", desc: "Open-source, end-to-end encrypted password manager. Self-host or use the cloud. Free plan is truly free forever.", url: "https://bitwarden.com", category: "Password Managers", free: true, platform: "All Platforms" },
  { title: "1Password", desc: "Premium password manager with Travel Mode, Watchtower breach detection, and best-in-class family sharing.", url: "https://1password.com", category: "Password Managers", free: false, platform: "All Platforms" },
  { title: "KeePassXC", desc: "Offline, open-source password vault. Your data never touches the cloud — total local control.", url: "https://keepassxc.org", category: "Password Managers", free: true, platform: "Win / Mac / Linux" },

  // GPU Benchmarks
  { title: "3DMark", desc: "Industry standard GPU benchmark suite. Time Spy, Port Royal ray tracing, and DirectX 12 Ultimate tests.", url: "https://www.3dmark.com", category: "GPU Benchmarks", free: true, platform: "Windows" },
  { title: "Unigine Superposition", desc: "Heavy stress-test benchmark pushing GPUs to their limit with 16K textures and real-time SSRTGI.", url: "https://benchmark.unigine.com/superposition", category: "GPU Benchmarks", free: true, platform: "Win / Linux" },
  { title: "GPU-Z", desc: "Lightweight utility showing real-time GPU specs, clock speeds, temperatures, and VRAM usage.", url: "https://www.techpowerup.com/gpuz/", category: "GPU Benchmarks", free: true, platform: "Windows" },
  { title: "MSI Afterburner", desc: "Most popular GPU overclocking and monitoring utility. Real-time OSD, fan curves, and voltage control.", url: "https://www.msi.com/Landing/afterburner/graphics-cards", category: "GPU Benchmarks", free: true, platform: "Windows" },

  // CPU Benchmarks
  { title: "Cinebench R24", desc: "MAXON's CPU render benchmark based on Cinema 4D. The industry standard for comparing multi-core CPU performance.", url: "https://www.maxon.net/cinebench", category: "CPU Benchmarks", free: true, platform: "Win / Mac" },
  { title: "CPU-Z", desc: "Essential CPU information utility showing detailed processor specs, cache info, memory timings, and real-time clocks.", url: "https://www.cpuid.com/softwares/cpu-z.html", category: "CPU Benchmarks", free: true, platform: "Windows" },
  { title: "PassMark PerformanceTest", desc: "Comprehensive PC benchmark covering CPU, memory, disk, and graphics with global comparison database.", url: "https://www.passmark.com/products/performancetest/", category: "CPU Benchmarks", free: true, platform: "Win / Mac / Linux" },
  { title: "Prime95", desc: "Classic CPU stability stress-tester using large prime number calculations to validate overclocks and thermals.", url: "https://www.mersenne.org/download/", category: "CPU Benchmarks", free: true, platform: "Win / Mac / Linux" },

  // Drivers
  { title: "NVIDIA Drivers", desc: "Official NVIDIA GeForce drivers and Game Ready updates. Use the auto-detect tool for one-click installation.", url: "https://www.nvidia.com/drivers", category: "Drivers", free: true, platform: "Windows / Linux" },
  { title: "AMD Software: Adrenalin", desc: "Official AMD Radeon graphics drivers with Radeon Super Resolution, Anti-Lag+, and performance overlay.", url: "https://www.amd.com/support", category: "Drivers", free: true, platform: "Windows / Linux" },
  { title: "Intel Driver & Support Assistant", desc: "Automatically scans and updates all Intel drivers — graphics, Ethernet, Bluetooth, and Thunderbolt.", url: "https://www.intel.com/content/www/us/en/support/detect.html", category: "Drivers", free: true, platform: "Windows" },
  { title: "Snappy Driver Installer Origin", desc: "Offline driver installer with huge driver pack database. Great for fresh Windows installs with no internet.", url: "https://www.snappy-driver-installer.org", category: "Drivers", free: true, platform: "Windows" },

  // Networking
  { title: "Wireshark", desc: "The world's foremost network protocol analyzer. Capture and inspect packets for troubleshooting and security analysis.", url: "https://www.wireshark.org", category: "Networking", free: true, platform: "Win / Mac / Linux" },
  { title: "NetSpot", desc: "Wi-Fi analyzer and site survey tool. Visualize signal strength, identify interference, and optimize router placement.", url: "https://www.netspotapp.com", category: "Networking", free: true, platform: "Win / Mac" },
  { title: "nmap", desc: "The network mapper. Security scanning, port discovery, OS detection, and network inventory — open-source since 1997.", url: "https://nmap.org", category: "Networking", free: true, platform: "Win / Mac / Linux" },
  { title: "Speedtest by Ookla", desc: "The global standard for internet speed testing. Check download/upload speeds, ping, and latency in one click.", url: "https://www.speedtest.net", category: "Networking", free: true, platform: "Web / App" },

  // Laptop Utilities
  { title: "HWiNFO64", desc: "Comprehensive hardware information and real-time monitoring — temperatures, voltages, fan speeds, power draw.", url: "https://www.hwinfo.com", category: "Laptop Utilities", free: true, platform: "Windows" },
  { title: "Fan Control", desc: "Powerful open-source fan curve software. Create custom fan profiles based on temperature sensors.", url: "https://getfancontrol.com", category: "Laptop Utilities", free: true, platform: "Windows" },
  { title: "Battery Report (Windows)", desc: "Built-in Windows tool to generate a detailed battery health report. Run 'powercfg /batteryreport' in CMD.", url: "https://support.microsoft.com/en-us/windows/battery-saving-tips-for-windows-a850d64d-ee8e-c8d2-9d6c-b8a9e4a3f5a6", category: "Laptop Utilities", free: true, platform: "Windows" },
  { title: "AlDente (macOS)", desc: "macOS menubar app to cap battery charge level and prevent degradation during long plugged-in sessions.", url: "https://apphousekitchen.com", category: "Laptop Utilities", free: true, platform: "macOS" },
  { title: "ThrottleStop", desc: "Disable thermal throttling on Intel laptops for a performance boost. Advanced CPU tuning utility.", url: "https://www.techpowerup.com/throttlestop/", category: "Laptop Utilities", free: true, platform: "Windows" },

  // Developer Tools
  { title: "Git", desc: "The distributed version control system powering modern software development. Track changes, branch, and collaborate.", url: "https://git-scm.com", category: "Developer Tools", free: true, platform: "Win / Mac / Linux" },
  { title: "Windows Subsystem for Linux (WSL)", desc: "Run a full Linux environment natively inside Windows 11/10 — no VM, no dual boot needed.", url: "https://learn.microsoft.com/en-us/windows/wsl/", category: "Developer Tools", free: true, platform: "Windows" },
  { title: "Homebrew", desc: "The missing package manager for macOS (and Linux). Install developer tools with a single terminal command.", url: "https://brew.sh", category: "Developer Tools", free: true, platform: "Mac / Linux" },
  { title: "Windows Terminal", desc: "Modern, tabbed terminal for Windows with PowerShell, CMD, WSL, and custom themes support.", url: "https://apps.microsoft.com/detail/9n0dx20hk701", category: "Developer Tools", free: true, platform: "Windows" },
  { title: "Raycast", desc: "Blazing fast macOS launcher — search apps, run scripts, manage clipboard, control Spotify, and much more.", url: "https://www.raycast.com", category: "Developer Tools", free: true, platform: "macOS" },
];

// ─── Resource Card ────────────────────────────────────────────────────────────

function ResourceCard({ res, index }: { res: Resource; index: number }) {
  const cfg = CATEGORY_CONFIG[res.category];
  return (
    <motion.div
      key={res.title}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }}
      className={`group relative flex flex-col p-6 rounded-2xl border ${cfg.border} ${cfg.bg} hover:-translate-y-1.5 transition-all duration-300 ${cfg.glow} backdrop-blur-sm`}
    >
      {/* Category icon + free badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center ${cfg.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {cfg.icon}
        </div>
        <div className="flex items-center gap-1.5">
          {res.free && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400">
              FREE
            </span>
          )}
          {res.platform && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hidden sm:inline-block">
              {res.platform}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-base font-bold mb-2 font-display leading-snug">{res.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">{res.desc}</p>

      {/* CTA */}
      <a
        href={res.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all duration-200 ${cfg.border} ${cfg.color} hover:bg-white/10 hover:border-white/25`}
      >
        Visit Official Website <ExternalLink size={13} />
      </a>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Use effect for mobile detection
  useState(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  });

  const filtered = RESOURCES.filter(r => {
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Group by category
  const grouped: Record<string, Resource[]> = {};
  filtered.forEach(r => {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  });

  return (
    <>
      <SEO
        title="Premium Tech Toolkit | Resources"
        description="Essential tools, software, benchmarks, and utilities for tech enthusiasts. Everything organized and linked to official websites."
        url="/resources"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Premium Tech Toolkit — Smart Picks Daily Resources',
          url: 'https://smartpicksdaily.com/resources',
          description: 'Essential tools, software, benchmarks, and utilities for tech enthusiasts. Everything organized and linked to official websites.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
              { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://smartpicksdaily.com/resources' }
            ]
          }
        }}
      />

      {/* ── Nebula Header ────────────────────────────────────────────────── */}
      <section className="relative h-[48vh] md:h-[52vh] w-full border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <NebulaCloud isMobile={isMobile} />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-gradient-to-t from-background to-transparent">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-medium text-accent mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {RESOURCES.length} Essential Tools · All Free or Freemium
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold mb-4"
            >
              Toolkit.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Software, benchmarks, drivers, and utilities trusted by professionals.
              All linked to official sources.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 py-3">
          {/* Search */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <input
                type="search"
                placeholder="Search tools…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>
            <span className="text-sm text-muted-foreground self-center hidden sm:block">
              {filtered.length} tools
            </span>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => setActiveCategory("All")}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => {
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? `${cfg.bg} ${cfg.border} border ${cfg.color}`
                      : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
                  }`}
                >
                  <span className={activeCategory === cat ? cfg.color : "text-muted-foreground"}>
                    {cfg.icon}
                  </span>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Resource Grid ─────────────────────────────────────────────────── */}
      <section className="py-16 relative z-10 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-5">Try a different search or category.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="px-6 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                Clear filters
              </button>
            </div>
          ) : activeCategory === "All" ? (
            // Grouped view when All selected
            <div className="space-y-16">
              {Object.entries(grouped).map(([cat, items]) => {
                const cfg = CATEGORY_CONFIG[cat];
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-9 h-9 rounded-xl border ${cfg.border} ${cfg.bg} flex items-center justify-center ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <h2 className="text-xl font-display font-bold">{cat}</h2>
                      <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {items.length} tools
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      <AnimatePresence mode="popLayout">
                        {items.map((res, i) => (
                          <ResourceCard key={res.title} res={res} index={i} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Flat grid for single category
            <div>
              <div className="flex items-center gap-3 mb-8">
                {(() => {
                  const cfg = CATEGORY_CONFIG[activeCategory];
                  return (
                    <>
                      <div className={`w-9 h-9 rounded-xl border ${cfg.border} ${cfg.bg} flex items-center justify-center ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <h2 className="text-2xl font-display font-bold">{activeCategory}</h2>
                      <span className="text-sm text-muted-foreground">{filtered.length} tools</span>
                    </>
                  );
                })()}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((res, i) => (
                    <ResourceCard key={res.title} res={res} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
