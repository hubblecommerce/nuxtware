<script setup lang="ts">
import { useProductReviews } from '../../composables/useProductReviews'
import { useModal } from '../../composables/useModal'

interface ReviewContainerProps {
    productId: string
    initialReviews?: unknown[]
    showInModal?: boolean
}
interface ReviewData {
    id?: string
    title: string
    content: string
    points: number
}

const props = withDefaults(defineProps<ReviewContainerProps>(), {
    initialReviews: () => [],
    showInModal: false
})

// Composables
const { isLoggedIn } = useUser()
const { addNotification } = useGlobalNotifications()
const { t } = useI18n()

// Initialize reviews composable
const {
    reviews,
    statistics,
    loading,
    error,
    currentPage,
    totalPages,
    totalReviews,
    filters,
    refreshReviews,
    setFilters,
    saveUserReviewToStorage
} = useProductReviews({
    productId: props.productId,
    autoFetch: true,
    defaultFilters: {
        limit: 4,
        sort: 'createdAt',
        order: 'desc'
    }
})

// UI state
const showForm = ref(false)
const showList = ref(true)
const formMode = ref<'create'>('create')
const reviewsModal = useModal('reviews-modal')

// Computed
const sortOptions = computed(() => [
    { value: 'createdAt', label: t('review.sortByDate') },
    { value: 'points', label: t('review.sortByRating') }
])

// Methods
const handleFilterRating = (ratings: number[]) => {
    setFilters({ points: ratings, page: 1 })
}

const handleToggleLanguage = (showAll: boolean) => {
    setFilters({ language: showAll, page: 1 })
}

const handleSortChange = (sort: string) => {
    setFilters({ sort: sort as 'createdAt' | 'points', page: 1 })
}

const handlePageChange = (page: number) => {
    setFilters({ page })
    
    // Scroll to top of reviews on page change
    if (import.meta.client) {
        const reviewsContainer = document.getElementById('reviews-container')
        if (reviewsContainer) {
            reviewsContainer.scrollIntoView({ behavior: 'smooth' })
        }
    }
}

const handleToggleForm = () => {
    if (!isLoggedIn.value) {
        // Show login form instead
        showForm.value = true
        formMode.value = 'create'
        return
    }
    
    showForm.value = !showForm.value
    
    if (showForm.value) {
        formMode.value = 'create'
        showList.value = false
    } else {
        showList.value = true
    }
}

const handleLoginSuccess = () => {
    showForm.value = true
    formMode.value = 'create'
    addNotification({
        type: 'success',
        message: 'Welcome! You can now write a review.'
    })
}

const handleFormSuccess = (reviewData: ReviewData) => {
    // Save to localStorage for client-side tracking
    saveUserReviewToStorage({
        id: reviewData.id,
        title: reviewData.title,
        content: reviewData.content,
        points: reviewData.points,
        status: 'submitted'
    })
    
    showForm.value = false
    showList.value = true
    refreshReviews()
}

const handleFormCancel = () => {
    showForm.value = false
    showList.value = true
}

// Check if any filters are active
const hasActiveFilters = computed(() => {
    return (filters.value.points && filters.value.points.length > 0) ||
           filters.value.language === true ||
           filters.value.sort !== 'createdAt'
})
</script>

