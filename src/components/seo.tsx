import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  image?: string;
  url?: string;
  keywords?: string;
  author?: string;
  /** Optional JSON-LD structured data object(s) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const SITE_NAME = 'Smart Picks Daily';
const SITE_URL  = 'https://smartpicksdaily.com';

/** Sitewide JSON-LD: Organization + WebSite with SearchAction */
const GLOBAL_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contactpicksdaily@gmail.com',
      contactType: 'customer support',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
];

export function SEO({
  title,
  description,
  type = 'website',
  image = '/og-image.png',
  url = '',
  keywords = 'tech reviews, AI gadgets, laptop buying guides, PC builds, gaming PCs, product recommendations, gadgets India',
  author = SITE_NAME,
  jsonLd,
  noindex = false,
}: SEOProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${url}`;
  const ogImage = `${SITE_URL}${image}`;

  // Merge page-level JSON-LD with global schemas
  const pageJsonLd = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];
  const allJsonLd = [...GLOBAL_JSONLD, ...pageJsonLd];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="theme-color" content="#050816" />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SmartPicksDaily" />
      <meta name="twitter:creator" content="@SmartPicksDaily" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* JSON-LD Structured Data */}
      {allJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}
