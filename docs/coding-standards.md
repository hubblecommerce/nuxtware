# Coding Standards

This document outlines the coding standards and style guidelines for the Nuxtware project.

## Formatting

- **Indentation**: Use 4 spaces for indentation (not tabs)
- **Quotes**: Prefer single quotes for JavaScript/TypeScript strings
- **Semicolons**: Don't use semicolons at the end of statements
- **Line Length**: Aim to keep lines under 100 characters

## Vue Components

- Use `<script setup lang="ts">` syntax for Vue components
- Component names should use PascalCase
- Props should be properly typed with TypeScript interfaces
- Use composition API instead of options API
- Use self-closing tags for HTML elements that don't have content (e.g., `<slot />`)
- Rely on Nuxt's auto-imports for Vue functions instead of explicit imports
- Avoid inline CSS in SFCs - use external CSS files in the assets/styles directory
- Avoid dynamic Tailwind class names (e.g., `bg-${color}-500`) as they won't be detected by Tailwind's purging process
- Components must follow these requirements:
  1. Zero dependencies (base deps only e.g.: Vue, VueUse, Tailwind, CSS, HTML5)
  2. Configurable / Reusable 
  3. Fully typed (TypeScript)
  4. "Theme"-able (uses the existing design system)
  5. Translatable (all text elements use i18n)
  6. Accessible:
     - Semantically correct HTML
     - Screen reader support
     - Keyboard support
     - User feedback
     - Responsive design
     - Target Size (24px × 24px for links and 44px × 44px for buttons)
  7. SEO (if relevant):
     - Semantically correct HTML
     - SSR support

### Component Best Practices

#### API Integration
- Use component-specific composables (e.g., `useCart()`) instead of direct API calls
- Handle errors as arrays to display multiple error messages when needed
- Manage state through composables rather than component-local state where appropriate
- Use `getFormattedPrice()` from `usePrice()` for all price displays

#### UI/UX Implementation
- Use self-closing HTML tags for void elements (e.g., `<img>` not `<img />`)
- Maintain consistent spacing in templates and script sections
- Use Foundation component props instead of custom styling when available:
  - Use `square` attribute instead of custom styling for square buttons
  - Use `size="small"` instead of custom width/height classes
  - Set `aria-hidden="true"` on decorative icons

#### Design System Integration
- Use theme tokens for colors (e.g., `border-border` instead of `border-gray-200`)
- Follow icon size standards (typically `w-2 h-2` for small icons)
- Use refined responsive width patterns (e.g., `w-[90%] md:w-[400px]`)
- Apply consistent spacing from the design system
- Use standard icons from the system

#### Accessibility Implementation
- Use translated ARIA labels with `$t()` (e.g., `:aria-label="$t('cart.remove')"`)
- Ensure appropriate sizing for interactive elements
- Apply appropriate button variants in different contexts

#### Internationalization
- Use `useLocalePath()` and `formatLink()` for proper i18n of navigation paths
- Ensure all user-facing text uses translation keys

## TypeScript

- Use explicit type annotations where possible
- Use interfaces for object shapes
- Prefix interface names with appropriate context (e.g., `WidgetSearchInputProps`)
- Use semicolons within type definitions 

## JSON Files

- JSON files should be properly formatted with 4-space indentation
- Each key should appear only once at each level
- Nested properties should maintain consistent indentation

## CSS/Tailwind

- Use utility classes where appropriate
- Custom CSS should follow BEM naming convention when needed

## I18n Translations

- Keys should be organized hierarchically by feature/component
- Keys should be descriptive of their purpose
- Translation files should mirror each other in structure between languages
- Always use `$t()` for translatable text, avoid hardcoded strings
