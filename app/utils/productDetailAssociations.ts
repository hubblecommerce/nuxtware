import type { Schemas } from '#shopware'

// Associations the product-detail read needs beyond `withCmsAssociations`
// (manufacturer/media/cover with their nested media). Shared so the read is
// method-agnostic: `useProductSearch().search` folds these into `?_criteria`
// on a cacheable GET and into the body on POST, keeping the rendered page
// identical either way.
export const productDetailAssociations = {
    manufacturer: {
        associations: {
            media: {}
        }
    },
    media: {
        associations: {
            media: {}
        }
    },
    cover: {
        associations: {
            media: {}
        }
    }
} satisfies Schemas['Association']
