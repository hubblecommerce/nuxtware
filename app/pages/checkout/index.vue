<script setup lang='ts'>
import type { RequestParameters } from '#shopware'
import { ApiClientError, type ApiError } from '@shopware/api-client'
import { getShippingMethodDeliveryTime, getTranslatedProperty } from '@shopware-pwa/helpers-next'

const { push } = useRouter()
const { getCountries, getStatesForCountry } = useCountries()
const { getSalutations } = useSalutations()
const {
    paymentMethods,
    shippingMethods,
    getPaymentMethods,
    getShippingMethods,
    createOrder,
} = useCheckout()
const { register, logout, isLoggedIn, isGuestSession, user } = useUser()
const {
    refreshSessionContext,
    selectedShippingMethod: shippingMethod,
    selectedPaymentMethod: paymentMethod,
    setShippingMethod,
    setPaymentMethod,
    activeShippingAddress,
    setActiveShippingAddress,
    activeBillingAddress,
    setActiveBillingAddress,
} = useSessionContext()
const {
    cart,
    cartItems,
    subtotal,
    totalPrice,
    shippingTotal,
    isVirtualCart,
    refreshCart,
} = useCart()
const { customerAddresses, loadCustomerAddresses } = useAddress()
const { getFormattedPrice } = usePrice()

const registerErrors = ref<ApiError[]>([])
const isLoading = reactive<{ [key: string]: boolean }>({})
const state = reactive<RequestParameters<'register'>>({
    salutationId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    guest: false,
    billingAddress: {
        street: '',
        zipcode: '',
        city: '',
        countryId: '',
        countryStateId: '',
    },
    acceptedDataProtection: true,
    storefrontUrl: '',
})

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value)
const selectedShippingMethod = computed({
    get(): string {
        return shippingMethod.value?.id || "";
    },
    async set(shippingMethodId: string) {
        isLoading[shippingMethodId] = true;
        await setShippingMethod({ id: shippingMethodId });
        isLoading[shippingMethodId] = false;
    },
})
const selectedPaymentMethod = computed({
    get(): string {
        return paymentMethod.value?.id || "";
    },
    async set(paymentMethodId: string) {
        isLoading[paymentMethodId] = true;
        await setPaymentMethod({ id: paymentMethodId });
        isLoading[paymentMethodId] = false;
    },
})

onMounted(async () => {
    await refreshSessionContext()

    isLoading['shippingMethods'] = true
    isLoading['paymentMethods'] = true

    Promise.any([
        loadCustomerAddresses(),
        !isVirtualCart.value ? getShippingMethods() : null,
        getPaymentMethods(),
    ]).finally(() => {
        isLoading['shippingMethods'] = false
        isLoading['paymentMethods'] = false
    })
})

async function onRegisterSubmit () {
    registerErrors.value = []
    try {
        const response = await register(state)
        if (!response.active) {
            // TODO: update data (session / customer / payment / shipping) instead of page reload
            await push('/')
        }
    } catch (error) {
        if (error instanceof ApiClientError) {
            registerErrors.value = error.details.errors
        }
    }
}

async function onLogout () {
    await logout()
    await push('/')
}

async function onPlaceOrder () {
    isLoading['placeOrder'] = true
    const order = await createOrder()
    isLoading['placeOrder'] = false
    await push('/checkout/success/' + order.id)
    await refreshCart()
}
</script>

