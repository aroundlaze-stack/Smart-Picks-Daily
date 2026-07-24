import { useState, useEffect } from 'react';
import { SEO } from '../components/seo';
import { WormholePortal } from '../components/3d/WormholePortal';
import { Mail, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [isMobile, setIsMobile] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  return (
    <>
      <SEO
        title="Contact Command"
        description="Open a channel with the Smart Picks Daily editorial team. Product suggestions, partnerships, and inquiries."
        url="/contact"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Smart Picks Daily',
          url: 'https://smartpicksdaily.com/contact',
          description: 'Open a channel with the Smart Picks Daily editorial team. Product suggestions, partnerships, and inquiries.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
              { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://smartpicksdaily.com/contact' }
            ]
          }
        }}
      />
      
      <div className="relative min-h-screen flex flex-col">
        {/* Full background 3D */}
        <div className="fixed inset-0 z-0">
          <WormholePortal isMobile={isMobile} />
        </div>
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 z-0 bg-background/80 md:bg-background/60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex-1 flex flex-col justify-center py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                COMMUNICATIONS OPEN
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-foreground">
                Open a Channel.
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-md">
                Reach through the void. Whether you have a product you want us to test, or want to partner on content, we read every transmission.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-card/80 p-4 rounded-xl border border-border backdrop-blur-md w-max">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                    <div className="font-bold text-foreground">24-48 Earth Hours</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-card/80 p-4 rounded-xl border border-border backdrop-blur-md w-max">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Direct Line</div>
                    <div className="font-bold text-foreground">contact@smartpicksdaily.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-card/90 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              {formStatus === 'sent' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">Transmission Received</h3>
                  <p className="text-muted-foreground">Your message has safely navigated the wormhole. We will respond shortly.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-8 text-primary hover:underline text-sm font-bold"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                      <input
                        id="contact-name"
                        required
                        type="text"
                        autoComplete="name"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                      <input
                        id="contact-email"
                        required
                        type="email"
                        autoComplete="email"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                    <select
                      id="contact-subject"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground appearance-none cursor-pointer"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="product">Product Suggestion</option>
                      <option value="advertising">Advertising / Sponsorship</option>
                      <option value="press">Press</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                      placeholder="Enter your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    aria-disabled={formStatus === 'sending'}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(79,140,255,0.3)] disabled:opacity-70 flex justify-center items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {formStatus === 'sending' ? (
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" aria-label="Sending…" />
                    ) : (
                      "Send Transmission"
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
