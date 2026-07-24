import { useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { SEO } from '../../components/seo';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, ExternalLink, AlertTriangle, Lightbulb, HelpCircle, CheckCircle2, XCircle, Star, ChevronRight } from 'lucide-react';
import { ARTICLES } from './data';
import { getArticleContent } from './content';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = useMemo(() => ARTICLES.find(a => a.slug === slug), [slug]);
  const content = useMemo(() => (slug ? getArticleContent(slug) : null), [slug]);
  const nextArticle = useMemo(() => {
    if (!article) return null;
    const idx = ARTICLES.findIndex(a => a.slug === slug);
    return ARTICLES[idx + 1] ?? ARTICLES[0];
  }, [article, slug]);

  if (!article || !content) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">This article may have been moved or is still being written.</p>
        <Link href="/blog" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt}
        url={`/blog/${article.slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          url: `https://smartpicksdaily.com/blog/${article.slug}`,
          author: { '@type': 'Organization', name: 'Smart Picks Daily' },
          publisher: { '@type': 'Organization', name: 'Smart Picks Daily', url: 'https://smartpicksdaily.com' },
          articleSection: article.type,
          timeRequired: `PT${article.time.replace(' min', 'M')}`,
        }}
      />

      {/* Hero Banner */}
      <section className={`relative bg-gradient-to-b ${article.heroColor} to-background py-20 md:py-28 border-b border-white/5`}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft size={15} /> Back to Blog
            </Link>
            <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr] items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{article.icon}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">{article.type}</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar size={15} /> {article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span className="flex items-center gap-1.5"><Clock size={15} /> {article.time}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <div className="flex gap-1.5 flex-wrap">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 shadow-2xl shadow-black/20">
                <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="prose prose-invert max-w-none prose-headings:font-display prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-foreground/85 prose-li:text-foreground/80 prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            {content.sections.map((section, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
              >
                {renderSection(section)}
              </motion.div>
            ))}
          </div>

          {/* Related Links */}
          {content.related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 pt-10 border-t border-white/10"
            >
              <h3 className="text-xl font-display font-bold mb-6">Related Articles & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.related.map((r, i) => (
                  <Link key={i} href={r.href}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all group">
                    <div>
                      <div className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Next Article */}
          {nextArticle && nextArticle.slug !== slug && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 pt-10 border-t border-white/10"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Next Article</p>
              <Link href={`/blog/${nextArticle.slug}`}
                className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all group">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{nextArticle.type} · {nextArticle.time}</div>
                  <div className="text-lg font-bold group-hover:text-primary transition-colors">{nextArticle.title}</div>
                </div>
                <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          )}
        </div>
      </article>
    </>
  );
}

// ── Section Renderer ──

type Section = {
  type: string;
  title?: string;
  content?: string;
  items?: string[];
  pros?: string[];
  cons?: string[];
  q?: string;
  a?: string;
  headers?: string[];
  rows?: string[][];
  link?: string;
  linkText?: string;
};

function renderSection(s: Section): React.ReactNode {
  switch (s.type) {
    case 'h2':
      return <h2 className="mt-10 mb-4">{s.title}</h2>;
    case 'h3':
      return <h3 className="mt-8 mb-3">{s.title}</h3>;
    case 'p':
      return s.content ? <p dangerouslySetInnerHTML={{ __html: s.content }} /> : null;
    case 'tip':
      return (
        <div className="my-6 p-5 rounded-2xl bg-green-500/10 border border-green-500/20 flex gap-3">
          <Lightbulb size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-300 mb-1">{s.title || '💡 Pro Tip'}</p>
            <p className="text-sm text-foreground/80" dangerouslySetInnerHTML={{ __html: s.content || '' }} />
          </div>
        </div>
      );
    case 'warning':
      return (
        <div className="my-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
          <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-300 mb-1">{s.title || '⚠️ Common Mistake'}</p>
            <p className="text-sm text-foreground/80" dangerouslySetInnerHTML={{ __html: s.content || '' }} />
          </div>
        </div>
      );
    case 'faq':
      return (
        <div className="my-6 p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex gap-3 mb-3">
            <HelpCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="font-bold text-foreground">{s.q}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-9" dangerouslySetInnerHTML={{ __html: s.a || '' }} />
        </div>
      );
    case 'pros-cons':
      return (
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
            <h4 className="flex items-center gap-2 text-green-400 font-bold mb-3"><CheckCircle2 size={16} /> Pros</h4>
            <ul className="space-y-2 text-sm text-foreground/80">{s.pros?.map((p,i) => <li key={i} className="flex gap-2"><span className="text-green-500 mt-0.5">+</span> {p}</li>)}</ul>
          </div>
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
            <h4 className="flex items-center gap-2 text-red-400 font-bold mb-3"><XCircle size={16} /> Cons</h4>
            <ul className="space-y-2 text-sm text-foreground/80">{s.cons?.map((c,i) => <li key={i} className="flex gap-2"><span className="text-red-500 mt-0.5">−</span> {c}</li>)}</ul>
          </div>
        </div>
      );
    case 'table':
      return (
        <div className="my-6 overflow-x-auto hide-scrollbar">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>{s.headers?.map((h,i) => (
                <th key={i} className={`p-3 text-left font-bold border-b border-white/10 ${i === 0 ? '' : ''}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {s.rows?.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 hover:bg-white/[0.02]">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`p-3 ${ci === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'highlight':
      return (
        <div className="my-6 p-5 rounded-2xl bg-primary/10 border border-primary/20">
          <p className="font-bold text-primary mb-1">{s.title}</p>
          <p className="text-sm text-foreground/80" dangerouslySetInnerHTML={{ __html: s.content || '' }} />
          {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-primary hover:underline">{s.linkText || 'Learn more'} <ExternalLink size={12} /></a>}
        </div>
      );
    case 'checklist':
      return (
        <div className="my-6 p-5 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="font-bold text-foreground mb-3">{s.title}</h4>
          <ul className="space-y-2">{s.items?.map((item,i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-0.5" /> {item}
            </li>
          ))}</ul>
        </div>
      );
    default:
      return null;
  }
}
