export type FoundationInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

export interface FoundationInputTextProps {
    type?: FoundationInputType;
    disabled?: boolean;
}
