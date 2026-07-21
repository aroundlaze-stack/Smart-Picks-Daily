import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CockpitSwitch } from '../ui/CockpitSwitch';
import { trackNavigationClick } from '../../lib/tracking';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/ai-tech-finder', label: 'AI Tech Finder' },
  { href: '/blog', label: 'Blog' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/resources', label: 'Resources' },
  { href: '/computers', label: 'Computers' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-display font-bold text-background group-hover:shadow-[0_0_15px_rgba(79,140,255,0.6)] transition-shadow">
              SP
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
              Smart Picks <span className="text-primary">Daily</span>
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                location === link.href ||
                (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => trackNavigationClick(link.label, link.href)}
                  className={`text-sm font-medium transition-colors hover:text-primary relative py-1 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(79,140,255,0.8)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right-side controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* ✈ Cockpit theme switch */}
            <CockpitSwitch />

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/products"
                className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/50 hover:border-primary px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(79,140,255,0.5)]"
              >
                Start Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden relative z-50 p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-xl flex flex-col pt-24 pb-8 px-6"
          >
            <nav className="flex flex-col gap-4 overflow-y-auto flex-1">
              {navLinks.map((link, i) => {
                const isActive =
                  location === link.href ||
                  (link.href !== '/' && location.startsWith(link.href));
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => trackNavigationClick(link.label, link.href)}
                      className={`flex items-center justify-between text-2xl font-display font-bold py-4 border-b border-white/5 ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {link.label}
                      <ChevronRight
                        size={20}
                        className={
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground opacity-50'
                        }
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="mt-6 flex items-center gap-4"
            >
              {/* Cockpit switch in mobile menu footer too */}
              <CockpitSwitch />
              <Link
                href="/products"
                className="flex-1 flex items-center justify-center bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(79,140,255,0.3)]"
              >
                Start Exploring Tech
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
