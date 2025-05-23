# API Client Integration

This document provides detailed information about the Shopware API integration in Nuxtware.

## Overview

Nuxtware uses the Shopware API client to connect with a Shopware backend. The implementation is based on the official [API client tutorial](https://api-client-tutorial-composable-frontends.pages.dev/1-intro/1-brief/1-brief/).

## Setup

### 1. Install Required Dependencies

```bash
npm install -D @shopware/api-gen
```

### 2. Configure Environment Variables

Set the following variables in your `.env` file:

```
OPENAPI_JSON_URL="https://my-shopware.com"
OPENAPI_ACCESS_KEY="SWXXXXXXXXXXXXXXXXXXXX"
```

### 3. API Types Directory

Create a subdirectory `api-types` in your project's root directory to store generated type definitions.

### 4. Load External Schema

```bash
npx @shopware/api-gen loadSchema --apiType=store
```

### 5. Generate Types

```bash
npx @shopware/api-gen generate --apiType=store
```

### 6. Register Synchronized Types

Create a `shopware.d.ts` file in the project root:

```typescript
declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";
  import type { operations, components } from './api-types/storeApiTypes'
  import type {
    RequestParameters as DefaultRequestParameters,
    RequestReturnType as DefaultRequestReturnType,
  } from "@shopware/api-client";

  export type operations = operations<changedComponents>;
  export type Schemas = changedComponents["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<
    typeof createAPIClient<operations>
  >;

  export type RequestParameters<T extends keyof operations> =
    DefaultRequestParameters<T, operations>;

  export type RequestReturnType<T extends keyof operations> =
    DefaultRequestReturnType<T, operations>;
}
```

## Extending API Definitions

### Adding New Definition

1. Create file `/api-types/storeApiTypes.overrides.ts`:

```typescript
import type { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents & {
    schemas: Schemas;
};

export type Schemas = {
    // here go the entities definitions available, that can be used in operations but also imported and used standalone
    AiAnswer: {
        content: string;
    };
    AiPrompt: {
        role: "system" | "user" | "assistant";
        content: string;
    };
};

export type operations = {
    // here go the endpoints and its definitions that can refer to the Schemas but it's not a requirement
    "sendAskAi post /ai-assistant/prompt": {
        contentType?: "application/json";
        accept?: "application/json";
        body: components["schemas"]["AiPrompt"];
        response: components["schemas"]["AiAnswer"];
        responseCode: 200;
    };
};
```

2. Generate types again:

```bash
npx @shopware/api-gen generate --apiType=store
```

### Editing Existing Definition

Extend type in `shopware.d.ts`:

```typescript
declare module "#shopware" {
  import type { createAPIClient } from "@shopware/api-client";
  import type { operations, components } from './api-types/storeApiTypes'
  import type {
    RequestParameters as DefaultRequestParameters,
    RequestReturnType as DefaultRequestReturnType,
  } from "@shopware/api-client";

  type changedComponents = components;
  // example how to extend Cart schema:
  type changedComponents = components & {
    schemas: {
      Cart: components["schemas"]["Cart"] & {
        myspecialfield: "hello field";
      };
    };
  };

  export type operations = operations<changedComponents>;
  export type Schemas = changedComponents["schemas"];

  // we're exporting our own Api Client definition as it depends on our own instance
  export type ApiClient = ReturnType<
    typeof createAPIClient<operations>
  >;

  export type RequestParameters<T extends keyof operations> =
    DefaultRequestParameters<T, operations>;

  export type RequestReturnType<T extends keyof operations> =
    DefaultRequestReturnType<T, operations>;
}
```

## Auto-imported Shopware Composables

The project is configured to automatically import all composables from `@shopware/composables/src` through the Nuxt auto-imports feature. This means you have direct access to all Shopware-specific composables without needing to import them explicitly.

### Available Composables

Some commonly used Shopware composables that are auto-imported include:

- `useAddToCart` - Managing add to cart functionality
- `useCart` - Cart state and operations
- `useCartErrorParamsResolver` - Resolving cart-specific errors with proper parameters
- `useCartNotification` - Cart notification handling and error code extraction
- `usePrice` - Price formatting utilities
- `useProduct` - Product data management
- `useCategory` - Category data management
- `useNavigation` - Navigation menu handling
- `useUser` - User authentication and profile
- `useWishlist` - Wishlist functionality

### Best Practices

1. **Always use Shopware composables** for e-commerce functionality instead of creating custom implementations
2. **Leverage built-in error handling** - Use `useCartErrorParamsResolver` and `useCartNotification` for cart operations
3. **Type safety** - These composables are fully typed and integrated with the generated API types
4. **Consistency** - Using these composables ensures consistent behavior across the application

## Usage Guidelines

### Basic API Request

```typescript
const { apiClient } = useShopwareContext();
const result = await apiClient.invoke("readProductListing get /product-listing/{categoryId}", {
    pathParams: {
        categoryId: "your-category-id"
    }
});
```

### Error Handling

Always implement proper error handling with try/catch blocks:

```typescript
try {
    const result = await apiClient.invoke("readProduct get /product/{productId}", {
        pathParams: {
            productId: productId
        }
    });
    // Handle success
} catch (error) {
    // Handle error
    console.error("API request failed:", error);
}
```

### TypeScript Integration

The generated types provide full TypeScript support, giving you autocompletion and type checking for all API requests.
