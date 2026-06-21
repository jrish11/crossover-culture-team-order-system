# Crossover Culture Custom Product Pages

## Atlas-Ready Storefront Shell Package

This repo now also includes a safe premium storefront shell package for Shopify implementation.

If ChatGPT agent mode in Atlas is being used for theme work, start here:

- `ATLAS_IMPLEMENTATION.md`
- `ATLAS_AGENT_PROMPT.md`
- `references/crossover-culture-homepage-concept.png`

These files are intended to help Atlas implement the premium storefront shell without modifying the protected custom-order systems.

### Safe storefront shell files

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

### Protected files that must remain untouched

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

## Overview

This repo contains Shopify theme files for four custom product-ordering flows:

- `team-order-form`
  Custom team uniform ordering
- `custom-shooting-shirt`
  Custom shooting shirt ordering
- `custom-travel-gear`
  Custom travel gear ordering for:
  - Enlisted 1/4 Zip
  - Enlisted Crew
- `custom-polo`
  Custom polo ordering for:
  - Enlisted Polo

These templates use native Shopify product form submission to `{{ routes.cart_add_url }}`. They do not use AJAX add-to-cart.

There is no `package.json` in this repo. There is no install, dev server, build, lint, or test command here. Implementation is done by copying these theme files into a Shopify theme.

## Repo Structure

```text
custom product/
├── README.md
├── assets/
│   ├── custom-shooting-shirt.css
│   ├── custom-shooting-shirt.js
│   ├── custom-polo.css
│   ├── custom-polo.js
│   ├── custom-travel-gear.css
│   ├── custom-travel-gear.js
│   ├── team-order-form.css
│   └── team-order-form.js
├── sections/
│   ├── custom-polo.liquid
│   ├── custom-shooting-shirt.liquid
│   ├── custom-travel-gear.liquid
│   └── team-order-form.liquid
├── snippets/
│   ├── team-feature-icons.liquid
│   └── team-size-guide.liquid
└── templates/
    ├── product.custom-polo.json
    ├── product.custom-shooting-shirt.json
    ├── product.custom-team-uniform.json
    └── product.custom-travel-gear.json
```

## Files That Matter Most

- `sections/team-order-form.liquid`
  Main team uniform product section.
- `assets/team-order-form.css`
  Scoped uniform styles.
- `assets/team-order-form.js`
  Uniform gallery, roster, color, validation, and submit behavior.
- `sections/custom-shooting-shirt.liquid`
  Main shooting shirt product section.
- `assets/custom-shooting-shirt.css`
  Shared apparel layout and shooting-shirt-specific styles.
- `assets/custom-shooting-shirt.js`
  Shooting shirt color, size, validation, and submit behavior.
- `sections/custom-travel-gear.liquid`
  Main travel gear product section.
- `assets/custom-travel-gear.css`
  Travel-gear-specific styling on top of the shared apparel layout.
- `assets/custom-travel-gear.js`
  Travel gear color, size, validation, and submit behavior.
- `sections/custom-polo.liquid`
  Main polo product section.
- `assets/custom-polo.css`
  Polo-specific layout adjustments on top of the shared apparel layout.
- `assets/custom-polo.js`
  Polo gallery, color, size, validation, and submit behavior.
- `templates/product.custom-team-uniform.json`
  Product template that mounts `team-order-form`.
- `templates/product.custom-shooting-shirt.json`
  Product template that mounts `custom-shooting-shirt`.
- `templates/product.custom-travel-gear.json`
  Product template that mounts `custom-travel-gear`.
- `templates/product.custom-polo.json`
  Product template that mounts `custom-polo`.

## Shopify Installation

1. In Shopify Admin, open `Online Store -> Themes`.
2. On the target theme, click `... -> Edit code`.
3. Create or replace these files:
   - `sections/team-order-form.liquid`
   - `sections/custom-shooting-shirt.liquid`
   - `sections/custom-travel-gear.liquid`
   - `sections/custom-polo.liquid`
   - `templates/product.custom-team-uniform.json`
   - `templates/product.custom-shooting-shirt.json`
   - `templates/product.custom-travel-gear.json`
   - `templates/product.custom-polo.json`
   - `assets/team-order-form.css`
   - `assets/team-order-form.js`
   - `assets/custom-shooting-shirt.css`
   - `assets/custom-shooting-shirt.js`
   - `assets/custom-polo.css`
   - `assets/custom-polo.js`
   - `assets/custom-travel-gear.css`
   - `assets/custom-travel-gear.js`
   - `snippets/team-size-guide.liquid`
   - `snippets/team-feature-icons.liquid`
