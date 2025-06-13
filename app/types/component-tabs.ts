export type ComponentTabsSize = 'sm' | 'md' | 'lg'
export type ComponentTabsColor = 'primary' | 'secondary' | 'tertiary' | ''

export interface TabItem {
    readonly id: string
    readonly label: string
    readonly disabled?: boolean
}

export interface ComponentTabsProps {
    readonly tabs: TabItem[]
    readonly modelValue?: string
    readonly enableHashNavigation?: boolean
    readonly defaultTab?: string
    readonly size?: ComponentTabsSize
    readonly color?: ComponentTabsColor
    readonly scrollable?: boolean
    readonly showBorder?: boolean
}

export interface ComponentTabsEmits {
    (event: 'update:modelValue', value: string): void
    (event: 'tab-change', tabId: string, tab: TabItem): void
}