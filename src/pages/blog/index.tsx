import { useState, useEffect, useMemo } from 'react';
import { SEO } from '../../components/seo';
import { ConstellationMap } from '../../components/3d/ConstellationMap';
import { Calendar, Clock, ArrowRight, Search, X, Filter } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  trackArticleOpened,
  trackBlogFilterSelected,
  trackLoadMoreArticles,
} from '../../lib/tracking';
import { ARTICLES } from './data';

const TYPES = ['All', 'Buying Guide', 'Comparison', 'Review', 'Explainer', 'Setup Guide'] as const;

export default function Blog() {
  const [isMobile, setIsMobile] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = useMemo(() => {
    let list = ARTICLES;
    if (filter !== 'All') list = list.filter(a => a.type === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags?.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  }, [filter, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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
            publisher: { '@type': 'Organization', name: 'Smart Picks Daily', url: 'https://smartpicksdaily.com' },
            breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://smartpicksdaily.com/blog' }
            ]}
          } as any,
          ...ARTICLES.map(a => ({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: a.title,
            description: a.excerpt,
            datePublished: a.date,
            url: `https://smartpicksdaily.com/blog/${a.slug}`,
            author: { '@type': 'Organization', name: 'Smart Picks Daily' },
            publisher: { '@type': 'Organization', name: 'Smart Picks Daily', url: 'https://smartpicksdaily.com' },
            articleSection: a.type,
          }))
        ]}
      />

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] w-full bg-background border-b border-white/5">
        <div className="absolute inset-0 z-0"><ConstellationMap isMobile={isMobile} /></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-background pointer-events-none" />
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 max-w-3xl">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="flex flex-col items-center"><span className="text-2xl font-bold text-primary">In-Depth</span><span className="text-xs text-muted-foreground uppercase tracking-wider">Articles</span></div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex flex-col items-center"><span className="text-2xl font-bold text-secondary">{ARTICLES.length}+</span><span className="text-xs text-muted-foreground uppercase tracking-wider">Guides</span></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">The Knowledge Base</h1>
            <p className="text-lg text-muted-foreground">Every dot is a deep dive. Navigate the constellation of tech knowledge.</p>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="py-8 border-b border-white/5 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <input type="search" placeholder="Search articles..."
                value={search} onChange={e => { setSearch(e.target.value); setVisibleCount(6); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:border-primary/50 transition-colors text-foreground" />
              {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={14} /></button>}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {TYPES.map(t => (
                <button key={t} onClick={() => { setFilter(t); setVisibleCount(6); trackBlogFilterSelected(t); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === t ? 'bg-primary text-primary-foreground shadow-[0_0_12px_rgba(79,140,255,0.4)]' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-display font-bold">
              {filter === 'All' ? 'Latest Articles' : filter}
              <span className="text-muted-foreground text-lg font-normal ml-3">{filtered.length} articles</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Filter size={32} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try a different search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((article, i) => (
                <motion.article key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative flex flex-col"
                >
                  <Link href={`/blog/${article.slug}`} onClick={() => trackArticleOpened(i + 1, article.title, article.type)}
                    className="block relative h-56 rounded-2xl overflow-hidden mb-6 bg-card border border-white/10 group-hover:border-primary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <span className="font-display font-bold text-xl text-white/50 group-hover:text-white transition-colors drop-shadow-md">{article.title}</span>
                    </div>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-primary">{article.type}</div>
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {article.time}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">{article.excerpt}</p>
                  <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all mt-auto">
                    Read Article <ArrowRight size={16} />
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-12 text-center">
              <button onClick={() => { setVisibleCount(v => v + 6); trackLoadMoreArticles(); }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Load More Articles</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
