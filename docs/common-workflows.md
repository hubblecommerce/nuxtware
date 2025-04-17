# Common Workflows

This document outlines common tasks and workflows for the Nuxtware project.

## Development Setup

1. Install dependencies with `npm install`
2. Start the development server with `npm run dev`
3. Test changes in the playground environment

## Adding New Components

1. Create the component file in the appropriate subdirectory of `app/components/`
2. Define props using TypeScript interfaces
3. Use `<script setup lang="ts">` syntax
4. Add necessary translations to i18n files
5. Document component usage and props
6. Follow the component implementation best practices:
   - Use existing composables instead of direct API calls
   - Properly type all props, emits, and data
   - Leverage Foundation components for UI elements
   - Use theme tokens instead of hardcoded colors/values
   - Ensure all text is internationalized
   - Apply accessibility best practices

## Translation Workflow

1. Identify untranslated text in components
2. Add keys to appropriate translation files
3. Implement translations in all language files
4. Replace hardcoded text with `$t()` calls
5. Test with language switching to verify

## Fixing Translation Issues

1. Search for hardcoded text in Vue files
2. Create appropriate translation keys
3. Add translations to all language files
4. Replace hardcoded text with translation calls
5. Verify everything works with language switching

## Working with Shopware Integration

1. Use the Shopware composables for data fetching
2. Follow the established patterns for product and category display
3. Test thoroughly with the Shopware API

## Working with Cart Functionality

1. Use the `useCart()` composable for cart operations
2. Use the `useApiErrorsResolver()` composable for error handling
3. Implement proper error handling with TypeScript types
4. Use `getFormattedPrice()` from `usePrice()` for all price displays
5. Handle all cart states: loading, empty, error, and populated
6. Test cart operations to ensure they update properly
7. Ensure proper internationalization of all cart-related text

## Adding New Pages

1. Create a new page in the `app/pages/` directory
2. Implement the page using existing components
3. Add any required translations
4. Test navigation and functionality

## CSS and Styling

1. Use Tailwind utility classes for most styling needs
2. For complex components, use the component-specific CSS files
3. Follow the project's design system for colors and spacing
