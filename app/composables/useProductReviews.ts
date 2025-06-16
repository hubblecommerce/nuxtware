import { useLocalStorage } from '@vueuse/core'

interface ProductReview {
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

interface ReviewsResponse {
    elements: ProductReview[]
    total: number
    page: number
    limit: number
    aggregations?: {
        'rating-avg'?: {
            value: number
        }
        'rating-distribution'?: {
            buckets: Array<{
                key: string
                count: number
            }>
        }
    }
}

interface ReviewFilters {
    page?: number
    limit?: number
    sort?: 'createdAt' | 'points'
    order?: 'asc' | 'desc'
    points?: number[]
    language?: boolean,
    'total-count-mode'?: number,
}

export interface UseProductReviewsOptions {
    productId: string
    autoFetch?: boolean
    defaultFilters?: ReviewFilters
}

export interface UseProductReviews {
    // Data
    reviews: Readonly<Ref<readonly ProductReview[]>>
    statistics: Readonly<Ref<ReviewStatistics>>
    currentUserReview: Readonly<Ref<ProductReview | null>>
    loading: Readonly<Ref<boolean>>
    error: Readonly<Ref<string | null>>
    
    // Pagination
    currentPage: Readonly<Ref<number>>
    totalPages: Readonly<Ref<number>>
    totalReviews: Readonly<Ref<number>>
    
    // Filters
    filters: Ref<ReviewFilters>
    
    // Methods
    fetchReviews: (newFilters?: Partial<ReviewFilters>) => Promise<void>
    refreshReviews: () => Promise<void>
    setFilters: (newFilters: Partial<ReviewFilters>) => void
    resetFilters: () => void
    saveUserReviewToStorage: (reviewData: {
        id?: string
        title: string
        content: string
        points: number
        status?: 'submitted' | 'pending'
    }) => void
}

export function useProductReviews(options: UseProductReviewsOptions): UseProductReviews {
    const { productId, autoFetch = true, defaultFilters = {} } = options
    
    // Get Shopware API client
    const { apiClient } = useShopwareContext()
    const { localeProperties } = useI18n()
    const { isLoggedIn, user } = useUser()
    
    // Client-side review tracking using localStorage
    const userReviewsStorage = useLocalStorage<Record<string, {
        id?: string
        title: string
        content: string
        points: number
        status: 'submitted' | 'pending'
        timestamp: number
    }>>('nuxtware-user-reviews', {})
    
    // Reactive state
    const reviews = ref<ProductReview[]>([])
    const statistics = ref<ReviewStatistics>({
        totalReviewCount: 0,
        averageRating: 0,
        maxPoints: 5,
        matrix: []
    })
    const currentUserReview = ref<ProductReview | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    
    // Pagination state
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalReviews = ref(0)
    
    // Default filters with sensible defaults
    const defaultFilterValues: ReviewFilters = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
        points: [],
        language: false,
        'total-count-mode': 1,
        ...defaultFilters
    }
    
    // Filter state
    const filters = ref<ReviewFilters>({ ...defaultFilterValues })
    
