export type LinkVariants = 'default' | 'underline'
export type LinkTarget = '_self' | '_blank' | '_parent' | '_top'
export type LinkType = 'internal' | 'external'

export interface LinkProps {
    text?: string
    href?: string
    target?: LinkTarget
    variant?: LinkVariants
    type?: LinkType,
    color?: string | undefined,
    disabled?: boolean
}
