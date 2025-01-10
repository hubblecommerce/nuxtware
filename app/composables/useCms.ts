import type { Schemas } from '#shopware'
import { pascalCase } from 'scule'

export default function useCms () {
    function getCmsSlot (block: Schemas["CmsBlock"], slotName: string): Schemas["CmsSlot"] | null {
        return block.find((item) => item.slot === slotName)
    }

    function getCmsBlockName (type: string) {
        return `StructureBlock${pascalCase(type)}`
    }

    function getCmsElementName (type: string) {
        return `StructureElement${pascalCase(type)}`
    }

    return {
        getCmsSlot,
        getCmsBlockName,
        getCmsElementName,
    }
}