    // Fetch reviews from API
    const fetchReviews = async (newFilters?: Partial<ReviewFilters>) => {
        if (!productId) {
            error.value = 'Product ID is required'
            return
        }
        
        loading.value = true
        error.value = null
        
        try {
            // Update filters if provided
            if (newFilters) {
                filters.value = { ...filters.value, ...newFilters }
            }
            
            // Build API request parameters
            const params: Record<string, unknown> = {
                page: filters.value.page || defaultFilterValues.page,
                limit: filters.value.limit || defaultFilterValues.limit,
                'total-count-mode': defaultFilterValues['total-count-mode']
            }
            
            // Add sorting
            if (filters.value.sort) {
                if (filters.value.order) {
                    params.sort = [
                        {
                            field: filters.value.sort,
                            order: filters.value.order
                        }
                    ]
                }
            }
            
            // Add filters array (affects both results and aggregations)
            const apiFilters: Array<{
                type: 'equals' | 'equalsAny'
                field: string
                value: string | number | unknown
            }> = []
            
            // Add post-filters array (affects only results, not aggregations)
            const apiPostFilters: Array<{
                type: 'equals' | 'equalsAny'
                field: string
                value: string | number | undefined
            }> = []
            
            // Add rating filter as POST-FILTER (so it doesn't affect aggregation statistics)
            if (filters.value.points && filters.value.points.length > 0) {
                if (filters.value.points.length === 1) {
                    // Single rating filter
                    apiPostFilters.push({
                        type: 'equals',
                        field: 'points',
                        value: filters.value.points[0]
                    })
                } else {
                    // Multiple ratings filter using equalsAny
                    apiPostFilters.push({
                        type: 'equalsAny',
                        field: 'points',
                        value: filters.value.points.join('|')
                    })
                }
            }
            
            // Add language filter as regular filter (affects both results and aggregations)
            if (filters.value.language !== undefined) {
                if (filters.value.language) {
                    // Show all languages - no language filter needed
                } else {
                    // Show only current language reviews
                    try {
                        apiFilters.push({
                            type: 'equals',
                            field: 'languageId',
                            value: localeProperties.value.localeId
                        })
                    } catch {
                        // Fallback: if i18n is not available, skip language filtering
                        console.warn('i18n locale not available for language filtering')
                    }
                }
            }
            
            // Add filters to params if any exist
            if (apiFilters.length > 0) {
                params.filter = apiFilters
            }
            
            // Add post-filters to params if any exist
            if (apiPostFilters.length > 0) {
                params['post-filter'] = apiPostFilters
            }
            
            // Request aggregations for statistics
            params.aggregations = [
                {
                    name: 'rating-avg',
                    type: 'avg',
                    field: 'points'
                },
                {
                    name: 'rating-distribution',
                    type: 'terms',
                    field: 'points'
                }
            ]
            
            // Make API call
            const response = await apiClient.invoke(
                'readProductReviews post /product/{productId}/reviews',
                {
                    pathParams: { productId },
                    body: params
                }
            )
            
            const data = response.data as ReviewsResponse
            
            // Update reviews
            reviews.value = data.elements || []
            
            // Update pagination
            totalReviews.value = data.total || 0
            currentPage.value = data.page || 1
            totalPages.value = Math.ceil(totalReviews.value / (filters.value.limit || 10))
            
            // Update statistics from aggregations or calculate from data
            if (data.aggregations) {
                const distributionBuckets = data.aggregations['rating-distribution']?.buckets || []
                
                // Calculate total count from aggregation buckets (unfiltered total)
                const totalCountFromAggregation = distributionBuckets.reduce(
                    (sum: number, bucket: { count: number }) => sum + bucket.count, 
                    0
                )
                
                // Calculate average rating manually from distribution buckets
                const weightedSum = distributionBuckets.reduce(
                    (sum: number, bucket: { key: string; count: number }) => {
                        const rating = parseInt(bucket.key, 10)
                        return sum + (rating * bucket.count)
                    }, 
                    0
                )
                const avgRating = totalCountFromAggregation > 0 ? weightedSum / totalCountFromAggregation : 0
                
                // Convert distribution buckets to matrix format
                const matrix = Array.from({ length: 5 }, (_, i) => {
                    const rating = i + 1
                    const bucket = distributionBuckets.find((b: { key: string; count: number }) => 
                        b.key === rating.toString()
                    )
                    const count = bucket?.count || 0
                    const percent = totalCountFromAggregation > 0 ? (count / totalCountFromAggregation) * 100 : 0
                    
                    return {
                        points: rating,
                        count,
                        percent
                    }
                })
                
                statistics.value = {
                    totalReviewCount: totalCountFromAggregation,
                    averageRating: avgRating,
                    maxPoints: 5,
                    matrix
                }
            } else {
                // Fallback: calculate statistics from current data
                statistics.value = calculateStatistics(reviews.value, totalReviews.value)
            }
            
            // Check for current user's review
            await fetchCurrentUserReview()
            
        } catch (err: unknown) {
            console.error('Failed to fetch reviews:', err)
            error.value = (err instanceof Error ? err.message : 'Failed to fetch reviews')
        } finally {
            loading.value = false
        }
    }
    
