# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nuxtware** is a Nuxt 3 layer designed for e-commerce with Shopware integration. It's architected as a reusable component library that can be published to NPM and extended by other Nuxt projects.

## Development Commands

### Essential Commands
```bash
npm dev                # Start development server (uses .playground directory)
npm build             # Build for production
npm generate          # Generate static files
npm preview           # Preview production build
npm lint              # Run ESLint
```

### Environment Setup
Create `.env` file in `/.playground` directory:
```env
NUXT_PUBLIC_SHOPWARE_ENDPOINT = 'https://my-shopware.com/store-api/'
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN = 'SWXXXXXXXXXXXXXXXXXXXX'
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL = 'https://my-shopware.com'
```

## Architecture & Key Technologies

- **Framework**: Nuxt.js 3.16.0 with Vue.js 3 Composition API
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS v4 with custom design system
- **E-commerce**: Shopware integration via `@shopware/nuxt-module`
- **I18n**: English (en-GB) and German (de-DE) support
- **Development**: 4-space indentation, ESLint, no semicolons

## Component Organization (Atomic Design)

Components follow atomic design principles:

- **`foundation/`** - Atoms (FoundationButton, FoundationInput, FoundationIcon)
- **`component/`** - Molecules (ComponentCarousel, ComponentDropdown)
- **Feature directories** - Organisms (cart/, product/, search/, mega-menu/)
- **`structure/`** - Templates (StructurePage, StructureSection, blocks/elements)

## Critical Coding Standards

### Component Requirements
All components MUST be:
1. **Zero dependencies** (base deps only: Vue, VueUse, Tailwind, CSS, HTML5)
2. **Configurable/Reusable** with proper TypeScript interfaces
3. **Fully typed** with TypeScript
4. **Theme-able** using existing design system tokens
5. **Translatable** - all text uses `$t()` i18n keys
6. **Accessible** - semantic HTML, ARIA labels, keyboard support, screen readers
7. **SEO-friendly** - SSR support, semantic HTML

### Code Style
- **4-space indentation** (enforced globally)
- **`<script setup lang="ts">`** syntax
- **Self-closing tags** for void elements (`<img>`, `<input>`)
- **No semicolons** at statement ends
- **Single quotes** for strings
- **Foundation components** preferred over custom styling

### TypeScript Patterns
- Use explicit interfaces for component props
- Access reactive values with `.value` for refs/computed
- Handle union types properly (see StructureElementImageGallery for example)
- Use type guards for complex type narrowing

## Key Composables & Patterns

- **`useCarousel()`** - Advanced carousel with responsive, SSR-ready, scroll-based implementation
- **`useCart()`** - Cart operations and state management
- **`usePrice()`** - Price formatting with `getFormattedPrice()`
- **`useApiErrorsResolver()`** - Generic API error handling
- **`useLocalePath()`** - Internationalized routing

## I18n Implementation

- Translations organized by feature in `/i18n/[locale]/` directories
- Each feature has its own JSON file (cart.json, product.json, etc.)
- Use `$t('feature.key')` for all user-facing text
- Never hardcode translatable strings

## Design System Integration

- Use theme tokens: `border-border`, `text-primary`, `bg-surface`
- Consistent icon sizing: `w-4 h-4` for standard icons
- Responsive patterns: `w-[90%] md:w-[400px]`
- Foundation component props over custom classes

## E-commerce Specific Patterns

- **Cart Management**: Use `useCart()` composable, handle errors as arrays
- **Price Display**: Always use `getFormattedPrice()` from `usePrice()`
- **Product Images**: Use `getBiggestThumbnailUrl()` from `@shopware/helpers`
- **Navigation**: Use `useLocalePath()` for i18n-aware routing
- **Error Handling**: Use `useApiErrorsResolver()` for consistent error management

## Testing & Quality

- Run `npm lint` before committing
- Follow accessibility guidelines (WCAG compliance)
- Ensure responsive design across breakpoints
- Test with screen readers and keyboard navigation
- Verify i18n translations work correctly

## Documentation

Comprehensive documentation available in `/docs/` directory:
- Read `/docs/project-overview.md` for architecture understanding
- Follow `/docs/coding-standards.md` for detailed style guidelines
- Check `/docs/common-workflows.md` for development patterns
- Review `/docs/i18n-guide.md` for internationalization best practices

## TypeScript Troubleshooting

When encountering TypeScript errors with union types (common in CMS components):
- Use type guards with `'property' in object` patterns
- Apply type assertions `(item as SpecificType)` when necessary
- Handle generic types from components like `CarouselItem` with proper casting
- See `StructureElementImageGallery.vue` for handling complex union types

## Important Notes

- The project uses `.playground/` directory for development
- Icons are from Lucide icon set, use `FoundationIcon` component
- All components must support SSR (server-side rendering)
- Layer can be published to NPM and extended by other projects
- Always check existing documentation in `/docs/` before implementing new patterns