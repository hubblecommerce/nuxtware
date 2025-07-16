import { computed, type Ref } from 'vue'
import type { Schemas } from '#shopware'

interface MarginProperties {
    marginTop?: string | null
    marginBottom?: string | null
    marginLeft?: string | null
    marginRight?: string | null
}

type CmsContent = (Schemas['CmsSection'] | Schemas['CmsBlock']) & MarginProperties

interface UseCmsMarginStylesReturn {
    marginStyles: Ref<string>
}

export function useCmsMarginStyles(content: CmsContent): UseCmsMarginStylesReturn {
    const marginStyles = computed(() => {
        const styles: string[] = []

        if (content.marginTop != null) {
            styles.push(`padding-top:${content.marginTop};`)
        }
        if (content.marginBottom != null) {
            styles.push(`padding-bottom:${content.marginBottom};`)
        }
        if (content.marginLeft != null) {
            styles.push(`padding-left:${content.marginLeft};`)
        }
        if (content.marginRight != null) {
            styles.push(`padding-right:${content.marginRight};`)
        }

        return styles.join(' ')
    })

    return {
        marginStyles
    }
}
