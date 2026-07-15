# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nuxtware** is a Nuxt 4 layer designed for e-commerce with Shopware integration. It's architected as a reusable component library that can be published to NPM and extended by other Nuxt projects.

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

- **Framework**: Nuxt.js 4 with Vue.js 3 Composition API
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

- Use theme tokens from app/assets/styles/main.css: `border-border`, `text-primary`
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
- Run `npx nuxt typecheck` after implementations (see the [TypeScript](#typescript) section)
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

## TypeScript

The project uses TypeScript with strict typing and `<script setup lang="ts">` for all components.

### Patterns
- Use explicit interfaces for component props and emits
- Access reactive values with `.value` for refs/computed
- **Never use `any`.** Prefer type guards, `?? fallback`, optional chaining, `as const`, or an explicit interface. A narrow cast (`as SpecificType`) is acceptable only when the value is genuinely known to be that type (e.g. a value the surrounding logic has already validated).
- Handle union types with proper type guards (`'property' in object` patterns); apply `(item as SpecificType)` only when necessary. See `StructureElementImageGallery.vue` for handling complex union types.

### Type Declaration Locations

Where a type is declared depends on what it describes and how widely it is used:

- **Non-API types, used once** → declare inline in the file where they are used (e.g. a component's local prop/emit interface, a ref shape).
- **Non-API types, used in multiple files** → declare in `app/types/` (auto-imported via the `types/*` import dir).
- **API-related types** (anything derived from or overriding the Shopware Store API schema) → declare in `api-types/storeApiTypes.overrides.ts`. This is the only versioned file in `api-types/`.
- **Global/ambient types** (e.g. `window`, Nuxt `RuntimeConfig`/`PublicRuntimeConfig` augmentation) → declare in `/nuxt.d.ts`.

The generated schema files `api-types/storeApiSchema.json` and `api-types/storeApiTypes.d.ts` are **not versioned** — they are fetched per project (and may come from a customer instance with custom endpoints/entities), so they are `.gitignore`d. Only `storeApiTypes.overrides.ts` is committed; put schema/operation corrections there so they survive a re-fetch.

### Validation & Error Resolution

Always run `npx nuxt typecheck` after implementations to catch type errors.

1. Run `npx nuxt typecheck` to identify type errors
2. Filter errors for specific files using `npx nuxt typecheck 2>&1 | grep "filename.vue"`
3. Common fixes:
   - Use nullish coalescing `?? 0` for potentially undefined values
   - Add optional chaining `?.` for safe property access
   - Add conditional rendering `v-if` to ensure objects exist before use
   - Handle union types with proper type guards

### Known Upstream Typecheck Errors

`npx nuxt typecheck` currently reports **2 errors that live inside `node_modules`** and are **not fixable from this repo** (editing `node_modules` is not durable or versioned). They originate from the upgraded Shopware dependency stack, not from our code — treat a typecheck run as clean when only these remain:

- `@shopware/nuxt-module/plugin.ts` — `import ... from "./src"` while the package only ships `dist/` (upstream packaging bug).
- `@shopware/composables/.../useNewsletter.ts` — `result.data.status` where the api-client return type resolves to `never` inside the composables package's own type context.

Do not attempt to "fix" these by casting to `any`, editing `node_modules`, or broadly excluding those packages from the generated tsconfig.

### Linting Exceptions

- When the linter shows an error for an unused const "prop", it's okay to use `// eslint-disable-next-line @typescript-eslint/no-unused-vars`.

## Important Notes

- The project uses `.playground/` directory for development
- Icons are from Lucide icon set, use `FoundationIcon` component
- All components must support SSR (server-side rendering)
- Layer can be published to NPM and extended by other projects
- Always check existing documentation in `/docs/` before implementing new patterns

## Rendering Patterns

- Always use `<ClientOnly>` with a fallback when conditionally rendering based on user authentication state or any other client-side reactive data that's not available during SSR.

## Specific Guidelines for Client-Side Rendering

- **Client-Side Conditional Rendering**: 
  - Always use `<ClientOnly>` with a fallback when conditionally rendering based on user authentication state or any other client-side reactive data that's not available during SSR.

## Agent skills

### Issue tracker

Issues tracked in GitHub Issues on `hubblecommerce/nuxtware` (via the `gh` CLI, pinned with `-R hubblecommerce/nuxtware` since `origin` is a GitLab remote). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
