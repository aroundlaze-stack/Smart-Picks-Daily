import { Link } from 'wouter';
import { SEO } from '../components/seo';

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 — Page Not Found"
        description="The page you are looking for could not be found. Return to Smart Picks Daily."
        noindex
      />
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div
          className="text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-transparent opacity-50 select-none"
          aria-hidden="true"
        >
          404
        </div>
        <h1 className="text-3xl font-bold mt-8 mb-4">Lost in Space</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for has drifted beyond our scanners. It might have been moved or deleted.
        </p>
        <Link
          href="/"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Return to Base
        </Link>
      </div>
    </>
  );
}
