import { getProductTierPrices } from "@shopware/helpers";
import type { TierPrice } from "@shopware/helpers";
import type { Schemas } from "#shopware";

export type UseProductPriceCustomReturn = {
  /**
   * Whole calculated price object
   */
  price: ComputedRef<Schemas["CalculatedPrice"] | undefined>;
  /**
   * Calculated price value for one selling unit
   */
  totalPrice: ComputedRef<number | undefined>;
  /**
   * Current unit price value
   */
  unitPrice: ComputedRef<number | undefined>;
  /**
   * Can be used if isListPrice is set to true
   */
  referencePrice: ComputedRef<
    Schemas["CalculatedPrice"]["referencePrice"] | undefined
  >;
  /**
   * determines if `price` contains the minimum tier price
   */
  displayFrom: ComputedRef<boolean>;
  /**
   * cheapest price value for a variant if exists
   */
  displayFromVariants: ComputedRef<number | false | undefined>;
  /**
   * array of TierPrice object
   */
  tierPrices: ComputedRef<TierPrice[]>;
  /**
   * determines whether a discount price is set
   */
  isListPrice: ComputedRef<boolean>;
  /**
   * price for products with regulation price
   */
  regulationPrice: ComputedRef<number | undefined>;
  /**
   * determines if cheapest price should be displayed separately
   */
  displayCheapestPrice: ComputedRef<boolean>;
  /**
   * cheapest price unit price value
   */
  cheapestPrice: ComputedRef<number | undefined>;
};

/**
 * Enhancement of the `useProductPrice` from shopware composables to abstract the logic to expose most useful helpers for price displaying.
 *
 * @public
 * @category Product
 * 
Missing API Data:
    1. product.variantListingConfig.displayParent - Configuration flag indicating if a parent product should display variant price ranges
    2. product.cheapestPriceContainer.value - Array of all variants with their prices
    3. Variant filtering logic - Ability to filter variants by variant.default != null

Impact on Rendering:
Parent Product Price Display:
    - Twig: Parent products can show "from X" pricing based on their cheapest variant
    - Vue: Cannot distinguish between parent products that should show variant ranges vs. regular products
    - Result: Parent products will show their own price instead of variant price ranges

Enhanced "From" Logic:
    - Twig: Shows "from" for both tier pricing AND parent products with multiple variants
    - Vue: Only shows "from" for tier pricing
    - Result: Some parent products that should show "from" won't display it

Price Selection Override:
    - Twig: Parent products can override their main price to show the cheapest variant price
    - Vue: Always uses the product's own calculated price
    - Result: Parent products show their configured price instead of cheapest variant price

What's Needed to resolve this:
Backend API Enhancement:
interface Product {
  variantListingConfig?: {
    displayParent: boolean;
  };
  cheapestPriceContainer?: {
    value: Array<{
      unitPrice: number;
      variantId: string;
      default?: any; 
    }>;
  };
}
 */
export function useProductPriceCustom(
  product: Ref<Schemas["Product"] | undefined>,
): UseProductPriceCustomReturn {
  const _cheapest: ComputedRef<
    Schemas["Product"]["calculatedCheapestPrice"] | undefined
  > = computed(() => product.value?.calculatedCheapestPrice);

  /**
   * calculatedPrices are used for product with tier prices
   * Fixed: Use last element instead of first to match Twig template
   */
  const _real: ComputedRef<Schemas["CalculatedPrice"] | undefined> = computed(
    () => {
      const calculatedPrices = product.value?.calculatedPrices;
      return (calculatedPrices?.length ?? 0) > 0
        ? calculatedPrices?.[calculatedPrices.length - 1] // Use last element
        : product.value?.calculatedPrice;
    }
  );

  const referencePrice: ComputedRef<
    Schemas["CalculatedPrice"]["referencePrice"] | undefined
  > = computed(() => _real?.value?.referencePrice);

  const displayFrom: ComputedRef<boolean> = computed(() => {
    return (product.value?.calculatedPrices?.length ?? 0) > 1;
  });

  const displayFromVariants: ComputedRef<number | false | undefined> = computed(
    () => {
      return (
        !!product.value?.parentId &&
        product.value?.calculatedCheapestPrice?.hasRange &&
        _real?.value?.unitPrice !== _cheapest?.value?.unitPrice &&
        _cheapest?.value?.unitPrice
      );
    },
  );

  const _price: ComputedRef<Schemas["CalculatedPrice"] | undefined> = computed(
    () => {
      if (displayFrom.value && getProductTierPrices(product.value).length > 1) {
        return product.value?.calculatedPrices?.reduce((previous, current) => {
          return current.unitPrice < previous.unitPrice ? current : previous;
        });
      }
      return _real.value;
    },
  );

  const unitPrice: ComputedRef<number | undefined> = computed(
    () => _price.value?.unitPrice,
  );
  const totalPrice: ComputedRef<number | undefined> = computed(
    () => _price.value?.totalPrice,
  );
  const price: ComputedRef<Schemas["CalculatedPrice"] | undefined> = computed(
    () => _price.value,
  );

  const isListPrice: ComputedRef<boolean> = computed(() => {
    return !!_price.value?.listPrice?.percentage;
  });

  /**
   * Fixed: Use regulation price from selected price object instead of base calculatedPrice
   */
  const regulationPrice: ComputedRef<number | undefined> = computed(
    () => _price.value?.regulationPrice?.price,
  );

  const tierPrices = computed(() => getProductTierPrices(product.value));

  /**
   * Added: Logic to determine if cheapest price should be displayed separately
   * Matches Twig condition: cheapest.unitPrice != real.unitPrice and cheapest.variantId != product.id
   */
  const displayCheapestPrice: ComputedRef<boolean> = computed(() => {
    return (
      _cheapest.value?.unitPrice !== _real.value?.unitPrice &&
      _cheapest.value?.variantId !== product.value?.id
    );
  });

  /**
   * Added: Cheapest price unit price value
   */
  const cheapestPrice: ComputedRef<number | undefined> = computed(
    () => _cheapest.value?.unitPrice,
  );

  return {
    price,
    totalPrice,
    unitPrice,
    displayFromVariants,
    displayFrom,
    tierPrices,
    referencePrice,
    isListPrice,
    regulationPrice,
    displayCheapestPrice,
    cheapestPrice,
  };
}