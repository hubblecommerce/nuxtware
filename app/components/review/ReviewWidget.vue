<script setup lang="ts">
interface ReviewMatrix {
    points: number
    count: number
    percent: number
}

interface ReviewStatistics {
    totalReviewCount: number
    averageRating: number
    maxPoints: number
    matrix: readonly ReviewMatrix[]
}

interface ReviewWidgetProps {
    productId: string
    statistics: ReviewStatistics
    hasUserReview?: boolean
    selectedRatings?: number[]
    showAllLanguages?: boolean
}

const props = withDefaults(defineProps<ReviewWidgetProps>(), {
    hasUserReview: false,
    selectedRatings: () => [],
    showAllLanguages: false
})

const emit = defineEmits<{
    'filter-rating': [ratings: number[]]
    'toggle-language': [showAll: boolean]
    'toggle-form': []
}>()

const { t } = useI18n()

// Local state for filters
const localSelectedRatings = ref<number[]>([...props.selectedRatings])
const localShowAllLanguages = ref(props.showAllLanguages)

// Computed values
const hasReviews = computed(() => props.statistics.totalReviewCount > 0)

const roundedAverageRating = computed(() => {
    return Math.round(props.statistics.averageRating * 10) / 10
})

// Watch for prop changes
watch(() => props.selectedRatings, (newValue) => {
    localSelectedRatings.value = [...newValue]
})

watch(() => props.showAllLanguages, (newValue) => {
    localShowAllLanguages.value = newValue
})

// Methods
const toggleRatingFilter = (rating: number) => {
    const index = localSelectedRatings.value.indexOf(rating)
    if (index > -1) {
        localSelectedRatings.value.splice(index, 1)
    } else {
        localSelectedRatings.value.push(rating)
    }
    emit('filter-rating', [...localSelectedRatings.value])
}

const toggleLanguageFilter = () => {
    localShowAllLanguages.value = !localShowAllLanguages.value
    emit('toggle-language', localShowAllLanguages.value)
}

const handleToggleForm = () => {
    emit('toggle-form')
}

const isRatingSelected = (rating: number) => {
    return localSelectedRatings.value.includes(rating)
}

const getRatingLabel = (rating: number) => {
    return rating === 1 
        ? `${rating} ${t('review.filter.rating', 1)}`
        : `${rating} ${t('review.filter.rating', 2)}`
}
</script>

<template>
    <aside class="review-widget sticky top-4 space-y-6">
        <!-- Review Statistics -->
        <div v-if="hasReviews" class="bg-surface border border-border rounded-lg p-6">
            <header class="mb-4">
                <h3 class="text-lg font-semibold mb-2">
                    {{ $t('review.title', { 
                        count: statistics.totalReviewCount
                    }) }}
                </h3>
            </header>

            <!-- Average Rating Display -->
            <div 
                class="flex items-center gap-3 mb-6"
                itemscope 
                itemtype="https://schema.org/AggregateRating"
            >
                <meta itemprop="bestRating" content="5">
                <meta itemprop="ratingCount" :content="statistics.totalReviewCount.toString()">
                <meta itemprop="ratingValue" :content="statistics.averageRating.toString()">
                
                <ComponentReviewStars 
                    :model-value="statistics.averageRating"
                    :interactive="false"
                    size="lg"
                    class="text-yellow-400"
                />
                
                <div class="text-sm">
                    <div class="font-medium">
                        {{ $t('review.averageRating', { 
                            rating: roundedAverageRating, 
                            maxRating: statistics.maxPoints 
                        }) }}
                    </div>
                </div>
            </div>

            <!-- Rating Distribution -->
            <div class="space-y-3">
                <h4 class="text-sm font-medium mb-3">
                    {{ $t('review.ratingDistribution') }}
                </h4>
                
                <div class="space-y-2">
                    <div 
                        v-for="matrix in statistics.matrix.slice().reverse()" 
                        :key="matrix.points"
                        class="flex items-center gap-3"
                    >
                        <!-- Rating Filter Checkbox -->
                        <label 
                            class="flex items-center gap-2 cursor-pointer group flex-1"
                            :class="{ 'opacity-50': matrix.count === 0 }"
                        >
                            <FoundationCheckbox
                                class="flex-shrink-0"
                                :checked="isRatingSelected(matrix.points)"
                                :disabled="matrix.count === 0"
                                @change="toggleRatingFilter(matrix.points)"
                            />
                            
                            <span class="text-sm transition-colors flex-shrink-0">
                                {{ getRatingLabel(matrix.points) }}
                                <span class="ml-1 text-xs">
                                    {{ $t('review.filter.ratingCount', { count: matrix.count }) }}
                                </span>
                            </span>
                        </label>

                        <!-- Progress Bar -->
                        <div class="flex-1 max-w-[100px]">
                            <div class="w-full rounded-full h-2">
                                <div 
                                    class="bg-primary h-2 rounded-full transition-all duration-300"
                                    :style="{ width: `${matrix.percent}%` }"
                                    role="progressbar"
                                    :aria-valuenow="matrix.percent"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    :aria-label="`${matrix.percent}% of reviews are ${matrix.points} stars`"
                                />
                            </div>
                        </div>

                        <!-- Percentage -->
                        <span class="text-xs w-8 text-right flex-shrink-0">
                            {{ Math.round(matrix.percent) }}%
                        </span>
                    </div>
                </div>
            </div>

            <!-- Language Filter -->
            <div class="mt-6 pt-4 border-t border-border">
                <label class="flex items-center gap-2 cursor-pointer group">
                    <FoundationCheckbox
                        :checked="localShowAllLanguages"
                        @change="toggleLanguageFilter"
                    />
                    <span class="text-sm transition-colors">
                        {{ $t('review.showAllLanguages') }}
                    </span>
                </label>
            </div>
        </div>

        <!-- Review Form Teaser -->
        <div class="bg-surface border border-border rounded-lg p-6">
            <header class="mb-4">
                <h3 class="text-lg font-semibold mb-2">
                    {{ $t('review.teaser.title') }}
                </h3>
                <p class="text-sm">
                    {{ $t('review.teaser.description') }}
                </p>
            </header>

            <FoundationButton
                variant="default"
                color="secondary"
                class="w-full"
                @click="handleToggleForm"
            >
                <FoundationIcon 
                    name="plus" 
                    size="sm" 
                    class="mr-2"
                />
                {{ $t('review.teaser.button') }}
            </FoundationButton>
        </div>
    </aside>
</template>