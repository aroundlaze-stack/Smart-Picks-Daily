import { Link } from 'wouter';
import { SEO } from '../../../../components/seo';
import { ArrowLeft, ArrowRight, BarChart3, Lock } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useAuth } from '../../../../auth/AuthContext';

// Re-use the existing fully-built compare page logic
const CompareContent = lazy(() => import('../../../compare'));

function LoginPrompt() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
          <Lock className="text-primary" size={28} />
        </div>
        <h2 className="text-xl font-display font-bold text-foreground mb-2">
          Sign in to compare products
        </h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          The Smart Product Comparison tool is available to registered users.
          Create a free account to unlock side-by-side comparisons.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login?redirect=/resources/product-comparison"
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-center hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(79,140,255,0.25)]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="w-full border border-border text-foreground py-3 rounded-xl font-semibold text-center hover:bg-muted/40 transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductComparisonPage() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <SEO
        title="Smart Product Comparison | Tech Toolkit"
        description="Compare tech products side-by-side with full specs, ratings, and AI-powered smart recommendations. Up to 4 products at once."
        url="/resources/product-comparison"
      />

      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link href="/resources">
              <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft size={15} /> Tech Toolkit
              </div>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm font-medium">Smart Product Comparison</span>
          </div>
          <Link href="/compare">
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              Full page view <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>

      {/* Tool intro */}
      <div className="border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="container mx-auto px-4 md:px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <BarChart3 size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold">Smart Product Comparison</h1>
            <p className="text-sm text-muted-foreground">Compare up to 4 tech products side-by-side with specs, pros, cons, and AI recommendations.</p>
          </div>
        </div>
      </div>

      {/* Content: login prompt or tool */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : !isAuthenticated ? (
        <LoginPrompt />
      ) : (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading comparison tool…</p>
            </div>
          </div>
        }>
          <CompareContent />
        </Suspense>
      )}
    </>
  );
}
