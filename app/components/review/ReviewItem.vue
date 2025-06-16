<script setup lang="ts">
interface ReviewItemProps {
    review: {
        id: string
        title: string
        content: string
        points: number
        createdAt: string
        externalUser?: string
        comment?: string
        status?: boolean
        language?: {
            translationCode?: {
                code: string
            }
        }
    }
    showStatus?: boolean
}

const props = withDefaults(defineProps<ReviewItemProps>(), {
    showStatus: true
})

const { locale } = useI18n()

const formattedDate = computed(() => {
    if (!props.review.createdAt) return ''
    const date = new Date(props.review.createdAt)
    return new Intl.DateTimeFormat(locale.value, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }).format(date)
})

const languageCode = computed(() => {
    return props.review.language?.translationCode?.code
})
</script>

<template>
    <article 
        class="product-review-item border-b border-border pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0"
        itemscope
        itemtype="https://schema.org/Review"
    >
        <!-- Schema.org metadata -->
        <meta 
            v-if="review.createdAt" 
            itemprop="datePublished" 
            :content="review.createdAt"
        >
        <meta 
            v-if="review.title" 
            itemprop="name" 
            :content="review.title"
        >
        <meta 
            v-if="languageCode" 
            itemprop="inLanguage" 
            :content="languageCode"
        >
        
        <!-- Author metadata -->
        <div 
            v-if="review.externalUser" 
            itemprop="author" 
            itemtype="https://schema.org/Person" 
            itemscope
        >
            <meta itemprop="name" :content="review.externalUser">
        </div>

        <!-- Review header -->
        <header class="flex flex-col gap-2 mb-4">
            <!-- Date -->
            <div v-if="formattedDate" class="text-sm">
                <time :datetime="review.createdAt">
                    {{ formattedDate }}
                </time>
                <span v-if="review.externalUser" class="ml-1">
                    • {{ $t('review.item.author', { author: review.externalUser }) }}
                </span>
            </div>

            <!-- Status warning for unapproved reviews -->
            <div 
                v-if="showStatus && review.status === false"
                class="flex items-center gap-2 p-3 bg-warning/30 border border-warning/20 rounded-md text-warning-content text-sm"
                role="alert"
            >
                <FoundationIcon 
                    name="triangle-alert" 
                    size="sm" 
                    class="text-warning-content"
                />
                {{ $t('review.item.notApproved') }}
            </div>

            <!-- Rating and title -->
            <div class="flex items-start gap-3">
                <div class="flex items-center gap-2 py-1" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
                    <meta itemprop="ratingValue" :content="review.points.toString()">
                    <meta itemprop="bestRating" content="5">
                    <ComponentReviewStars 
                        :model-value="review.points"
                        :interactive="false"
                        size="sm"
                        :aria-label="$t('review.averageRating', { rating: review.points, maxRating: 5 })"
                    />
                </div>
                <h3 
                    class="text-lg font-semibold flex-1"
                    :lang="languageCode"
                    itemprop="headline"
                >
                    {{ review.title }}
                </h3>
            </div>
        </header>

        <!-- Review content -->
        <div class="space-y-4">
            <div 
                class="leading-relaxed whitespace-pre-wrap"
                :lang="languageCode"
                itemprop="reviewBody"
            >
                {{ review.content }}
            </div>

            <!-- Merchant comment -->
            <div 
                v-if="review.comment" 
                class="bg-surface border border-border rounded-md p-4"
            >
                <div class="flex items-start gap-2">
                    <FoundationIcon 
                        name="user-check" 
                        size="sm" 
                        class="text-primary mt-0.5 flex-shrink-0"
                    />
                    <div class="space-y-1">
                        <div class="text-sm font-medium">
                            {{ $t('review.item.merchantComment') }}
                        </div>
                        <div class="text-sm">
                            {{ review.comment }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>