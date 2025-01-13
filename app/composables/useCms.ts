import type { Schemas } from '#shopware'
import { pascalCase } from 'scule'

export default function useCms () {
    function getCmsSlot (block: Schemas["CmsBlock"], slotName: string) {
        return block.slots.find((item: Schemas["CmsSlot"]) => item.slot === slotName)
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
