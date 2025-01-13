import { computed, type Ref } from 'vue'
import type { Schemas } from '#shopware'

export function useCmsBackgroundStyles (content: Schemas['CmsSection'] | Schemas['CmsBlock']): { backgroundStyles: Ref<string> } {
    const backgroundStyles: Ref<string> = computed(() => {
        let styles = ''

        if (content.backgroundColor != null) {
            styles = `background-color:${content.backgroundColor};`
        }

        if (content.backgroundMedia != null) {
            styles = `background:url('${content.backgroundMedia.url}');`
        }

        if (content.backgroundMediaMode != null) {
            styles += `background-size:${content.backgroundMediaMode};`
        }

        return styles
    })

    return {
        backgroundStyles
    }
}
