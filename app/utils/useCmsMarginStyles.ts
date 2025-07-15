import { computed, type Ref } from 'vue'
import type { Schemas } from '#shopware'

export function useCmsMarginStyles(content: Schemas['CmsSection'] | Schemas['CmsBlock']): { marginStyles: Ref<string> } {
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
