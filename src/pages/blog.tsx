import { useState, useEffect } from 'react';
import { SEO } from '../components/seo';
import { ConstellationMap } from '../components/3d/ConstellationMap';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const ARTICLES = [
  { id: 1, type: "Buying Guide", time: "8 min", title: "Best Gaming Laptops of 2026", excerpt: "Compare the latest high-performance machines with RTX graphics and OLED displays.", date: "Jul 15, 2026" },
  { id: 2, type: "Comparison", time: "6 min", title: "Mechanical vs Optical Switches", excerpt: "Which keyboard switches reign supreme for competitive gaming vs typing?", date: "Jul 12, 2026" },
  { id: 3, type: "Reviews", time: "7 min", title: "Best Gaming Monitors for Every Budget", excerpt: "Refresh rates, HDR, response times explained and our top picks for each bracket.", date: "Jul 08, 2026" },
  { id: 4, type: "Comparison", time: "5 min", title: "Top Wireless Headphones 2026", excerpt: "We tested the top 10 models for sound quality, comfort, and battery life.", date: "Jul 03, 2026" },
  { id: 5, type: "Buying Guide", time: "4 min", title: "Best Budget Gaming Mice", excerpt: "Precision on a budget. You don't need to spend $150 to get flawless tracking.", date: "Jun 28, 2026" },
  { id: 6, type: "Explainer", time: "9 min", title: "SSD vs HDD: The Complete Guide", excerpt: "Storage decisions made simple. When you still need spinning rust and when NVMe is mandatory.", date: "Jun 22, 2026" }
];

export default function Blog() {
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
        title="Knowledge Base & Guides"
        description="Deep dives, comparisons, and buying guides to help you navigate the tech landscape."
        url="/blog"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Smart Picks Daily — Knowledge Base & Guides',
            url: 'https://smartpicksdaily.com/blog',
            description: 'Deep dives, comparisons, and buying guides to help you navigate the tech landscape.',
            publisher: {
              '@type': 'Organization',
              name: 'Smart Picks Daily',
              url: 'https://smartpicksdaily.com'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://smartpicksdaily.com/blog' }
              ]
            }
          },
          ...ARTICLES.map(a => ({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: a.title,
            description: a.excerpt,
            datePublished: a.date,
            url: `https://smartpicksdaily.com/blog#article-${a.id}`,
            author: { '@type': 'Organization', name: 'Smart Picks Daily' },
            publisher: { '@type': 'Organization', name: 'Smart Picks Daily', url: 'https://smartpicksdaily.com' },
            articleSection: a.type,
            timeRequired: `PT${a.time.replace(' min', 'M')}`
          }))
        ]}
      />
      
      {/* Hero with Constellation Map */}
      <section className="relative h-[50vh] md:h-[60vh] w-full bg-background border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <ConstellationMap isMobile={isMobile} />
        </div>
        
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-background pointer-events-none" />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-primary">150+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Articles</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-secondary">25+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Guides</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">The Knowledge Base</h1>
            <p className="text-lg text-muted-foreground">Every dot is a deep dive. Navigate the constellation of tech knowledge.</p>
          </div>
        </div>
      </section>

      {/* Editor's Note */}
      <section className="py-12 border-b border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Editor's Note: The State of PC Gaming in 2026</h3>
              <p className="text-muted-foreground leading-relaxed">
                With the release of the new RTX 50-series and OLED becoming standard on laptops, the value proposition has completely shifted. We're currently overhauling all our laptop and monitor guides to reflect the new performance floor. 
                <a href="#" className="text-primary ml-2 hover:underline">Read the full breakdown →</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-display font-bold">Latest Transmissions</h2>
            <div className="hidden md:flex gap-2">
              {['All', 'Guides', 'Reviews', 'Comparisons'].map(filter => (
                <button key={filter} className={`px-4 py-1.5 rounded-full text-sm font-medium ${filter === 'All' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map((article, i) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col"
              >
                {/* Image Placeholder */}
                <Link href={`/blog/${article.id}`} className="block relative h-56 rounded-2xl overflow-hidden mb-6 bg-card border border-white/10 group-hover:border-primary/50 transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <span className="font-display font-bold text-xl text-white/50 group-hover:text-white transition-colors drop-shadow-md">
                      {article.title}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-primary">
                    {article.type}
                  </div>
                </Link>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {article.time} read</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/blog/${article.id}`}>{article.title}</Link>
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
                  {article.excerpt}
                </p>

                <Link href={`/blog/${article.id}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all mt-auto">
                  Read Article <ArrowRight size={16} />
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Load more articles"
            >
              Load More Articles
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
