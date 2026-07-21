import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { SEO } from '../components/seo';
import { HolographicShelf } from '../components/3d/HolographicShelf';
import { Search, Filter, ExternalLink, SlidersHorizontal, ChevronDown, X, Sparkles, Cpu, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  name: string;
  category: string;
  price: string;
  priceMin: number;
  priceMax: number;
  description?: string;
  pros: string[];
  cons: string[];
  link: string;
  usecases?: string[];
  badge?: string;
  aiBadges?: string[];
}

// ─── Product Database ────────────────────────────────────────────────────────

const ALL_PRODUCTS: Product[] = [
  // ── LAPTOPS ──────────────────────────────────────────────────────────────
  { name: "Dell XPS 15 (9530)", category: "Laptops", price: "₹1,62,000 – ₹2,10,000", priceMin: 162000, priceMax: 210000, description: "Premium 15.6\" laptop with stunning OLED display and powerful performance for professionals.", pros: ["4K OLED display", "Compact chassis", "Strong CPU"], cons: ["Battery life", "Gets hot under load"], link: "https://www.dell.com/en-in/shop/laptops/xps-15-laptop/spd/xps-15-9530-laptop", usecases: ["programming","business","editing","content"], aiBadges: ["Performance Pick"] },
  { name: "HP Spectre x360 14", category: "Laptops", price: "₹1,45,000 – ₹1,85,000", priceMin: 145000, priceMax: 185000, description: "Elegant 2-in-1 convertible with OLED touchscreen, perfect for creative professionals.", pros: ["2-in-1 convertible", "OLED touch", "Premium build"], cons: ["Webcam placement", "Mediocre speakers"], link: "https://www.hp.com/in-en/shop/laptops", usecases: ["business","college","travel"], aiBadges: ["Editor's Choice"] },
  { name: "Lenovo ThinkPad X1 Carbon Gen 11", category: "Laptops", price: "₹1,35,000 – ₹1,78,000", priceMin: 135000, priceMax: 178000, description: "The gold standard for business laptops — legendary keyboard, MIL-SPEC durability, ultra-light.", pros: ["Legendary keyboard", "MIL-SPEC build", "Long battery"], cons: ["Integrated GPU only", "Expensive"], link: "https://www.lenovo.com/in/en/laptops/thinkpad/x-series/", usecases: ["business","programming","travel"], aiBadges: ["Best Value", "Future Proof"] },
  { name: "Apple MacBook Pro 14 (M4 Pro)", category: "Laptops", price: "₹1,99,000 – ₹2,79,000", priceMin: 199000, priceMax: 279000, description: "Apple's most powerful 14\" laptop — M4 Pro chip delivers desktop-class performance with incredible efficiency.", pros: ["M4 Pro performance", "18-hr battery", "Liquid Retina XDR"], cons: ["macOS only", "Very expensive", "Limited ports base model"], link: "https://www.apple.com/in/shop/buy-mac/macbook-pro", usecases: ["programming","editing","content","ml","architecture"], badge: "Best Overall", aiBadges: ["AI Recommended", "Performance Pick"] },

  // ── GAMING LAPTOPS ────────────────────────────────────────────────────────
  { name: "ASUS ROG Zephyrus G14 (2024)", category: "Gaming Laptops", price: "₹1,58,000 – ₹1,99,000", priceMin: 158000, priceMax: 199000, description: "Compact 14\" powerhouse with RTX 4060 Ti — rare combination of portability and raw gaming muscle.", pros: ["Compact 14″", "RTX 4060 Ti", "AniMe Matrix lid"], cons: ["Webcam average", "Runs warm"], link: "https://rog.asus.com/in/laptops/rog-zephyrus/rog-zephyrus-g14-series/", usecases: ["gaming","ml","editing"], badge: "Editor's Pick", aiBadges: ["AI Recommended", "Best Value"] },
  { name: "MSI Raider GE78 HX", category: "Gaming Laptops", price: "₹2,10,000 – ₹2,80,000", priceMin: 210000, priceMax: 280000, description: "17.3\" desktop-replacement with RTX 4080 — uncompromising power for serious gamers.", pros: ["17.3″ QHD 240Hz", "RTX 4080", "Powerful cooling"], cons: ["Huge and heavy", "Poor battery"], link: "https://www.msi.com/Laptop/Raider-GE78-HX", usecases: ["gaming","ml"], aiBadges: ["Performance Pick"] },
  { name: "Lenovo Legion Pro 7i Gen 9", category: "Gaming Laptops", price: "₹1,89,000 – ₹2,40,000", priceMin: 189000, priceMax: 240000, description: "Intel Core Ultra 9 paired with RTX 4080 and industry-leading thermals make this a powerhouse.", pros: ["Intel Core Ultra 9", "RTX 4080", "Excellent thermals"], cons: ["Chonky body", "Loud fans"], link: "https://www.lenovo.com/in/en/laptops/legion-laptops/legion-pro-series/", usecases: ["gaming","content","ml"] },
  { name: "Acer Predator Helios Neo 16", category: "Gaming Laptops", price: "₹1,02,000 – ₹1,40,000", priceMin: 102000, priceMax: 140000, description: "Budget gaming champion — RTX 4060 and 165Hz display at a price that doesn't break the bank.", pros: ["Budget powerhouse", "RTX 4060", "165Hz IPS"], cons: ["Plasticky build", "Short battery"], link: "https://www.acer.com/in-en/predator/laptops", usecases: ["gaming","college"], aiBadges: ["Budget Pick"] },
  { name: "HP OMEN 16 (2024)", category: "Gaming Laptops", price: "₹1,05,000 – ₹1,50,000", priceMin: 105000, priceMax: 150000, description: "Solid mid-range gaming laptop with QHD display and good thermal headroom.", pros: ["165Hz QHD display", "Good thermals", "Solid keyboard"], cons: ["Average speakers", "Build is average"], link: "https://www.hp.com/in-en/shop/gaming-laptops", usecases: ["gaming","college"] },

  // ── ULTRABOOKS ────────────────────────────────────────────────────────────
  { name: "Apple MacBook Air 15 (M3)", category: "Ultrabooks", price: "₹1,34,900 – ₹1,64,900", priceMin: 134900, priceMax: 164900, description: "The perfect travel laptop — fanless silence, all-day battery, and a gorgeous 15\" Liquid Retina display.", pros: ["Fanless, silent", "18-hr battery", "Thin & light"], cons: ["No fan = throttles", "No SD slot"], link: "https://www.apple.com/in/shop/buy-mac/macbook-air", usecases: ["college","travel","programming","content"], badge: "Best Value", aiBadges: ["AI Recommended", "Best Value"] },
  { name: "Samsung Galaxy Book4 Pro 360", category: "Ultrabooks", price: "₹1,32,000 – ₹1,70,000", priceMin: 132000, priceMax: 170000, description: "AMOLED 2X convertible with included S Pen — gorgeous screen for creative professionals on the move.", pros: ["AMOLED 2X display", "S Pen included", "Slim build"], cons: ["Average battery", "Fan noise"], link: "https://www.samsung.com/in/computers/galaxy-book/", usecases: ["travel","business","college"] },
  { name: "LG Gram 16 (2024)", category: "Ultrabooks", price: "₹1,29,000 – ₹1,55,000", priceMin: 129000, priceMax: 155000, description: "Lightest 16\" laptop in the world — 1.19 kg with MIL-STD build and extraordinary battery life.", pros: ["1.19 kg only!", "32 Whr battery", "MIL-STD"], cons: ["Weak GPU", "Average speakers"], link: "https://www.lg.com/in/laptops/lg-gram/", usecases: ["travel","college","business"] },
  { name: "Asus ZenBook 14 OLED (Q425)", category: "Ultrabooks", price: "₹95,000 – ₹1,20,000", priceMin: 95000, priceMax: 120000, description: "3K OLED panel in a featherweight chassis — incredible display for the price.", pros: ["3K OLED display", "Lightweight", "Strong iGPU"], cons: ["Mediocre webcam", "No dGPU"], link: "https://www.asus.com/in/laptops/for-home/zenbook/", usecases: ["college","travel","programming"] },

  // ── MINI PCs ──────────────────────────────────────────────────────────────
  { name: "Apple Mac Mini M4", category: "Mini PCs", price: "₹59,900 – ₹89,900", priceMin: 59900, priceMax: 89900, description: "Revolutionary compact desktop — M4 chip performance in a palm-sized box.", pros: ["M4 chip performance", "Tiny footprint", "Dual Thunderbolt 4"], cons: ["No display included", "Pricey upgrades"], link: "https://www.apple.com/in/shop/buy-mac/mac-mini", usecases: ["programming","editing","ml"], badge: "Best Mini", aiBadges: ["AI Recommended", "Best Value"] },
  { name: "Intel NUC 13 Pro", category: "Mini PCs", price: "₹52,000 – ₹75,000", priceMin: 52000, priceMax: 75000, description: "Intel's most capable NUC with Thunderbolt 4 and Iris Xe graphics.", pros: ["Iris Xe GPU", "Thunderbolt 4", "Wi-Fi 6E"], cons: ["No RAM/storage included", "Gets warm"], link: "https://www.intel.in/content/www/in/en/products/details/nuc.html", usecases: ["programming","business"] },
  { name: "ASUS PN65 Mini PC", category: "Mini PCs", price: "₹55,000 – ₹80,000", priceMin: 55000, priceMax: 80000, description: "Meteor Lake-powered mini PC with four USB4 ports and whisper-quiet operation.", pros: ["Meteor Lake CPU", "4 USB4 ports", "Silent operation"], cons: ["Limited GPU options", "RAM slots only 2"], link: "https://www.asus.com/in/displays-desktops/mini-pcs/", usecases: ["business","programming"] },
  { name: "Beelink EQ12", category: "Mini PCs", price: "₹18,000 – ₹28,000", priceMin: 18000, priceMax: 28000, description: "Affordable mini PC with DDR5 memory — ideal for light tasks and home use.", pros: ["Budget friendly", "Fanless option", "DDR5"], cons: ["Basic GPU", "Average build"], link: "https://www.bee-link.com/", usecases: ["college","business"], aiBadges: ["Budget Pick"] },

  // ── GAMING PCs ────────────────────────────────────────────────────────────
  { name: "ASUS ROG Strix GT15", category: "Gaming PCs", price: "₹1,20,000 – ₹1,60,000", priceMin: 120000, priceMax: 160000, description: "Pre-built gaming desktop with aggressive ROG aesthetics and RTX 4070 Super for 1440p domination.", pros: ["RTX 4070 Super", "Tool-less side panel", "ROG cooling"], cons: ["Loud under load", "No optical drive"], link: "https://rog.asus.com/in/gaming-desktops/", usecases: ["gaming"], badge: "Best Gaming PC", aiBadges: ["AI Recommended"] },
  { name: "MSI Aegis RS 13th Gen", category: "Gaming PCs", price: "₹1,40,000 – ₹1,80,000", priceMin: 140000, priceMax: 180000, description: "High-end pre-built with Core i9 and RTX 4080 — built for 4K gaming without compromise.", pros: ["Core i9 + RTX 4080", "Compact design", "Good airflow"], cons: ["Expensive", "Proprietary parts"], link: "https://www.msi.com/Desktop/Aegis-RS-13th", usecases: ["gaming","ml"], aiBadges: ["Performance Pick"] },
  { name: "Lenovo Legion Tower 5i Gen 8", category: "Gaming PCs", price: "₹1,10,000 – ₹1,50,000", priceMin: 110000, priceMax: 150000, description: "Mid-range gaming tower balancing value and performance — upgradeable standard components.", pros: ["Upgradeable parts", "Good value", "1440p capable"], cons: ["Plastic chassis", "Average stock cooler"], link: "https://www.lenovo.com/in/en/gaming/desktops/", usecases: ["gaming"], aiBadges: ["Best Value"] },

  // ── WORKSTATIONS ──────────────────────────────────────────────────────────
  { name: "Apple Mac Studio (M4 Ultra)", category: "Workstations", price: "₹2,29,900 – ₹3,99,900", priceMin: 229900, priceMax: 399900, description: "Unprecedented unified memory bandwidth and M4 Ultra performance in a compact desktop.", pros: ["Extraordinary performance", "Incredible memory bandwidth", "Silent"], cons: ["Very expensive", "No GPU upgrade"], link: "https://www.apple.com/in/shop/buy-mac/mac-studio", usecases: ["editing","ml","architecture","content"], aiBadges: ["Performance Pick", "Future Proof"] },
  { name: "HP Z4 G5 Workstation", category: "Workstations", price: "₹2,20,000 – ₹5,00,000", priceMin: 220000, priceMax: 500000, description: "ISV-certified workstation with Xeon W support and ECC RAM for mission-critical workflows.", pros: ["Xeon W / Core Ultra", "ECC RAM support", "ISV certified"], cons: ["Bulky tower", "Expensive"], link: "https://www.hp.com/in-en/shop/workstations", usecases: ["engineering","architecture","ml"] },
  { name: "Lenovo ThinkStation P3 Tower", category: "Workstations", price: "₹1,85,000 – ₹3,50,000", priceMin: 185000, priceMax: 350000, description: "Tool-less chassis and PCIe 5.0 make upgrades effortless in this certified workstation.", pros: ["Tool-less chassis", "PCIe 5.0", "ISV certified"], cons: ["Loud fans under load", "Pricey"], link: "https://www.lenovo.com/in/en/desktops/thinkstation/", usecases: ["engineering","architecture"] },

  // ── NAS ───────────────────────────────────────────────────────────────────
  { name: "Synology DiskStation DS923+", category: "NAS", price: "₹52,000 – ₹65,000", priceMin: 52000, priceMax: 65000, description: "4-bay powerhouse with exceptional DSM software ecosystem — best NAS for home and SMB.", pros: ["4-bay expandable", "Excellent DSM software", "10GbE upgradeable"], cons: ["Drives not included", "Ryzen iGPU limited"], link: "https://www.synology.com/en-in/products/DS923+", badge: "Best NAS", aiBadges: ["AI Recommended"] },
  { name: "QNAP TS-464", category: "NAS", price: "₹48,000 – ₹62,000", priceMin: 48000, priceMax: 62000, description: "PCIe-expandable 4-bay NAS with built-in M.2 SSD slots for caching.", pros: ["PCIe slot for 10GbE", "Built-in M.2 SSD slots", "HDMI out"], cons: ["QTS UI complex", "Fan can be loud"], link: "https://www.qnap.com/en-in/product/ts-464" },
  { name: "Synology DS423+", category: "NAS", price: "₹35,000 – ₹48,000", priceMin: 35000, priceMax: 48000, description: "Compact 4-bay NAS for home use with low power consumption and great Synology app ecosystem.", pros: ["Compact 4-bay", "Great Synology apps", "Low power"], cons: ["No PCIe slot", "DDR4 only"], link: "https://www.synology.com/en-in/products/DS423+", aiBadges: ["Budget Pick"] },

  // ── PROCESSORS ───────────────────────────────────────────────────────────
  { name: "Intel Core Ultra 9 285K", category: "Processors", price: "₹42,000 – ₹52,000", priceMin: 42000, priceMax: 52000, description: "Arrow Lake flagship with top single-thread speeds and PCIe 5.0 connectivity.", pros: ["Top single-thread speed", "PCIe 5.0", "Arrow Lake arch"], cons: ["Needs Z890 board", "Power hungry"], link: "https://www.intel.in/content/www/in/en/products/sku/240648.html", badge: "Top CPU", aiBadges: ["Performance Pick"] },
  { name: "AMD Ryzen 9 9900X", category: "Processors", price: "₹38,000 – ₹48,000", priceMin: 38000, priceMax: 48000, description: "Zen 5 architecture brings major efficiency improvements and strong all-core performance.", pros: ["Zen 5 architecture", "Efficient power use", "AM5 socket"], cons: ["Stock cooler adequate only for stock", "DDR5 only"], link: "https://www.amd.com/en/products/processors/desktop/ryzen/9000-series/amd-ryzen-9-9900x.html" },
  { name: "AMD Ryzen 7 7800X3D", category: "Processors", price: "₹29,000 – ₹36,000", priceMin: 29000, priceMax: 36000, description: "3D V-Cache technology makes this the undisputed gaming CPU king — massive frame rate advantage.", pros: ["3D V-Cache gaming king", "AM5 socket", "Great efficiency"], cons: ["No overclocking", "Gaming-focused"], link: "https://www.amd.com/en/products/processors/desktop/ryzen/7000-series/amd-ryzen-7-7800x3d.html", badge: "Best Gaming CPU", aiBadges: ["AI Recommended"] },
  { name: "Intel Core i5-14600K", category: "Processors", price: "₹19,500 – ₹24,000", priceMin: 19500, priceMax: 24000, description: "Outstanding price-to-performance ratio — best mid-range gaming and productivity CPU.", pros: ["Great value", "Strong gaming", "Runs cool"], cons: ["Z790 board needed", "6P+8E not as efficient"], link: "https://www.intel.in/content/www/in/en/products/sku/236796.html", aiBadges: ["Best Value"] },
  { name: "AMD Ryzen 5 7600X", category: "Processors", price: "₹15,500 – ₹20,000", priceMin: 15500, priceMax: 20000, description: "6-core budget champion with PCIe 5.0 — best entry-level CPU for AM5 builds.", pros: ["6-core budget champ", "PCIe 5.0", "Runs cool"], cons: ["Only 6 cores", "No 3D V-Cache"], link: "https://www.amd.com/en/products/processors/desktop/ryzen/7000-series/amd-ryzen-5-7600x.html", aiBadges: ["Budget Pick"] },

  // ── GRAPHICS CARDS ────────────────────────────────────────────────────────
  { name: "NVIDIA GeForce RTX 5090", category: "Graphics Cards", price: "₹2,30,000 – ₹2,80,000", priceMin: 230000, priceMax: 280000, description: "The fastest consumer GPU ever made — 32 GB GDDR7 and DLSS 4 redefine 4K gaming.", pros: ["Fastest consumer GPU", "32 GB GDDR7", "DLSS 4"], cons: ["Extreme price", "1000W system power"], link: "https://www.nvidia.com/en-in/geforce/graphics-cards/50-series/rtx-5090/", badge: "Fastest GPU", aiBadges: ["Performance Pick", "Future Proof"] },
  { name: "NVIDIA GeForce RTX 5080", category: "Graphics Cards", price: "₹1,05,000 – ₹1,30,000", priceMin: 105000, priceMax: 130000, description: "Blackwell architecture with 16 GB GDDR7 — incredible 4K performance without the RTX 5090 premium.", pros: ["Blackwell architecture", "16 GB GDDR7", "DLSS 4"], cons: ["Still expensive", "RTX 4090 competition"], link: "https://www.nvidia.com/en-in/geforce/graphics-cards/50-series/rtx-5080/" },
  { name: "AMD Radeon RX 9070 XT", category: "Graphics Cards", price: "₹48,000 – ₹62,000", priceMin: 48000, priceMax: 62000, description: "16 GB VRAM at mid-range pricing — AMD's strongest value proposition in years.", pros: ["16 GB VRAM", "FSR 4 support", "Strong raster"], cons: ["Ray tracing still behind NVIDIA", "Driver maturity"], link: "https://www.amd.com/en/products/graphics/desktop/rx-9000-series.html", badge: "Best Value GPU", aiBadges: ["Best Value", "AI Recommended"] },
  { name: "NVIDIA GeForce RTX 4070 Ti Super", category: "Graphics Cards", price: "₹72,000 – ₹88,000", priceMin: 72000, priceMax: 88000, description: "4K-capable with 16 GB GDDR6X and DLSS 3.5 — excellent for creative professionals.", pros: ["16 GB GDDR6X", "4K capable", "DLSS 3.5"], cons: ["Premium price", "Power hungry"], link: "https://www.nvidia.com/en-in/geforce/graphics-cards/40-series/rtx-4070-ti-super/" },
  { name: "Intel Arc B580", category: "Graphics Cards", price: "₹22,000 – ₹30,000", priceMin: 22000, priceMax: 30000, description: "12 GB VRAM at an unbeatable budget price — Intel's comeback GPU surprises.", pros: ["12 GB VRAM at budget price", "Good raster", "XeSS support"], cons: ["Driver still improving", "No AV1 decode acceleration"], link: "https://www.intel.in/content/www/in/en/products/sku/236847.html", aiBadges: ["Budget Pick"] },

  // ── MOTHERBOARDS ──────────────────────────────────────────────────────────
  { name: "ASUS ROG Maximus Z890 Apex", category: "Motherboards", price: "₹58,000 – ₹75,000", priceMin: 58000, priceMax: 75000, description: "Enthusiast Z890 board with extreme overclocking capabilities and premium VRM design.", pros: ["Extreme OC support", "Excellent VRM", "DDR5 memory training"], cons: ["Expensive", "Over-specced for most"], link: "https://rog.asus.com/in/motherboards/rog-maximus/", badge: "Best Enthusiast", aiBadges: ["Performance Pick"] },
  { name: "MSI MAG B650 Tomahawk WiFi", category: "Motherboards", price: "₹18,000 – ₹24,000", priceMin: 18000, priceMax: 24000, description: "Best mid-range AM5 board — strong VRM, PCIe 5.0, and WiFi 6E at a fair price.", pros: ["Strong VRM", "PCIe 5.0 M.2", "WiFi 6E built-in"], cons: ["No Thunderbolt", "B650 not B650E"], link: "https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI", aiBadges: ["Best Value", "AI Recommended"] },
  { name: "Gigabyte B760M DS3H DDR4", category: "Motherboards", price: "₹9,500 – ₹13,000", priceMin: 9500, priceMax: 13000, description: "Solid budget LGA1700 board supporting DDR4 memory — ideal for budget Intel builds.", pros: ["DDR4 support saves cost", "Micro-ATX", "Solid quality"], cons: ["No WiFi", "Limited USB ports"], link: "https://www.gigabyte.com/in/Motherboard/B760M-DS3H-DDR4", aiBadges: ["Budget Pick"] },
  { name: "ASUS ProArt Z790-Creator", category: "Motherboards", price: "₹38,000 – ₹50,000", priceMin: 38000, priceMax: 50000, description: "Creator-focused Z790 with dual Thunderbolt 4 and 10GbE — designed for content creation workflows.", pros: ["Dual Thunderbolt 4", "10GbE onboard", "Stable for 24/7"], cons: ["No RGB", "Premium price"], link: "https://www.asus.com/in/motherboards-components/motherboards/proart/proart-z790-creator-wifi/", aiBadges: ["Editor's Choice"] },

  // ── POWER SUPPLIES ────────────────────────────────────────────────────────
  { name: "Corsair RM1000x SHIFT (2023)", category: "Power Supplies", price: "₹16,000 – ₹20,000", priceMin: 16000, priceMax: 20000, description: "Side-mounted modular connectors make cable management easier than ever — 80 PLUS Gold.", pros: ["Side connector design", "Fully modular", "80 PLUS Gold"], cons: ["Premium pricing", "ATX 3.0 PCIe only some SKUs"], link: "https://www.corsair.com/in/en/c/power-supply-units", badge: "Best Premium PSU", aiBadges: ["Editor's Choice"] },
  { name: "Seasonic Focus GX-850", category: "Power Supplies", price: "₹10,000 – ₹13,000", priceMin: 10000, priceMax: 13000, description: "10-year warranty and rock-solid reliability — Seasonic's reputation for quality shines here.", pros: ["10-yr warranty", "Fully modular", "Quiet fan"], cons: ["No ATX 3.0 native"], link: "https://seasonic.com/focus-gx", aiBadges: ["Best Value", "AI Recommended"] },
  { name: "Cooler Master MWE Gold 650W", category: "Power Supplies", price: "₹5,500 – ₹7,500", priceMin: 5500, priceMax: 7500, description: "Reliable 80 PLUS Gold at entry-level pricing — great for mid-range builds.", pros: ["80 PLUS Gold efficiency", "Semi-modular", "Reliable caps"], cons: ["Fan always on", "Cable quality average"], link: "https://www.coolermaster.com/in/en/catalog/power-supply-units/", aiBadges: ["Budget Pick"] },
  { name: "be quiet! Dark Power 13 1000W", category: "Power Supplies", price: "₹22,000 – ₹28,000", priceMin: 22000, priceMax: 28000, description: "Whisper-quiet operation with titanium-class efficiency — the PSU for silent high-end builds.", pros: ["Near-silent", "80 PLUS Titanium", "10-yr warranty"], cons: ["Expensive", "Overkill for mid builds"], link: "https://www.bequiet.com/en/powersupply/", aiBadges: ["Performance Pick"] },

  // ── MONITORS ──────────────────────────────────────────────────────────────
  { name: "LG UltraGear 27GP950P-B", category: "Monitors", price: "₹55,000 – ₹72,000", priceMin: 55000, priceMax: 72000, description: "4K 160Hz Nano IPS with G-Sync Compatible — the benchmark for gaming monitor excellence.", pros: ["4K 160Hz Nano IPS", "G-Sync Compatible", "HDR600"], cons: ["No USB-C 90W", "Some backlight bleed"], link: "https://www.lg.com/in/monitors/gaming-monitors/", badge: "Best Gaming Monitor", aiBadges: ["AI Recommended"] },
  { name: "Samsung Odyssey OLED G8 S32DG80", category: "Monitors", price: "₹72,000 – ₹95,000", priceMin: 72000, priceMax: 95000, description: "QD-OLED with infinite contrast and 240Hz — the most stunning gaming monitor available.", pros: ["QD-OLED infinite contrast", "240Hz", "Smart TV apps"], cons: ["OLED burn-in risk", "Premium price"], link: "https://www.samsung.com/in/monitors/gaming/", aiBadges: ["Performance Pick"] },
  { name: "Dell UltraSharp U2723QE", category: "Monitors", price: "₹52,000 – ₹65,000", priceMin: 52000, priceMax: 65000, description: "Professional-grade IPS Black with exceptional colour accuracy and USB-C hub functionality.", pros: ["4K IPS Black", "Color accuracy", "USB-C Hub 90W"], cons: ["60Hz only", "No local dimming"], link: "https://www.dell.com/en-in/shop/monitors", aiBadges: ["Editor's Choice"] },
  { name: "AOC Q27G3XMN Mini LED", category: "Monitors", price: "₹28,000 – ₹36,000", priceMin: 28000, priceMax: 36000, description: "Mini LED backlight at mid-range pricing — 170Hz QHD with excellent HDR for the price.", pros: ["Mini LED backlight", "170Hz QHD", "Great HDR"], cons: ["Halo effect", "Basic stand"], link: "https://aoc.com/in/monitors", aiBadges: ["Best Value"] },
  { name: "LG 34WN80C-B UltraWide", category: "Monitors", price: "₹38,000 – ₹52,000", priceMin: 38000, priceMax: 52000, description: "34\" ultrawide IPS with USB-C 60W charging — the productivity booster for multitaskers.", pros: ["34″ 21:9 IPS", "USB-C 60W", "sRGB accurate"], cons: ["Only 60Hz", "Older design"], link: "https://www.lg.com/in/monitors/ultrawide-monitors/" },

  // ── PORTABLE MONITORS ─────────────────────────────────────────────────────
  { name: "ASUS ZenScreen 15.6\" OLED MB16QHG", category: "Portable Monitors", price: "₹28,000 – ₹36,000", priceMin: 28000, priceMax: 36000, description: "OLED portable monitor with 2.5K resolution — crisp and vivid on the go.", pros: ["2.5K OLED", "USB-C single-cable", "Auto-rotate"], cons: ["Price premium", "No built-in stand"], link: "https://www.asus.com/in/displays-desktops/monitors/zenscreen/", badge: "Best OLED Portable", aiBadges: ["AI Recommended"] },
  { name: "LG 16MR70 gram+view", category: "Portable Monitors", price: "₹22,000 – ₹30,000", priceMin: 22000, priceMax: 30000, description: "Ultra-thin 16\" IPS companion made for LG gram laptops — but works with everything.", pros: ["Thin & light", "IPS display", "Foldable cover stand"], cons: ["1200p not 1440p", "Limited brightness"], link: "https://www.lg.com/in/monitors/gram-plus-view-monitors/" },
  { name: "Espresso Display 13 Pro", category: "Portable Monitors", price: "₹18,000 – ₹25,000", priceMin: 18000, priceMax: 25000, description: "Premium touchscreen portable monitor with magnetic smart cover and pen support.", pros: ["Touchscreen", "Thin & premium", "USB-C"], cons: ["Expensive", "No speakers"], link: "https://espres.so/", aiBadges: ["Editor's Choice"] },

  // ── TVs ───────────────────────────────────────────────────────────────────
  { name: "LG C3 OLED 55\" (2023)", category: "TVs", price: "₹1,20,000 – ₹1,55,000", priceMin: 120000, priceMax: 155000, description: "The benchmark 4K OLED TV — perfect blacks, wide-angle viewing and 4 HDMI 2.1 ports.", pros: ["OLED perfect blacks", "4× HDMI 2.1", "120Hz gaming"], cons: ["OLED burn-in risk", "Average speakers"], link: "https://www.lg.com/in/tvs/oled-tvs/", badge: "Best TV", aiBadges: ["AI Recommended"] },
  { name: "Samsung Neo QLED QN90C 55\"", category: "TVs", price: "₹1,40,000 – ₹1,80,000", priceMin: 140000, priceMax: 180000, description: "Mini LED Neo QLED with Anti-Reflection coating — stunning in bright rooms.", pros: ["Mini LED brightness", "Anti-Reflection", "Excellent upscaling"], cons: ["VA viewing angles", "Samsung OS"], link: "https://www.samsung.com/in/tvs/qled-tv/", aiBadges: ["Performance Pick"] },
  { name: "Sony Bravia XR A80L 55\" OLED", category: "TVs", price: "₹1,80,000 – ₹2,20,000", priceMin: 180000, priceMax: 220000, description: "Sony's Cognitive Processor XR and Acoustic Surface Audio+ make this the ultimate home cinema OLED.", pros: ["XR cognitive processor", "Acoustic Surface Audio", "Google TV"], cons: ["Very expensive", "No HDMI 2.1 all ports"], link: "https://www.sony.co.in/en/electronics/televisions/a80l-series" },
  { name: "TCL 65C845 QLED Mini LED", category: "TVs", price: "₹72,000 – ₹95,000", priceMin: 72000, priceMax: 95000, description: "Exceptional value QLED with mini LED — rivals TVs twice its price.", pros: ["Mini LED at budget price", "144Hz refresh", "IMAX Enhanced"], cons: ["Google TV ads", "Local dimming zones fewer"], link: "https://www.tcl.com/in/en/products/home-theater", aiBadges: ["Best Value"] },

  // ── PROJECTORS ────────────────────────────────────────────────────────────
  { name: "BenQ TK700STi 4K Gaming Projector", category: "Projectors", price: "₹95,000 – ₹1,20,000", priceMin: 95000, priceMax: 120000, description: "4K HDR gaming projector with ultra-short throw and 240Hz input lag support.", pros: ["4K HDR", "240Hz input", "Short throw"], cons: ["Fan noise", "No zoom lens"], link: "https://www.benq.com/en-in/projector/home-entertainment/", badge: "Best Gaming Projector", aiBadges: ["AI Recommended"] },
  { name: "Epson EH-TW7820 4K Pro", category: "Projectors", price: "₹1,10,000 – ₹1,40,000", priceMin: 110000, priceMax: 140000, description: "3LCD 4K projector with outstanding colour accuracy — perfect for home cinema.", pros: ["3LCD no rainbow", "Lens shift", "Quiet operation"], cons: ["Bulky", "Needs dark room"], link: "https://www.epson.co.in/consumer/projectors" },
  { name: "Xiaomi Mi Smart Projector 2 Pro", category: "Projectors", price: "₹45,000 – ₹65,000", priceMin: 45000, priceMax: 65000, description: "Android TV projector with 1080p+ resolution and automatic keystone correction.", pros: ["Android TV built-in", "Auto-keystone", "Compact"], cons: ["Not true 4K", "Limited throw ratio"], link: "https://www.mi.com/in/", aiBadges: ["Budget Pick"] },

  // ── RAM ───────────────────────────────────────────────────────────────────
  { name: "G.Skill Trident Z5 RGB DDR5-6400 32GB", category: "RAM", price: "₹14,500 – ₹18,000", priceMin: 14500, priceMax: 18000, description: "DDR5-6400 with XMP 3.0 — the fastest mainstream DDR5 kit for Intel and AMD platforms.", pros: ["DDR5-6400 speed", "XMP 3.0", "RGB per stick"], cons: ["Needs DDR5 board", "Price premium"], link: "https://www.gskill.com/product/165/390/1676530264/F5-6400J3239G16GA2-TZ5RK", badge: "Best DDR5", aiBadges: ["Performance Pick"] },
  { name: "Corsair Vengeance DDR5-5600 32GB", category: "RAM", price: "₹10,500 – ₹13,500", priceMin: 10500, priceMax: 13500, description: "Reliable DDR5 with proven XMP profiles — the dependable choice for new platform builds.", pros: ["Reliable XMP profile", "Low-profile option", "Intel XMP 3.0"], cons: ["No per-key RGB", "Slightly slower than G.Skill"], link: "https://www.corsair.com/in/en/c/ddr5", aiBadges: ["Best Value"] },
  { name: "Kingston Fury Beast DDR4-3200 16GB", category: "RAM", price: "₹3,800 – ₹5,200", priceMin: 3800, priceMax: 5200, description: "Budget DDR4 that just works — reliable and widely compatible with any DDR4 motherboard.", pros: ["Great budget DDR4", "Runs cool", "Wide compatibility"], cons: ["DDR4 generation", "No RGB"], link: "https://www.kingston.com/in/memory/gaming/kingston-fury-beast-ddr4-memory", badge: "Best Budget RAM", aiBadges: ["Budget Pick"] },
  { name: "G.Skill Ripjaws V DDR4-3600 32GB", category: "RAM", price: "₹7,500 – ₹10,000", priceMin: 7500, priceMax: 10000, description: "Proven DDR4 kit with excellent compatibility — ideal for budget AM4 and LGA1700 builds.", pros: ["Proven DDR4 kit", "Reliable XMP", "Good thermals"], cons: ["No RGB", "DDR4 generation"], link: "https://www.gskill.com/category/165/170/DDR4" },

  // ── STORAGE ───────────────────────────────────────────────────────────────
  { name: "Samsung 990 Pro 2TB NVMe", category: "Storage", price: "₹13,500 – ₹17,000", priceMin: 13500, priceMax: 17000, description: "7450 MB/s read speed with excellent endurance — the go-to Gen4 NVMe for builds and PS5.", pros: ["7450 MB/s read", "Excellent endurance", "PCIe 4.0"], cons: ["Pricey per GB", "Gen4 not Gen5"], link: "https://www.samsung.com/in/memory-storage/nvme-ssd/", badge: "Best SSD", aiBadges: ["AI Recommended"] },
  { name: "WD Black SN850X 2TB", category: "Storage", price: "₹12,000 – ₹16,000", priceMin: 12000, priceMax: 16000, description: "7300 MB/s read with PCIe Gen4 — PlayStation 5 compatible with optional heatsink model.", pros: ["7300 MB/s read", "PCIe Gen4", "PlayStation 5 compatible"], cons: ["Runs warm", "Heatsink needed for PS5"], link: "https://www.westerndigital.com/products/internal-drives/wd-black-sn850x-nvme-ssd" },
  { name: "Crucial T700 2TB PCIe Gen5", category: "Storage", price: "₹16,000 – ₹20,000", priceMin: 16000, priceMax: 20000, description: "World's fastest consumer SSD at 12,400 MB/s — for builds with a PCIe 5.0 M.2 slot.", pros: ["12,400 MB/s peak!", "PCIe 5.0", "Heatsink model available"], cons: ["Very hot", "Needs PCIe 5.0 slot"], link: "https://www.crucial.com/ssd/t700", aiBadges: ["Performance Pick"] },
  { name: "Seagate BarraCuda 4TB HDD", category: "Storage", price: "₹6,500 – ₹8,500", priceMin: 6500, priceMax: 8500, description: "Reliable 4TB spinning disk — ideal for bulk storage, media libraries and backups.", pros: ["4TB for under ₹8500", "Reliable 5400rpm", "CMR writing"], cons: ["Slow read speed", "Spinning disk"], link: "https://www.seagate.com/in/en/hard-drives/barracuda/", aiBadges: ["Budget Pick"] },
  { name: "Samsung T7 Shield Portable SSD 2TB", category: "Storage", price: "₹12,000 – ₹16,000", priceMin: 12000, priceMax: 16000, description: "IP65-rated portable SSD with USB 3.2 Gen2 — rugged on-the-go storage for professionals.", pros: ["IP65 rugged", "USB 3.2 Gen2 1050 MB/s", "Compact"], cons: ["Not NVMe speeds", "Pricey vs USB HDD"], link: "https://www.samsung.com/in/memory-storage/portable-ssd/" },

  // ── KEYBOARDS ────────────────────────────────────────────────────────────
  { name: "Logitech MX Keys S", category: "Keyboards", price: "₹8,400 – ₹11,000", priceMin: 8400, priceMax: 11000, description: "The definitive productivity keyboard — perfectly quiet, precise typing with multi-device sync.", pros: ["Quiet typing", "Multi-device sync", "Great battery"], cons: ["Not for gaming", "Low travel"], link: "https://www.logitech.com/en-in/products/keyboards/mx-keys-s.html", aiBadges: ["Editor's Choice"] },
  { name: "Keychron Q6 Pro", category: "Keyboards", price: "₹14,000 – ₹18,000", priceMin: 14000, priceMax: 18000, description: "Full aluminum wireless mechanical keyboard with QMK/VIA — the enthusiast's endgame.", pros: ["Full aluminum", "QMK/VIA", "Wireless 3-device"], cons: ["Heavy 2.1 kg", "Pricey"], link: "https://www.keychron.com/products/keychron-q6-pro-qmk-via-wireless-custom-mechanical-keyboard", badge: "Premium Pick", aiBadges: ["Performance Pick"] },
  { name: "Keychron K8 Pro", category: "Keyboards", price: "₹7,000 – ₹9,500", priceMin: 7000, priceMax: 9500, description: "Hot-swappable wireless TKL with QMK support — an excellent entry into the mechanical keyboard hobby.", pros: ["QMK/VIA support", "Hot-swappable", "Build quality"], cons: ["Thick profile", "Bluetooth latency"], link: "https://www.keychron.com/products/keychron-k8-pro-qmk-via-wireless-mechanical-keyboard", aiBadges: ["Best Value", "AI Recommended"] },
  { name: "ASUS ROG Strix Scope II RX", category: "Keyboards", price: "₹7,500 – ₹10,500", priceMin: 7500, priceMax: 10500, description: "Optical switches for zero debounce delay — serious gaming performance with per-key RGB.", pros: ["ROG RX optical switches", "Media controls", "Solid build"], cons: ["Heavy for travel", "Software-heavy RGB"], link: "https://rog.asus.com/in/keyboards/" },
  { name: "Razer BlackWidow V4 Pro", category: "Keyboards", price: "₹13,000 – ₹17,000", priceMin: 13000, priceMax: 17000, description: "Wireless gaming flagship with magnetic wrist rest and macro dial — ultimate streaming setup keyboard.", pros: ["Wireless gaming", "Magnetic wrist rest", "Macro dials"], cons: ["Expensive", "Large footprint"], link: "https://www.razer.com/gaming-keyboards" },

  // ── MOUSE ────────────────────────────────────────────────────────────────
  { name: "Logitech G Pro X Superlight 2", category: "Mouse", price: "₹10,500 – ₹14,000", priceMin: 10500, priceMax: 14000, description: "60g ultra-light wireless mouse used by esports pros — the gold standard for competitive gaming.", pros: ["60g ultra-light", "HERO 2 sensor", "USB-C charging"], cons: ["Expensive", "No Bluetooth"], link: "https://www.logitechg.com/en-in/products/gaming-mice/pro-x2-superlight-wireless.html", badge: "Esports Standard", aiBadges: ["AI Recommended", "Performance Pick"] },
  { name: "Razer DeathAdder V3 HyperSpeed", category: "Mouse", price: "₹5,200 – ₹7,500", priceMin: 5200, priceMax: 7500, description: "Ergonomic gaming mouse with HyperSpeed 2.4GHz wireless — the classic shape refined.", pros: ["Ergonomic shape", "2.4GHz wireless", "Lightweight"], cons: ["AA battery", "Right-hand only"], link: "https://www.razer.com/gaming-mice", aiBadges: ["Best Value"] },
  { name: "Logitech MX Master 3S", category: "Mouse", price: "₹8,000 – ₹10,500", priceMin: 8000, priceMax: 10500, description: "The productivity mouse benchmark — MagSpeed scroll, 7 buttons and exceptional multi-device support.", pros: ["MagSpeed scroll", "7 buttons", "Multi-device"], cons: ["Heavy 141g", "Not for gaming"], link: "https://www.logitech.com/en-in/products/mice/mx-master-3s.html", aiBadges: ["Editor's Choice"] },
  { name: "Pulsar X2H Mini", category: "Mouse", price: "₹6,500 – ₹8,500", priceMin: 6500, priceMax: 8500, description: "52g symmetric gaming mouse for small to medium grip — excellent sensor and value.", pros: ["52g super light", "Symmetrical", "XLOX optical switch"], cons: ["No Bluetooth", "Smaller grip"] , link: "https://www.pulsargg.com/" },
  { name: "Apple Magic Mouse", category: "Mouse", price: "₹7,500 – ₹9,000", priceMin: 7500, priceMax: 9000, description: "Multi-touch wireless mouse designed for macOS — gestures and scrolling are uniquely fluid.", pros: ["Multi-touch surface", "Wireless Bluetooth", "Slim design"], cons: ["Charges from bottom", "No ergonomic"], link: "https://www.apple.com/in/shop/product/MXK53HN/A/magic-mouse" },

  // ── HEADPHONES ───────────────────────────────────────────────────────────
  { name: "Sony WH-1000XM5", category: "Headphones", price: "₹24,000 – ₹32,000", priceMin: 24000, priceMax: 32000, description: "Industry-leading ANC with exceptional call quality and 30-hour battery life.", pros: ["Best-in-class ANC", "30-hr battery", "Multipoint connect"], cons: ["Can't fold flat", "Bass-forward tuning"], link: "https://www.sony.co.in/en/articles/wh-1000xm5", badge: "Best ANC", aiBadges: ["AI Recommended"] },
  { name: "Apple AirPods Max (USB-C)", category: "Headphones", price: "₹54,900 – ₹62,000", priceMin: 54900, priceMax: 62000, description: "Premium over-ear with Adaptive Transparency and Spatial Audio — built for the Apple ecosystem.", pros: ["Spatial Audio", "Adaptive Transparency", "Premium build"], cons: ["Expensive", "Apple-only features", "No carry case"], link: "https://www.apple.com/in/shop/buy-airpods/airpods-max", aiBadges: ["Performance Pick"] },
  { name: "SteelSeries Arctis Nova Pro Wireless", category: "Headphones", price: "₹19,500 – ₹25,000", priceMin: 19500, priceMax: 25000, description: "Gaming headset with hot-swap battery and hi-fi sound quality that rivals audiophile headphones.", pros: ["Hot-swap battery", "Hi-Fi DAC", "Multi-platform"], cons: ["Base station required", "Pricey"], link: "https://www.steelseries.com/gaming-headsets/arctis-nova-pro-wireless", aiBadges: ["Editor's Choice"] },
  { name: "Sennheiser HD 560S", category: "Headphones", price: "₹8,500 – ₹12,000", priceMin: 8500, priceMax: 12000, description: "Open-back audiophile headphone with exceptionally accurate and natural sound reproduction.", pros: ["Neutral sound signature", "Open-back soundstage", "Comfortable"], cons: ["Leaks sound", "Needs amp for best performance"], link: "https://www.sennheiser.com/en-in/catalog/products/headphones/hd-560s/", aiBadges: ["Best Value"] },

  // ── EARBUDS ───────────────────────────────────────────────────────────────
  { name: "Apple AirPods Pro 2 (USB-C)", category: "Earbuds", price: "₹20,900 – ₹26,000", priceMin: 20900, priceMax: 26000, description: "Best-in-class ANC TWS with Adaptive Audio and Conversation Awareness — the benchmark.", pros: ["Best ANC TWS", "Adaptive Audio", "Spatial Audio"], cons: ["Apple ecosystem", "Stem design divides opinion"], link: "https://www.apple.com/in/shop/buy-airpods/airpods-pro", badge: "Best TWS", aiBadges: ["AI Recommended"] },
  { name: "Sony WF-1000XM5", category: "Earbuds", price: "₹17,500 – ₹22,000", priceMin: 17500, priceMax: 22000, description: "Smallest Sony ANC earbuds ever with world-class noise cancellation on Android.", pros: ["Excellent ANC", "Small size", "Hi-Res audio"], cons: ["Small case", "Average call quality"], link: "https://www.sony.co.in/en/articles/wf-1000xm5", aiBadges: ["Best Value"] },
  { name: "Samsung Galaxy Buds3 Pro", category: "Earbuds", price: "₹14,000 – ₹18,000", priceMin: 14000, priceMax: 18000, description: "Premium Galaxy AI-enhanced earbuds with adaptive EQ and seamless Samsung ecosystem integration.", pros: ["Galaxy AI features", "Adaptive EQ", "IP57 rated"], cons: ["Best with Samsung phones", "Average battery life"], link: "https://www.samsung.com/in/audio-sound/galaxy-buds/" },
  { name: "Nothing Ear (2)", category: "Earbuds", price: "₹8,999 – ₹12,000", priceMin: 8999, priceMax: 12000, description: "Unique transparent design with Hi-Res audio certification and dual-driver sound.", pros: ["Distinctive transparent design", "Hi-Res certified", "Good value ANC"], cons: ["App required for full features", "Fit not for all"], link: "https://in.nothing.tech/pages/ear", aiBadges: ["Budget Pick"] },

  // ── SPEAKERS ─────────────────────────────────────────────────────────────
  { name: "Sonos Era 100", category: "Speakers", price: "₹28,000 – ₹35,000", priceMin: 28000, priceMax: 35000, description: "Premium smart speaker with spatial audio and seamless multi-room stereo pairing.", pros: ["Spatial audio", "Multi-room stereo", "USB-C line-in"], cons: ["Subscription for some features", "No AUX in base"], link: "https://www.sonos.com/en-in/shop/era-100", badge: "Best Smart Speaker", aiBadges: ["AI Recommended"] },
  { name: "JBL Charge 5", category: "Speakers", price: "₹12,000 – ₹15,500", priceMin: 12000, priceMax: 15500, description: "IP67 waterproof portable speaker with phone-charging capability and powerful 30W output.", pros: ["IP67 waterproof", "Can charge phone", "20-hr battery"], cons: ["No 3.5mm jack", "Midrange slightly recessed"], link: "https://in.jbl.com/bluetooth-speakers/?start=0&sz=12" },
  { name: "Bose SoundLink Flex", category: "Speakers", price: "₹10,500 – ₹14,000", priceMin: 10500, priceMax: 14000, description: "Rugged portable speaker with PositionIQ technology that optimises sound for any orientation.", pros: ["PositionIQ tech", "IP67 rated", "Balanced sound"], cons: ["No multi-speaker stereo on older firmware", "Average battery"], link: "https://www.bose.com/en_in/products/speakers/portable_speakers/", aiBadges: ["Best Value"] },
  { name: "Creative Pebble X Plus", category: "Speakers", price: "₹2,499 – ₹3,500", priceMin: 2499, priceMax: 3500, description: "Budget desktop speakers with USB-C power and surprisingly full sound for the price.", pros: ["Very affordable", "USB-C powered", "Compact"], cons: ["Limited bass", "Not portable"], link: "https://in.creative.com/p/speakers", aiBadges: ["Budget Pick"] },

  // ── MICROPHONES ───────────────────────────────────────────────────────────
  { name: "Shure MV7+", category: "Microphones", price: "₹16,000 – ₹21,000", priceMin: 16000, priceMax: 21000, description: "Hybrid USB+XLR microphone with on-mic controls and built-in LED meter — podcaster favourite.", pros: ["USB + XLR dual output", "On-mic mute & gain", "Shure quality"], cons: ["No headphone monitoring over XLR", "Cardioid only"], link: "https://www.shure.com/en-IN/microphones/mv", badge: "Best Podcast Mic", aiBadges: ["AI Recommended"] },
  { name: "Blue Yeti X", category: "Microphones", price: "₹12,000 – ₹16,000", priceMin: 12000, priceMax: 16000, description: "Versatile USB condenser with four polar patterns and LED level metering — a streaming staple.", pros: ["Four polar patterns", "LED metering", "Solid build"], cons: ["Large footprint", "Picks up room noise"], link: "https://www.logitechg.com/en-in/products/streaming-gear/yeti-x-professional-microphone.988-000218.html", aiBadges: ["Editor's Choice"] },
  { name: "Rode NT-USB+", category: "Microphones", price: "₹14,000 – ₹18,000", priceMin: 14000, priceMax: 18000, description: "Studio-quality USB condenser with built-in headphone monitoring at zero latency.", pros: ["Zero-latency monitoring", "32-bit float recording", "Premium capsule"], cons: ["Cardioid only", "Needs boom arm"], link: "https://rode.com/en-in/microphones/usb/nt-usb-plus", aiBadges: ["Performance Pick"] },
  { name: "Maono PD200X", category: "Microphones", price: "₹5,500 – ₹8,000", priceMin: 5500, priceMax: 8000, description: "Budget hybrid USB+XLR dynamic mic — punches way above its price point for streaming.", pros: ["Hybrid USB+XLR", "Dynamic capsule", "Affordable"], cons: ["Average accessories", "Plastic feel"], link: "https://www.maono.com/", aiBadges: ["Budget Pick"] },

  // ── WEBCAMS ───────────────────────────────────────────────────────────────
  { name: "Logitech Brio 4K Pro", category: "Webcams", price: "₹12,000 – ₹15,500", priceMin: 12000, priceMax: 15500, description: "4K 30fps webcam with HDR and wide 90° FOV — the gold standard for professional video calls.", pros: ["4K 30fps / 1080p 60fps", "HDR support", "Wide FOV"], cons: ["Big file sizes at 4K", "Pricey"], link: "https://www.logitech.com/en-in/products/webcams/brio-4k-pro-webcam.html", badge: "Best 4K Webcam", aiBadges: ["AI Recommended"] },
  { name: "Razer Kiyo Pro Ultra", category: "Webcams", price: "₹15,000 – ₹20,000", priceMin: 15000, priceMax: 20000, description: "4K Sony STARVIS 2 sensor optimised for low-light streaming — best for dark rooms.", pros: ["Sony STARVIS 2 sensor", "Excellent low-light", "4K@30fps"], cons: ["Expensive", "Software needs improvement"], link: "https://www.razer.com/streaming-cameras", aiBadges: ["Performance Pick"] },
  { name: "Microsoft Modern Webcam", category: "Webcams", price: "₹6,000 – ₹9,000", priceMin: 6000, priceMax: 9000, description: "1080p webcam with HDR and Teams/Zoom certified — plug-and-play simplicity for office use.", pros: ["Teams certified", "HDR", "Compact"], cons: ["1080p only", "No 60fps"], link: "https://www.microsoft.com/en-in/", aiBadges: ["Best Value"] },
  { name: "Anker PowerConf C300", category: "Webcams", price: "₹4,500 – ₹6,500", priceMin: 4500, priceMax: 6500, description: "Budget-friendly 1080p webcam with AI framing and noise cancellation built-in.", pros: ["AI framing", "Affordable", "Good for calls"], cons: ["Average low-light", "AI can be janky"], link: "https://www.anker.com/collections/webcams", aiBadges: ["Budget Pick"] },

  // ── CAPTURE CARDS ────────────────────────────────────────────────────────
  { name: "Elgato 4K X", category: "Capture Cards", price: "₹18,000 – ₹24,000", priceMin: 18000, priceMax: 24000, description: "4K60 HDR10+ capture with VRR passthrough — the new benchmark for console streaming capture.", pros: ["4K60 HDR10+", "VRR passthrough", "USB 3.0"], cons: ["Expensive", "PC needs to be strong"], link: "https://www.elgato.com/en/capture-card/4k-x", badge: "Best Capture Card", aiBadges: ["AI Recommended"] },
  { name: "AVerMedia Live Gamer 4K (GC553)", category: "Capture Cards", price: "₹15,000 – ₹20,000", priceMin: 15000, priceMax: 20000, description: "Internal PCIe capture card with 4K30 or 1080p240 capture and ultra-low latency.", pros: ["PCIe internal", "1080p 240fps", "Hardware encode"], cons: ["Needs free PCIe slot", "Internal installation"], link: "https://www.avermedia.com/in/capturecard/gc553", aiBadges: ["Performance Pick"] },
  { name: "Elgato HD60 X", category: "Capture Cards", price: "₹9,500 – ₹13,000", priceMin: 9500, priceMax: 13000, description: "1080p60 HDR capture card — easy USB setup for beginners starting their streaming journey.", pros: ["Easy USB setup", "1080p60 HDR", "Instant Gameview low latency"], cons: ["No 4K capture", "Software can lag"], link: "https://www.elgato.com/en/capture-card/hd60-x", aiBadges: ["Best Value", "Budget Pick"] },

  // ── STREAMING EQUIPMENT ───────────────────────────────────────────────────
  { name: "Elgato Stream Deck MK.2", category: "Streaming Equipment", price: "₹11,500 – ₹14,000", priceMin: 11500, priceMax: 14000, description: "15 LCD keys that transform your streaming workflow — control OBS, Spotify and more at a touch.", pros: ["15 LCD keys", "Deep integrations", "Plugin ecosystem"], cons: ["Software subscription for some plugins", "Bulky on desk"], link: "https://www.elgato.com/en/stream-deck-mk2", badge: "Streamer Essential", aiBadges: ["AI Recommended"] },
  { name: "Elgato Stream Deck +", category: "Streaming Equipment", price: "₹16,000 – ₹21,000", priceMin: 16000, priceMax: 21000, description: "Stream Deck with touch screen strip and analog dials — perfect for audio mixing and scene transitions.", pros: ["Touch strip + dials", "Audio mixing integration", "Compact"], cons: ["Fewer keys than MK.2", "Pricey"], link: "https://www.elgato.com/en/stream-deck-plus", aiBadges: ["Performance Pick"] },
  { name: "Rode RødeCaster Duo", category: "Streaming Equipment", price: "₹28,000 – ₹38,000", priceMin: 28000, priceMax: 38000, description: "Dual-mic podcast mixer with built-in APHEX processing and wireless support.", pros: ["2 XLR inputs", "APHEX processing", "Wireless connect"], cons: ["Expensive", "Learning curve"], link: "https://rode.com/en-in/interfaces-and-mixers/rodecaster-series/" },

  // ── NETWORKING ────────────────────────────────────────────────────────────
  { name: "TP-Link Archer BE800 Wi-Fi 7", category: "Networking", price: "₹28,000 – ₹36,000", priceMin: 28000, priceMax: 36000, description: "First Wi-Fi 7 tri-band router with 10GbE WAN — the future of home networking.", pros: ["Wi-Fi 7 19Gbps", "10GbE WAN port", "Tri-band"], cons: ["Expensive", "Wi-Fi 7 devices needed"], link: "https://www.tp-link.com/in/home-networking/wifi-router/archer-be800/", badge: "Wi-Fi 7", aiBadges: ["Future Proof", "Performance Pick"] },
  { name: "TP-Link Archer AX55 Wi-Fi 6", category: "Networking", price: "₹5,500 – ₹7,500", priceMin: 5500, priceMax: 7500, description: "Wi-Fi 6 AX3000 router with easy app setup and great range for apartments.", pros: ["Wi-Fi 6 AX3000", "Easy app setup", "Good range"], cons: ["Some features need sub", "Gets warm"], link: "https://www.tp-link.com/in/home-networking/wifi-router/archer-ax55/", aiBadges: ["Best Value"] },
  { name: "ASUS ZenWiFi Pro ET12 Mesh", category: "Networking", price: "₹28,000 – ₹40,000", priceMin: 28000, priceMax: 40000, description: "Tri-band mesh with 10GbE backhaul — eliminates dead zones in large homes and offices.", pros: ["Tri-band mesh", "10GbE backhaul", "2-pack"], cons: ["Very expensive", "Large units"], link: "https://www.asus.com/in/networking-iot-servers/whole-home-mesh-wifi-system/zenwifi-pro-series/", aiBadges: ["AI Recommended"] },
  { name: "Ubiquiti UniFi U6 Pro", category: "Networking", price: "₹18,000 – ₹24,000", priceMin: 18000, priceMax: 24000, description: "Enterprise-grade ceiling-mount Wi-Fi 6 AP — for those who demand the best coverage.", pros: ["Enterprise Wi-Fi 6", "Ceiling mount", "UniFi controller"], cons: ["Needs PoE switch", "Complex setup"], link: "https://store.ui.com/us/en/products/u6-pro" },

  // ── DOCKING STATIONS ─────────────────────────────────────────────────────
  { name: "CalDigit TS4 Thunderbolt 4 Dock", category: "Docking Stations", price: "₹28,000 – ₹38,000", priceMin: 28000, priceMax: 38000, description: "18-port Thunderbolt 4 dock with 98W host charging and dual 4K display support.", pros: ["18 ports!", "98W host charging", "Dual 4K"], cons: ["Huge footprint", "Very expensive"], link: "https://www.caldigit.com/thunderbolt-station-4/", badge: "Best Dock", aiBadges: ["AI Recommended", "Performance Pick"] },
  { name: "Anker 575 USB-C Dock 13-in-1", category: "Docking Stations", price: "₹7,500 – ₹10,500", priceMin: 7500, priceMax: 10500, description: "13-in-1 USB-C dock with 85W charging and dual HDMI — excellent value for Windows laptops.", pros: ["USB-C input", "85W charging", "Dual HDMI"], cons: ["No Thunderbolt", "Warm under load"], link: "https://www.anker.com/collections/hubs-and-docks", aiBadges: ["Best Value"] },
  { name: "Dell WD22TB4 Thunderbolt Dock", category: "Docking Stations", price: "₹22,000 – ₹30,000", priceMin: 22000, priceMax: 30000, description: "130W charging and Thunderbolt 4 bandwidth — designed for Dell laptops but works with any TB4 laptop.", pros: ["130W charging", "TB4 bandwidth", "Lock slot"], cons: ["Bulky", "Expensive"], link: "https://www.dell.com/en-in/shop/accessories" },

  // ── COOLING ───────────────────────────────────────────────────────────────
  { name: "Noctua NH-D15 G2", category: "Cooling", price: "₹9,500 – ₹13,000", priceMin: 9500, priceMax: 13000, description: "The definitive high-end air cooler — dual-tower silence champion with 7-year warranty.", pros: ["Dual-tower silence king", "Top air cooling", "7yr warranty"], cons: ["Huge size", "RAM clearance issues"], link: "https://noctua.at/en/nh-d15-g2", badge: "Best Air Cooler", aiBadges: ["AI Recommended"] },
  { name: "Corsair iCUE H150i Elite LCD", category: "Cooling", price: "₹13,500 – ₹18,000", priceMin: 13500, priceMax: 18000, description: "360mm AIO with LCD pump head display and three RGB fans for premium system builds.", pros: ["360mm AIO", "LCD pump head", "RGB fans"], cons: ["LCD complex setup", "Pricey"], link: "https://www.corsair.com/in/en/c/liquid-cpu-coolers", aiBadges: ["Performance Pick"] },
  { name: "Thermalright Phantom Spirit 120 SE", category: "Cooling", price: "₹2,800 – ₹4,200", priceMin: 2800, priceMax: 4200, description: "Incredible value air cooler — rivals coolers three times its price in performance.", pros: ["Incredible value", "Quiet", "Strong performance"], cons: ["No RGB", "Basic clips"], link: "https://www.thermalright.com/products/cpu-cooler/", badge: "Best Budget Cooler", aiBadges: ["Budget Pick"] },
  { name: "be quiet! Dark Rock Pro 5", category: "Cooling", price: "₹7,500 – ₹10,000", priceMin: 7500, priceMax: 10000, description: "Premium near-silent dual-tower cooler with luxurious finish — performance and aesthetics combined.", pros: ["Near-silent operation", "Dual-tower", "Premium finish"], cons: ["Huge size", "No RGB"], link: "https://www.bequiet.com/en/cpucooler/", aiBadges: ["Editor's Choice"] },

  // ── CASES ────────────────────────────────────────────────────────────────
  { name: "Fractal Design North XL", category: "Cases", price: "₹11,500 – ₹15,000", priceMin: 11500, priceMax: 15000, description: "Award-winning wood front panel full tower — natural aesthetic with excellent airflow.", pros: ["Wood front panel", "E-ATX support", "Excellent airflow"], cons: ["Large footprint", "Wood can scratch"], link: "https://www.fractal-design.com/products/cases/north/north-xl/", badge: "Best Full Tower", aiBadges: ["Editor's Choice"] },
  { name: "Lian Li PC-O11 Dynamic EVO", category: "Cases", price: "₹9,500 – ₹13,000", priceMin: 9500, priceMax: 13000, description: "Dual-chamber layout for custom water cooling — the canvas for showpiece builds.", pros: ["Versatile layout", "Dual chamber", "Great for custom loop"], cons: ["No front USB-C on base", "Needs many fans"], link: "https://lian-li.com/product/pc-o11-dynamic-evo/", aiBadges: ["Performance Pick"] },
  { name: "Corsair 4000D Airflow", category: "Cases", price: "₹7,200 – ₹9,500", priceMin: 7200, priceMax: 9500, description: "Best-selling mid-tower with mesh front panel for optimal airflow at a fair price.", pros: ["Excellent mesh airflow", "ATX mid tower", "Clean cable management"], cons: ["No tempered glass front", "Basic side panel latch"], link: "https://www.corsair.com/in/en/p/pc-cases", aiBadges: ["Best Value", "AI Recommended"] },
  { name: "NZXT H9 Flow", category: "Cases", price: "₹14,000 – ₹18,000", priceMin: 14000, priceMax: 18000, description: "Panoramic all-glass dual-chamber case — stunning aesthetics with excellent airflow.", pros: ["All-glass panoramic", "Dual chamber", "Excellent airflow"], cons: ["Expensive", "Large size"], link: "https://nzxt.com/product/h9-flow" },

  // ── SMARTPHONES ───────────────────────────────────────────────────────────
  { name: "Apple iPhone 16 Pro Max", category: "Smartphones", price: "₹1,34,900 – ₹1,74,900", priceMin: 134900, priceMax: 174900, description: "A18 Pro chip with Camera Control button and 5x periscope zoom — Apple's best iPhone ever.", pros: ["A18 Pro chip", "Camera Control", "Titanium build"], cons: ["Very expensive", "iOS only", "USB 2.0 speed"], link: "https://www.apple.com/in/shop/buy-iphone/iphone-16-pro", badge: "Flagship", aiBadges: ["Performance Pick", "AI Recommended"] },
  { name: "Samsung Galaxy S25 Ultra", category: "Smartphones", price: "₹1,29,999 – ₹1,69,999", priceMin: 129999, priceMax: 169999, description: "Galaxy AI integration and built-in titanium S Pen make this Android's ultimate productivity device.", pros: ["Built-in S Pen", "Galaxy AI", "200MP camera"], cons: ["Expensive", "Android ecosystem", "Large size"], link: "https://www.samsung.com/in/smartphones/galaxy-s/", aiBadges: ["Editor's Choice"] },
  { name: "OnePlus 13", category: "Smartphones", price: "₹69,999 – ₹89,999", priceMin: 69999, priceMax: 89999, description: "Snapdragon 8 Elite and 100W charging at a price well below Samsung/Apple flagships.", pros: ["100W charging", "Snapdragon 8 Elite", "Clean OxygenOS"], cons: ["Camera lags S25/iPhone", "No IP68 wireless charging"], link: "https://www.oneplus.com/in/13", aiBadges: ["Best Value"] },
  { name: "Google Pixel 9 Pro", category: "Smartphones", price: "₹99,999 – ₹1,29,999", priceMin: 99999, priceMax: 129999, description: "Google's Tensor G4 AI smarts with best-in-class computational photography.", pros: ["Best AI camera features", "7yr OS updates", "Call Screen"], cons: ["Tensor thermals", "Expensive"], link: "https://store.google.com/in/product/pixel_9_pro", aiBadges: ["Future Proof"] },
  { name: "Realme GT 7 Pro", category: "Smartphones", price: "₹35,999 – ₹45,999", priceMin: 35999, priceMax: 45999, description: "Snapdragon 8 Elite at mid-premium pricing — the performance flagship for budget enthusiasts.", pros: ["Snapdragon 8 Elite", "IP69 rating", "Value flagship"], cons: ["Camera average", "Realme UI"], link: "https://www.realme.com/in/", aiBadges: ["Budget Pick"] },

  // ── TABLETS ───────────────────────────────────────────────────────────────
  { name: "Apple iPad Pro M4 13\"", category: "Tablets", price: "₹1,08,900 – ₹1,59,900", priceMin: 108900, priceMax: 159900, description: "Ultra Retina XDR OLED and M4 chip in a 5.1mm body — the most capable tablet ever made.", pros: ["M4 chip", "Ultra Retina OLED", "5.1mm thin"], cons: ["Very expensive", "iPadOS limits", "No USB-A"], link: "https://www.apple.com/in/shop/buy-ipad/ipad-pro", badge: "Best Tablet", aiBadges: ["Performance Pick", "AI Recommended"] },
  { name: "Samsung Galaxy Tab S10+", category: "Tablets", price: "₹89,999 – ₹1,19,999", priceMin: 89999, priceMax: 119999, description: "12.4\" Dynamic AMOLED 2X with S Pen included and DeX desktop mode.", pros: ["Dynamic AMOLED 2X", "S Pen included", "DeX mode"], cons: ["Android tablet app gap", "Expensive"], link: "https://www.samsung.com/in/tablets/galaxy-tab-s/", aiBadges: ["Editor's Choice"] },
  { name: "Apple iPad Air M2 11\"", category: "Tablets", price: "₹59,900 – ₹89,900", priceMin: 59900, priceMax: 89900, description: "M2 chip at a more approachable price — the perfect creative companion with Apple Pencil Pro support.", pros: ["M2 chip", "Apple Pencil Pro", "Great value vs iPad Pro"], cons: ["No OLED", "Same design as before"], link: "https://www.apple.com/in/shop/buy-ipad/ipad-air", aiBadges: ["Best Value"] },
  { name: "Xiaomi Pad 7 Pro", category: "Tablets", price: "₹24,999 – ₹34,999", priceMin: 24999, priceMax: 34999, description: "144Hz LCD with Snapdragon 8s Gen 3 — exceptional performance at budget tablet pricing.", pros: ["144Hz display", "Snapdragon 8s Gen 3", "Budget price"], cons: ["MIUI ads", "Average app optimization"], link: "https://www.mi.com/in/tablets", aiBadges: ["Budget Pick"] },

  // ── SMARTWATCHES ──────────────────────────────────────────────────────────
  { name: "Apple Watch Ultra 2", category: "Smartwatches", price: "₹89,900 – ₹99,900", priceMin: 89900, priceMax: 99900, description: "Titanium adventure smartwatch with precision dual GPS and 60-hour battery — built for extremes.", pros: ["60-hr battery", "Precision dual GPS", "Titanium case"], cons: ["Very expensive", "Apple-only", "Large size"], link: "https://www.apple.com/in/shop/buy-watch/apple-watch-ultra", badge: "Best Smartwatch", aiBadges: ["Performance Pick"] },
  { name: "Samsung Galaxy Watch 7", category: "Smartwatches", price: "₹28,999 – ₹42,999", priceMin: 28999, priceMax: 42999, description: "Advanced BioActive sensor and Galaxy AI health insights — the best Android smartwatch.", pros: ["BioActive sensor", "Galaxy AI health", "Thin design"], cons: ["Short battery", "Best with Samsung phones"], link: "https://www.samsung.com/in/smartphones/galaxy-watch/", aiBadges: ["AI Recommended"] },
  { name: "Garmin Fenix 8 AMOLED", category: "Smartwatches", price: "₹65,000 – ₹85,000", priceMin: 65000, priceMax: 85000, description: "Adventure multisport GPS watch with AMOLED display and 29-day battery in smartwatch mode.", pros: ["29-day battery", "AMOLED display", "Multi-GNSS"], cons: ["Expensive", "Large for small wrists"], link: "https://www.garmin.com/en-IN/c/sports-fitness/wearables-smartwatches/", aiBadges: ["Editor's Choice", "Future Proof"] },
  { name: "Noise ColorFit Pro 6", category: "Smartwatches", price: "₹2,499 – ₹3,999", priceMin: 2499, priceMax: 3999, description: "Feature-packed budget smartwatch with AMOLED display and 100+ sports modes.", pros: ["AMOLED display", "100+ sport modes", "Budget price"], cons: ["Limited app ecosystem", "Average accuracy"], link: "https://www.gonoise.com/", aiBadges: ["Budget Pick"] },

  // ── POWER BANKS ───────────────────────────────────────────────────────────
  { name: "Anker Prime 27,650mAh 250W", category: "Power Banks", price: "₹9,500 – ₹13,000", priceMin: 9500, priceMax: 13000, description: "250W output charges laptops at full speed — the most powerful portable power bank for pros.", pros: ["250W output", "27,650mAh capacity", "Laptop charging"], cons: ["Expensive", "Heavy 641g"], link: "https://www.anker.com/collections/power-banks", badge: "Most Powerful", aiBadges: ["Performance Pick", "AI Recommended"] },
  { name: "Baseus Blade 100W 20,000mAh", category: "Power Banks", price: "₹4,500 – ₹6,500", priceMin: 4500, priceMax: 6500, description: "Flat and slim 100W laptop power bank that slides into your bag like a notebook.", pros: ["Flat slim design", "100W PD output", "Good value"], cons: ["Slower input", "No Qi wireless"], link: "https://www.baseus.com/", aiBadges: ["Best Value"] },
  { name: "Xiaomi 33W Power Bank 20,000mAh", category: "Power Banks", price: "₹2,200 – ₹3,500", priceMin: 2200, priceMax: 3500, description: "Reliable 20,000mAh at an extremely affordable price — two USB outputs plus USB-C.", pros: ["Great value", "Dual USB output", "Reliable quality"], cons: ["No laptop charging", "Slow 33W"], link: "https://www.mi.com/in/product/power-bank", aiBadges: ["Budget Pick"] },

  // ── CHARGERS ─────────────────────────────────────────────────────────────
  { name: "Anker 737 GaN Prime 120W", category: "Chargers", price: "₹6,000 – ₹8,500", priceMin: 6000, priceMax: 8500, description: "120W GaN charger with smart power distribution across three ports.", pros: ["120W GaN", "3 ports USB-A+C", "Compact"], cons: ["Heavy for size", "Premium price"], link: "https://www.anker.com/collections/chargers", badge: "Best GaN", aiBadges: ["AI Recommended"] },
  { name: "Apple 140W USB-C Power Adapter", category: "Chargers", price: "₹7,500 – ₹9,500", priceMin: 7500, priceMax: 9500, description: "Apple's fastest charger — required for MacBook Pro 16\" max charging speed.", pros: ["140W for MacBook Pro", "Official Apple", "Magsafe support"], cons: ["Expensive", "Only one port"], link: "https://www.apple.com/in/shop/product/MLYU3HN/A/140w-usb-c-power-adapter", aiBadges: ["Editor's Choice"] },
  { name: "Baseus 65W 3-Port GaN", category: "Chargers", price: "₹2,500 – ₹4,000", priceMin: 2500, priceMax: 4000, description: "Compact 65W GaN charger with three ports — charges laptop, phone and earbuds simultaneously.", pros: ["65W GaN compact", "3 ports", "Affordable"], cons: ["65W split between ports", "Gets warm"], link: "https://www.baseus.com/", aiBadges: ["Budget Pick", "Best Value"] },

  // ── GAMING CHAIRS ────────────────────────────────────────────────────────
  { name: "Secretlab Titan Evo 2022", category: "Gaming Chairs", price: "₹35,000 – ₹48,000", priceMin: 35000, priceMax: 48000, description: "Industry benchmark gaming chair with magnetic neck pillow and 4D armrests.", pros: ["4D armrests", "Magnetic neck pillow", "Cold-cure foam"], cons: ["Break-in period", "Assembly can be tricky"], link: "https://secretlab.eu/", badge: "Best Gaming Chair", aiBadges: ["AI Recommended"] },
  { name: "DXRacer Formula Series", category: "Gaming Chairs", price: "₹18,000 – ₹25,000", priceMin: 18000, priceMax: 25000, description: "The original gaming chair brand — reliable bucket-seat comfort for long sessions.", pros: ["Iconic design", "Good lumbar support", "Adjustable"], cons: ["Better options now exist", "Vinyl not fabric"], link: "https://www.dxracer.com/", aiBadges: ["Budget Pick"] },
  { name: "Herman Miller Aeron", category: "Gaming Chairs", price: "₹1,80,000 – ₹2,40,000", priceMin: 180000, priceMax: 240000, description: "The gold standard for ergonomics — designed with NASA-studied PostureFit SL lumbar support.", pros: ["Best lumbar support", "12-yr warranty", "Posturefit SL"], cons: ["Extremely expensive", "Not a gaming chair look"], link: "https://www.hermanmiller.com/", aiBadges: ["Performance Pick", "Future Proof"] },

  // ── ACCESSORIES ───────────────────────────────────────────────────────────
  { name: "HyperX QuadCast S", category: "Accessories", price: "₹10,500 – ₹14,000", priceMin: 10500, priceMax: 14000, description: "RGB streaming microphone with built-in shock mount and tap-to-mute.", pros: ["RGB glow", "Built-in shock mount", "Tap to mute"], cons: ["Can't turn off RGB easily", "Bulky"], link: "https://www.hyperxgaming.com/in/us/microphones" },
  { name: "Anker 737 GaN Prime 120W Hub", category: "Accessories", price: "₹6,000 – ₹8,500", priceMin: 6000, priceMax: 8500, description: "Versatile 3-port GaN charger hub for desk setups.", pros: ["120W GaN", "3 ports USB-A+C", "Compact"], cons: ["Heavy for size", "Premium price"], link: "https://www.anker.com/collections/chargers" },
  { name: "UGREEN Revodok Max 213", category: "Accessories", price: "₹8,000 – ₹11,000", priceMin: 8000, priceMax: 11000, description: "13-in-1 USB4 hub with 8K display out and 40Gbps bandwidth.", pros: ["13-in-1 hub", "USB4 40Gbps", "8K display out"], cons: ["Gets warm at max load", "Cable attached"], link: "https://www.ugreen.com/collections/usb-c-hubs" },
  { name: "Elgato Stream Deck MK.2", category: "Accessories", price: "₹11,500 – ₹14,000", priceMin: 11500, priceMax: 14000, description: "15 LCD macro keys for streamers, editors and power users.", pros: ["15 LCD keys", "Deep integrations", "Plugin ecosystem"], cons: ["Software subscription for some plugins", "Bulky on desk"], link: "https://www.elgato.com/en/stream-deck-mk2" },
];

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

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const shelfProducts = filtered.slice(0, 7);

  const loadMore = useCallback(() => setVisibleCount(prev => prev + PAGE_SIZE), []);

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
                        onClick={() => { setSortBy(o.value); setShowSortDropdown(false); }}
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
          <div className="overflow-x-auto pb-1 hide-scrollbar flex items-center gap-2">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProducts.map((product, i) => (
                <motion.div
                  key={product.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.4) }}
                  className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 flex flex-col hover:shadow-[0_0_24px_rgba(79,140,255,0.12)]"
                >
                  {/* Image area */}
                  <div className="h-44 bg-black/50 relative overflow-hidden flex items-center justify-center p-5">
                    <div className="w-full h-full border border-dashed border-white/10 rounded-lg flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
                      <span className="font-display font-bold text-white/20 text-base text-center px-3 leading-snug">{product.name}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20" />
                    <div className="absolute inset-0 z-0 opacity-20" style={{
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
