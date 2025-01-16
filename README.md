# Nuxt Layer Starter

Create Nuxt extendable layer with this GitHub template.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Working on your layer

Your layer is at the root of this repository, it is exactly like a regular Nuxt project, except you can publish it on NPM.

The `.playground` directory should help you on trying your layer during development.

Running `pnpm dev` will prepare and boot `.playground` directory, which imports your layer itself.

## Distributing your layer

Your Nuxt layer is shaped exactly the same as any other Nuxt project, except you can publish it on NPM.

To do so, you only have to check if `files` in `package.json` are valid, then run:

```bash
npm publish --access public
```

Once done, your users will only have to run:

```bash
npm install --save your-layer
```

Then add the dependency to their `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: 'your-layer'
})
```

## Shopware configuration
Create `.env` file in `/.playground`:
```
NUXT_PUBLIC_SHOPWARE_ENDPOINT = 'https://my-shopware.com/store-api/'
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN = 'SWXXXXXXXXXXXXXXXXXXXX'
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL = 'https://my-shopware.com'
```

## API Client
Based on official [api client tutorial](https://api-client-tutorial-composable-frontends.pages.dev/1-intro/1-brief/1-brief/). 

### Setup
Install shopware api-gen:
```
npm install -D @shopware/api-gen
```

Set variables to .env:
```
OPENAPI_JSON_URL="https://my-shopware.com"
OPENAPI_ACCESS_KEY="SWXXXXXXXXXXXXXXXXXXXX"
```

Create a subdirectory `api-types` in your project’s root dir.

Load external schema:
```
npx @shopware/api-gen loadSchema --apiType=store
```

Generate types:
```
npx @shopware/api-gen generate --apiType=store
```

Register synchronized types:
Create shopware.d.ts file in root
```.ts
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

### Add new definition
Create file `/api-types/storeApiTypes.overrides.ts`
```.ts
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

Generate types:
```
npx @shopware/api-gen generate --apiType=store
```

### Edit existing definition
Extend type in `shopware.d.ts`:
```
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

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Or statically generate it with:

```bash
pnpm generate
```

Locally preview production build:

```bash
pnpm preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
