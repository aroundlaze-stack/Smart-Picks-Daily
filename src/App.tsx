import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Shell } from './components/layout/Shell';

// Lazy-loaded pages for optimal code splitting
const Home        = lazy(() => import('./pages/home'));
const Products    = lazy(() => import('./pages/products'));
const Blog        = lazy(() => import('./pages/blog'));
const Reviews     = lazy(() => import('./pages/reviews'));
const Resources   = lazy(() => import('./pages/resources'));
const Computers   = lazy(() => import('./pages/computers'));
const About       = lazy(() => import('./pages/about'));
const Contact     = lazy(() => import('./pages/contact'));
const Legal       = lazy(() => import('./pages/legal'));
const AiTechFinder = lazy(() => import('./pages/ai-tech-finder'));
const LaptopFinder = lazy(() => import('./pages/laptop-finder'));
const NotFound    = lazy(() => import('./pages/not-found'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

// Minimal skeleton shown while a lazy chunk loads
function PageSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]" aria-busy="true" aria-label="Loading page">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Shell>
      <Suspense fallback={<PageSkeleton />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/ai-tech-finder" component={AiTechFinder} />
          <Route path="/laptop-finder" component={LaptopFinder} />
          <Route path="/blog" component={Blog} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/resources" component={Resources} />
          <Route path="/computers" component={Computers} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy">
            {() => <Legal title="Privacy Policy" />}
          </Route>
          <Route path="/terms">
            {() => <Legal title="Terms of Service" />}
          </Route>
          <Route path="/disclaimer">
            {() => <Legal title="Affiliate Disclosure" />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Shell>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
