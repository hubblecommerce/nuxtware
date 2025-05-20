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

### Template Structure

When building complex templates, follow these guidelines to ensure maintainability and performance:

- Use `<template>` tags with `v-for` when conditional rendering is needed within loops:
  ```vue
  <!-- Preferred -->
  <template v-for="(item, index) in items" :key="item.id">
    <div v-if="shouldRenderItem(item)" class="item">
      {{ item.name }}
    </div>
  </template>
  
  <!-- Avoid -->
  <div v-for="(item, index) in items" :key="item.id" v-if="shouldRenderItem(item)" class="item">
    {{ item.name }}
  </div>
  ```

- Group related attributes together in a consistent order:
  1. Key/ref attributes (`:key`, `ref`)
  2. Structural directives (`v-if`, `v-else`, `v-for`)
  3. Other v-directives (`v-model`, `v-bind`)
  4. Standard HTML attributes (`class`, `id`, etc.)
  5. Aria attributes (`aria-*`, `role`)
  6. Event handlers (`@click`, etc.)

- For complex conditional rendering, use computed properties instead of complex expressions:
  ```vue
  <!-- Preferred -->
  <div v-if="isItemVisible">{{ item.name }}</div>
  
  <!-- Avoid -->
  <div v-if="item.isActive && !item.isHidden && currentFilter === 'all'">
    {{ item.name }}
  </div>
  ```

### Reactive Property Access

When working with Vue's reactivity system, be consistent in how you access reactive values:

- Always use `.value` to access values from `ref()` and `computed()` properties:
  ```ts
  // Correct
  const count = ref(0)
  function increment() {
    count.value++
  }
  
  // Also correct - accessing value from composable
  if (getInitialFilters.value.length > 0) {
    // Do something
  }
  
  // Incorrect - missing .value
  function decrement() {
    count-- // This won't work!
  }
  ```

- Remember that properties from composables are often refs or computed values:
  ```ts
  // Composable usage
  const { items, isLoading } = useMyComposable()
  
  // Correct
  if (!isLoading.value && items.value.length > 0) {
    processItems()
  }
  ```

- For reactive objects created with `reactive()`, do not use `.value`:
  ```ts
  // Correct
  const state = reactive({ count: 0 })
  function increment() {
    state.count++
  }
  ```

- Be consistent with destructuring - prefer using `toRefs` instead of manual destructuring:
  ```ts
  // Preferred
  const state = reactive({ count: 0, name: 'Example' })
  const { count, name } = toRefs(state)
  
  // Now you can use count.value and name.value while maintaining reactivity
  ```

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

## Common Pitfalls

Avoid these common issues to maintain code quality and prevent bugs:

### Unused Parameters and Variables

- Remove unused parameters from functions:
  ```ts
  // Incorrect
  function shouldRenderFilter(filter: any, index: number): boolean {
    // index is never used
    return filter.isActive
  }
  
  // Correct
  function shouldRenderFilter(filter: any): boolean {
    return filter.isActive
  }
  ```

- Declare types for all variables and parameters:
  ```ts
  // Incorrect
  let resizeTimer;
  
  // Correct
  let resizeTimer: number;
  ```

### Reactive Access Inconsistencies

- Always check if reactive properties are defined before accessing nested properties:
  ```ts
  // Incorrect
  if (items.value.length > 0) { ... }
  
  // Correct
  if (items.value && items.value.length > 0) { ... }
  ```

- Use optional chaining for safer property access:
  ```ts
  // Preferred
  const itemName = items.value?.[0]?.name
  ```

### DOM Manipulation Errors

- Always check if DOM references exist before accessing their properties:
  ```ts
  // Incorrect
  const width = containerRef.value.offsetWidth
  
  // Correct
  const width = containerRef.value?.offsetWidth || 0
  ```

- Clean up event listeners and observers to prevent memory leaks:
  ```ts
  // Set up listeners
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  
  // Clean up
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })
  ```

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
