export interface Article {
  slug: string;
  title: string;
  type: 'Buying Guide' | 'Comparison' | 'Review' | 'Explainer' | 'Setup Guide';
  time: string;
  date: string;
  excerpt: string;
  image?: string;
  tags: string[];
  heroColor: string;
  icon: string;
}

const BLOG_COVER_IMAGES: Record<string, string> = {
  'best-gaming-laptops-2026': 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
  'mechanical-vs-optical-switches': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
  'best-gaming-monitors-2026': 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80',
  'top-wireless-headphones-2026': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  'best-budget-gaming-mice': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'ssd-vs-hdd-guide': 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'best-student-laptops-2026': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  'laptop-buying-guide-2026': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  'best-mechanical-keyboards-2026': 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'gaming-mouse-buying-guide': 'https://images.pexels.com/photos/5198285/pexels-photo-5198285.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'best-nvme-ssds-2026': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
  'monitor-buying-guide-2026': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  'best-wifi-routers-2026': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
  'budget-smartphones-2026': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  'best-tablets-2026': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
  'best-wireless-earbuds-2026': 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
  'noise-cancelling-headphones-guide': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'best-power-banks-2026': 'https://images.pexels.com/photos/414860/pexels-photo-414860.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'best-usb-c-hubs-2026': 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
  'laptop-cooling-pads-guide': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  'graphics-cards-buying-guide': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
  'best-gaming-chairs-2026': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'mechanical-switch-buying-guide': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
  'laptop-accessories-guide': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  'study-setup-guide': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
  'programming-laptop-guide': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'streaming-equipment-guide': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  'best-webcams-2026': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'best-usb-microphones-2026': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
  'productive-desk-setup-guide': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
};

