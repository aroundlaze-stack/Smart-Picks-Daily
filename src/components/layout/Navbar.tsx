import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, LogIn, LogOut, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CockpitSwitch } from '../ui/CockpitSwitch';
import { Logo } from './Logo';
import { trackNavigationClick } from '../../lib/tracking';
import { useAuth } from '../../auth/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/resources', label: 'Tech Toolkit' },
  { href: '/ai-tech-finder', label: 'AI Finder' },
  { href: '/computers', label: 'Computers' },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

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
          <Logo />

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
                  className={`text-sm font-medium transition-colors duration-200 hover:text-primary relative py-1 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      style={{ boxShadow: '0 0 6px rgba(79,140,255,0.6)' }}
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

            {isAuthenticated ? (
              /* ── Authenticated: user display + logout ── */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                  <UserCircle2 size={15} />
                  <span className="max-w-[120px] truncate font-medium">{user?.displayName}</span>
                </div>
                <motion.button
                  onClick={logout}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  title="Sign out"
                  aria-label="Sign out"
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <LogOut size={16} />
                </motion.button>
              </div>
            ) : (
              /* ── Unauthenticated: login + explore ── */
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                  >
                    <LogIn size={15} />
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/products"
                    className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/50 hover:border-primary px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-[0_0_22px_rgba(79,140,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Explore
                  </Link>
                </motion.div>
              </div>
            )}
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
                      className={`flex items-center justify-between text-2xl font-display font-bold py-4 border-b border-white/5 transition-colors duration-200 ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Auth links in mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <UserCircle2 size={16} />
                      <span>{user?.displayName}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-sm font-medium"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-4">
                    <Link
                      href="/login"
                      className="text-xl font-display font-bold py-4 border-b border-white/5 text-foreground flex items-center gap-2"
                    >
                      <LogIn size={18} /> Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="text-xl font-display font-bold py-4 border-b border-white/5 text-primary flex items-center gap-2"
                    >
                      <UserCircle2 size={18} /> Create Account
                    </Link>
                  </div>
                )}
              </motion.div>
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
                className="flex-1 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(79,140,255,0.3)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explore Products
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
