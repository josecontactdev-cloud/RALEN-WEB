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

## Phase 7 — Dynamic merchandising
- Hero can stay manual, follow the first available product in a Shopify collection, or rotate daily through a candidate collection
- Dynamic modes use the collection order already managed by Shopify
- Manual product remains a safe fallback
- Selected merchandising state is exposed for future analytics and automation integrations
- Dynamic hero remains visually consistent, so product selection can change without redesigning the storefront
- Operating and future-automation contract documented in `docs/TREND_ENGINE.md`

## Phase 8 — Premium setup store
- RALEN repositioned around premium/minimal tech accessories for desk, mobile, charging and carry
- Immersive split-text landing intro and tech-focused hero
- Product viewer with mask reveal, pointer depth and configurable dynamic merchandising
- Setup-system category rail with native horizontal touch navigation on mobile
- Continuous signal marquee and light editorial philosophy chapter
- Setup-first fallback navigation when Shopify menus are not configured yet
- Responsive layouts tuned for phone screens, safe touch interaction and reduced-motion preferences
- Product-card and product-page language aligned to the new setup positioning
- Brand and merchandising operating guide in `docs/SETUP_DIRECTION.md`

## Shopify setup notes
- Assign a navigation menu to **RALEN Header** if you want custom links. Without one, the theme falls back to Setup / Shop / About.
- Create **Desk**, **Mobile**, **Charge** and **Carry** collections and map them to the `RALEN Setup Systems` blocks.
- Select a collection in **RALEN Productos**.
- Create a Shopify page and assign the `contact` template to use the RALEN contact form.
- Configure shipping, refund, privacy and terms policies in Shopify; configured policies appear automatically in the footer and relevant purchase surfaces.
- Enable **RALEN Aviso** only when you have a real message worth showing.
- Leave the cart drawer free-shipping target at `0` unless your actual shipping policy includes free shipping above a defined amount.
- Quick add automatically sends products with variants to the product page instead of guessing a variant.
- For dynamic hero merchandising, create a source collection and choose how Shopify should order it: best-selling, newest, or manual. See `docs/TREND_ENGINE.md`.
- For visual/product curation guidance, see `docs/SETUP_DIRECTION.md`.
