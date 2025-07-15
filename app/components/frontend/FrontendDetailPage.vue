<script setup lang="ts">
const props = defineProps<{
    navigationId: string;
}>();

const { search } = useProductSearch()

const { data: productResponse } = await useAsyncData(
    'cmsProduct' + props.navigationId,
    async () => {
        return await search(props.navigationId, {
            withCmsAssociations: true,
            associations: {
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
            }
        })
    },
)

const { product } = useProduct(
    productResponse.value.product,
    productResponse.value.configurator,
)
</script>

<template>
    <StructurePage v-if="product.cmsPage" :content="product.cmsPage" />
</template>
