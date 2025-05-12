<script setup lang="ts">
export interface ProductPaginationProps {
    currentPage: number
    totalPages: number
    maxPageLinks?: number
    /**
     * Base route for generating page links
     * Use :page as a placeholder for the page number
     * e.g. "/category/my-category?page=:page"
     */
    baseRoute: string
    /**
     * Optional instance ID for multiple pagination instances on the same page
     */
    instanceId?: string
    /**
     * When true, pagination is visually hidden but still accessible to screen readers
     * Useful for infinite scrolling implementations
     */
    srOnly?: boolean
    /**
     * Whether to show first/last page links
     */
    showFirstLastLinks?: boolean
}

const props = withDefaults(defineProps<ProductPaginationProps>(), {
    maxPageLinks: 5,
    instanceId: '',
    srOnly: false,
    showFirstLastLinks: true
})

const emit = defineEmits<{
    (e: 'page-change', page: number): void
}>()

const uniqueId = useId()
const paginationId = computed(() => props.instanceId || `pagination-${uniqueId}`)

// Determine which page links to display based on current page and maxPageLinks
const visiblePageNumbers = computed(() => {
    const { currentPage, totalPages, maxPageLinks } = props
    
    if (totalPages <= maxPageLinks) {
        // If we have fewer pages than maxPageLinks, show all pages
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    
    const half = Math.floor(maxPageLinks / 2)
    let startPage = Math.max(currentPage - half, 1)
    let endPage = Math.min(startPage + maxPageLinks - 1, totalPages)
    
    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
        startPage = Math.max(totalPages - maxPageLinks + 1, 1)
    }
    
    // Generate page numbers
    return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    )
})

// Generate actual URL for a page
const getPageUrl = (page: number) => {
    return props.baseRoute.replace(encodeURIComponent(':page'), page.toString())
}

// Handle page click events without relying on href navigation
const handlePageClick = (page: number, event: Event) => {
    if (page === props.currentPage) {
        event.preventDefault()
        return
    }
    
    event.preventDefault()
    emit('page-change', page)
}

// Localization helper
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

// Computed properties for navigation
const hasPreviousPage = computed(() => props.currentPage > 1)
const hasNextPage = computed(() => props.currentPage < props.totalPages)
const previousPageUrl = computed(() => getPageUrl(props.currentPage - 1))
const nextPageUrl = computed(() => getPageUrl(props.currentPage + 1))
const firstPageUrl = computed(() => getPageUrl(1))
const lastPageUrl = computed(() => getPageUrl(props.totalPages))
</script>

<template>
    <nav 
        :id="paginationId"
        :class="{ 'sr-only': srOnly }"
        :aria-label="$t('pagination.page')"
        class="product-pagination my-4"
    >
        <div class="flex items-center justify-center">
            <!-- First page link -->
            <FoundationLink
                v-if="showFirstLastLinks"
                :href="formatLink(firstPageUrl)"
                :aria-label="$t('pagination.first_page')"
                :disabled="!hasPreviousPage"
                class="pagination-link mx-1"
                @click="(e) => handlePageClick(1, e)"
            >
                <FoundationIcon name="chevrons-left" size="sm" class="block" aria-hidden="true" />
            </FoundationLink>
            
            <!-- Previous page link -->
            <FoundationLink
                :href="formatLink(previousPageUrl)"
                :aria-label="$t('pagination.previous_page')"
                :disabled="!hasPreviousPage"
                class="pagination-link mx-1"
                @click="(e) => hasPreviousPage && handlePageClick(currentPage - 1, e)"
            >
                <FoundationIcon name="chevron-left" size="sm" class="block" aria-hidden="true" />
            </FoundationLink>
            
            <!-- Page indicator for mobile -->
            <div class="mx-2 text-sm sm:hidden">
                {{ $t('pagination.page') }} {{ currentPage }} {{ $t('pagination.of') }} {{ totalPages }}
            </div>

            <!-- Page number links (hidden on mobile) -->
            <div class="hidden sm:flex">
                <FoundationLink
                    v-for="pageNum in visiblePageNumbers"
                    :key="`${paginationId}-page-${pageNum}`"
                    :href="formatLink(getPageUrl(pageNum))"
                    :aria-label="pageNum === currentPage 
                        ? $t('pagination.current_page', { page: pageNum })
                        : $t('pagination.go_to_page', { page: pageNum })"
                    :aria-current="pageNum === currentPage ? 'page' : undefined"
                    :class="[
                        'pagination-link mx-1 min-w-[2rem] text-center',
                        pageNum === currentPage ? 'font-bold border-b-2 border-primary' : ''
                    ]"
                    @click="(e) => handlePageClick(pageNum, e)"
                >
                    {{ pageNum }}
                </FoundationLink>
            </div>

            <!-- Next page link -->
            <FoundationLink
                :href="formatLink(nextPageUrl)"
                :aria-label="$t('pagination.next_page')"
                :disabled="!hasNextPage"
                class="pagination-link mx-1"
                @click="(e) => hasNextPage && handlePageClick(currentPage + 1, e)"
            >
                <FoundationIcon name="chevron-right" size="sm" class="block" aria-hidden="true" />
            </FoundationLink>
            
            <!-- Last page link -->
            <FoundationLink
                v-if="showFirstLastLinks"
                :href="formatLink(lastPageUrl)"
                :aria-label="$t('pagination.last_page')"
                :disabled="!hasNextPage"
                class="pagination-link mx-1"
                @click="(e) => handlePageClick(totalPages, e)"
            >
                <FoundationIcon name="chevrons-right" size="sm" class="block" aria-hidden="true" />
            </FoundationLink>
        </div>
    </nav>
</template>
