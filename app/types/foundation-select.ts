export type SelectSize = 'small' | 'medium' | 'large';
export type SelectColor = 'primary' | 'secondary' | 'tertiary' | '';

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface FoundationSelectProps {
    options: SelectOption[];
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    size?: SelectSize;
    color?: SelectColor;
    error?: boolean;
    name?: string;
}
