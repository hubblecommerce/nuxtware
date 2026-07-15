/**
 * Module declaration for #shopware types.
 *
 * IMPORTANT: We use inline import types `import("...").Type` instead of
 * top-level `import type { ... } from "..."` for relative paths.
 *
 * Reason: Top-level imports turn this file into a "module", which breaks
 * relative path resolution inside `declare module` blocks. Inline imports
 * don't change the file's module status, so paths resolve correctly.
 *
 * - npm package imports (@shopware/...): both syntaxes work
 * - relative path imports (./...): only inline syntax works
 *
 * Type sources:
 * - operations: from generated file (api-gen merges custom operations)
 * - Schemas: from overrides file (extends base schemas with custom fields)
 */
declare module "#shopware" {
    import type { createAPIClient } from "@shopware/api-client";

    // Operations come from generated file (api-gen merges custom operations)
    type generatedOperations = import("./api-types/storeApiTypes").operations;
    type generatedOperationPaths = import("./api-types/storeApiTypes").operationPaths;

    // Schemas come from overrides file (merges base schemas with extensions)
    type mergedSchemas = import("./api-types/storeApiTypes.overrides").MergedSchemas;
    type mergedOperations = import("./api-types/storeApiTypes.overrides").operations;

    export type operations = mergedOperations;
    export type operationPaths = generatedOperationPaths;
    export type Schemas = mergedSchemas;

    // we're exporting our own Api Client definition as it depends on our own instance
    export type ApiClient = ReturnType<
        typeof createAPIClient<operations, operationPaths>
    >;
    export type RequestParameters<T extends keyof operations> =
        import("@shopware/api-client").RequestParameters<T, operations>;

    export type RequestReturnType<T extends keyof operations> =
        import("@shopware/api-client").RequestReturnType<T, operations>;
}
