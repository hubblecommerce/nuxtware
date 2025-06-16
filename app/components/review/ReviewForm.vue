<script setup lang="ts">
interface ReviewFormProps {
    productId: string
}

interface ReviewFormData {
    rating: number | undefined
    title: string
    content: string
}

interface ReviewData {
    id?: string
    title: string
    content: string
    points: number
}

const props = defineProps<ReviewFormProps>()

const emit = defineEmits<{
    success: [review: ReviewData]
    cancel: []
}>()

const { apiClient } = useShopwareContext();
const { t } = useI18n()

const isLoading = ref(false)
const { resolveApiErrors } = useApiErrorsResolver()
const { addNotification } = useGlobalNotifications()

// Form data
const formData = reactive<ReviewFormData>({
    rating: undefined,
    title: '',
    content: ''
})

// Form validation
const errors = reactive<Record<string, string>>({})

const validateForm = (): boolean => {
    // Clear previous errors
    Object.keys(errors).forEach(key => {
        errors[key] = ''
    })
    
    let isValid = true

    // Rating validation
    if (!formData.rating) {
        errors.rating = t('review.form.validation.ratingRequired')
        isValid = false
    }

    // Title validation
    if (!formData.title.trim()) {
        errors.title = t('review.form.validation.titleRequired')
        isValid = false
    } else if (formData.title.trim().length < 5) {
        errors.title = t('review.form.validation.titleMinLength')
        isValid = false
    }

    // Content validation
    if (!formData.content.trim()) {
        errors.content = t('review.form.validation.contentRequired')
        isValid = false
    } else if (formData.content.trim().length < 40) {
        errors.content = t('review.form.validation.contentMinLength')
        isValid = false
    }

    return isValid
}

const submitForm = async () => {
    if (!validateForm()) {
        return
    }

    isLoading.value = true

    try {
        
        const requestData = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            points: formData.rating!
        }

        // Always create a new review
        const response = await apiClient.invoke('saveProductReview post /product/{productId}/review', {
            pathParams: {
                productId: props.productId
            },
            body: requestData
        })

        // Show success message
        const successMessage = t('review.success.created')
        
        addNotification({
            type: 'success',
            message: successMessage
        })

        // Emit the form data if API doesn't return review data
        const reviewDataToEmit: ReviewData = response.data || {
            id: `local-${Date.now()}`,
            title: requestData.title,
            content: requestData.content,
            points: requestData.points
        }

        emit('success', reviewDataToEmit)

    } catch (error: unknown) {
        console.error('Review submission failed:', error)
        
        if (error && typeof error === 'object' && 'details' in error && 
            typeof error.details === 'object' && error.details &&
            'errors' in error.details) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const apiErrors = resolveApiErrors(error.details.errors as any[])
            apiErrors.forEach(errorMessage => {
                addNotification({
                    type: 'error',
                    message: errorMessage
                })
            })
        } else {
            addNotification({
                type: 'error',
                message: t('review.error.general')
            })
        }
    } finally {
        isLoading.value = false
    }
}

const handleCancel = () => {
    emit('cancel')
}

</script>

<template>
    <div class="review-form bg-surface border border-border rounded-lg p-6">
        <header class="mb-6">
            <h3 class="text-xl font-semibold">
                {{ $t('review.form.title') }}
            </h3>
        </header>

        <form class="space-y-6" @submit.prevent="submitForm">
            <!-- Rating Input -->
            <div class="space-y-2">
                <FoundationLabel 
                    for="review-rating"
                    class="block"
                    :class="{ 'text-error': errors.rating }"
                >
                    {{ $t('review.form.rating') }} *
                </FoundationLabel>
                
                <div id="review-rating" class="flex items-center gap-2">
                    <ComponentReviewStars 
                        v-model="formData.rating"
                        :interactive="true"
                        size="lg"
                    />
                    <span v-if="formData.rating" class="text-sm ml-2">
                        ({{ formData.rating }}/5)
                    </span>
                </div>
                
                <p v-if="errors.rating" class="text-sm text-error">
                    {{ errors.rating }}
                </p>
            </div>

            <!-- Title Input -->
            <ComponentTextInput
                id="review-title"
                v-model="formData.title"
                :label="`${$t('review.form.reviewTitle')} *`"
                type="text"
                :placeholder="$t('review.form.reviewTitlePlaceholder')"
                :error="errors.title"
                :disabled="isLoading"
                size="md"
                bordered
            />

            <!-- Content Input -->
            <div class="space-y-2">
                <FoundationLabel 
                    for="review-content"
                    class="block font-medium"
                    :class="{ 'text-error': errors.content }"
                >
                    {{ $t('review.form.content') }} *
                </FoundationLabel>
                
                <FoundationTextarea
                    id="review-content"
                    v-model="formData.content"
                    :placeholder="$t('review.form.contentPlaceholder')"
                    :disabled="isLoading"
                    :rows="6"
                    class="w-full px-3 py-2 border border-input rounded-md disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[120px]"
                    :class="{ 'border-error': errors.content }"
                />
                
                <p v-if="errors.content" class="text-sm text-error">
                    {{ errors.content }}
                </p>
                
                <p class="text-xs text-muted-foreground">
                    {{ formData.content.length }}/40 {{ $t('form.charactersMinimum') }}
                </p>
            </div>

            <!-- Required fields note -->
            <p class="text-sm">
                {{ $t('review.form.requiredFields') }}
            </p>

            <!-- Form Actions -->
            <div class="flex items-center gap-3 pt-4 border-t border-border">
                <FoundationButton
                    type="submit"
                    variant="default"
                    color="secondary"
                    :loading="isLoading"
                    :disabled="isLoading"
                    class="px-6"
                    @click="submitForm"
                >
                    {{ $t('review.form.submit') }}
                </FoundationButton>

                <FoundationButton
                    type="button"
                    variant="outline"
                    :disabled="isLoading"
                    @click="handleCancel"
                >
                    {{ $t('review.form.cancel') }}
                </FoundationButton>
            </div>
        </form>
    </div>
</template>