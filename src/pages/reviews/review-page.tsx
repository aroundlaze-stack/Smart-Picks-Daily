import { useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { SEO } from '../../components/seo';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Star,
  ChevronRight,
  Award,
} from 'lucide-react';
import { getReview, REVIEWS } from './data';
import { getReviewContent } from './content';
import { trackReadFullReview } from '../../lib/tracking';

// ─── Section renderer (mirrors blog article-page) ────────────────────────────

function renderSection(s: Record<string, unknown>, idx: number) {
  switch (s.type) {
    case 'h2':
      return (
        <h2 key={idx} className="text-2xl md:text-3xl font-display font-bold mt-12 mb-4 text-foreground">
          {s.title as string}
        </h2>
      );
    case 'p':
      return (
        <p
          key={idx}
          className="text-foreground/80 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: s.content as string }}
        />
      );
    case 'tip':
      return (
        <div key={idx} className="my-6 p-5 rounded-2xl bg-accent/10 border border-accent/20 flex gap-3">
          <Lightbulb size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-accent mb-1">{s.title as string}</p>
            <p
              className="text-sm text-foreground/80"
              dangerouslySetInnerHTML={{ __html: s.content as string }}
            />
          </div>
        </div>
      );
    case 'warning':
      return (
        <div key={idx} className="my-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
          <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p
            className="text-sm text-foreground/80"
            dangerouslySetInnerHTML={{ __html: s.content as string }}
          />
        </div>
      );
    case 'faq':
      return (
        <div key={idx} className="my-6 p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="flex items-start gap-2 font-bold text-foreground mb-2">
            <HelpCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
            {s.q as string}
          </p>
          <p className="text-sm text-foreground/70 pl-6">{s.a as string}</p>
        </div>
      );
    case 'pros-cons': {
      const pros = (s.pros as string[]) ?? [];
      const cons = (s.cons as string[]) ?? [];
      return (
        <div key={idx} className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
            <h4 className="flex items-center gap-2 text-green-400 font-bold mb-3">
              <CheckCircle2 size={16} /> Pros
            </h4>
            <ul className="space-y-2 text-sm text-foreground/80">
              {pros.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-500 mt-0.5">+</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
            <h4 className="flex items-center gap-2 text-red-400 font-bold mb-3">
              <XCircle size={16} /> Cons
            </h4>
            <ul className="space-y-2 text-sm text-foreground/80">
              {(cons).map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-500 mt-0.5">−</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    case 'table': {
      const headers = (s.headers as string[]) ?? [];
      const rows = (s.rows as string[][]) ?? [];
      return (
        <div key={idx} className="my-6 overflow-x-auto hide-scrollbar">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="p-3 text-left font-bold border-b border-white/10 bg-white/[0.03]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 hover:bg-white/[0.02]">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`p-3 ${ci === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'highlight':
      return (
        <div key={idx} className="my-6 p-5 rounded-2xl bg-primary/10 border border-primary/20">
          <p className="font-bold text-primary mb-1">{s.title as string}</p>
          <p
            className="text-sm text-foreground/80"
            dangerouslySetInnerHTML={{ __html: (s.content as string) || '' }}
          />
          {s.link && (
            <a
              href={s.link as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-primary hover:underline"
            >
              {(s.linkText as string) || 'Learn more'} <ExternalLink size={12} />
            </a>
          )}
        </div>
      );
    case 'checklist': {
      const items = (s.items as string[]) ?? [];
      return (
        <div key={idx} className="my-6 p-5 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="font-bold text-foreground mb-3">{s.title as string}</h4>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    default:
      return null;
  }
}

// ─── Star rating component ────────────────────────────────────────────────────

function StarRating({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < full
              ? 'text-amber-400 fill-amber-400'
              : i === full && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-muted-foreground/30'
          }
        />
      ))}
      <span className="ml-1 font-bold text-foreground">{score.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">/5</span>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function ReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const review = useMemo(() => getReview(slug), [slug]);
  const content = useMemo(() => (slug ? getReviewContent(slug) : null), [slug]);

  // Determine next review (wraps around)
  const nextReview = useMemo(() => {
    if (!review) return null;
    const idx = REVIEWS.findIndex(r => r.slug === slug);
    return REVIEWS[(idx + 1) % REVIEWS.length];
  }, [review, slug]);

  if (!review || !content) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Review Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This review may have been moved or is still being written.
        </p>
        <Link
          href="/reviews"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          Back to Reviews
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={review.title}
        description={review.excerpt}
        url={`/reviews/${review.slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Review',
          name: review.title,
          description: review.excerpt,
          datePublished: review.date,
          url: `https://smartpicksdaily.com/reviews/${review.slug}`,
          author: { '@type': 'Organization', name: 'Smart Picks Daily' },
          publisher: {
            '@type': 'Organization',
            name: 'Smart Picks Daily',
            url: 'https://smartpicksdaily.com',
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.score,
            bestRating: 5,
          },
          itemReviewed: {
            '@type': 'Product',
            name: review.title,
            category: review.category,
          },
          timeRequired: `PT${review.read.replace(' min', 'M')}`,
        }}
      />

      {/* Hero Banner */}
      <section
        className={`relative bg-gradient-to-b ${review.heroColor} to-background py-20 md:py-28 border-b border-white/5`}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link href="/reviews" className="hover:text-foreground transition-colors">Reviews</Link>
              <ChevronRight size={13} />
              <span className="text-foreground truncate max-w-[200px]">{review.category}</span>
            </nav>

            {/* Icon + badge row */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{review.icon}</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
                {review.category} Review
              </span>
              {review.editorChoice && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center gap-1">
                  <Award size={11} /> Editor's Choice
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
              {review.title}
            </h1>

            <p className="text-lg text-foreground/70 mb-6 leading-relaxed max-w-2xl">
              {review.excerpt}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={15} /> {review.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {review.read} read
              </span>
            </div>

            {/* Score */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <span className="text-sm font-semibold text-muted-foreground">Our Rating</span>
              <StarRating score={review.score} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

            {/* Main content */}
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="min-w-0"
            >
              {content.sections.map((s, idx) =>
                renderSection(s as Record<string, unknown>, idx)
              )}
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 self-start space-y-6">

              {/* Score card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-white/10 rounded-2xl p-6"
              >
                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-3">
                    <span className="font-display font-bold text-2xl text-primary">
                      {review.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {review.editorChoice ? "Editor's Choice" : 'Smart Picks Rating'}
                  </p>
                  <StarRating score={review.score} />
                </div>
                <Link
                  href="/reviews"
                  className="flex items-center justify-center gap-2 w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => trackReadFullReview(review.title)}
                >
                  <ArrowLeft size={14} /> All Reviews
                </Link>
              </motion.div>

              {/* Related */}
              {content.related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card border border-white/10 rounded-2xl p-5"
                >
                  <h3 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
                    Related
                  </h3>
                  <ul className="space-y-3">
                    {content.related.map((r, i) => (
                      <li key={i}>
                        <Link
                          href={r.href}
                          className="group block text-sm hover:text-primary transition-colors"
                        >
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {r.label}
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {r.desc}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Next Review CTA */}
      {nextReview && (
        <section className="border-t border-white/5 py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Next Review
            </p>
            <Link
              href={`/reviews/${nextReview.slug}`}
              className="group flex items-center justify-between bg-card border border-white/10 hover:border-primary/30 rounded-2xl p-6 transition-all"
            >
              <div>
                <span className="text-2xl mr-3">{nextReview.icon}</span>
                <span className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                  {nextReview.title}
                </span>
                <p className="text-sm text-muted-foreground mt-1">{nextReview.read} read</p>
              </div>
              <ArrowRight
                size={20}
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
