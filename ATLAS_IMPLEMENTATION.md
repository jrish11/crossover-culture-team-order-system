# Atlas Implementation Guide

This repo is prepared so ChatGPT agent mode in Atlas can implement the premium storefront shell into a duplicate Shopify theme with minimal guessing.

## Goal

Add the premium Crossover Culture storefront shell while preserving all protected custom-order product systems.

Use Atlas only against a duplicated Shopify theme, never the live theme first.

## Source Of Truth

Atlas should use these files from this repo:

### Safe storefront shell files to copy into the duplicate theme

- `assets/crossover-culture-storefront.css`
- `assets/crossover-culture-storefront.js`
- `sections/cc-homepage-shell.liquid`
- `sections/cc-collection-shell.liquid`
- `sections/cc-product-shell.liquid`
- `snippets/cc-store-header.liquid`
- `snippets/cc-store-footer.liquid`
- `snippets/cc-collection-card.liquid`
- `templates/index.json`
- `templates/collection.json`
- `templates/product.json`

### Final homepage concept image

- `references/crossover-culture-homepage-concept.png`

If Atlas needs a visual target for the homepage, use that image.

## Files Atlas Must Not Modify

These are protected custom-order system files and must remain untouched:

- `templates/product.custom-team-uniform.json`
- `templates/product.custom-shooting-shirt.json`
- `templates/product.custom-travel-gear.json`
- `templates/product.custom-polo.json`
- `sections/team-order-form.liquid`
- `sections/custom-shooting-shirt.liquid`
- `sections/custom-travel-gear.liquid`
- `sections/custom-polo.liquid`
- `assets/team-order-form.css`
- `assets/team-order-form.js`
- `assets/custom-shooting-shirt.css`
- `assets/custom-shooting-shirt.js`
- `assets/custom-travel-gear.css`
- `assets/custom-travel-gear.js`
- `assets/custom-polo.css`
- `assets/custom-polo.js`
- `snippets/team-feature-icons.liquid`
- `snippets/team-size-guide.liquid`

Atlas must also not alter:

- roster builders
- size breakdown logic
- font selectors inside protected forms
- color selector logic inside protected forms
- artwork upload behavior
- protected validation logic
- protected line item properties
- special protected add-to-cart flows

## Collections Required In The Storefront Shell

These collections must appear in the homepage and storefront experience:

- Reversible Jerseys
- Reversible Basketball Uniforms
- Basketball Uniforms
- Shooting Shirts
- Hoodies & Fleece
- Travel Gear
- Practice Shorts
- Base Layers
- Accessories

## Expected Collection Handles

The shell currently assumes these collection handles:

- `reversible-jerseys`
- `reversible-basketball-uniforms`
- `basketball-uniforms`
- `shooting-shirts`
- `hoodies-fleece`
- `travel-gear`
- `practice-shorts`
- `base-layers`
- `accessories`

If the live Shopify store uses different handles, Atlas should stop and report the mismatch instead of guessing.

## Expected Custom Product Routes

The shell currently defaults to these product routes:

- `/products/custom-team-uniform`
- `/products/custom-shooting-shirt`
- `/products/custom-travel-gear`
- `/products/custom-polo`

If the live Shopify store uses different product handles, Atlas should update the section settings in the theme editor if possible, or stop and report the mismatch.

## Homepage Behavior

The homepage uses:

- one immersive hero scene
- clickable collection hotspots over the hero
- a collection discovery grid
- supporting story and route sections
- premium header and footer chrome

If Atlas uses the baked hero concept image in `references/crossover-culture-homepage-concept.png`, then:

- set `Show headline and hero copy over the scene` to `off`

That image already contains the headline and hotspot-style labels visually, so duplicate overlay copy should be avoided.

If Atlas later swaps to a clean photography-only hero, then:

- set `Show headline and hero copy over the scene` to `on`

## Recommended Shopify Implementation Sequence

1. Duplicate the current Shopify theme.
2. Rename the duplicate to something clearly marked as staging.
3. Open `Edit code` on the duplicate theme.
4. Copy only the safe storefront shell files listed above.
5. Do not open or edit any protected custom-order file listed above.
6. Open the duplicate theme in `Customize`.
7. Confirm the homepage uses the `CC Homepage Shell`.
8. Upload or reference `references/crossover-culture-homepage-concept.png`.
9. Set the homepage hero image to that asset.
10. Turn `Show headline and hero copy over the scene` off when using that baked concept image.
11. Adjust the 9 homepage hotspot positions so they align with the scene.
12. Verify each hotspot links to the correct collection.
13. Verify collection pages render with the premium collection shell.
14. Verify standard non-custom product pages render with the premium product shell.
15. Verify protected custom products still use their dedicated custom templates.
16. Test homepage, collection pages, standard product pages, and protected custom-order pages on desktop and mobile.
17. Report any collection-handle or product-route mismatches before publishing anything.

## What Counts As Success

Success means:

- homepage is premium and immersive
- all 9 collections are clearly merchandised
- navigation is elevated
- collection discovery is stronger
- standard non-protected product pages are improved
- protected custom-order systems remain unchanged

## What Atlas Should Report Back

Atlas should report:

- which safe storefront shell files were added or replaced
- whether the homepage hero image was set successfully
- whether any collection handles differed from the defaults
- whether any custom product routes differed from the defaults
- confirmation that protected custom-order files were not modified
- any blockers in Shopify theme editor or file upload flow
