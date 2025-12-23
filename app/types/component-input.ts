import type { FoundationInputType } from "#nuxtware/types/foundation-input-text";

export type ComponentInputSize =  'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ComponentInputColor =  'primary' | 'secondary' | 'tertiary' | '';

export interface ComponentInputProps {
    id: string;
    label: string;
    showLabel?: boolean;
    placeholder?: string;
    type?: FoundationInputType;
    error?: string;
    helperText?: string;
    description?: string;
    size?: ComponentInputSize;
    color?: ComponentInputColor;
    bordered?: boolean;
    inputCss?: string;
}
