import { Link } from 'wouter';
import { Twitter, Instagram, Youtube, Facebook, Mail } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/5 pt-16 pb-8 relative overflow-hidden" aria-label="Site footer">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/20 blur-[100px] pointer-events-none rounded-full" aria-hidden="true" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 w-max" aria-label="Smart Picks Daily — home">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-display font-bold text-background" aria-hidden="true">
                SP
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Smart Picks <span className="text-primary">Daily</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The cockpit of the internet's most obsessive tech buyers. We put every gadget through its paces so you don't have to guess.
            </p>
            <div className="flex items-center gap-4 pt-2" aria-label="Social media links">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label="Follow us on Instagram"
                rel="noopener noreferrer"
              >
                <Instagram size={20} aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label="Subscribe on YouTube"
                rel="noopener noreferrer"
              >
                <Youtube size={20} aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label="Follow us on Twitter / X"
                rel="noopener noreferrer"
              >
                <Twitter size={20} aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label="Follow us on Facebook"
                rel="noopener noreferrer"
              >
                <Facebook size={20} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <nav aria-label="Product categories">
            <h4 className="font-display font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=Keyboards" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Mechanical Keyboards</Link></li>
              <li><Link href="/products?category=Mice" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Gaming Mice</Link></li>
              <li><Link href="/products?category=Monitors" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">High-Refresh Monitors</Link></li>
              <li><Link href="/products?category=Headsets" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Wireless Audio</Link></li>
              <li><Link href="/products?category=SSDs" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Storage Solutions</Link></li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <h4 className="font-display font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">About Us</Link></li>
              <li><Link href="/reviews" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Editorial Process</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Buying Guides</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">Contact</Link></li>
              <li><Link href="/computers" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">PC Builds</Link></li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold mb-4">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">Get the latest tech reviews and deals in your inbox.</p>
            <form
              className="flex"
              onSubmit={e => e.preventDefault()}
              aria-label="Newsletter sign-up"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className="bg-white/5 border border-white/10 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 w-full"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-3 py-2 rounded-r-md flex items-center justify-center hover:bg-primary/90 transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <Mail size={16} aria-hidden="true" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {year} Smart Picks Daily. All rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:underline">Affiliate Disclosure</Link>
          </nav>
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground/50 text-center max-w-3xl mx-auto leading-relaxed">
          Smart Picks Daily is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. This helps us maintain our rigorous testing standards.
        </p>
      </div>
    </footer>
  );
}
