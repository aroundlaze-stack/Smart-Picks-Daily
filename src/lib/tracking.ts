/**
 * Affiliate Intelligence Tracking — Smart Picks Daily
 *
 * Single source of truth for all analytics events.
 * Never duplicate tracking calls. Always use these helpers.
 *
 * Safety guarantees:
 *  • All functions are no-ops if the analytics service has not loaded yet
 *    (consent not given, or script still loading).
 *  • Errors are swallowed; tracking failures can never throw to the UI.
 *  • Console warnings are emitted only in development.
 */

// ─── Type Declarations ────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (method: string, ...args: unknown[]) => void;
  }
}

const DEV = import.meta.env.DEV;

// ─── Low-level Adapters ───────────────────────────────────────────────────────

/** Send a custom GA4 event via gtag. */
function ga(eventName: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, { ...params, send_to: 'G-QR3PXF2F2F' });
    }
  } catch (err) {
    if (DEV) console.warn('[tracking] GA4 error:', err);
  }
}

/** Send a custom tag to Microsoft Clarity. */
function clarity(tag: string, value: string): void {
  try {
    if (typeof window.clarity === 'function') {
      window.clarity('set', tag, value);
    }
  } catch (err) {
    if (DEV) console.warn('[tracking] Clarity error:', err);
  }
}

// ─── Product Events ───────────────────────────────────────────────────────────

export interface ProductTrackingData {
  name: string;
  category: string;
  price?: string;
  priceMin?: number;
  priceMax?: number;
  brand?: string;
  affiliateNetwork?: string;
}

/** Card scrolled into the viewport. */
export function trackProductViewed(product: ProductTrackingData): void {
  ga('product_card_viewed', {
    item_name: product.name,
    item_category: product.category,
    price: product.priceMin,
    timestamp: Date.now(),
  });
  clarity('product_viewed', product.category);
}

/** User clicked anywhere on a product card. */
export function trackProductCardClicked(product: ProductTrackingData): void {
  ga('product_card_clicked', {
    item_name: product.name,
    item_category: product.category,
    price: product.priceMin,
    timestamp: Date.now(),
  });
  clarity('product_clicked', product.name);
}

/** "View Deal" / affiliate CTA clicked. */
export function trackAffiliateClick(
  product: ProductTrackingData,
  store: 'amazon' | 'flipkart' | 'official' | 'generic' = 'generic',
): void {
  ga('affiliate_button_clicked', {
    item_name: product.name,
    item_category: product.category,
    affiliate_network: store,
    price_range: product.price,
    timestamp: Date.now(),
  });
  // GA4 also as select_item for funnel tracking
  ga('select_item', {
    item_list_name: product.category,
    items: [{ item_name: product.name, item_category: product.category, price: product.priceMin }],
  });
  clarity('affiliate_click', `${product.name} (${store})`);
}

/** "Load More Products" button clicked. */
export function trackLoadMoreProducts(category: string, remainingCount: number): void {
  ga('load_more_products_clicked', { category, remaining_count: remainingCount });
}

// ─── Search & Filter Events ───────────────────────────────────────────────────

/** User started typing in the search box. */
export function trackSearchStarted(): void {
  ga('search_started');
}

/** User paused/finished typing — debounce before calling. */
export function trackSearchCompleted(
  keyword: string,
  resultCount: number,
  category: string,
): void {
  ga('search_completed', { search_term: keyword, result_count: resultCount, category });
  clarity('search_keyword', keyword);
}

/** Search returned zero results. */
export function trackNoResults(keyword: string, category: string): void {
  ga('search_no_results', { search_term: keyword, category });
  clarity('no_results', `${keyword} | ${category}`);
}

/** Category filter chip clicked. */
export function trackCategoryFilter(category: string): void {
  ga('category_filter_applied', { category });
  clarity('category_filter', category);
}

/** Sort option chosen. */
export function trackSortOptionSelected(sortOption: string): void {
  ga('sort_option_selected', { sort_by: sortOption });
}

// ─── AI Tech Finder Events ────────────────────────────────────────────────────

/** User clicked "Start Finding Your Perfect Tech". */
export function trackAiFinderOpened(): void {
  ga('ai_finder_opened');
  clarity('ai_finder', 'opened');
}

/** User selected a top-level device category. */
export function trackDeviceTypeSelected(deviceType: string): void {
  ga('ai_device_type_selected', { device_type: deviceType });
  clarity('ai_device_type', deviceType);
}

/** User selected a sub-category and entered the question flow. */
export function trackAiSubcategorySelected(category: string, deviceType: string): void {
  ga('ai_subcategory_selected', { category, device_type: deviceType });
}

/** User answered the budget question. */
export function trackBudgetSelected(budget: string, category: string): void {
  ga('ai_budget_selected', { budget, category });
  clarity('ai_budget', budget);
}

/** User answered the purpose question. */
export function trackPurposeSelected(purpose: string, category: string): void {
  ga('ai_purpose_selected', { purpose, category });
  clarity('ai_purpose', purpose);
}

/** "Find My Perfect X" button clicked — recommendation about to generate. */
export function trackRecommendationGenerated(
  category: string,
  answers: Record<string, string>,
): void {
  ga('recommendation_generated', {
    category,
    purpose: answers.purpose ?? 'unknown',
    budget: answers.budget ?? 'unknown',
    answer_count: Object.keys(answers).length,
  });
  clarity('ai_recommendation', `${category} | ${answers.purpose ?? ''} | ${answers.budget ?? ''}`);
}

