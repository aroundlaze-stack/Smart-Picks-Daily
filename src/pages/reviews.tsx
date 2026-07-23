import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { SEO } from '../components/seo';
import { ScanningLab } from '../components/3d/ScanningLab';
import { Star, Check, X, ArrowRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  trackReviewViewed,
  trackReadFullReview,
  trackComparisonViewDeal,
} from '../lib/tracking';
import { REVIEWS } from './reviews/data';

export default function Reviews() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <SEO
        title="Expert Reviews & Benchmarks"
        description="Rigorous, unbiased hardware reviews. We test the thermals, measure the latency, and tear down the marketing hype."
        url="/reviews"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Expert Tech Reviews & Benchmarks — Smart Picks Daily',
            url: 'https://smartpicksdaily.com/reviews',
            description: 'Rigorous, unbiased hardware reviews. We test the thermals, measure the latency, and tear down the marketing hype.',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
                { '@type': 'ListItem', position: 2, name: 'Reviews', item: 'https://smartpicksdaily.com/reviews' }
              ]
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Review',
            name: "MSI Katana 17 Review — Editor's Choice",
            reviewBody: "The mid-range king returns with an RTX 4070 that punches above its weight class. Consistently hits 100+ FPS at 1440p. Keyboard has excellent travel. Surprisingly quiet under full load. Battery life is abysmal under 3 hours.",
            datePublished: '2026-07-01',
            reviewRating: { '@type': 'Rating', ratingValue: 4.8, bestRating: 5 },
            author: { '@type': 'Organization', name: 'Smart Picks Daily' },
            itemReviewed: {
              '@type': 'Product',
              name: 'MSI Katana 17',
              category: 'Gaming Laptop',
              brand: { '@type': 'Brand', name: 'MSI' }
            }
          },
          ...REVIEWS.filter(r => !r.featured).map(r => ({
            '@context': 'https://schema.org',
            '@type': 'Review',
            name: r.title,
            reviewRating: { '@type': 'Rating', ratingValue: r.score, bestRating: 5 },
            datePublished: '2026-07-01',
            author: { '@type': 'Organization', name: 'Smart Picks Daily' },
            itemReviewed: { '@type': 'Product', name: r.title, category: r.category }
          }))
        ]}
      />
      
      {/* 3D Lab Header */}
      <section className="relative h-[60vh] md:h-[70vh] w-full border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <ScanningLab isMobile={isMobile} />
        </div>
        
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-transparent md:w-1/2" />
        
        <div className="absolute inset-0 z-20 container mx-auto px-4 md:px-6 flex items-center pointer-events-none">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              SCANNING LAB ACTIVE
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-xl">
              Tested to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Destruction.</span>
            </h1>
            <p className="text-lg text-muted-foreground drop-shadow-md bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-white/5">
              We don't just read spec sheets. We run thermals, measure input latency, and use the gear daily before rendering a verdict.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Deep Dive */}
      <section className="py-20 relative z-10 bg-black/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 bg-card border border-white/10 rounded-3xl overflow-hidden p-1">
            
            <div className="md:w-1/2 bg-black/50 rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-[0_0_20px_rgba(79,140,255,0.5)]">
                  <span className="font-display font-bold text-xl text-background">4.8</span>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider mb-4">
                <Award size={18} /> Editor's Choice
              </div>
              
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">MSI Katana 17 Review</h2>
              <p className="text-lg text-muted-foreground mb-8">The mid-range king returns with an RTX 4070 that punches above its weight class, though the display leaves some color accuracy to be desired.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">GPU</div>
                  <div className="font-bold">RTX 4070 8GB</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Display</div>
                  <div className="font-bold">17.3" 144Hz FHD</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">RAM</div>
                  <div className="font-bold">16GB DDR5</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Storage</div>
                  <div className="font-bold">1TB NVMe Gen4</div>
                </div>
              </div>
              
              <Link
                href="/reviews/msi-katana-17-review"
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold w-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Read the full MSI Katana 17 featured review"
                onClick={() => trackReadFullReview('MSI Katana 17')}
              >
                Read Full Review <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6">The Verdict</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-green-400 font-bold mb-3"><Check size={20} /> What we loved</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2"><span className="text-green-500 mt-1">•</span> Consistently hits 100+ FPS in modern titles at 1440p</li>
                    <li className="flex gap-2"><span className="text-green-500 mt-1">•</span> Keyboard has excellent travel for a laptop</li>
                    <li className="flex gap-2"><span className="text-green-500 mt-1">•</span> Surprisingly quiet under full load (42dB max)</li>
                  </ul>
                </div>
                
                <div className="h-px w-full bg-white/10" />
                
                <div>
                  <h4 className="flex items-center gap-2 text-red-400 font-bold mb-3"><X size={20} /> What fell short</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2"><span className="text-red-500 mt-1">•</span> Battery life is abysmal (under 3 hours)</li>
                    <li className="flex gap-2"><span className="text-red-500 mt-1">•</span> Screen color gamut (65% sRGB) isn't for creators</li>
                    <li className="flex gap-2"><span className="text-red-500 mt-1">•</span> Plastic chassis attracts fingerprints instantly</li>
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Review Grid */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-display font-bold">Category Roundups</h2>
            <span className="text-primary font-medium hidden md:inline-block">{REVIEWS.filter(r => !r.featured).length} Reviews</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.filter(r => !r.featured).map((review, i) => (
              <motion.div
                key={review.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/reviews/${review.slug}`}
                  onClick={() => trackReviewViewed(review.title, review.category)}
                  className="group block bg-card border border-white/5 rounded-2xl p-6 hover:bg-white/5 hover:border-primary/30 transition-all relative overflow-hidden h-full"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{review.icon}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        {review.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md border border-white/10">
                      <Star size={14} className="text-primary fill-primary" />
                      <span className="text-sm font-bold">{review.score}/5</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors relative z-10">
                    {review.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 relative z-10">
                    {review.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-white/5 relative z-10">
                    <span>Updated {review.date}</span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      {review.read} read
                      <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 border-t border-white/5 bg-background relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-display font-bold mb-10 text-center">Top 3 Gaming Laptops Head-to-Head</h2>
          
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 w-1/4">Spec</th>
                  <th className="p-4 border-b border-primary border-b-2 text-primary font-bold text-lg w-1/4 bg-primary/5 rounded-t-xl">Editor's Choice</th>
                  <th className="p-4 border-b border-white/10 font-bold text-lg w-1/4">Premium Pick</th>
                  <th className="p-4 border-b border-white/10 font-bold text-lg w-1/4">Budget Pick</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-muted-foreground font-medium">Model</td>
                  <td className="p-4 font-bold bg-primary/5">MSI Katana 17</td>
                  <td className="p-4 font-bold">Razer Blade 16</td>
                  <td className="p-4 font-bold">Acer Nitro 5</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-muted-foreground font-medium">Price</td>
                  <td className="p-4 text-primary font-bold bg-primary/5">₹1,05,000</td>
                  <td className="p-4">₹2,25,000</td>
                  <td className="p-4">₹75,000</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-muted-foreground font-medium">GPU</td>
                  <td className="p-4 bg-primary/5">RTX 4070</td>
                  <td className="p-4">RTX 4080</td>
                  <td className="p-4">RTX 4050</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-muted-foreground font-medium">Display</td>
                  <td className="p-4 bg-primary/5">17.3" FHD 144Hz</td>
                  <td className="p-4">16" QHD+ OLED 240Hz</td>
                  <td className="p-4">15.6" FHD 144Hz</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-muted-foreground font-medium">Build</td>
                  <td className="p-4 bg-primary/5">Plastic</td>
                  <td className="p-4">CNC Aluminum</td>
                  <td className="p-4">Plastic</td>
                </tr>
                <tr>
                  <td className="p-4"></td>
                  <td className="p-4 bg-primary/5 rounded-b-xl"><button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="View deal for Editor's Choice laptop (MSI Katana 17)" onClick={() => trackComparisonViewDeal('MSI Katana 17', "Editor's Choice")}>View Deal</button></td>
                  <td className="p-4"><button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="View deal for Premium Pick laptop (Razer Blade 16)" onClick={() => trackComparisonViewDeal('Razer Blade 16', 'Premium Pick')}>View Deal</button></td>
                  <td className="p-4"><button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="View deal for Budget Pick laptop (Acer Nitro 5)" onClick={() => trackComparisonViewDeal('Acer Nitro 5', 'Budget Pick')}>View Deal</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
