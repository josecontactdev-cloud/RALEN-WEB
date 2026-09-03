# RALEN Dynamic Merchandising

Phase 7 makes the hero product data-driven without changing the visual design.

## Modes

### Manual
Uses the product and image selected directly in **RALEN Hero**. This is the safest override and the fallback for every dynamic mode.

### First product from collection
Uses the first available product from the selected source collection. The collection order becomes the merchandising logic.

Useful Shopify collection sorting strategies:
- Best selling: puts current store demand first.
- Newest: highlights recent launches.
- Manual: lets RALEN curate the order directly.

### Daily rotation
Rotates once per calendar day through the first available products in the source collection, up to the configured candidate limit. This avoids changing layout or editing the theme every day.

## Recommended zero-cost setup

1. Create a collection named `RALEN / Selección dinámica`.
2. Add only products that are valid candidates for the hero.
3. Choose the collection sort that matches the goal: best-selling, newest, or manual.
4. In Theme Editor → **RALEN Hero**, select that collection.
5. Choose **Primero de una colección** or **Rotación diaria**.
6. Keep a manual featured product configured as fallback.

You can also make the source collection automatic using a product tag such as `ralen-trend`. That way, adding or removing the tag changes the candidate pool without editing theme code.

## Future automation contract

An external process can later update collection membership/order through Shopify Admin without touching the storefront theme. RALEN will immediately consume the updated source on the next render.

The hero also exposes the resolved state in:
- `window.RalenMerchandising`
- the `ralen:merchandising-ready` browser event
- a JSON payload inside the hero markup

This creates a stable integration point for future analytics or automation.

## Accuracy rule

Do not label a product as "trending", "viral", "best seller", or similar unless the source logic actually supports that claim. The default UI uses neutral language such as **SELECCIÓN RALEN**.