<template>
    <client-only>
    <div>
        <div class="grid gap-4 px-4 py-5 sm:p-6 mb-8">
            <div>
                <h3 class="text-lg font-medium text-secondary-900 m-0">
                    {{ $t("checkout.personalInformationLabel") }}
                </h3>
                <div class="text-sm text-secondary-600">
                    {{ $t("checkout.personalInformationInfo") }}
                </div>
            </div>
            <form
                v-if="!isUserSession"
                id="checkout-billing-address"
                class="grid gap-8"
                name="checkout-billing-address"
                method="post"
                @submit.prevent="onRegisterSubmit"
            >
                <div
                    v-if="registerErrors.length"
                    class="bg-red-200 border-l-4 border-red-500 text-red-700 p-4"
                    role="alert"
                >
                    <p class="font-bold">Error!!!</p>
                    <ul>
                        <li v-for="error in registerErrors" :key="error.detail">
                            {{ error.detail }}
                        </li>
                    </ul>
                </div>
                <div class="grid grid-cols-6 gap-6">
                    <div class="col-span-6">
                        <label
                            for="salutation"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.salutation") }}</label
                        >
                        <select
                            id="salutation"
                            v-model="state.salutationId"
                            required
                            name="salutation"
                            autocomplete="on"
                        >
                            <option disabled selected value="">
                                {{ $t("form.chooseSalutation") }}
                            </option>
                            <option
                                v-for="salutation in getSalutations"
                                :key="salutation.id"
                                :value="salutation.id"
                            >
                                {{ salutation.displayName }}
                            </option>
                        </select>
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                        <label
                            for="first-name"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.firstName") }}</label
                        >
                        <input
                            id="first-name"
                            v-model="state.firstName"
                            type="text"
                            required
                            name="first-name"
                            :placeholder="$t('form.firstNamePlaceholder')"
                        >
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                        <label
                            for="last-name"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.lastName") }}</label
                        >
                        <input
                            id="last-name"
                            v-model="state.lastName"
                            type="text"
                            required
                            name="last-name"
                            :placeholder="$t('form.lastNamePlaceholder')"
                        >
                    </div>

                    <div class="col-span-6">
                        <div class="flex items-center">
                            <input
                                id="create-account"
                                v-model="state.guest"
                                type="checkbox"
                            >
                            <label
                                for="create-account"
                                class="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300"
                            >{{ $t("checkout.notCreateAccount") }}</label>
                        </div>
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                        <label
                            for="email-address"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.email") }}</label>
                        <input
                            id="email-address"
                            v-model="state.email"
                            type="email"
                            required
                            name="email-address"
                            :placeholder="$t('form.emailPlaceholder')"
                            autocomplete="off"
                        >
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                        <div v-if="!state.guest">
                            <label
                                for="password"
                                class="block text-sm font-medium text-secondary-700"
                            >{{ $t("form.password") }}</label>
                            <input
                                id="password"
                                v-model="state.password"
                                autocomplete="off"
                                type="password"
                                name="password"
                            >
                        </div>
                    </div>

                    <div class="col-span-6">
                        <label
                            for="street-address"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.streetAddress") }}</label>
                        <input
                            id="street-address"
                            v-model="state.billingAddress.street"
                            type="text"
                            required
                            name="street-address"
                            :placeholder="$t('form.streetPlaceholder')"
                            autocomplete="street-address"
                        >
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                        <label
                            for="postal-code"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.postalCode") }}</label>
                        <input
                            id="postal-code"
                            v-model="state.billingAddress.zipcode"
                            type="text"
                            required
                            name="postal-code"
                            :placeholder="$t('form.postalCodePlaceholder')"
                            autocomplete="postal-code"
                        >
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                        <label
                            for="city"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.city") }}</label>
                        <input
                            id="city"
                            v-model="state.billingAddress.city"
                            type="text"
                            required
                            name="city"
                            :placeholder="$t('form.cityPlaceholder')"
                            autocomplete="address-level2"
                        >
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                        <label
                            for="country"
                            class="block text-sm font-medium text-secondary-700"
                        >{{ $t("form.country") }}</label>
                        <select
                            id="country"
                            v-model="state.billingAddress.countryId"
                            required
                            name="country"
                            autocomplete="country-name"
                        >
                            <option disabled selected value="">
                                {{ $t("form.chooseCountry") }}
                            </option>
                            <option
                                v-for="country in getCountries"
                                :key="country.id"
                                :value="country.id"
                            >
                                {{ country.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <button type="submit">
                    {{ $t("form.save") }}
                </button>
            </form>
            <div v-else>
                {{ $t("checkout.loggedInAs") }} {{ user?.firstName }}
                <span v-if="isGuestSession">({{ $t("checkout.guest") }}) </span>
                -
                <a
                    href="#"
                    class="text-primary font-bold hover:text-dark"
                    data-testid="checkout-logout"
                    aria-label="click here to log out"
                    @click="onLogout"
                >{{ $t("checkout.logOut") }}</a>

                <div v-if="!isLoading['addresses']">
                    <div
                        v-for="address in customerAddresses"
                        :key="address.id"
                        class="flex mb-3"
                    >
                        <div>
                            <span class="block" >{{address.street}}</span>
                            <p><span>{{ address.zipcode }}</span>&nbsp;<span>{{ address.city }}</span></p>
                            <p v-if="address.country">
                                <span>{{ getTranslatedProperty(address.country, "name") }}</span>
                                <span v-if="address.countryState">, {{ getTranslatedProperty(address.countryState, "name") }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <fieldset v-if="!isVirtualCart" class="grid gap-4 px-4 py-5  sm:p-6 mb-8">
            <legend class="pt-5">
                <h3 class="text-lg font-medium text-secondary-900 m-0">
                    {{ $t("checkout.shippingMethodLabel") }}
                </h3>
                <div class="text-sm text-secondary-600">
                    {{ $t("checkout.selectPaymentMethod") }}
                </div>
            </legend>
            <div v-if="isLoading['shippingMethods']" class="w-60 h-24">
                <div
                    class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5"
                >
                    <div class="w-4 bg-secondary-300 h-4 mt-1 rounded-full" />
                    <div class="flex flex-col space-y-3">
                        <div class="w-36 bg-secondary-300 h-6 rounded-md" />
                        <div class="w-24 bg-secondary-300 h-6 rounded-md" />
                    </div>
                </div>
            </div>
            <div
                v-for="singleShippingMethod in shippingMethods"
                v-else
                :key="singleShippingMethod.id"
                class="flex items-center w-full"
            >
                <input
                    :id="singleShippingMethod.id"
                    v-model="selectedShippingMethod"
                    :value="singleShippingMethod.id"
                    name="shipping-method"
                    type="radio"
                >
                <label
                    :for="singleShippingMethod.id"
                    :class="{ 'animate-pulse': isLoading[singleShippingMethod.id] }"
                    class="ml-2 block text-sm font-medium text-secondary-700 w-full"
                >
                    <div class="flex justify-between">
                        <div>
                            {{ singleShippingMethod.translated?.name }}
                            <span v-if="getShippingMethodDeliveryTime(singleShippingMethod)"
                            >({{getShippingMethodDeliveryTime(singleShippingMethod) }})</span>
                            <span
                                v-if="singleShippingMethod.translated?.description"
                                class="text-sm text-secondary-500 block"
                            >{{ singleShippingMethod.translated.description }}</span>
                        </div>
                        <div v-if="singleShippingMethod.media?.url">
                            <img
                                loading="lazy"
                                :src="singleShippingMethod.media.url"
                                alt="payment-image"
                            >
                        </div>
                    </div>
                </label>
            </div>
        </fieldset>

        <fieldset class="grid gap-4 px-4 py-5 sm:p-6">
            <legend class="pt-5">
                <h3 class="text-lg font-medium text-secondary-900 m-0">
                    {{ $t("checkout.paymentMethodLabel") }}
                </h3>
                <div class="text-sm text-secondary-600">
                    {{ $t("checkout.selectPaymentMethod") }}
                </div>
            </legend>
            <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
                <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
                    <div class="w-4 bg-secondary-300 h-4 mt-1 rounded-full" />
                    <div class="flex flex-col space-y-3">
                        <div class="w-36 bg-secondary-300 h-6 rounded-md" />
                        <div class="w-24 bg-secondary-300 h-6 rounded-md" />
                    </div>
                </div>
            </div>
            <div
                v-for="singlePaymentMethod in paymentMethods"
                v-else
                :key="singlePaymentMethod.id"
                class="flex items-center"
            >
                <input
                    :id="singlePaymentMethod.id"
                    v-model="selectedPaymentMethod"
                    :value="singlePaymentMethod.id"
                    name="payment-method"
                    type="radio"
                >
                <label
                    :for="singlePaymentMethod.id"
                    :class="{ 'animate-pulse': isLoading[singlePaymentMethod.id] }"
                    class="ml-2 block text-sm font-medium text-secondary-700 w-full"
                >
                    <div class="flex justify-between">
                        <div>
                            <span>
                              {{ singlePaymentMethod.translated?.name }}
                            </span>
                            <span
                                v-if="singlePaymentMethod.translated?.description"
                                class="text-sm text-secondary-500 block"
                            >{{ singlePaymentMethod.translated.description }}</span>
                        </div>
                        <div v-if="singlePaymentMethod.media?.url">
                            <img
                                loading="lazy"
                                :src="singlePaymentMethod.media.url"
                                :alt="`Logo of ${singlePaymentMethod.shortName}`"
                            >
                        </div>
                    </div>
                </label>
            </div>
        </fieldset>

        <div class="mt-5 md:mt-0 md:col-span-1">
            <div class="grid gap-4 px-4 py-5  sm:p-6">
                <div>
                    <h3 class="text-lg font-medium text-secondary-900 m-0">
                        {{ $t("checkout.orderSummary") }}
                    </h3>
                    <p class="text-sm text-secondary-600">
                        {{ $t("checkout.orderSummaryLabel") }}
                    </p>
                </div>
                <ul role="list" class="-my-4 divide-y divide-secondary-200 pl-0">
                    <li
                        v-for="cartItem in cartItems"
                        :key="cartItem.id"
                        class="flex py-6 justify-between"
                    >
                        <div>{{ cartItem.label }}</div>
                        <div>{{ cartItem.quantity }} x {{ getFormattedPrice(cartItem?.price?.unitPrice) }}</div>
                    </li>
                </ul>

                <div class="flex justify-between text-sm text-secondary-500">
                    <p>{{ $t("checkout.subtotal") }}</p>
                    <div class="text-secondary-900 font-medium">{{ getFormattedPrice(subtotal) }}</div>
                </div>

                <div class="flex pb-4 border-b justify-between text-sm text-secondary-500">
                    <p>{{ $t("checkout.shippingEstimate") }}</p>
                    <div class="text-secondary-900 font-medium">{{ getFormattedPrice(shippingTotal) }}</div>
                </div>

                <div class="flex justify-between text-secondary-900 font-medium">
                    <p>{{ $t("checkout.orderTotal") }}</p>
                    <div class="text-secondary-900 font-medium">{{ getFormattedPrice(totalPrice) }}</div>
                </div>

                <div class="mt-4">
                    <div class="text-right">
                        <span v-if="!isUserSession" class="text-sm text-secondary-600">{{ $t("checkout.loginRequired") }}</span>
                        <button
                            :disabled="!isUserSession"
                            type="button"
                            :class="{
                                grayscale: !isUserSession,
                                'opacity-50 cursor-not-allowed hover:bg-primary':
                                !isUserSession,
                                'animate-pulse': isLoading['placeOrder'],
                            }"
                            @click="onPlaceOrder"
                        >
                            {{ $t("checkout.placeOrder") }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </client-only>
</template>
