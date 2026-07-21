import { Link } from 'wouter';
import { SEO } from '../components/seo';

const LEGAL_SLUGS: Record<string, string> = {
  'Privacy Policy':         '/privacy',
  'Terms of Service':       '/terms',
  'Affiliate Disclosure':   '/disclaimer',
};

const LEGAL_SCHEMAS: Record<string, Record<string, unknown>> = {
  'Privacy Policy': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy — Smart Picks Daily',
    url: 'https://smartpicksdaily.com/privacy',
    description: 'Privacy Policy for Smart Picks Daily.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
        { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://smartpicksdaily.com/privacy' },
      ],
    },
  },
  'Terms of Service': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service — Smart Picks Daily',
    url: 'https://smartpicksdaily.com/terms',
    description: 'Terms of Service for Smart Picks Daily.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
        { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: 'https://smartpicksdaily.com/terms' },
      ],
    },
  },
  'Affiliate Disclosure': {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Affiliate Disclosure — Smart Picks Daily',
    url: 'https://smartpicksdaily.com/disclaimer',
    description: 'Affiliate disclosure for Smart Picks Daily.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartpicksdaily.com/' },
        { '@type': 'ListItem', position: 2, name: 'Affiliate Disclosure', item: 'https://smartpicksdaily.com/disclaimer' },
      ],
    },
  },
};

export default function Legal({ title }: { title: string }) {
  const slug = LEGAL_SLUGS[title] ?? '/privacy';
  const schema = LEGAL_SCHEMAS[title];

  return (
    <>
      <SEO
        title={title}
        description={`Legal information and ${title.toLowerCase()} for Smart Picks Daily.`}
        url={slug}
        jsonLd={schema}
      />

      <div className="relative min-h-screen bg-background pt-24 pb-32">
        {/* Subtle background element */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-1/3 h-[50vh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 to-transparent pointer-events-none" aria-hidden="true" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{title}</h1>
            <p className="text-muted-foreground">Last Updated: July 1, 2026</p>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            <p>
              Welcome to Smart Picks Daily. The following document outlines our policies and terms. We believe in transparency and plain language, though legal requirements dictate certain formatting.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              When you visit our site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
            </p>
            <ul>
              <li><strong>Log Data:</strong> We track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</li>
              <li><strong>Web Beacons/Pixels:</strong> We use electronic files used to record information about how you browse the Site.</li>
            </ul>

            <h2>2. Affiliate Disclosure</h2>
            <p>
              Smart Picks Daily is a reader-supported publication. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission. Affiliate programs and affiliations include, but are not limited to, the Amazon Services LLC Associates Program.
            </p>
            <p>
              We only recommend products we've independently researched and would buy ourselves. The compensation we receive never influences the content, topics, or posts made on this blog.
            </p>

            <h2>3. External Links</h2>
            <p>
              Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.
            </p>

            <h2>4. Editorial Independence</h2>
            <p>
              We do not accept paid reviews or sponsored placements masquerading as editorial content. Any sponsored content will be explicitly labeled as such at the very top of the article.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at{' '}
              <a href="mailto:contact@smartpicksdaily.com">contact@smartpicksdaily.com</a>
              {' '}or via our{' '}
              <Link href="/contact" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                contact page
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
