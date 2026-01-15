# Nuxtware

A production-ready Nuxt 4 layer with Shopware integration for building modern e-commerce frontends. Built with Vue 3, TypeScript, and Tailwind CSS v4.

## Features

- Complete Shopware 6 e-commerce integration
- Product listing with filtering, sorting, and pagination
- Product detail pages with variant selection
- Shopping cart and checkout flow
- Customer account management
- Wishlist functionality
- CMS content management with customizable blocks
- Multi-language support (i18n)
- Accessible and SEO-friendly components
- Fully typed with TypeScript
- Responsive design with Tailwind CSS

## Installation

Install the package via npm:

```bash
npm install @hubblecommerce/nuxtware
```

## Setup

### 1. Extend Your Nuxt Configuration

Add Nuxtware as a layer in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
    extends: ['@hubblecommerce/nuxtware']
})
```

### 2. Configure Shopware Connection

Create a `.env` file in your project root with your Shopware credentials:

```env
NUXT_PUBLIC_SHOPWARE_ENDPOINT='https://your-shopware-instance.com/store-api/'
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN='SWXXXXXXXXXXXXXXXXXXXX'
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL='https://your-shopware-instance.com'
```

### 3. Start Development

```bash
npm run dev
```

Your Nuxt application will now have access to all Nuxtware components, composables, and pages.

## Usage

Nuxtware provides ready-to-use pages and components for common e-commerce scenarios:

- Product listing pages
- Product detail pages
- Shopping cart
- Checkout process
- Customer account pages
- Wishlist

All components follow atomic design principles and are fully customizable through props and Tailwind CSS.

## Documentation

For detailed documentation, component references, and advanced configuration:

- [Project Overview](/docs/project-overview.md) - Architecture and structure
- [Coding Standards](/docs/coding-standards.md) - Development guidelines
- [I18n Guide](/docs/i18n-guide.md) - Internationalization setup
- [Common Workflows](/docs/common-workflows.md) - Development patterns
- [Roadmap](/docs/roadmap.md) - Feature progress and planned enhancements

## Technology Stack

- **Framework**: Nuxt.js 4
- **UI Library**: Vue.js 3 (Composition API)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **E-commerce**: Shopware 6 via `@shopware/nuxt-module`
- **Internationalization**: Built-in i18n support

## Contributing

Contributions are welcome! Please refer to the documentation in the `/docs` directory for coding standards and development workflows.

## License

MIT 

