import type { Schemas } from '#shopware'

export type ProductWishlistToggleVariant = 'icon' | 'button';
export type ProductWishlistToggleSize = 'small' | 'medium' | 'large';

export interface ProductWishlistToggleProps {
    /** The product data object */
    product: Schemas['Product'];
    /** Visual variant of the toggle - icon shows just the heart, button shows text */
    variant?: ProductWishlistToggleVariant;
    /** Size of the toggle button */
    size?: ProductWishlistToggleSize;
    /** Whether the toggle is disabled */
    disabled?: boolean;
}