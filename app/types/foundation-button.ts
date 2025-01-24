export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps {
    text: string
    tag?: string
    variant?: ButtonVariant
    size?: ButtonSize
    color?: string | null
    disabled?: boolean
    loading?: boolean
}
