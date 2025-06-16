export type FoundationTextareaWrap = 'soft' | 'hard' | 'off';

export interface FoundationTextareaProps {
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    rows?: number;
    cols?: number;
    placeholder?: string;
    maxlength?: number;
    minlength?: number;
    wrap?: FoundationTextareaWrap;
}