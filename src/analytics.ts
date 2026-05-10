// src/analytics.ts
// Google Analytics 4 utility
// Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID in index.html

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const track = (event: string, params?: Record<string, unknown>) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
};

export const analytics = {
  // Called when user views a product modal
  viewProduct: (product: { id: string; name: string; category: string; price: string }) => {
    track('view_item', {
      currency: 'USD',
      value: parseFloat(product.price.replace('$', '')),
      items: [{ item_id: product.id, item_name: product.name, item_category: product.category }],
    });
  },

  // Called when item added to cart
  addToCart: (product: { id: string; name: string; category: string; price: string }, size: string, color: string, qty = 1) => {
    track('add_to_cart', {
      currency: 'USD',
      value: parseFloat(product.price.replace('$', '')) * qty,
      items: [{ item_id: product.id, item_name: product.name, item_category: product.category, item_variant: `${size} / ${color}`, quantity: qty }],
    });
  },

  // Called when checkout opens
  beginCheckout: (totalUSD: number, itemCount: number) => {
    track('begin_checkout', { currency: 'USD', value: totalUSD, num_items: itemCount });
  },

  // Called after successful payment
  purchase: (orderId: string, totalINR: number, totalUSD: string) => {
    track('purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: parseFloat(totalUSD.replace('$', '')),
      value_inr: totalINR,
    });
  },

  // Called when user searches
  search: (term: string) => {
    track('search', { search_term: term });
  },

  // Called when wishlist toggle
  wishlist: (productId: string, productName: string, action: 'add' | 'remove') => {
    track(action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
      items: [{ item_id: productId, item_name: productName }],
    });
  },
};
