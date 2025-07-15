import type { FoundationTextareaWrap } from "./foundation-textarea";

export type ComponentTextareaColor = 'primary' | 'secondary' | 'tertiary' | '';

export interface ComponentTextareaProps {
    id: string;
    label: string;
    showLabel?: boolean;
    placeholder?: string;
    error?: string;
    helperText?: string;
    description?: string;
    color?: ComponentTextareaColor;
    bordered?: boolean;
    textareaCss?: string;
    rows?: number;
    cols?: number;
    maxlength?: number;
    minlength?: number;
    wrap?: FoundationTextareaWrap;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
}