import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { SEO } from '../components/seo';
import { ExplodedComputer } from '../components/3d/ExplodedComputer';
import { Cpu, Zap, HardDrive, Monitor } from 'lucide-react';
import {
  trackComputerCategorySelected,
  trackBuildPartsListClicked,
  trackViewBuildGuidesClicked,
} from '../lib/tracking';
import { COMPUTER_BUILDS } from '../data/computer-builds';

export default function Computers() {
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
        title="PC Builds & Desktop Guides"
        description="Curated PC part lists for every budget. From budget 1080p rigs to uncompromising 4K battlestations."
        url="/computers"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'PC Builds & Desktop Guides — Smart Picks Daily',
          url: 'https://smartpicksdaily.com/computers',
          description: 'Curated PC part lists for every budget. From budget 1080p rigs to uncompromising 4K battlestations.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
              { '@type': 'ListItem', position: 2, name: 'PC Builds', item: 'https://smartpicksdaily.com/computers' }
            ]
          }
        }}
      />
      
      {/* 3D Builder Header */}
      <section className="relative h-[60vh] md:h-[70vh] w-full border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <ExplodedComputer isMobile={isMobile} />
        </div>
        
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-background/80 to-transparent md:w-2/3" />
        
        <div className="absolute inset-0 z-20 container mx-auto px-4 md:px-6 flex items-center pointer-events-none">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 drop-shadow-lg">
              Assemble <br/>Your Engine.
            </h1>
            <p className="text-lg text-muted-foreground drop-shadow-md mb-8 max-w-md">
              Stop stressing over bottleneck calculators. We've curated perfectly balanced parts lists for every resolution and budget.
            </p>
            <div className="flex gap-4 pointer-events-auto">
              <button
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(79,140,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => { document.getElementById('builds-section')?.scrollIntoView({ behavior: 'smooth' }); trackViewBuildGuidesClicked(); }}
              >
                View Build Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Component Selection Grid */}
      <section className="py-20 relative z-10 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div id="builds-section" className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">Featured Builds: July 2026</h2>
            <p className="text-muted-foreground">Prices fluctuate daily, but the performance target remains identical. These are the configurations we'd build with our own money today.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {COMPUTER_BUILDS.map((build, i) => (
              <div 
                key={i} 
                className={`relative flex flex-col bg-card border rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] ${build.borderColor}`}
              >
                {build.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-b-lg">
                    EDITOR'S PICK
                  </div>
                )}
                
                <div className={`p-8 bg-gradient-to-b ${build.color}`}>
                  <h3 className="text-2xl font-display font-bold mb-2 pt-4">{build.title}</h3>
                  <div className="text-xl font-bold mb-4 text-foreground/80">{build.price}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed h-16">
                    {build.desc}
                  </p>
                </div>

                <div className="p-8 pt-0 flex-1 flex flex-col">
                  <div className="space-y-4 mb-8 flex-1">
                    {build.specs.map((spec, idx) => (
                      <div key={idx} className="flex flex-col border-b border-white/5 pb-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{spec.name}</span>
                        <span className="font-medium">{spec.val}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={`/computers/${build.slug}`}>
                    <button
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`View parts list for ${build.title}`}
                      onClick={() => trackBuildPartsListClicked(build.title)}
                    >
                      View Parts List
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Category Links */}
      <section className="py-12 border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Monitor aria-hidden="true" />, label: "Pre-Built PCs", href: "/products?category=Desktop" },
              { icon: <Cpu aria-hidden="true" />, label: "Mini PCs", href: "/products?category=Mini+PC" },
              { icon: <Zap aria-hidden="true" />, label: "Workstations", href: "/products?category=Workstation" },
              { icon: <HardDrive aria-hidden="true" />, label: "NAS Builds", href: "/products?category=NAS" }
            ].map((cat, i) => (
              <a
                href={cat.href}
                key={i}
                onClick={() => trackComputerCategorySelected(cat.label)}
                className="flex flex-col items-center justify-center p-6 bg-card border border-white/5 rounded-2xl hover:bg-white/5 hover:border-primary/30 transition-colors gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="text-muted-foreground">{cat.icon}</div>
                <span className="font-medium">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
