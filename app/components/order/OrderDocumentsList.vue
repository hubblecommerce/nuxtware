<script setup lang="ts">
import type { Schemas } from '#shopware'

interface Props {
    documents: Schemas['Document'][]
    orderId: string
    showHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showHeader: true
})

const { t } = useI18n()
const { success, error: errorNotification } = useGlobalNotifications()
const orderDetails = useOrderDetails(props.orderId)

const sortedDocuments = computed(() => {
    return [...props.documents].sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime()
        const dateB = new Date(b.createdAt || '').getTime()
        return dateB - dateA // newest first
    })
})

const getDocumentDisplayName = (document: Schemas['Document']) => {
    const config = document.config
    if (!config || typeof config !== 'object') return document.id

    const configObj = config as Record<string, string | number | boolean>
    const prefix = String(configObj.filenamePrefix || '')
    const number = String(configObj.documentNumber || '')
    const suffix = configObj.filenameSuffix ? `_${String(configObj.filenameSuffix)}` : ''
    const date = document.createdAt ? `_${new Date(document.createdAt).toISOString().split('T')[0]}` : ''
    
    return `${prefix}${number}${suffix}${date}`
}

const getDocumentTypeIcon = (document: Schemas['Document']) => {
    const config = document.config
    const configObj = config && typeof config === 'object' ? config as Record<string, string | number | boolean> : {}
    const type = String(configObj.documentType || 'invoice')
    
    switch (type.toLowerCase()) {
        case 'invoice':
            return 'file-text'
        case 'delivery_note':
            return 'truck'
        case 'credit_note':
            return 'file-minus'
        case 'storno':
            return 'file-x'
        default:
            return 'file'
    }
}

const downloadDocument = async (document: Schemas['Document']) => {
    try {
        // Use the useOrderDetails composable method for document download
        const response = await orderDetails.getDocumentFile(document.id, document.deepLinkCode || '')
        
        // Handle the blob response
        if (response && response instanceof Blob) {
            // Use downloadFile helper from @shopware/helpers
            const { downloadFile } = await import('@shopware/helpers')
            const fileName = `${getDocumentDisplayName(document)}.pdf`
            downloadFile(response, fileName)
            
            success(t('orders.documents.downloadSuccess'))
        } else {
            throw new Error('Invalid response format')
        }
    } catch (error) {
        console.error('Error downloading document:', error)
        errorNotification(t('orders.documents.downloadError'))
    }
}

const formatDocumentDate = (createdAt: string | undefined) => {
    if (!createdAt) return t('orders.documents.noDate')
    
    return new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<template>
    <div class="space-y-4">
        <!-- Documents Table -->
        <div v-if="documents.length > 0" class="overflow-hidden rounded-lg border border-border">
            <!-- Table Header -->
            <div v-if="showHeader" class="bg-muted/50 px-6 py-3 border-b border-border">
                <div class="grid grid-cols-6 md:grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                    <div class="col-span-3 md:col-span-2">
                        {{ t('orders.documents.fileName') }}
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        {{ t('orders.documents.date') }}
                    </div>
                    <div class="col-span-1">
                        {{ t('orders.documents.actions') }}
                    </div>
                </div>
            </div>

            <!-- Documents List -->
            <ul class="divide-y divide-border">
                <li 
                    v-for="document in sortedDocuments" 
                    :key="document.id"
                    class="px-6 py-4 hover:bg-muted/25 transition-colors"
                >
                    <div class="grid grid-cols-6 md:grid-cols-4 gap-4 items-center">
                        <!-- File Name -->
                        <div class="col-span-3 md:col-span-2 flex items-center gap-3">
                            <FoundationIcon 
                                :name="getDocumentTypeIcon(document)" 
                                class="w-5 h-5 text-muted-foreground flex-shrink-0"
                            />
                            <div class="min-w-0">
                                <div class="text-sm font-medium text-foreground truncate">
                                    {{ getDocumentDisplayName(document) }}
                                </div>
                                <div v-if="document.config && typeof document.config === 'object'" class="text-xs text-muted-foreground">
                                    {{ String((document.config as Record<string, string | number | boolean>).documentType || 'Document') }}
                                </div>
                            </div>
                        </div>

                        <!-- Date -->
                        <div class="col-span-2 md:col-span-1">
                            <div class="text-sm text-muted-foreground">
                                {{ formatDocumentDate(document.createdAt) }}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="col-span-1 flex justify-start">
                            <FoundationButton
                                color="secondary"
                                size="small"
                                class="p-2"
                                :title="t('orders.documents.download')"
                                @click="downloadDocument(document)"
                            >
                                <FoundationIcon name="download" class="w-4 h-4" />
                                <span class="sr-only">{{ t('orders.documents.download') }}</span>
                            </FoundationButton>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-muted-foreground">
            <FoundationIcon name="file-x" class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">{{ t('orders.documents.empty') }}</p>
        </div>
    </div>
</template>