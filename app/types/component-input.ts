export type ComponentInputSize =  'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ComponentInputColor =  'primary' | 'secondary' | 'tertiary' | '';

export interface ComponentInputProps {
    id: string;
    label: string;
    showLabel?: boolean;
    placeholder?: string;
    type?: string;
    error?: string;
    helperText?: string;
    size?: ComponentInputSize;
    color?: ComponentInputColor;
    bordered?: boolean;
}
