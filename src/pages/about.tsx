import { useState, useEffect } from 'react';
import { SEO } from '../components/seo';
import { MissionControlGlobe } from '../components/3d/MissionControlGlobe';
import { Shield, Target, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
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
        title="About Us | Mission Control"
        description="Learn about Smart Picks Daily, our testing methodology, and our commitment to unbiased tech journalism."
        url="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Smart Picks Daily — Mission Control',
          url: 'https://smartpicksdaily.com/about',
          description: 'Learn about Smart Picks Daily, our testing methodology, and our commitment to unbiased tech journalism.',
          publisher: {
            '@type': 'Organization',
            name: 'Smart Picks Daily',
            url: 'https://smartpicksdaily.com'
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
              { '@type': 'ListItem', position: 2, name: 'About', item: 'https://smartpicksdaily.com/about' }
            ]
          }
        }}
      />
      
      {/* Globe Header */}
      <section className="relative h-[60vh] w-full border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <MissionControlGlobe isMobile={isMobile} />
        </div>
        
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="absolute bottom-12 left-0 right-0 z-20 container mx-auto px-4 md:px-6 flex flex-col items-center text-center pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 drop-shadow-xl">Global Mission.</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-white/5">
            We are a collective of engineers, gamers, and hardware obsessives dedicated to separating marketing fiction from technological fact.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative z-10 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">The Manifesto</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                The internet is broken. Product searches yield AI-generated slop, paid placements, and "reviewers" who read spec sheets without ever unboxing the product.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Smart Picks Daily was built as a firewall against the noise. We buy the gear. We test it in real workflows. We document the failures, the thermal throttling, and the buggy software. 
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Shield className="text-primary" />, title: "Independent", text: "Zero sponsored reviews." },
                  { icon: <Target className="text-secondary" />, title: "Precise", text: "Rigorous testing loops." },
                  { icon: <Users className="text-accent" />, title: "Community", text: "Reader-supported model." },
                  { icon: <Zap className="text-green-400" />, title: "Current", text: "Constantly updated guides." }
                ].map((val, i) => (
                  <div key={i} className="bg-card border border-white/5 p-4 rounded-xl">
                    <div className="mb-3">{val.icon}</div>
                    <h4 className="font-bold mb-1">{val.title}</h4>
                    <p className="text-xs text-muted-foreground">{val.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/50 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
              <h3 className="text-2xl font-display font-bold mb-8 relative z-10">Our Testing Lab</h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <div className="text-primary font-bold text-xl mt-1">01</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Procurement</h4>
                    <p className="text-muted-foreground">We buy retail units anonymously to ensure we get the same silicon lottery you do.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-primary font-bold text-xl mt-1">02</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Synthetic Benchmarks</h4>
                    <p className="text-muted-foreground">Isolating variables using industry-standard tools to establish a baseline.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-primary font-bold text-xl mt-1">03</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Real-World Friction</h4>
                    <p className="text-muted-foreground">30-day daily driver testing. Finding the software bugs benchmarks miss.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-primary font-bold text-xl mt-1">04</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Value Calculation</h4>
                    <p className="text-muted-foreground">Scoring performance relative to current market pricing, not MSRP.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
