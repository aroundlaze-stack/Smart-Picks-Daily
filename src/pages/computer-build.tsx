import { Link, useRoute } from 'wouter';
import { ArrowLeft, Cpu, HardDrive, Monitor, Zap } from 'lucide-react';
import { SEO } from '../components/seo';
import { COMPUTER_BUILDS } from '../data/computer-builds';

export default function ComputerBuildPage() {
  const [, params] = useRoute('/computers/:slug');
  const slug = params?.slug;
  const build = COMPUTER_BUILDS.find((entry) => entry.slug === slug);

  if (!build) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Build not found</h1>
        <p className="text-muted-foreground mb-8">The requested build could not be found.</p>
        <Link href="/computers">
          <a className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold">
            <ArrowLeft size={18} />
            Back to builds
          </a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${build.title} Parts List`}
        description={`${build.title} parts list and buying guide. See the CPU, GPU, storage and more for this curated PC build.`}
        url={`/computers/${build.slug}`}
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/computers">
            <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft size={16} />
              Back to all builds
            </a>
          </Link>

          <div className={`rounded-3xl border ${build.borderColor} overflow-hidden bg-card/80 backdrop-blur-sm`}>
            <div className={`p-8 md:p-10 bg-gradient-to-b ${build.color}`}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Curated parts list</p>
                  <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{build.title}</h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">{build.summary}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/70 px-6 py-4 min-w-[220px]">
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Estimated budget</div>
                  <div className="text-2xl font-bold mt-2">{build.price}</div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="grid gap-4 md:grid-cols-4 mb-10">
                <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-primary mb-2"><Cpu size={18} /> <span className="font-semibold">Core Focus</span></div>
                  <p className="text-sm text-muted-foreground">Balanced CPU and GPU pairing for the target resolution.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-primary mb-2"><Zap size={18} /> <span className="font-semibold">Performance Target</span></div>
                  <p className="text-sm text-muted-foreground">Designed to deliver high-value gaming performance without overspending.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-primary mb-2"><HardDrive size={18} /> <span className="font-semibold">Storage</span></div>
                  <p className="text-sm text-muted-foreground">Fast NVMe storage with enough capacity for modern games and apps.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-primary mb-2"><Monitor size={18} /> <span className="font-semibold">Display Fit</span></div>
                  <p className="text-sm text-muted-foreground">Built for the ideal resolution sweet spot, whether 1080p or 4K.</p>
                </div>
              </div>

              <div className="space-y-4">
                {build.parts.map((part, index) => (
                  <article key={`${part.name}-${index}`} className="rounded-2xl border border-white/10 bg-background/50 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            {part.category}
                          </span>
                          <span className="text-sm text-muted-foreground">{part.price}</span>
                        </div>
                        <h2 className="text-2xl font-display font-semibold mb-2">{part.name}</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">{part.description}</p>
                        <p className="text-sm text-foreground/85"><span className="font-semibold">Why it fits:</span> {part.whyItFits}</p>
                      </div>
                      <a
                        href={part.purchaseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        View product
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
