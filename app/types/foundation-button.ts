export type ButtonVariant = 'default' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'secondary' | 'tertiary' | '';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
    text?: string;
    tag?: string;
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    circle?: boolean;
    square?: boolean;
    unStyled?: boolean;
}
