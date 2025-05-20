<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

interface CollapsibleProps {
  /**
   * Items to be displayed in the container
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  /**
   * Space to reserve for control elements (in pixels)
   */
  reservedWidth?: number;
  /**
   * Space between items (in pixels)
   */
  itemSpacing?: number;
  /**
   * Text for the show more button
   */
  showMoreText?: string;
  /**
   * Text for the show less button
   */
  showLessText?: string;
  /**
   * Whether the component is in desktop mode
   * When false, all items will be shown without collapsing
   */
  isDesktopMode?: boolean;
}

const props = withDefaults(defineProps<CollapsibleProps>(), {
  reservedWidth: 80,
  itemSpacing: 12,
  showMoreText: 'Show More',
  showLessText: 'Show Less',
  isDesktopMode: true
})

const emit = defineEmits(['update:expanded'])

// Refs for DOM elements
const containerRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])
const toggleButtonRef = ref<HTMLElement | null>(null)

// State management
const isExpanded = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const visibleItems = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hiddenItems = ref<any[]>([])
const hasOverflow = ref(false)
const isInitializing = ref(true)
const isCalculating = ref(false)
const isToggling = ref(false)

// Store item widths to avoid recalculation
const itemWidths = ref<number[]>([])

// ResizeObserver setup
let resizeObserver: ResizeObserver | null = null
let resizeTimer: number

// Capture item widths once during initialization
function captureItemWidths() {
  itemWidths.value = []
  
  if (props.items && itemRefs.value.length) {
    props.items.forEach((_, index) => {
      const element = itemRefs.value[index]
      if (element) {
        itemWidths.value.push(element.offsetWidth)
      } else {
        itemWidths.value.push(0) // Fallback
      }
    })
  }
}

// Calculate which items should be visible based on container width
function calculateVisibleItems() {
  if (isCalculating.value || !containerRef.value || !props.items?.length) return
  
  // Set calculating flag to prevent recursive calls
  isCalculating.value = true
  
  try {
    // If not in desktop mode, show all items
    if (!props.isDesktopMode) {
      visibleItems.value = [...props.items]
      hiddenItems.value = []
      hasOverflow.value = false
      return
    }
    
    const containerWidth = containerRef.value.offsetWidth - props.reservedWidth
    let availableWidth = containerWidth
    
    // Reset arrays
    visibleItems.value = []
    hiddenItems.value = []
    
    // Use stored item widths rather than measuring dynamically
    props.items.forEach((item, index) => {
      const itemWidth = itemWidths.value[index] || 0
      const marginSpace = props.itemSpacing
      
      if (availableWidth >= (itemWidth + marginSpace) || isExpanded.value) {
        visibleItems.value.push(item)
        availableWidth -= (itemWidth + marginSpace)
      } else {
        hiddenItems.value.push(item)
      }
    })
    
    // Determine if we have overflow based on current calculation
    hasOverflow.value = hiddenItems.value.length > 0
    
    // Only auto-collapse during initialization or resize, not during toggling
    if (!isToggling.value && isExpanded.value && hiddenItems.value.length === 0) {
      isExpanded.value = false
    }
  } finally {
    // Always reset the calculating flag
    isCalculating.value = false
  }
}

// Toggle expanded state
function toggleExpanded() {
  isToggling.value = true
  isExpanded.value = !isExpanded.value
  
  emit('update:expanded', isExpanded.value)
  
  // Use nextTick to ensure DOM is updated before recalculation
  nextTick(() => {
    calculateVisibleItems()
    
    // Small delay to avoid interference from resize events
    setTimeout(() => {
      isToggling.value = false
    }, 1)
  })
}

// Register an item ref
function setItemRef(el: HTMLElement | null, index: number) {
  if (el) {
    itemRefs.value[index] = el
  }
}

// Determine if an item should be rendered based on visibility state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shouldRenderItem(item: any): boolean {
  // In mobile mode, always render all items
  if (!props.isDesktopMode) {
    return true
  }
  
  // During initialization or toggling, render everything
  if (isInitializing.value || isToggling.value) {
    return true
  }
  
  // When expanded, render everything
  if (isExpanded.value) {
    return true
  }
  
  // When collapsed, only render visible items
  return visibleItems.value.some((visibleItem) => {
    if (visibleItem.id != null && item.id != null) {
      return visibleItem.id === item.id
    } else if (visibleItem.code != null && item.code != null) {
      return visibleItem.code === item.code
    }
    return visibleItem === item
  })
}

// Initialize on mount
onMounted(() => {
  setTimeout(() => {
    // Phase 1: Initialize all items as visible to get dimensions
    if (props.items && props.items.length) {
      isInitializing.value = true
      visibleItems.value = [...props.items]
    }
    
    // Phase 2: After items are rendered and measured, calculate actual visibility
    captureItemWidths()
    calculateVisibleItems()
    
    // Set up ResizeObserver
    initResizeObserver()
    isInitializing.value = false
    
    // Add window resize handler
    window.addEventListener('resize', handleResize)
  }, 300) // Wait for animations/rendering
})

// Clean up on unmount
onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', handleResize)
  
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
})

// Initialize ResizeObserver
function initResizeObserver() {
  if (!containerRef.value) return
  
  resizeObserver = new ResizeObserver(entries => {
    // Skip if we're in a special state
    if (entries.length === 0 || isInitializing.value || isCalculating.value || isToggling.value) return
    
    // Only recalculate on container width changes
    const entry = entries[0]
    if (entry?.contentRect) {
      handleResize()
    }
  })
  
  resizeObserver.observe(containerRef.value)
}

// Handle window resize or container size changes
function handleResize() {
  // Skip during toggle operations
  if (isToggling.value) return
  
  // Debounce resize calculations
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  
  resizeTimer = window.setTimeout(() => {
    if (!isCalculating.value && !isToggling.value) {
      calculateVisibleItems()
    }
  }, 150)
}

// Expose key methods and properties for parent component
defineExpose({
  isExpanded,
  hasOverflow,
  toggleExpanded
})
</script>

<template>
  <div
    ref="containerRef"
    role="region"
    aria-live="polite"
    class="relative"
  >
    <!-- Main content area -->
    <slot
      :visible-items="visibleItems"
      :hidden-items="hiddenItems"
      :is-expanded="isExpanded"
      :has-overflow="hasOverflow"
      :set-item-ref="setItemRef"
      :should-render-item="shouldRenderItem"
    />
    
    <!-- Toggle button with customization options -->
    <slot
      v-if="isDesktopMode"
      name="toggle-button"
      :toggle="toggleExpanded"
      :is-expanded="isExpanded"
      :has-overflow="hasOverflow"
    >
      <button
        v-if="hasOverflow || (isExpanded && !hasOverflow)"
        ref="toggleButtonRef"
        :aria-expanded="isExpanded"
        aria-controls="collapsible-content"
        :class="[
          'toggle-button',
          isExpanded ? 'relative' : 'absolute right-0'
        ]"
        @click="toggleExpanded"
      >
        {{ isExpanded ? showLessText : showMoreText }}
        <slot name="toggle-icon" :is-expanded="isExpanded" />
      </button>
    </slot>
  </div>
</template>