export const ARTICLES: Article[] = [
  { slug: 'best-gaming-laptops-2026', title: 'Best Gaming Laptops of 2026', type: 'Buying Guide', time: '8 min', date: 'Jul 15, 2026', excerpt: 'Compare the latest high-performance machines with RTX graphics and OLED displays — from budget picks to 4K monsters.', tags: ['gaming', 'laptops', 'RTX'], heroColor: 'from-red-500/30', icon: '🎮' },
  { slug: 'mechanical-vs-optical-switches', title: 'Mechanical vs Optical Switches: Which Is Right for You?', type: 'Comparison', time: '6 min', date: 'Jul 12, 2026', excerpt: 'Which keyboard switches reign supreme for competitive gaming versus everyday typing? We break down the science.', tags: ['keyboards', 'switches', 'gaming'], heroColor: 'from-blue-500/30', icon: '⌨️' },
  { slug: 'best-gaming-monitors-2026', title: 'Best Gaming Monitors for Every Budget', type: 'Buying Guide', time: '7 min', date: 'Jul 08, 2026', excerpt: 'Refresh rates, HDR, response times explained and our top picks for each price bracket — 1080p to 4K.', tags: ['monitors', 'gaming', 'display'], heroColor: 'from-cyan-500/30', icon: '🖥️' },
  { slug: 'top-wireless-headphones-2026', title: 'Top Wireless Headphones 2026: ANC, Sound & Value', type: 'Comparison', time: '8 min', date: 'Jul 03, 2026', excerpt: 'We tested the top 10 models for sound quality, comfort, ANC performance, and battery life — here are the winners.', tags: ['audio', 'headphones', 'wireless'], heroColor: 'from-purple-500/30', icon: '🎧' },
  { slug: 'best-budget-gaming-mice', title: 'Best Budget Gaming Mice Under ₹5,000', type: 'Buying Guide', time: '5 min', date: 'Jun 28, 2026', excerpt: 'Precision on a budget. You don\'t need to overspend to get flawless tracking, lightweight design, and great sensors.', tags: ['mouse', 'gaming', 'budget'], heroColor: 'from-green-500/30', icon: '🖱️' },
  { slug: 'ssd-vs-hdd-guide', title: 'SSD vs HDD: The Complete Storage Guide', type: 'Explainer', time: '9 min', date: 'Jun 22, 2026', excerpt: 'Storage decisions made simple. When you still need spinning rust and when NVMe is mandatory — PCIe 3.0 vs 4.0 vs 5.0.', tags: ['storage', 'SSD', 'hardware'], heroColor: 'from-orange-500/30', icon: '💾' },
  { slug: 'best-student-laptops-2026', title: 'Best Laptops for Students in 2026', type: 'Buying Guide', time: '7 min', date: 'Jun 18, 2026', excerpt: 'Balancing battery life, portability, and budget. Our top picks for college, engineering, creative arts, and medical students.', tags: ['laptops', 'students', 'budget'], heroColor: 'from-emerald-500/30', icon: '🎓' },
  { slug: 'laptop-buying-guide-2026', title: 'The Ultimate Laptop Buying Guide: Everything You Need to Know', type: 'Buying Guide', time: '10 min', date: 'Jun 15, 2026', excerpt: 'CPU, GPU, RAM, display, battery — what actually matters and what\'s just marketing hype. Make an informed decision.', tags: ['laptops', 'guide', 'beginners'], heroColor: 'from-blue-500/30', icon: '💻' },
  { slug: 'best-mechanical-keyboards-2026', title: 'Best Mechanical Keyboards for Every Use Case', type: 'Buying Guide', time: '8 min', date: 'Jun 10, 2026', excerpt: 'From coding to gaming to office work — find the perfect mechanical keyboard with the right switches for your fingers.', tags: ['keyboards', 'mechanical', 'switches'], heroColor: 'from-violet-500/30', icon: '⌨️' },
  { slug: 'gaming-mouse-buying-guide', title: 'How to Choose the Perfect Gaming Mouse', type: 'Buying Guide', time: '6 min', date: 'Jun 05, 2026', excerpt: 'Sensor types, weight, grip styles, DPI myths, and wireless vs wired — everything that actually affects your aim.', tags: ['mouse', 'gaming', 'guide'], heroColor: 'from-pink-500/30', icon: '🎯' },
  { slug: 'best-nvme-ssds-2026', title: 'Best NVMe SSDs for Speed, Capacity & Value', type: 'Buying Guide', time: '7 min', date: 'Jun 01, 2026', excerpt: 'From budget DRAM-less drives to PCIe 5.0 monsters — find the right SSD for your build, laptop, or PS5 upgrade.', tags: ['SSD', 'storage', 'NVMe'], heroColor: 'from-amber-500/30', icon: '🚀' },
  { slug: 'monitor-buying-guide-2026', title: 'Monitor Buying Guide: Resolution, Refresh Rate & Panel Types', type: 'Explainer', time: '9 min', date: 'May 28, 2026', excerpt: 'IPS vs VA vs OLED. 60Hz vs 144Hz vs 240Hz. 1080p vs 1440p vs 4K. Learn what each spec actually means.', tags: ['monitors', 'display', 'guide'], heroColor: 'from-cyan-500/30', icon: '📺' },
  { slug: 'best-wifi-routers-2026', title: 'Best Wi-Fi Routers for Home & Gaming', type: 'Buying Guide', time: '6 min', date: 'May 25, 2026', excerpt: 'Wi-Fi 6 vs Wi-Fi 6E vs Wi-Fi 7, mesh systems explained, and the best routers for apartments, houses, and gaming.', tags: ['networking', 'WiFi', 'routers'], heroColor: 'from-sky-500/30', icon: '📡' },
  { slug: 'budget-smartphones-2026', title: 'Best Budget Smartphones Under ₹25,000', type: 'Buying Guide', time: '7 min', date: 'May 22, 2026', excerpt: 'Flagship features without the flagship price. Camera quality, battery life, software experience — ranked for India.', tags: ['smartphones', 'budget', 'mobile'], heroColor: 'from-rose-500/30', icon: '📱' },
  { slug: 'best-tablets-2026', title: 'Best Tablets for Work, Study & Entertainment', type: 'Buying Guide', time: '6 min', date: 'May 18, 2026', excerpt: 'iPad vs Android vs Windows tablets. Which one fits your workflow — note-taking, drawing, media, or productivity?', tags: ['tablets', 'mobile', 'iPad'], heroColor: 'from-indigo-500/30', icon: '📟' },
  { slug: 'best-wireless-earbuds-2026', title: 'Best True Wireless Earbuds for Every Budget', type: 'Buying Guide', time: '7 min', date: 'May 15, 2026', excerpt: 'ANC quality, sound signature, battery life, and fit — our honest picks from ₹2,000 to ₹25,000.', tags: ['audio', 'earbuds', 'wireless'], heroColor: 'from-teal-500/30', icon: '🎵' },
  { slug: 'noise-cancelling-headphones-guide', title: 'Active Noise Cancellation Explained: How It Works and What to Buy', type: 'Explainer', time: '8 min', date: 'May 12, 2026', excerpt: 'ANC technology explained in plain English. Feedforward vs feedback vs hybrid — and our top headphone picks.', tags: ['audio', 'ANC', 'headphones'], heroColor: 'from-purple-500/30', icon: '🔇' },
  { slug: 'best-power-banks-2026', title: 'Best Power Banks for Laptops, Phones & Travel', type: 'Buying Guide', time: '5 min', date: 'May 08, 2026', excerpt: 'Capacity, charging speeds, GaN technology, and airline regulations — find the right power bank for your devices.', tags: ['accessories', 'charging', 'travel'], heroColor: 'from-yellow-500/30', icon: '🔋' },
  { slug: 'best-usb-c-hubs-2026', title: 'Best USB-C Hubs & Docking Stations for Laptops', type: 'Buying Guide', time: '6 min', date: 'May 05, 2026', excerpt: 'HDMI, Ethernet, SD cards, USB-A — restore every port your thin laptop eliminated. Budget to Thunderbolt 4 options.', tags: ['accessories', 'USB-C', 'docks'], heroColor: 'from-blue-500/30', icon: '🔌' },
  { slug: 'laptop-cooling-pads-guide', title: 'Do Laptop Cooling Pads Actually Work?', type: 'Explainer', time: '5 min', date: 'May 01, 2026', excerpt: 'We tested 8 cooling pads with thermal cameras. Here\'s when they help, when they\'re useless, and which ones to buy.', tags: ['laptops', 'cooling', 'accessories'], heroColor: 'from-red-500/30', icon: '❄️' },
  { slug: 'graphics-cards-buying-guide', title: 'Graphics Card Buying Guide: NVIDIA vs AMD vs Intel', type: 'Buying Guide', time: '9 min', date: 'Apr 28, 2026', excerpt: 'VRAM requirements, ray tracing, DLSS vs FSR, and which GPU you actually need for your resolution and games.', tags: ['GPU', 'graphics', 'gaming'], heroColor: 'from-green-500/30', icon: '🎨' },
  { slug: 'best-gaming-chairs-2026', title: 'Best Gaming & Ergonomic Chairs for Long Sessions', type: 'Buying Guide', time: '7 min', date: 'Apr 25, 2026', excerpt: 'Your back deserves better. Ergonomic chairs vs gaming chairs — lumbar support, materials, and what actually matters.', tags: ['chairs', 'ergonomics', 'gaming'], heroColor: 'from-slate-500/30', icon: '🪑' },
  { slug: 'mechanical-switch-buying-guide', title: 'Mechanical Keyboard Switches: The Complete Reference', type: 'Explainer', time: '8 min', date: 'Apr 22, 2026', excerpt: 'Linear vs Tactile vs Clicky. Cherry MX, Gateron, Kailh — actuation force, travel distance, and finding your perfect switch.', tags: ['keyboards', 'switches', 'mechanical'], heroColor: 'from-fuchsia-500/30', icon: '🔘' },
  { slug: 'laptop-accessories-guide', title: 'Essential Laptop Accessories Every User Should Own', type: 'Buying Guide', time: '6 min', date: 'Apr 18, 2026', excerpt: 'From laptop stands to portable monitors to travel chargers — the accessories that transform your workflow.', tags: ['laptops', 'accessories', 'productivity'], heroColor: 'from-lime-500/30', icon: '🧰' },
  { slug: 'study-setup-guide', title: 'How to Build the Perfect Study Setup on a Budget', type: 'Setup Guide', time: '7 min', date: 'Apr 15, 2026', excerpt: 'Desk, chair, monitor, lighting, and organisation — a complete student workspace under ₹20,000 that boosts focus.', tags: ['setup', 'students', 'budget'], heroColor: 'from-emerald-500/30', icon: '📚' },
  { slug: 'programming-laptop-guide', title: 'What Laptop Specs Actually Matter for Programming', type: 'Buying Guide', time: '7 min', date: 'Apr 12, 2026', excerpt: 'More RAM vs faster CPU. Integrated GPU vs dedicated. Linux compatibility, keyboard quality, and display considerations.', tags: ['programming', 'laptops', 'developers'], heroColor: 'from-blue-500/30', icon: '👨‍💻' },
  { slug: 'streaming-equipment-guide', title: 'Streaming Equipment Guide: From Beginner to Pro', type: 'Setup Guide', time: '8 min', date: 'Apr 08, 2026', excerpt: 'Microphones, cameras, capture cards, lighting, and software — build your streaming setup step by step.', tags: ['streaming', 'setup', 'content'], heroColor: 'from-purple-500/30', icon: '🎥' },
  { slug: 'best-webcams-2026', title: 'Best Webcams for Remote Work & Streaming', type: 'Buying Guide', time: '6 min', date: 'Apr 05, 2026', excerpt: '1080p vs 4K, autofocus, low-light performance, and built-in mics — find the right webcam for your setup.', tags: ['webcams', 'streaming', 'remote work'], heroColor: 'from-cyan-500/30', icon: '📷' },
  { slug: 'best-usb-microphones-2026', title: 'Best USB Microphones for Podcasting, Streaming & Calls', type: 'Buying Guide', time: '6 min', date: 'Apr 01, 2026', excerpt: 'Condenser vs dynamic, sample rates, polar patterns — and our top picks from ₹3,000 to ₹20,000.', tags: ['microphones', 'audio', 'streaming'], heroColor: 'from-rose-500/30', icon: '🎙️' },
  { slug: 'productive-desk-setup-guide', title: 'How to Build a Productive Desk Setup That Lasts', type: 'Setup Guide', time: '8 min', date: 'Mar 28, 2026', excerpt: 'Ergonomics, cable management, monitor placement, lighting, and the tools that make working at your desk a joy.', tags: ['setup', 'productivity', 'ergonomics'], heroColor: 'from-amber-500/30', icon: '🖥️' },
].map(article => ({
  ...article,
  image: article.image ?? BLOG_COVER_IMAGES[article.slug] ?? 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
}));