/** User reached the results page (redirect completed). */
export function trackRecommendationAccepted(category: string): void {
  ga('recommendation_accepted', { category });
}

/** User clicked "Start Over" — recommendation ignored. */
export function trackRecommendationIgnored(): void {
  ga('recommendation_ignored');
}

// ─── Resource Page Events ─────────────────────────────────────────────────────

/** "Visit Official Website" link on a resource card clicked. */
export function trackResourceClick(title: string, category: string, url: string): void {
  ga('resource_link_clicked', { resource_title: title, resource_category: category, url });
  clarity('resource_click', `${category}: ${title}`);
}

/** Category chip on Resources page selected. */
export function trackResourceCategoryFilter(category: string): void {
  ga('resource_category_filter', { category });
}

// ─── Computers / PC Builds Events ────────────────────────────────────────────

/** A PC category tile clicked (Pre-Built, Mini PCs, Workstations, NAS). */
export function trackComputerCategorySelected(category: string): void {
  ga('computer_category_selected', { category });
  clarity('computer_category', category);
}

/** "View Parts List" button on a build card clicked. */
export function trackBuildPartsListClicked(buildTitle: string): void {
  ga('build_parts_list_clicked', { build_title: buildTitle });
}

/** "View Build Guides" scroll-to button clicked. */
export function trackViewBuildGuidesClicked(): void {
  ga('view_build_guides_clicked');
}

// ─── Blog Events ──────────────────────────────────────────────────────────────

/** Article card or link clicked. */
export function trackArticleOpened(articleId: number, title: string, articleType: string): void {
  ga('article_opened', { article_id: articleId, article_title: title, article_type: articleType });
  clarity('article_opened', title);
}

/** Blog filter tab clicked. */
export function trackBlogFilterSelected(filter: string): void {
  ga('blog_filter_selected', { filter });
}

/** "Load More Articles" clicked. */
export function trackLoadMoreArticles(): void {
  ga('load_more_articles_clicked');
}

// ─── Reviews Events ───────────────────────────────────────────────────────────

/** A review roundup card viewed / clicked. */
export function trackReviewViewed(reviewTitle: string, category: string): void {
  ga('review_viewed', { review_title: reviewTitle, review_category: category });
  clarity('review_viewed', reviewTitle);
}

/** "Read Full Review" CTA clicked on the featured review. */
export function trackReadFullReview(productName: string): void {
  ga('read_full_review_clicked', { product_name: productName });
  clarity('read_full_review', productName);
}

/** "View Deal" button in the comparison table clicked. */
export function trackComparisonViewDeal(productName: string, position: string): void {
  ga('comparison_view_deal_clicked', { product_name: productName, position });
  clarity('comparison_deal', productName);
}

// ─── User Engagement Events ───────────────────────────────────────────────────

/** Scroll depth milestone reached. depth: 25 | 50 | 75 | 100 */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100, page: string): void {
  ga('scroll_depth', { depth_percent: depth, page_path: page });
  if (depth >= 75) clarity('scroll_depth', `${depth}% — ${page}`);
}

/** Time on page milestone (30s, 60s, 120s, 300s). */
export function trackTimeOnPage(seconds: number, page: string): void {
  ga('time_on_page', { seconds, page_path: page });
}

/** Navbar link or mobile menu link clicked. */
export function trackNavigationClick(label: string, href: string): void {
  ga('navigation_menu_click', { link_label: label, link_url: href });
}

/** Footer link clicked (legal, social, category, company). */
export function trackFooterLinkClick(label: string, href?: string): void {
  ga('footer_link_click', { link_label: label, link_url: href ?? 'unknown' });
}

/** Any outbound / external link clicked. */
export function trackExternalLinkClick(url: string, label?: string): void {
  ga('external_link_click', { url, link_label: label ?? url });
  clarity('external_link', new URL(url).hostname);
}

// ─── Scroll Depth Helper (call once per page mount) ─────────────────────────

/**
 * Attaches a single scroll listener that fires each depth milestone only once.
 * Returns a cleanup function.
 */
export function attachScrollDepthTracker(page: string): () => void {
  const milestones: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100];
  const fired = new Set<number>();

  const handler = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const pct = (scrolled / total) * 100;

    for (const m of milestones) {
      if (!fired.has(m) && pct >= m) {
        fired.add(m);
        trackScrollDepth(m, page);
      }
    }
  };

  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}

/**
 * Starts a time-on-page tracker. Fires at 30s, 60s, 120s, 300s milestones.
 * Returns a cleanup function.
 */
export function attachTimeOnPageTracker(page: string): () => void {
  const milestones = [30, 60, 120, 300];
  const timers: ReturnType<typeof setTimeout>[] = [];

  for (const s of milestones) {
    const t = setTimeout(() => trackTimeOnPage(s, page), s * 1000);
    timers.push(t);
  }

  return () => timers.forEach(clearTimeout);
}

/**
 * Attaches a document-level click listener for external links (target="_blank").
 * Returns a cleanup function.
 */
export function attachExternalLinkTracker(): () => void {
  const handler = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;
    const isExternal =
      href.startsWith('http') &&
      !href.includes('smartpicksdaily.com') &&
      target.getAttribute('target') === '_blank';
    if (isExternal) {
      trackExternalLinkClick(href, target.textContent?.trim());
    }
  };
  document.addEventListener('click', handler, true);
  return () => document.removeEventListener('click', handler, true);
}
