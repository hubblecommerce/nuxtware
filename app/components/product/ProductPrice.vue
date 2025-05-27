<template>
  <div class="product-price-info">
    <!-- Price Unit Information -->
    <p class="product-price-unit" v-if="referencePrice?.unitName">
      <!-- Purchase Unit -->
      <template v-if="referencePrice.purchaseUnit">
        <span class="product-unit-label">
          {{ $t('listing.boxUnitLabel') }}
        </span>
        <span class="price-unit-content">
          {{ referencePrice.purchaseUnit }} {{ referencePrice.unitName }}
        </span>
      </template>

      <!-- Reference Unit Price -->
      <span class="price-unit-reference" v-if="referencePrice.price">
        ({{ formatCurrency(referencePrice.price) }}* / {{ referencePrice.referenceUnit }} {{ referencePrice.unitName }})
      </span>
    </p>

    <!-- Main Price Display -->
    <div class="product-price-wrapper">
      <!-- Cheapest Price Display -->
      <div 
        class="product-cheapest-price"
        :class="{
          'with-list-price': isListPrice && regulationPrice && !displayFrom,
          'with-regulation-price': regulationPrice && !displayFrom,
          'with-from-price': displayFrom && regulationPrice
        }"
      >
        <div v-if="displayCheapestPrice">
          {{ $t('listing.cheapestPriceLabel') }}
          <span class="product-cheapest-price-price">
            {{ formatCurrency(cheapestPrice) }}*
          </span>
        </div>
      </div>

      <!-- "From" Text -->
      <template v-if="displayFrom">
        {{ $t('listing.listingTextFrom') }}
      </template>

      <!-- Main Price -->
      <span 
        class="product-price"
        :class="{
          'with-list-price': isListPrice && !displayFrom
        }"
      >
        {{ formatCurrency(unitPrice) }}*

        <!-- List Price Display -->
        <span 
          v-if="isListPrice && !displayFrom && price?.listPrice"
          class="list-price"
          :class="{
            'list-price-no-line-through': beforeListPriceExists || afterListPriceExists
          }"
        >
          <template v-if="beforeListPriceExists">
            {{ $t('listing.beforeListPrice').trim() }}
          </template>

          <span class="list-price-price">
            {{ formatCurrency(price.listPrice.price) }}*
          </span>

          <template v-if="afterListPriceExists">
            {{ $t('listing.afterListPrice').trim() }}
          </template>

          <span class="list-price-percentage">
            {{ $t('detail.listPricePercentage', { price: price.listPrice.percentage }) }}
          </span>
        </span>
      </span>

      <!-- Regulation Price -->
      <span 
        v-if="regulationPrice"
        class="product-price with-regulation-price"
      >
        <br v-if="isListPrice" />
        <span class="regulation-price">
          {{ $t('general.listPricePreviously', { price: formatCurrency(regulationPrice) }) }}*
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schemas } from '#shopware';

interface Props {
  product: Schemas['Product'];
}

const props = defineProps<Props>();

// Use the product price composable
const productRef = computed(() => props.product);
const {
  price,
  unitPrice,
  referencePrice,
  displayFrom,
  isListPrice,
  regulationPrice,
  displayCheapestPrice,
  cheapestPrice,
} = useProductPriceCustom(productRef);

// Helper computed properties for list price snippets
const beforeListPriceExists = computed(() => {
  // This would need to be implemented based on your i18n setup
  // return $t('listing.beforeListPrice').length > 0;
  return false; // Placeholder
});

const afterListPriceExists = computed(() => {
  // This would need to be implemented based on your i18n setup
  // return $t('listing.afterListPrice').length > 0;
  return false; // Placeholder
});

// Currency formatting helper
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return '';
  
  // This should be replaced with your actual currency formatting logic
  // For example, using Intl.NumberFormat or a Shopware helper
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR', // This should come from your store context
  }).format(value);
};

// Translation helper placeholder
const $t = (key: string, params?: Record<string, any>): string => {
  // This should be replaced with your actual translation function
  // For example, using vue-i18n's useI18n() composable
  return key; // Placeholder
};
</script>

<style scoped>
.product-price-info {
  /* Base styling for price info container */
}

.product-price-unit {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.product-unit-label {
  font-weight: 500;
  margin-right: 0.25rem;
}

.price-unit-content {
  margin-right: 0.5rem;
}

.price-unit-reference {
  font-style: italic;
}

.product-price-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-cheapest-price {
  font-size: 0.875rem;
  color: #059669;
}

.product-cheapest-price-price {
  font-weight: 600;
  margin-left: 0.25rem;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.product-price.with-list-price {
  color: #dc2626;
}

.list-price {
  margin-left: 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: #6b7280;
  text-decoration: line-through;
}

.list-price.list-price-no-line-through {
  text-decoration: none;
}

.list-price-price {
  margin: 0 0.25rem;
}

.list-price-percentage {
  background-color: #dc2626;
  color: white;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.regulation-price {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-price {
    font-size: 1.125rem;
  }
  
  .product-price-unit {
    font-size: 0.75rem;
  }
}
</style>