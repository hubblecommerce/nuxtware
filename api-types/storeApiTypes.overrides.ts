import type { 
    operations as mainOperations,
    components as mainComponents,
    Schemas as mainSchemas 
} from "./storeApiTypes";

export type components = mainComponents & {
    schemas: Schemas;
}

/**
 * Schema overrides for api-gen tool.
 * Only include schemas that need to be extended.
 * Note: api-gen merges these but the generated file has a bug with mainSchemas reference.
 */
type SchemaOverrides = {
    CmsSlot: mainSchemas['CmsSlot'] & {}
}

// For api-gen (not working correctly due to mainSchemas reference bug)
export type Schemas = SchemaOverrides;

/**
 * Full merged schemas for use in shopware.d.ts.
 * Combines base schemas with our extensions.
 */
export type MergedSchemas = Omit<mainSchemas, keyof SchemaOverrides> & SchemaOverrides;

type CustomOperations = {
    "sendAskAi post /ai-assistant/prompt": {
        contentType?: "application/json";
        accept?: "application/json";
        body: components["schemas"]["Product"];
        response: components["schemas"]["Product"];
        responseCode: 200;
    };
}

export type operations = Omit<mainOperations, keyof CustomOperations> & CustomOperations;