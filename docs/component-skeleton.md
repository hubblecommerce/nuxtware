# Skeleton Component

The `ComponentSkeleton` is a versatile component used for creating loading placeholders in the UI following the atomic design methodology. This document outlines the implementation details and usage guidelines.

## Component Overview

Skeleton UI elements provide visual feedback to users while content is loading. They mimic the shape and structure of the content that will eventually appear, creating a smoother user experience by reducing perceived loading times and preventing layout shifts.

## Implementation

The skeleton component is implemented as a molecule in our atomic design system, located at:

```
app/components/component/ComponentSkeleton.vue
```

The styling for this component is in:

```
app/assets/styles/lib/components/skeleton.css
```

## Features

- **Multiple preset layouts** for common UI elements (text, button, image, etc.)
- **Animation options** including pulse, wave, or none
- **Customizable dimensions** through props
- **Shape variants** including rounded corners and circle
- **Accessible by default** with proper ARIA attributes

## Usage Examples

### Basic Usage

```vue
<ComponentSkeleton preset="text" />
<ComponentSkeleton preset="button" />
<ComponentSkeleton preset="image" />
```

### Custom Dimensions

```vue
<ComponentSkeleton width="200px" height="40px" />
<ComponentSkeleton width="50%" height="20px" />
```

### Animation Types

```vue
<ComponentSkeleton preset="text" animation="pulse" />
<ComponentSkeleton preset="text" animation="wave" />
<ComponentSkeleton preset="text" animation="none" />
```

### Custom Shapes

```vue
<ComponentSkeleton width="60px" height="60px" circle />
```

### Creating Complex Layouts

The component is designed to be composable, allowing you to build more complex skeleton structures:

```vue
<div class="flex flex-col gap-3">
  <ComponentSkeleton preset="image" />
  <ComponentSkeleton preset="heading" />
  <ComponentSkeleton preset="text" width="90%" />
  <ComponentSkeleton preset="text" width="80%" />
</div>
```

### Real-world Usage: Product Listing Skeleton

The `ProductListingSkeleton.vue` component demonstrates how to create specialized skeletons for specific content types:

```vue
<template>
  <div class="flex flex-col w-full justify-start border p-3 gap-3">
    <ComponentSkeleton preset="image" height="200px" />
    <ComponentSkeleton preset="text" width="80%" />
    <ComponentSkeleton preset="text" width="40%" />
  </div>
</template>
```

This can be used in product listings to show placeholder cards while data is loading:

```vue
<div v-if="loading" class="grid grid-cols-4 gap-3">
  <ProductListingSkeleton v-for="i in 8" :key="i" />
</div>
<div v-else class="grid grid-cols-4 gap-3">
  <ProductListingCard 
    v-for="product in products" 
    :key="product.id" 
    :product="product" 
  />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `preset` | String | 'custom' | Predefined layouts: 'text', 'card', 'button', 'image', 'heading', 'paragraph', 'line', 'avatar', 'custom' |
| `width` | String/Number | '' | Width of the skeleton (CSS value) |
| `height` | String/Number | '' | Height of the skeleton (CSS value) |
| `animation` | String | 'pulse' | Animation type: 'pulse', 'wave', 'none' |
| `rounded` | Boolean | true | Whether to apply rounded corners |
| `circle` | Boolean | false | Whether to render as a circle (overrides rounded) |
| `inline` | Boolean | false | Whether to display as an inline element |
| `repeat` | Number | 1 | Number of times to repeat the skeleton |
| `class` | String | '' | Additional CSS classes |

## Best Practices

1. **Match dimensions with content**: Try to match skeleton dimensions closely to the actual content that will replace it to minimize layout shifts when content loads.

2. **Use appropriate animation**: The pulse animation is subtle and works well for most use cases. Use wave animation for more noticeable loading states, or no animation for static placeholders.

3. **Create specialized skeletons**: For frequently used components like product cards, create specialized skeleton components (like `ProductListingSkeleton.vue`) that compose the base skeleton component.

4. **Consider accessibility**: The component already sets appropriate ARIA attributes (`aria-busy="true"` and `aria-hidden="true"`), but ensure your implementation maintains these accessibility features.

5. **Consistent application**: Apply skeleton loading states consistently throughout your application to provide a unified user experience.

## Integration with Atomic Design

As a molecule in our atomic design system, the skeleton component can be:

- Used directly in page components for simple loading states
- Composed into specialized organism-level components (like `ProductListingSkeleton`)
- Integrated into templates to create page-level loading states

This hierarchical approach ensures consistent loading patterns throughout the application while maintaining the flexibility to adapt to different content types.