# Product Listing Components

This document provides guidance on using the ProductListingPagination, ProductListingLimiter, and ProductListingSorter components for creating accessible e-commerce product listings with pagination, items-per-page, and sorting functionality.

## Components Overview

### ProductListingPagination

The `ProductListingPagination` component provides a fully accessible, SEO-friendly pagination interface for product listings. It renders as a navigation element with links to different pages, respecting accessibility best practices and providing proper keyboard navigation.

### ProductListingLimiter

The `ProductListingLimiter` component allows users to change the number of products displayed per page. It works in conjunction with the pagination component to provide a complete solution for browsing large product collections.

### ProductListingSorter

The `ProductListingSorter` component provides a dropdown interface for users to select different sorting options for the product listing. It displays Shopware's available sorting options and allows changing the sort order.

### Key Features

- Accessible with proper ARIA attributes and keyboard navigation
- SEO-friendly using actual links rather than buttons
- Responsive design with different layouts for mobile and desktop
- Support for screen-reader-only mode (for infinite scrolling interfaces)
- Internationalized labels and aria-labels
- Supports multiple instances on the same page with unique IDs
- Customizable number of page links displayed

## Usage

### Basic Pagination Implementation

```vue
<ProductListingPagination
  :current-page="getCurrentPage"
  :total-pages="getTotalPagesCount"
  :base-route="'/category/my-category?page=:page'"
  @page-change="onPageChange"
/>
```

### Basic Limiter Implementation

```vue
<ProductListingLimiter
  :current-limit="getLimit"
  :available-limits="[12, 24, 36, 48]"
  @update:limit="onLimitChange"
/>
```

### Basic Sorter Implementation

```vue
<ProductListingSorter
  :current-sorting="getCurrentSortingOrder"
  :available-sortings="getSortingOrders"
  @update:sorting="onSortChange"
/>
```

### Full Example with ProductListing Component

```vue
<ProductListing
  :listing="categoryListing"
  :show-top-pagination="true"
  :show-bottom-pagination="true"
  :show-top-limiter="true"
  :show-bottom-limiter="true"
  :show-top-sorter="true"
  :show-bottom-sorter="false"
  :available-limits="[6, 12, 24, 48]"
  :default-limit="12"
  :default-sorting="'name-asc'"
/>
```

### Screen-Reader-Only Implementation (for Infinite Scroll)

```vue
<ProductListingPagination
  :current-page="getCurrentPage"
  :total-pages="getTotalPagesCount"
  :base-route="'/category/my-category?page=:page'"
  :sr-only="true"
/>
```

## Components Props

### ProductListingPagination Props

| Prop               | Type      | Default | Description                                                 |
|--------------------|-----------|---------|-------------------------------------------------------------|
| currentPage        | Number    | -       | Current page number (1-based index)                        |
| totalPages         | Number    | -       | Total number of pages                                       |
| baseRoute          | String    | -       | Base route template with `:page` placeholder                |
| maxPageLinks       | Number    | 5       | Maximum number of page links to show                        |
| instanceId         | String    | ''      | Optional ID for multiple instances (auto-generated if empty)|
| srOnly             | Boolean   | false   | Whether pagination should be visible only to screen readers |
| showFirstLastLinks | Boolean   | true    | Whether to show first/last page buttons                     |

### ProductListingLimiter Props

| Prop             | Type       | Default         | Description                                     |
|------------------|------------|----------------|-------------------------------------------------|
| currentLimit     | Number     | -               | Current number of items per page                |
| availableLimits  | Number[]   | [1, 12, 24, 36, 48]| Available limit options to display           |
| instanceId       | String     | ''              | Optional ID for multiple instances              |

### ProductListingSorter Props

| Prop              | Type                | Default | Description                                     |
|-------------------|---------------------|--------|-------------------------------------------------|
| currentSorting    | String              | undefined | Current active sorting option                   |
| availableSortings | Array               | []     | Available sorting options from Shopware         |
| instanceId        | String              | ''     | Optional ID for multiple instances              |

### ProductListing Enhanced Props

The ProductListing component now supports these additional props related to pagination, limiting, and sorting:

