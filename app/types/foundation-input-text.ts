export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type InputSize =  'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type InputColor =  'primary' | 'secondary' | 'tertiary' | '' ;

export interface TextInputProps {
    type?: InputType;
    placeholder?: string;
    disabled?: boolean;
    size?: InputSize;
    color?: InputColor;
    bordered?: boolean;
}
