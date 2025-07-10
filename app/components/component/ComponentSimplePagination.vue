<script setup lang="ts">
interface Props {
    currentPage: number
    totalPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'page-change', page: number): void
}>()

const handlePageChange = (page: number) => {
    if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
        emit('page-change', page)
    }
}

const visiblePages = computed(() => {
    const { currentPage, totalPages } = props
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    
    const half = Math.floor(maxVisible / 2)
    let start = Math.max(currentPage - half, 1)
    const end = Math.min(start + maxVisible - 1, totalPages)
    
    if (end === totalPages) {
        start = Math.max(totalPages - maxVisible + 1, 1)
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
    <div class="flex items-center justify-center space-x-1">
        <!-- Previous Button -->
        <FoundationButton
            :disabled="currentPage <= 1"
            variant="outline"
            size="small"
            @click="handlePageChange(currentPage - 1)"
        >
            <FoundationIcon name="chevron-left" class="w-4 h-4" />
        </FoundationButton>
        
        <!-- Page Numbers -->
        <template v-for="page in visiblePages" :key="page">
            <FoundationButton
                :variant="page === currentPage ? 'default' : 'outline'"
                size="small"
                class="min-w-[40px]"
                @click="handlePageChange(page)"
            >
                {{ page }}
            </FoundationButton>
        </template>
        
        <!-- Next Button -->
        <FoundationButton
            :disabled="currentPage >= totalPages"
            variant="outline"
            size="small"
            @click="handlePageChange(currentPage + 1)"
        >
            <FoundationIcon name="chevron-right" class="w-4 h-4" />
        </FoundationButton>
    </div>
</template>