<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('description')

const productTabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'shipping', label: 'Shipping & Returns' },
    { id: 'warranty', label: 'Warranty' }
]

const accountTabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'settings', label: 'Settings', disabled: true }
]
</script>

<template>
    <div class="container mx-auto p-8 space-y-12">
        <div>
            <FoundationHeadline tag="h1" class="mb-8">ComponentTabs Demo</FoundationHeadline>
            
            <!-- Basic Tabs -->
            <section class="mb-12">
                <FoundationHeadline tag="h2" class="mb-4">Basic Tabs</FoundationHeadline>
                <ComponentTabs v-model="activeTab" :tabs="productTabs">
                    <template #description>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Product Description</FoundationHeadline>
                            <p class="text-black leading-relaxed">
                                This is a comprehensive product description that provides detailed information about the features, 
                                benefits, and specifications of the product. The description helps customers understand what they 
                                are purchasing and make informed decisions.
                            </p>
                        </div>
                    </template>
                    
                    <template #specifications>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Technical Specifications</FoundationHeadline>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Dimensions:</strong> 10" x 8" x 2"
                                </div>
                                <div>
                                    <strong>Weight:</strong> 2.5 lbs
                                </div>
                                <div>
                                    <strong>Material:</strong> Premium aluminum
                                </div>
                                <div>
                                    <strong>Color:</strong> Space gray
                                </div>
                            </div>
                        </div>
                    </template>
                    
                    <template #reviews>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Customer Reviews</FoundationHeadline>
                            <div class="space-y-4">
                                <div class="border-l-4 border-primary pl-4">
                                    <p class="font-semibold">⭐⭐⭐⭐⭐ Amazing product!</p>
                                    <p class="text-muted">Really exceeded my expectations. Highly recommended!</p>
                                </div>
                                <div class="border-l-4 border-primary pl-4">
                                    <p class="font-semibold">⭐⭐⭐⭐ Great quality</p>
                                    <p class="text-muted">Good build quality and fast shipping.</p>
                                </div>
                            </div>
                        </div>
                    </template>
                    
                    <template #shipping>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Shipping & Returns</FoundationHeadline>
                            <div class="space-y-4">
                                <div>
                                    <strong>Free Shipping:</strong> On orders over $50
                                </div>
                                <div>
                                    <strong>Delivery Time:</strong> 3-5 business days
                                </div>
                                <div>
                                    <strong>Return Policy:</strong> 30-day hassle-free returns
                                </div>
                            </div>
                        </div>
                    </template>
                    
                    <template #warranty>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Warranty Information</FoundationHeadline>
                            <p class="text-black leading-relaxed">
                                This product comes with a comprehensive 2-year manufacturer warranty covering 
                                all defects in materials and workmanship under normal use conditions.
                            </p>
                        </div>
                    </template>
                </ComponentTabs>
            </section>

            <!-- Tabs with Custom Headers -->
            <section class="mb-12">
                <FoundationHeadline tag="h2" class="mb-4">Tabs with Custom Headers</FoundationHeadline>
                <ComponentTabs :tabs="accountTabs" color="secondary" size="lg">
                    <template #tab-profile>
                        <FoundationIcon name="user" class="w-4 h-4 mr-2" aria-hidden="true" />
                        Profile
                    </template>
                    
                    <template #tab-orders>
                        <FoundationIcon name="layers" class="w-4 h-4 mr-2" aria-hidden="true" />
                        Orders
                        <span class="ml-2 bg-primary text-white rounded-full px-2 py-1 text-xs">3</span>
                    </template>
                    
                    <template #tab-wishlist>
                        <FoundationIcon name="heart" class="w-4 h-4 mr-2" aria-hidden="true" />
                        Wishlist
                        <span class="ml-2 bg-secondary text-white rounded-full px-2 py-1 text-xs">12</span>
                    </template>

                    <template #profile>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">User Profile</FoundationHeadline>
                            <p>Manage your personal information and preferences.</p>
                        </div>
                    </template>
                    
                    <template #orders>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Order History</FoundationHeadline>
                            <p>View your past orders and track current shipments.</p>
                        </div>
                    </template>
                    
                    <template #wishlist>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Your Wishlist</FoundationHeadline>
                            <p>Items you've saved for later purchase.</p>
                        </div>
                    </template>
                </ComponentTabs>
            </section>

            <!-- Color Variants -->
            <section class="mb-12">
                <FoundationHeadline tag="h2" class="mb-4">Color Variants</FoundationHeadline>
                
                <div class="space-y-8">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Primary (Default)</h3>
                        <ComponentTabs 
                            :tabs="[
                                { id: 'tab1', label: 'Tab 1' },
                                { id: 'tab2', label: 'Tab 2' },
                                { id: 'tab3', label: 'Tab 3' }
                            ]"
                            color="primary"
                        >
                            <template #tab1><div class="p-4">Primary color content 1</div></template>
                            <template #tab2><div class="p-4">Primary color content 2</div></template>
                            <template #tab3><div class="p-4">Primary color content 3</div></template>
                        </ComponentTabs>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold mb-2">Secondary</h3>
                        <ComponentTabs 
                            :tabs="[
                                { id: 'tab1', label: 'Tab 1' },
                                { id: 'tab2', label: 'Tab 2' },
                                { id: 'tab3', label: 'Tab 3' }
                            ]"
                            color="secondary"
                        >
                            <template #tab1><div class="p-4">Secondary color content 1</div></template>
                            <template #tab2><div class="p-4">Secondary color content 2</div></template>
                            <template #tab3><div class="p-4">Secondary color content 3</div></template>
                        </ComponentTabs>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold mb-2">Tertiary</h3>
                        <ComponentTabs 
                            :tabs="[
                                { id: 'tab1', label: 'Tab 1' },
                                { id: 'tab2', label: 'Tab 2' },
                                { id: 'tab3', label: 'Tab 3' }
                            ]"
                            color="tertiary"
                        >
                            <template #tab1><div class="p-4">Tertiary color content 1</div></template>
                            <template #tab2><div class="p-4">Tertiary color content 2</div></template>
                            <template #tab3><div class="p-4">Tertiary color content 3</div></template>
                        </ComponentTabs>
                    </div>
                </div>
            </section>

            <!-- Size Variants -->
            <section class="mb-12">
                <FoundationHeadline tag="h2" class="mb-4">Size Variants</FoundationHeadline>
                
                <div class="space-y-8">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Small</h3>
                        <ComponentTabs 
                            :tabs="[
                                { id: 'small1', label: 'Small Tab 1' },
                                { id: 'small2', label: 'Small Tab 2' }
                            ]"
                            size="sm"
                        >
                            <template #small1><div class="p-4">Small size content</div></template>
                            <template #small2><div class="p-4">Small size content 2</div></template>
                        </ComponentTabs>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold mb-2">Medium (Default)</h3>
                        <ComponentTabs 
                            :tabs="[
                                { id: 'medium1', label: 'Medium Tab 1' },
                                { id: 'medium2', label: 'Medium Tab 2' }
                            ]"
                            size="md"
                        >
                            <template #medium1><div class="p-4">Medium size content</div></template>
                            <template #medium2><div class="p-4">Medium size content 2</div></template>
                        </ComponentTabs>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold mb-2">Large</h3>
                        <ComponentTabs 
                            :tabs="[
                                { id: 'large1', label: 'Large Tab 1' },
                                { id: 'large2', label: 'Large Tab 2' }
                            ]"
                            size="lg"
                        >
                            <template #large1><div class="p-4">Large size content</div></template>
                            <template #large2><div class="p-4">Large size content 2</div></template>
                        </ComponentTabs>
                    </div>
                </div>
            </section>

            <!-- Scrollable Tabs -->
            <section class="mb-12">
                <FoundationHeadline tag="h2" class="mb-4">Scrollable Tabs (Many Tabs)</FoundationHeadline>
                <ComponentTabs 
                    :tabs="[
                        { id: 'tab1', label: 'Very Long Tab Name 1' },
                        { id: 'tab2', label: 'Very Long Tab Name 2' },
                        { id: 'tab3', label: 'Very Long Tab Name 3' },
                        { id: 'tab4', label: 'Very Long Tab Name 4' },
                        { id: 'tab5', label: 'Very Long Tab Name 5' },
                        { id: 'tab6', label: 'Very Long Tab Name 6' },
                        { id: 'tab7', label: 'Very Long Tab Name 7' },
                        { id: 'tab8', label: 'Very Long Tab Name 8' },
                        { id: 'tab9', label: 'Very Long Tab Name 9' },
                        { id: 'tab10', label: 'Very Long Tab Name 10' }
                    ]"
                    :scrollable="true"
                >
                    <template v-for="i in 10" :key="`tab${i}`" #[`tab${i}`]>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Content for Tab {{ i }}</FoundationHeadline>
                            <p>This is the content for tab {{ i }}. The tabs above should scroll horizontally if there's not enough space.</p>
                        </div>
                    </template>
                </ComponentTabs>
            </section>

            <!-- Hash Navigation Demo -->
            <section class="mb-12">
                <FoundationHeadline tag="h2" class="mb-4">Hash Navigation</FoundationHeadline>
                <p class="mb-4 text-neutral">
                    Try these direct links: 
                    <a href="#overview" class="text-primary hover:underline mr-4">#overview</a>
                    <a href="#features" class="text-primary hover:underline mr-4">#features</a>
                    <a href="#pricing" class="text-primary hover:underline">#pricing</a>
                </p>
                
                <ComponentTabs 
                    :tabs="[
                        { id: 'overview', label: 'Overview' },
                        { id: 'features', label: 'Features' },
                        { id: 'pricing', label: 'Pricing' }
                    ]"
                    :enable-hash-navigation="true"
                >
                    <template #overview>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Overview</FoundationHeadline>
                            <p>This tab demonstrates hash navigation. The URL changes when you switch tabs, and direct links work.</p>
                        </div>
                    </template>
                    
                    <template #features>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Features</FoundationHeadline>
                            <p>Key features of the ComponentTabs component are demonstrated here.</p>
                        </div>
                    </template>
                    
                    <template #pricing>
                        <div class="p-6">
                            <FoundationHeadline tag="h3" class="mb-4">Pricing</FoundationHeadline>
                            <p>Pricing information and plans would be displayed in this section.</p>
                        </div>
                    </template>
                </ComponentTabs>
            </section>
        </div>
    </div>
</template>