<template>
    <div id="reviews-container" class="review-container">
        <!-- examplary modal implementation-->
        <FoundationButton
            type="button"
            class="btn btn-secondary mb-6"
            @click="reviewsModal.open"
        >
            Open Modal
        </FoundationButton>
        <ComponentModal
            :controller="reviewsModal"
            modal-headline="Reviews Modal"
        >
            <ReviewWidget
                :product-id="productId"
                :statistics="statistics"
                :selected-ratings="filters.points || []"
                :show-all-languages="filters.language || false"
                @filter-rating="handleFilterRating"
                @toggle-language="handleToggleLanguage"
                @toggle-form="handleToggleForm"
            />
        </ComponentModal>

        <!-- Mobile-first responsive layout -->
        <div class="flex flex-col lg:flex-row gap-6">
            
            <!-- Sidebar Widget (Desktop) / Top Section (Mobile) -->
            <div class="lg:w-80 lg:flex-shrink-0 order-1 lg:order-1">
                <ReviewWidget
                    :product-id="productId"
                    :statistics="statistics"
                    :selected-ratings="filters.points || []"
                    :show-all-languages="filters.language || false"
                    @filter-rating="handleFilterRating"
                    @toggle-language="handleToggleLanguage"
                    @toggle-form="handleToggleForm"
                />
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 order-2 lg:order-2">
                <!-- Review Form -->
                <div 
                    v-if="showForm" 
                    class="mb-6"
                    :class="{ 'animate-in slide-in-from-top-4 duration-300': showForm }"
                >
                    <div v-if="!isLoggedIn">
                        <ReviewLogin 
                            @login-success="handleLoginSuccess"
                            @cancel="handleFormCancel"
                        />
                    </div>
                    <div v-else>
                        <ReviewForm
                            :product-id="productId"
                            @success="handleFormSuccess"
                            @cancel="handleFormCancel"
                        />
                    </div>
                </div>

                <!-- Review List Section -->
                <div 
                    v-if="showList" 
                    class="space-y-6"
                    :class="{ 'animate-in slide-in-from-top-4 duration-300': showList }"
                >
                    <!-- List Actions Bar -->
                    <div v-if="totalReviews > 0" class="border border-border rounded-lg p-4">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            
                            <!-- Filters and Sort -->
                            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                
                                <!-- Sort Dropdown -->
                                <div class="flex  items-center justify-between gap-2">
                                    <FoundationLabel for="reviews-sort" class="text-sm font-medium whitespace-nowrap">
                                        {{ $t('review.sortBy') }}:
                                    </FoundationLabel>
                                    <FoundationSelect
                                        id="reviews-sort"
                                        v-model="filters.sort"
                                        :options="sortOptions"
                                        size="small"
                                        @change="filters?.sort ? handleSortChange(filters.sort) : null"
                                    />
                                </div>
                            </div>

                            <!-- Review Count -->
                            <div class="text-sm">
                                {{ $t('review.pagination.showing', {
                                    from: ((currentPage - 1) * (filters.limit || 10)) + 1,
                                    to: Math.min(currentPage * (filters.limit || 10), totalReviews),
                                    total: totalReviews
                                }) }}
                            </div>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-if="error" class="bg-error/10 border border-error/20 rounded-lg p-4 text-error-content">
                        <div class="flex items-center gap-2">
                            <FoundationIcon name="triangle-alert" size="sm" />
                            <p class="font-medium">{{ $t('review.error.general') }}</p>
                        </div>
                        <p class="text-sm mt-1">{{ error }}</p>
                        <FoundationButton
                            variant="outline"
                            size="small"
                            class="mt-3"
                            @click="refreshReviews"
                        >
                            Try again
                        </FoundationButton>
                    </div>

                    <!-- Loading State -->
                    <ClientOnly>
                        <div v-if="loading" class="space-y-6">
                            <div v-for="i in 3" :key="i" class="animate-pulse">
                                <div class="rounded-lg p-6 space-y-3">
                                    <div class="flex items-center gap-2">
                                        <div class="w-20 h-4 rounded" />
                                        <div class="w-32 h-4 rounded" />
                                    </div>
                                    <div class="w-3/4 h-6 rounded" />
                                    <div class="space-y-2">
                                        <div class="w-full h-4 rounded" />
                                        <div class="w-5/6 h-4 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ClientOnly>

                    <!-- Reviews List -->
                    <div v-if="!loading && reviews.length > 0" class="space-y-6">
                        <ReviewItem
                            v-for="review in reviews"
                            :key="review.id"
                            :review="review"
                            :show-status="true"
                        />
                    </div>

                    <!-- Empty State -->
                    <ClientOnly>
                        <div v-if="!loading && reviews.length === 0" class="text-center py-12">
                            <FoundationIcon name="star" size="2xl" class="block mx-auto mb-4" />
                            <h3 class="text-lg font-medium mb-2">
                                {{ hasActiveFilters ? 'No reviews match your filters' : $t('review.empty') }}
                            </h3>
                            <p class="mb-6">
                                {{ hasActiveFilters ? 'Try adjusting your filters to see more reviews.' : $t('review.emptyDescription') }}
                            </p>
                        </div>
                    </ClientOnly>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="flex justify-center">
                        <nav class="flex items-center gap-2" aria-label="Reviews pagination">
                            <!-- Previous Page -->
                            <FoundationButton
                                variant="outline"
                                size="small"
                                square
                                :disabled="currentPage <= 1"
                                :aria-label="$t('pagination.previous')"
                                @click="handlePageChange(currentPage - 1)"
                            >
                                <FoundationIcon name="chevron-left" />
                            </FoundationButton>

                            <!-- Page Numbers -->
                            <template v-for="page in Math.min(totalPages, 7)" :key="page">
                                <FoundationButton
                                    v-if="page === currentPage"
                                    variant="default"
                                    color="secondary"
                                    size="small"
                                    :aria-label="`Current page ${page}`"
                                    aria-current="page"
                                >
                                    {{ page }}
                                </FoundationButton>
                                <FoundationButton
                                    v-else
                                    variant="outline"
                                    size="small"
                                    :aria-label="`Go to page ${page}`"
                                    @click="handlePageChange(page)"
                                >
                                    {{ page }}
                                </FoundationButton>
                            </template>

                            <!-- Show ellipsis if there are more pages -->
                            <span v-if="totalPages > 7" class="px-2">
                                ...
                            </span>

                            <!-- Next Page -->
                            <FoundationButton
                                variant="outline"
                                size="small"
                                square
                                :disabled="currentPage >= totalPages"
                                :aria-label="$t('pagination.next')"
                                @click="handlePageChange(currentPage + 1)"
                            >
                                <FoundationIcon name="chevron-right" />
                            </FoundationButton>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>