| Prop                | Type      | Default | Description                                        |
|---------------------|-----------|---------|----------------------------------------------------| 
| paginationBaseRoute | String    | -       | Base route for pagination links                    |
| showTopPagination   | Boolean   | true    | Whether to show pagination at the top              |
| showBottomPagination| Boolean   | true    | Whether to show pagination at the bottom           |
| srOnlyPagination    | Boolean   | false   | Whether pagination should be screen-reader only    |
| availableLimits     | Number[]  | -       | Available limit options for the limiter           |
| showTopLimiter      | Boolean   | true    | Whether to show the limiter at the top             |
| showBottomLimiter   | Boolean   | true    | Whether to show the limiter at the bottom          |
| showTopSorter       | Boolean   | true    | Whether to show the sorter at the top              |
| showBottomSorter    | Boolean   | false   | Whether to show the sorter at the bottom           |
| defaultLimit        | Number    | 12      | Default limit to use if none specified             |
| defaultSorting      | String    | 'name-asc' | Default sorting to use if none specified         |

## Pagination Accessibility Features

- Proper `aria-label` attributes for all interactive elements
- Clear indication of the current page with `aria-current="page"`
- Descriptive screen reader text for navigation actions
- Keyboard navigation support
- Support for screen-reader-only mode while maintaining functionality

## Pagination Internationalization

The component uses translation keys under the `pagination` namespace. Available keys:

- `pagination.previous`: Label for previous page link
- `pagination.next`: Label for next page link
- `pagination.page`: Label for "Page"
- `pagination.of`: Label for "of" in "Page X of Y"
- `pagination.go_to_page`: Screen reader text for page links (receives `{page}` parameter)
- `pagination.current_page`: Screen reader text for current page (receives `{page}` parameter)
- `pagination.previous_page`: Screen reader text for previous page link
- `pagination.next_page`: Screen reader text for next page link
- `pagination.first_page`: Screen reader text for first page link
- `pagination.last_page`: Screen reader text for last page link

## Limiter Accessibility Features

- Proper `aria-label` attributes for all buttons
- Clear indication of the current limit with `aria-current="true"`
- Descriptive screen reader text for limit selection
- Keyboard navigation support

## Limiter Internationalization

The component uses translation keys under the `limiter` namespace. Available keys:

- `limiter.items_per_page`: Label for the limiter
- `limiter.show`: Text for "Show"
- `limiter.items`: Text for "items"
- `limiter.change_items_per_page`: Screen reader text for limit buttons (receives `{limit}` parameter)

## Sorter Accessibility Features

- Proper `aria-label` attributes for dropdown
- Descriptive screen reader text for sorting options
- Keyboard navigation support

## Sorter Internationalization

The component uses translation keys under the `sorter` namespace. Available keys:

- `sorter.sort_by`: Label for the sorter
- `sorter.sort_by_option`: Screen reader text for sorting options (receives `{option}` parameter)

## SEO Considerations

The pagination component uses actual links (`<a>` elements) rather than buttons to ensure that search engine crawlers can follow the pagination links. This improves indexability of paginated content.

## Component Conventions

### Naming Convention
Components should be named following these guidelines:

- Use PascalCase for component names
- Names should be descriptive and specific to their purpose
- Include the context in which the component will be used (e.g., `ProductListingPagination` rather than just `Pagination`)
- Structure names as `[Context][Purpose][ComponentType]`, such as:
  - `ProductListingPagination`
  - `CategoryFilterDropdown`
  - `CartItemQuantity`

### Type Definitions
Component-specific TypeScript interfaces and types should be defined within the SFC (Single File Component) rather than in separate files. This improves maintainability by keeping related code together.

## Responsive Behavior

- On mobile devices, only shows previous/next buttons and a simple "Page X of Y" indicator
- On desktop devices, shows numbered page links between previous/next buttons
- Icons remain visible at all viewport sizes
- Limiter component shows only numbers on mobile, adds text labels on desktop

## Implementation Details

- All components handle edge cases such as empty values and undefined states
- The pagination component properly encodes URL parameters to avoid issues with special characters
- Icons in pagination controls use `block` display for proper alignment
- The sorter uses native select element with `selected` attribute for better compatibility and performance

## URL Parameter Handling

The ProductListing component handles URL parameters to maintain state on page refresh:

1. **Limit parameter**: The selected items-per-page value is preserved in the URL as a `limit` parameter
2. **Page parameter**: The current page is preserved in the URL as a `p` parameter
3. **Sorting parameter**: The current sorting option is preserved in the URL as an `order` parameter

When a user refreshes the page:
- The component reads parameters from the URL and applies them if valid
- The URL is automatically updated when any parameter changes
- All parameters are properly encoded to ensure compatibility across browsers
- All parameters are preserved when navigating between pages

Example URL with all parameters:
```
/category/shoes?p=2&limit=24&order=price-desc
```

This ensures that users can share links with specific pagination, limit, and sorting settings, and browser refreshes will maintain the current view state.
