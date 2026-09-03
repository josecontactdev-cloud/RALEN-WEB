# RALEN-WEB

Custom Shopify theme for RALEN.

## Phase 1 — Brand shell
- Dark minimal visual system
- Split-text intro with GSAP
- Configurable header
- Trend-ready hero with editable image, product, copy, CTA and badge
- Responsive and reduced-motion support

## Phase 2 — Commerce home
- Editorial featured-product grid
- Brand manifesto
- Trust/assurance strip
- Minimal footer
- Scroll reveals

## Phase 3 — Shopping experience
- Adaptive product grids
- Custom product page and gallery
- Variant and quantity controls
- Custom cart and collection templates
- Responsive conversion layouts

## Phase 4 — Mobile & production readiness
- Full-screen accessible mobile navigation
- Mobile sticky add-to-cart bar
- Responsive search experience
- Default content, contact and 404 templates
- Automatic policy links when configured in Shopify
- SEO/social metadata and product structured data
- Page-specific asset loading for better performance
- Safe-area, touch-target and iOS form handling

## Phase 5 — Conversion & merchandising
- Reusable product-card system
- Quick add for products without variant selection
- AJAX cart drawer with quantity and remove controls
- Live cart count and subtotal updates
- Native Shopify product recommendations
- Newsletter capture using Shopify customer forms
- Desktop and full-screen mobile cart-drawer layouts
- Shopify Theme Check CI on pull requests and main

## Phase 6 — Launch polish & trust
- Optional configurable announcement bar
- Product FAQ system with editable blocks
- Real Shopify policy links near purchase actions
- Active payment-method icons from Shopify
- Optional free-shipping progress bar with an honest merchant-defined threshold
- Product, cart and checkout lifecycle events prepared for a future analytics stack
- Mobile-first styling for all new trust and conversion components

## Shopify setup notes
- Assign a navigation menu to **RALEN Header**.
- Select a collection in **RALEN Productos**.
- Create a Shopify page and assign the `contact` template to use the RALEN contact form.
- Configure shipping, refund, privacy and terms policies in Shopify; configured policies appear automatically in the footer and relevant purchase surfaces.
- Enable **RALEN Aviso** only when you have a real message worth showing.
- Leave the cart drawer free-shipping target at `0` unless your actual shipping policy includes free shipping above a defined amount.
- Quick add automatically sends products with variants to the product page instead of guessing a variant.
- The hero remains data-driven so Phase 7 can automate featured product/image selection without redesigning the page.
