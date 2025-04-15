# Project Overview

## Architecture

Nuxtware is a Nuxt 3 project with TypeScript that's set up as a reusable component library/layer. The project integrates with Shopware for e-commerce functionality.

## Key Technologies

- **Frontend Framework**: Nuxt.js 3.16.0 with Vue.js 
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: i18n (English and German)
- **E-commerce Integration**: Shopware via `@shopware/nuxt-module`

## Directory Structure

```
nuxtware/
├── .playground/       # Development sandbox
├── app/               # Main application code
│   ├── assets/        # Static assets and styles
│   ├── components/    # Vue components
│   ├── composables/   # Reusable composition functions
│   ├── layouts/       # Page layouts
│   └── pages/         # Route pages
├── i18n/              # Translation files
│   ├── de-DE/         # German translations
│   └── en-GB/         # English translations
└── server/            # Server-side code
    └── routes/        # API routes
```

## Component Organization

Components are organized by feature/function:

- `category/` - Category-related components
- `component/` - Base UI component wrappers
- `context/` - Context providers (language, currency)
- `foundation/` - Core UI elements
- `mega-menu/` - Navigation menu components
- `product/` - Product display components
- `search/` - Search functionality
- `sidenav/` - Mobile navigation
- `structure/` - Layout structure components

## I18n Structure

Translations are organized by feature in separate JSON files:
- `cart.json` - Shopping cart translations
- `checkout.json` - Checkout process translations
- `form.json` - Form element translations
- `header.json` - Header component translations
- etc.