4. Save the files.

## Template Assignment

Assign each product to the matching template in the Shopify product admin:

- `custom-team-uniform`
  Use for custom uniform products.
- `custom-shooting-shirt`
  Use for custom shooting shirt products.
- `custom-travel-gear`
  Use only for:
  - Enlisted 1/4 Zip
  - Enlisted Crew
- `custom-polo`
  Use for:
  - Enlisted Polo

Do not assign `custom-travel-gear` to polo products. Polo has its own dedicated template.

## Travel Gear Mapping Rules

`sections/custom-travel-gear.liquid` uses the product title to choose between the two supported catalog setups:

- Titles containing `crew`
  Use the Crew configuration.
- All other supported travel-gear titles
  Use the 1/4 Zip configuration.

For clean implementation, keep the actual product titles explicit:

- `Enlisted 1/4 Zip`
- `Enlisted Crew`

## Theme Editor Settings

### Team Uniform

Configured through `product.custom-team-uniform.json` / `team-order-form`:

- `Minimum Players`

### Shooting Shirt

Configured through `product.custom-shooting-shirt.json` / `custom-shooting-shirt`:

- `Delivery Time`
- `Minimum Order Text`
- `Contact Page URL`
- `Minimum Pieces`
- `Intro Copy`

### Travel Gear

Configured through `product.custom-travel-gear.json` / `custom-travel-gear`:

- `Minimum Order Text`
- `Contact Page URL`
- `Minimum Pieces`
- `1/4 Zip Intro Copy`
- `Crew Intro Copy`

### Polo

Configured through `product.custom-polo.json` / `custom-polo`:

- `Minimum Order Text`
- `Contact Page URL`
- `Minimum Pieces`
- `Intro Copy`

## Runtime Behavior

All four flows:

- submit through the native Shopify product form
- store custom selections as line item properties
- require one vector upload
- validate required fields before submit

Accepted upload extensions:

- `.svg`
- `.ai`
- `.eps`

## Expected Cart / Order Data

Examples of saved line item properties:

### Team Uniform

```text
Team Name: Panthers
Main Color: #FFFFFF (White)
Number Color: #111111 (Black)
Alt Color: #003DA5 (Royal Blue)
Style: Home
Player Count: 8
Roster: 1. WILLIAMS #30 Men's L | 2. JOHNSON #23 Men's XL
Number & Name Font: Athletic
Sample Size: Men's L
Team Logo Upload: [uploaded vector file]
```

### Shooting Shirt

```text
Team Wording: Panthers
Wording Font: Athletic
Shirt Color: #FFFFFF (White)
Words + CC Logo Color: #111111 (Black)
Size Breakdown: Mens M x 6 | Youth YL x 2
Total Pieces: 8
Artwork Upload: [uploaded vector file]
```

### Travel Gear

```text
Team Wording: Panthers
Team Font: ATHLETIC
Garment Type: 1/4 Zip
Garment Color: #111111 (Black)
Logo / Artwork Color: #FFFFFF (White)
Size Breakdown: Mens L x 4 | Womens WM x 2 | Youth YM x 1
Total Pieces: 7
Artwork Upload: [uploaded vector file]
```

### Polo

```text
Team Wording: Panthers
Team Font: ATHLETIC
Garment Type: Polo
Garment Color: #111111 (Black)
Logo / Artwork Color: #FFFFFF (White)
Size Breakdown: Mens L x 4 | Womens WM x 2
Total Pieces: 6
Artwork Upload: [uploaded vector file]
```

## Cart Theme Requirement

The theme cart must render line item properties and uploaded file links. If the cart hides `item.properties`, the custom order details will still submit, but the customer and staff will not see them in the cart UI.

## Recommended QA Before Launch

1. Open one product for each template:
   - `custom-team-uniform`
   - `custom-shooting-shirt`
   - `custom-travel-gear`
   - `custom-polo`
2. Confirm the gallery thumbnails swap the main image.
3. Confirm all required fields block submission when empty.
4. Confirm invalid upload types are rejected.
5. Confirm valid vector uploads submit.
6. Confirm cart line item properties render correctly.
7. Confirm desktop, tablet, and mobile layouts.
8. Confirm the travel-gear template is assigned only to 1/4 Zip and Crew products.
9. Confirm the polo template is assigned only to polo products.
10. Confirm the women’s sizing display matches the actual size inputs for both travel-gear products and the polo product.

## Current Repo Notes

- `team-feature-icons.liquid` is legacy and not required by the current page layouts.
- The font previews in the travel-gear and uniform references use CSS approximations unless the real licensed font files are added to the theme separately.