    // Get storage key for current user-product combination
    const getStorageKey = () => {
        if (!user.value?.id) return null
        return `${user.value.id}-${productId}`
    }
    
    // Fetch current user's review from localStorage
    const fetchCurrentUserReview = async () => {
        try {
            if (!isLoggedIn.value || !user.value) {
                currentUserReview.value = null
                return
            }
            
            const storageKey = getStorageKey()
            if (!storageKey) {
                currentUserReview.value = null
                return
            }
            
            // Check localStorage for existing review
            const storedReview = userReviewsStorage.value[storageKey]
            if (storedReview) {
                currentUserReview.value = {
                    id: storedReview.id || 'local',
                    title: storedReview.title,
                    content: storedReview.content,
                    points: storedReview.points,
                    createdAt: new Date(storedReview.timestamp).toISOString(),
                    externalUser: user.value.firstName || 'Customer',
                    status: storedReview.status === 'submitted'
                }
            } else {
                currentUserReview.value = null
            }
            
        } catch (err) {
            console.warn('Failed to fetch user review from storage:', err)
            currentUserReview.value = null
        }
    }
    
    // Save user review to localStorage
    const saveUserReviewToStorage = (reviewData: {
        id?: string
        title: string
        content: string
        points: number
        status?: 'submitted' | 'pending'
    }) => {
        const storageKey = getStorageKey()
        if (!storageKey) return
        
        userReviewsStorage.value[storageKey] = {
            id: reviewData.id,
            title: reviewData.title,
            content: reviewData.content,
            points: reviewData.points,
            status: reviewData.status || 'submitted',
            timestamp: Date.now()
        }
        
        // Update current user review immediately
        fetchCurrentUserReview()
    }
    
    // Calculate statistics from review data
    const calculateStatistics = (reviewList: ProductReview[], total: number): ReviewStatistics => {
        if (reviewList.length === 0) {
            return {
                totalReviewCount: total,
                averageRating: 0,
                maxPoints: 5,
                matrix: Array.from({ length: 5 }, (_, i) => ({
                    points: i + 1,
                    count: 0,
                    percent: 0
                }))
            }
        }
        
        const ratingCounts = [0, 0, 0, 0, 0] // Index 0 = 1 star, Index 4 = 5 stars
        let totalRating = 0
        
        reviewList.forEach(review => {
            const rating = Math.max(1, Math.min(5, Math.floor(review.points)))
            // @ts-expect-error api ensures rating is set 
            ratingCounts[rating - 1]++
            totalRating += review.points
        })
        
        const averageRating = reviewList.length > 0 ? totalRating / reviewList.length : 0
        
        const matrix = ratingCounts.map((count, index) => ({
            points: index + 1,
            count,
            percent: total > 0 ? (count / total) * 100 : 0
        }))
        
        return {
            totalReviewCount: total,
            averageRating,
            maxPoints: 5,
            matrix
        }
    }
    
    // Refresh reviews with current filters
    const refreshReviews = async () => {
        await fetchReviews()
    }
    
    // Set new filters and fetch
    const setFilters = (newFilters: Partial<ReviewFilters>) => {
        filters.value = { ...filters.value, ...newFilters }
        // Reset page when filters change (except when explicitly setting page)
        if (!newFilters.page) {
            filters.value.page = 1
        }
        fetchReviews()
    }
    
    // Reset filters to defaults
    const resetFilters = () => {
        filters.value = { ...defaultFilterValues }
        fetchReviews()
    }
    
    // Auto-fetch on mount if enabled
    if (autoFetch && import.meta.client) {
        fetchReviews()
    }
    
    return {
        // Data
        reviews: readonly(reviews),
        statistics: readonly(statistics),
        currentUserReview: readonly(currentUserReview),
        loading: readonly(loading),
        error: readonly(error),
        
        // Pagination
        currentPage: readonly(currentPage),
        totalPages: readonly(totalPages),
        totalReviews: readonly(totalReviews),
        
        // Filters
        filters,
        
        // Methods
        fetchReviews,
        refreshReviews,
        setFilters,
        resetFilters,
        saveUserReviewToStorage
    }
}