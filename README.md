# Nuxtware

A Nuxt 3 layer with Shopware integration for building e-commerce frontends.

## Quick Start

```bash
npm install
npm dev
```

## Documentation

Detailed documentation is available in the `/docs` directory:

- [Project Overview](/docs/project-overview.md) - High-level overview of the project
- [Coding Standards](/docs/coding-standards.md) - Code formatting and style guidelines
- [I18n Guide](/docs/i18n-guide.md) - Internationalization implementation and best practices
- [Common Workflows](/docs/common-workflows.md) - Step-by-step guides for common tasks

### Working with AI Assistant

To maximize productivity when using Claude or other AI assistants with this project:

1. Start with: "Please read the documentation in the /docs directory to understand the project standards before we begin."

2. For updates after project changes: "I've made some changes to the project since we last spoke. Please review the current state of the codebase and update the documentation in the /docs directory to reflect these changes. Specifically, we've [description of changes]. Make sure the documentation accurately reflects our current standards, workflows, and project structure."

## Development

### Shopware Configuration

Create `.env` file in `/.playground`:

```
NUXT_PUBLIC_SHOPWARE_ENDPOINT = 'https://my-shopware.com/store-api/'
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN = 'SWXXXXXXXXXXXXXXXXXXXX'
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL = 'https://my-shopware.com'
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm dev
```

### Production

Build the application for production:

```bash
npm build
```

Or statically generate it with:

```bash
npm generate
```

Locally preview production build:

```bash
npm preview
```

## Distribution

This Nuxt layer can be published to NPM. Check if `files` in `package.json` are valid, then run:

```bash
npm publish --access public
```

Users can install it with:

```bash
npm install --save nuxtware
```

And add it to their Nuxt configuration:

```ts
defineNuxtConfig({
  extends: 'nuxtware'
})
```

## Additional Resources

For more information about Shopware API integration and advanced configurations, please refer to the [API Client](/docs/api-client.md) documentation.

## Api Constraints (differences to Storefront)

- Rendering correct "from price" in listing, see composables composables/useProductPriceCustom.ts for detailed info and solutions
- Store API lacks endpoint to check if current customer has already reviewed a specific product (requires client-side tracking via localStorage)
- Store API does not provide PATCH endpoint for updating existing reviews (edit functionality not available) 


## Roadmap

Nuxtware:
- [x] Listing:
    - [x] Pagination
    - [x] Limiter
    - [x] Sorter
    - [x] Filter
    - [x] Category Sidebar Navigation
    - [x] Card
- [ ] Detail:
    - [x] Gallery
    - [x] Buybox
      - Prices, Availability, Delivery Time, Reviews Link, Qty Selector, Add-To-Cart Button, Wishlist-Toggle, Sku
    - [x] Variant Selection
    - [x] Tabs: Description / Reviews
        - [x] Description
        - [x] Reviews
    - [x] X-Selling (Product Carousel)
- [x] Cart
- [x] Checkout
- [x] Wishlist
- [x] Account
    - [x] Login
    - [x] Register
    - [x] Password forgot
    - [x] Overview
    - [x] Orders
    - [x] Profile
    - [x] Addresses
- [ ] CMS
    - [ ] Blocks and elements from "community edition"
        - [ ] Blocks
            - [ ] Text Variations
            - [ ] Image Variations
            - [ ] Video Variations
            - [ ] Text & Image Variations
        - [ ] Elements
            - [ ] Image
            - [ ] Text
            - [ ] Video
            - [ ] Formular
            - [ ] HTML
    - [ ] Blocks and elements from "licensed edition"
        - [ ] Elements
            - [ ] 3D
- [ ] Skiplinks
- [x] Scroll To Top
- [x] Newsletter Form
- [ ] Popups (Modals)
- [x] Footer
- [x] Topbar / Banderole
- [ ] Brands Page
- [ ] Refactor \<img\> to use nuxt-image component instead
- [ ] Add Consent Modal to Video CMS Element
- [ ] Add Cookie Consent
- [ ] Language Switch
- [ ] Currency Switch