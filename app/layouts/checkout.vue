<template>
    <div class="checkout-layout">
        <!-- Skip Link -->
        <LayoutSkipLinks />

        <!-- Top Bar -->
        <LayoutTopBar />

        <main class="grid grid-cols-1 lg:grid-cols-12 lg:min-h-screen">
            <div class="sidebar lg:col-span-5 order-1 lg:order-2 p-4 lg:px-16 lg:py-10">
                <div class="flex flex-col lg:gap-4 w-full lg:max-w-md">
                    <FoundationLink to="/" class="btn btn-ghost normal-case text-xl p-0">
                        <FoundationIcon name="logo" class="w-36" />
                    </FoundationLink>

                    <!-- Checkbox for collapse (hidden visually, works with label) -->
                    <FoundationCheckbox
                        id="checkout-summary-toggle"
                        class="peer opacity-0 lg:hidden -mb-8 mt-4"
                        checked
                    />

                    <!-- Label acts as toggle button (mobile only) -->
                    <FoundationLabel
                        for="checkout-summary-toggle"
                        class="cursor-pointer p-4 font-medium lg:hidden flex justify-between items-center peer-checked:hidden"
                    >
                        <span class="block peer-checked:hidden">{{ $t('checkout.summary.toggleLabel.show') }}</span>
                        <FoundationIcon name="chevron-down" class="block peer-checked:hidden" />
                    </FoundationLabel>

                    <FoundationLabel
                        for="checkout-summary-toggle"
                        class="cursor-pointer p-4 font-medium peer-checked:lg:hidden justify-between items-center hidden peer-checked:flex"
                    >
                        <span>{{ $t('checkout.summary.toggleLabel.hide') }}</span>
                        <FoundationIcon name="chevron-up" />
                    </FoundationLabel>

                    <!-- Content: hidden by default, shown when checked, always shown on desktop -->
                    <div class="max-h-0 opacity-0 overflow-hidden peer-checked:max-h-[2000px] peer-checked:opacity-100 lg:max-h-none lg:opacity-100 transition-[max-height,opacity] duration-300 ease-in-out">
                        <CheckoutSummary hide-order-button />
                    </div>
                </div>
            </div>
            <div class="content lg:col-span-7 order-2 lg:order-1 container mx-auto p-4 lg:px-16 lg:py-10 bg-gray-200">
                <div class="w-full lg:max-w-xl lg:ml-auto">
                    <slot />
                </div>
            </div>
        </main>
        <div class="w-full grid grid-cols-1 lg:sticky lg:left-0 lg:bottom-0 lg:grid-cols-12">
            <div class="p-4 lg:col-span-7 lg:py-4 lg:px-16 lg:border-t lg:border-r lg:border-border rounded-tr-lg lg:bg-gray-200">
                <div class="lg:max-w-xl lg:ml-auto">
                    <div id="CheckoutNavigation" />
                </div>
            </div>
        </div>

        <!-- FooterLight -->
        <LayoutFooterLight :depth="1" class="w-full grid" />

        <!-- Global Notifications -->
        <NotificationContainer />
    </div>
</template>