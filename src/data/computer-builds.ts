export interface BuildSpec {
  name: string;
  val: string;
}

export interface BuildPart {
  name: string;
  category: string;
  price: string;
  description: string;
  whyItFits: string;
  purchaseUrl: string;
}

export interface ComputerBuild {
  slug: string;
  title: string;
  price: string;
  desc: string;
  specs: BuildSpec[];
  color: string;
  borderColor: string;
  popular?: boolean;
  summary: string;
  parts: BuildPart[];
}

export const COMPUTER_BUILDS: ComputerBuild[] = [
  {
    slug: '1080p-budget-king',
    title: '1080p Budget King',
    price: '₹65,000 – ₹85,000',
    desc: 'Max out graphics at 1080p without breaking the bank. Perfect for esports and modern AAA titles on high settings.',
    specs: [
      { name: 'CPU', val: 'AMD Ryzen 5 7600' },
      { name: 'GPU', val: 'Radeon RX 7600' },
      { name: 'RAM', val: '16GB DDR5-5600' },
      { name: 'Storage', val: '1TB NVMe Gen4' }
    ],
    color: 'from-green-500/20 to-transparent',
    borderColor: 'border-green-500/30',
    summary: 'A lean, high-value gaming rig that prioritises frame rates at 1080p and leaves room for future upgrades.',
    parts: [
      {
        name: 'AMD Ryzen 5 7600',
        category: 'CPU',
        price: '₹15,500 – ₹20,000',
        description: 'Six efficient cores with strong gaming performance and excellent AM5 upgrade headroom.',
        whyItFits: 'It keeps the overall build balanced while leaving budget for a stronger graphics card.',
        purchaseUrl: 'https://www.amd.com/en/products/processors/desktop/ryzen/7000-series/amd-ryzen-5-7600x.html'
      },
      {
        name: 'Radeon RX 7600',
        category: 'GPU',
        price: '₹28,000 – ₹38,000',
        description: 'A capable 1080p gaming card with solid raster performance and excellent value for esports and AAA titles.',
        whyItFits: 'This part is the main performance engine for competitive gaming and high-refresh 1080p play.',
        purchaseUrl: 'https://www.amd.com/en/products/graphics/desktop/rx-7000-series.html'
      },
      {
        name: 'MSI MAG B650 Tomahawk WiFi',
        category: 'Motherboard',
        price: '₹18,000 – ₹24,000',
        description: 'A reliable AM5 motherboard with DDR5 support, Wi-Fi 6E and strong VRM quality.',
        whyItFits: 'It gives you a modern platform with plenty of longevity and upgrade flexibility.',
        purchaseUrl: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI'
      },
      {
        name: 'G.Skill Trident Z5 RGB DDR5-6400 32GB',
        category: 'RAM',
        price: '₹14,500 – ₹18,000',
        description: 'Fast DDR5 memory with a strong XMP profile that makes the whole system feel snappy.',
        whyItFits: 'The extra RAM headroom helps the build stay smooth in modern games and multitasking.',
        purchaseUrl: 'https://www.gskill.com/product/165/390/1676530264/F5-6400J3239G16GA2-TZ5RK'
      },
      {
        name: 'WD Black SN850X 2TB',
        category: 'Storage',
        price: '₹12,000 – ₹16,000',
        description: 'A high-speed NVMe SSD with excellent responsiveness and plenty of room for your library.',
        whyItFits: 'Fast storage keeps load times short and gives the system a premium feel without overspending.',
        purchaseUrl: 'https://www.westerndigital.com/products/internal-drives/wd-black-sn850x-nvme-ssd'
      },
      {
        name: 'Corsair RM1000x SHIFT',
        category: 'Power Supply',
        price: '₹16,000 – ₹20,000',
        description: 'A premium 80 PLUS Gold PSU with clean power delivery and excellent cable management.',
        whyItFits: 'It keeps the system stable, quiet and future-proof for a stronger GPU later.',
        purchaseUrl: 'https://www.corsair.com/in/en/c/power-supply-units'
      }
    ]
  },
  {
    slug: '1440p-sweet-spot',
    title: '1440p Sweet Spot',
    price: '₹1,05,000 – ₹1,35,000',
    desc: 'The best price-to-performance ratio in gaming right now. Dominates 1440p monitors with high refresh rates.',
    specs: [
      { name: 'CPU', val: 'Intel Core i5-13600K' },
      { name: 'GPU', val: 'NVIDIA RTX 4070' },
      { name: 'RAM', val: '32GB DDR5-6000' },
      { name: 'Storage', val: '2TB NVMe Gen4' }
    ],
    color: 'from-primary/20 to-transparent',
    borderColor: 'border-primary/30',
    popular: true,
    summary: 'An ideal all-rounder for 1440p gaming, streaming and creative work without overspending on ultra-enthusiast parts.',
    parts: [
      {
        name: 'Intel Core i5-13600K',
        category: 'CPU',
        price: '₹19,500 – ₹24,000',
        description: 'A hybrid CPU with enough cores for gaming, streaming and everyday multitasking.',
        whyItFits: 'It gives you the strong single-core and multi-core performance needed for smooth high-refresh play.',
        purchaseUrl: 'https://www.intel.in/content/www/in/en/products/sku/236796.html'
      },
      {
        name: 'NVIDIA GeForce RTX 4070',
        category: 'GPU',
        price: '₹58,000 – ₹72,000',
        description: 'A strong 1440p performer with excellent ray tracing and DLSS support.',
        whyItFits: 'The GPU is the star of this build, delivering superb frame rates at the most popular gaming resolution.',
        purchaseUrl: 'https://www.nvidia.com/en-in/geforce/graphics-cards/40-series/rtx-4070/'
      },
      {
        name: 'MSI MAG B650 Tomahawk WiFi',
        category: 'Motherboard',
        price: '₹18,000 – ₹24,000',
        description: 'A well-rounded board with premium features and a strong platform for future upgrades.',
        whyItFits: 'You get plenty of connectivity, good power delivery and a platform that can grow with you.',
        purchaseUrl: 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI'
      },
      {
        name: 'Corsair Vengeance DDR5-5600 32GB',
        category: 'RAM',
        price: '₹10,500 – ₹13,500',
        description: 'Reliable DDR5 memory that balances speed, latency and price well for a gaming-focused rig.',
        whyItFits: '32GB keeps the system comfortable for modern games, browsers and streaming tools.',
        purchaseUrl: 'https://www.corsair.com/in/en/c/ddr5'
      },
      {
        name: 'WD Black SN850X 2TB',
        category: 'Storage',
        price: '₹12,000 – ₹16,000',
        description: 'Fast, roomy storage that keeps install sizes and game libraries easy to manage.',
        whyItFits: 'The 2TB capacity is ideal if you want space for several large games without sacrificing speed.',
        purchaseUrl: 'https://www.westerndigital.com/products/internal-drives/wd-black-sn850x-nvme-ssd'
      },
      {
        name: 'Seasonic Focus GX-850',
        category: 'Power Supply',
        price: '₹10,000 – ₹13,000',
        description: 'A dependable 850W PSU with a strong reputation for quality and quiet operation.',
        whyItFits: 'It leaves enough power headroom for a later GPU upgrade while keeping noise under control.',
        purchaseUrl: 'https://seasonic.com/focus-gx'
      }
    ]
  },
  {
    slug: '4k-no-compromises',
    title: '4K No Compromises',
    price: '₹2,00,000+',
    desc: 'When budget isn’t a concern. Play anything at 4K native or crush complex video editing and 3D rendering workflows.',
    specs: [
      { name: 'CPU', val: 'AMD Ryzen 7 7800X3D' },
      { name: 'GPU', val: 'NVIDIA RTX 4080 Super' },
      { name: 'RAM', val: '32GB DDR5-6000 CL30' },
      { name: 'Storage', val: '4TB NVMe Gen4' }
    ],
    color: 'from-secondary/20 to-transparent',
    borderColor: 'border-secondary/30',
    summary: 'A premium powerhouse for 4K gaming, content creation and long-term performance without compromise.',
    parts: [
      {
        name: 'AMD Ryzen 7 7800X3D',
        category: 'CPU',
        price: '₹29,000 – ₹36,000',
        description: 'The flagship gaming CPU for high frame rates and excellent efficiency.',
        whyItFits: 'It pairs with the GPU to create a balanced high-end platform that stays strong in every resolution.',
        purchaseUrl: 'https://www.amd.com/en/products/processors/desktop/ryzen/7000-series/amd-ryzen-7-7800x3d.html'
      },
      {
        name: 'NVIDIA GeForce RTX 4080 Super',
        category: 'GPU',
        price: '₹1,10,000 – ₹1,40,000',
        description: 'A flagship GPU for 4K gaming, video editing and AI-heavy workflows.',
        whyItFits: 'This is the part that unlocks genuinely smooth 4K performance and serious creator workloads.',
        purchaseUrl: 'https://www.nvidia.com/en-in/geforce/graphics-cards/40-series/rtx-4080-super/'
      },
      {
        name: 'ASUS ProArt Z790-Creator',
        category: 'Motherboard',
        price: '₹38,000 – ₹50,000',
        description: 'A premium creator-focused board with excellent connectivity and stable power delivery.',
        whyItFits: 'It gives the system the flexibility to handle fast storage, high-end networking and pro workflows.',
        purchaseUrl: 'https://www.asus.com/in/motherboards-components/motherboards/proart/proart-z790-creator-wifi/'
      },
      {
        name: 'G.Skill Trident Z5 RGB DDR5-6400 32GB',
        category: 'RAM',
        price: '₹14,500 – ₹18,000',
        description: 'Fast, high-quality memory tuned for modern AMD and Intel platforms.',
        whyItFits: '32GB is the sweet spot for gaming and content creation without the cost of 64GB.',
        purchaseUrl: 'https://www.gskill.com/product/165/390/1676530264/F5-6400J3239G16GA2-TZ5RK'
      },
      {
        name: 'Crucial T700 2TB PCIe Gen5',
        category: 'Storage',
        price: '₹16,000 – ₹20,000',
        description: 'An ultra-fast SSD that keeps the system responsive even under heavy file transfers.',
        whyItFits: 'It pairs with the high-power rig to avoid storage bottlenecks in gaming and editing.',
        purchaseUrl: 'https://www.crucial.com/ssd/t700'
      },
      {
        name: 'be quiet! Dark Power 13 1000W',
        category: 'Power Supply',
        price: '₹22,000 – ₹28,000',
        description: 'A high-end, whisper-quiet PSU that is built for long-term reliability.',
        whyItFits: 'It delivers stable power for a high-end GPU while staying extremely quiet under load.',
        purchaseUrl: 'https://www.bequiet.com/en/powersupply/'
      }
    ]
  }
];
