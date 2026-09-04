# RALEN — Setup direction

## Positioning

RALEN is a curated technology-accessories store for cleaner desks, mobile setups and everyday carry.

**Core line:** `Tech for cleaner setups.`

The store should never feel like a generic gadget catalog. Every product should earn its place through at least two of these filters:

1. Solves a visible setup problem.
2. Reduces clutter or cables.
3. Improves ergonomics or workflow.
4. Looks intentional when left on a desk.
5. Is easy to demonstrate in short-form content.

## Merchandising system

Use four primary systems:

- **DESK** — laptop stands, desk mats, monitor accessories, cable management.
- **MOBILE** — stands, wallets, mounts and compact accessories.
- **CHARGE** — docks, hubs, GaN chargers and cable systems.
- **CARRY** — tech pouches, cable organizers and travel accessories.

Keep the home collection short. Four strong products are better than twenty unrelated gadgets.

## Hero operations

`RALEN Hero` keeps the Phase 7 dynamic merchandising engine:

- `manual`: use the selected product/image.
- `collection_first`: show the first available product from the source collection.
- `daily_rotation`: rotate through the first available candidates.

Use product photography with a neutral/graphite background, simple lighting and enough negative space for the interface overlay. Avoid busy marketplace images, bright RGB scenes and packaging-heavy photos.

## Motion rules

The motion layer is intentionally inspired by immersive portfolio/editorial sites while remaining usable as ecommerce:

- Split-word and staggered text entrances.
- Product-viewer mask reveal.
- Pointer-responsive product depth on desktop only.
- Horizontal category rail on mobile with native touch scrolling.
- Editorial chapter transitions without hijacking the mouse wheel.
- All non-essential motion is disabled by `prefers-reduced-motion`.

Do not add scroll-jacking or mandatory carousel navigation to shopping flows.

## Mobile rules

- Primary CTA becomes full width.
- Product viewer remains above the fold after the hero copy.
- Setup systems become swipeable cards with `scroll-snap`.
- Touch controls retain the existing Phase 4 accessibility rules.
- Avoid tiny floating controls over product imagery.

## Shopify setup checklist

1. Create collections named Desk, Mobile, Charge and Carry.
2. Assign each collection to the matching block inside `RALEN Setup Systems`.
3. Assign a featured collection to `RALEN Productos`.
4. Add a strong hero product or a source collection to `RALEN Hero`.
5. Prefer product images on simple dark/neutral backgrounds.
6. Assign the main navigation menu if custom links are needed; the theme has setup-first fallback navigation when no menu is assigned.
7. Configure Shopify policies before launch.
8. Keep free-shipping thresholds disabled unless the actual shipping policy supports them.

## Visual tokens

- Background: `#050505`
- Paper chapter: `#e8e8e2`
- Signal accent: `#d8ff3e`
- Typography: system sans, oversized editorial display treatment
- UI language: uppercase, indexed, sparse

The signal accent is intentionally used only for status dots, CTAs and micro-interactions. It should not become the dominant page color.
