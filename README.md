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


## Roadmap

Nuxtware:
- [ ] Listing:
    - [x] Pagination
    - [x] Limiter
    - [x] Sorter
    - [ ] Filter
    - [ ] Category Sidebar Navigation
    - [ ] Card
- [ ] Images (Products)
- [ ] Detail:
    - [ ] Gallery
    - [ ] Buybox
    - [ ] Variant Selection
    - [ ] Tabs: Description / Reviews
    - [ ] X-Selling (Product Carousel)
- [ ] Cart
- [ ] Checkout
- [ ] Wishlist
- [ ] Account
    - [ ] Login
    - [ ] Register
- [ ] CMS
- [ ] Skiplinks
- [ ] Scroll To Top
- [ ] Newsletter Form
- [ ] Popups (Modals)
- [ ] Footer
- [ ] Topbar / Banderole 
- [ ] Brands Page