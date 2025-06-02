# Layout Top Bar Component

## Component Overview

The `LayoutTopBar.vue` component serves as a responsive top navigation bar that displays USP (Unique Selling Proposition) messages to users based on their geographic location. This component integrates with `ComponentBanderole.vue` to create an animated display of selling points that enhances the user experience.

## Key Components

### LayoutTopBar

The top bar serves as a container that:
- Creates a full-width banner with semantic HTML structure
- Includes proper accessibility attributes (`role="region"` and `aria-labelledby`)
- Dynamically selects USP messages based on the user's country

## Country-Based USP Management

### Data Structure

The system uses a sophisticated approach to manage location-specific messaging:
```
typescript interface UspRecord { [countryId: string]: string[] fallback: string[] }
``` 

This structure allows:
- Country-specific messages indexed by country ID
- A fallback set of messages for users from countries without specific content

### Dynamic Content Selection

The component intelligently selects content by:
1. Accessing the user's country via `salesChannelCountryId` from the session context
2. Looking up country-specific USPs if available
3. Defaulting to fallback messages when country-specific content isn't available

### Example Implementation

If a sales channel country should display individual UPSs implement them as text snippets in the corresponding i18n JSON for every language. In LayoutTopBar.vue Use the country code as indicator in the snippet key. Add the sales channel ID and use this variable as a key for the array of sales channel related USP snippets.
```
const SWISS_COUNTRY_ID = '123456789'
const uspsByShippingCountry = ref<UspRecord>({
    [SWISS_COUNTRY_ID]: [
        'topBar.benefit1Ch',
        'topBar.benefit2Ch',
        'topBar.benefit3Ch',
    ],
    'fallback': [
        'topBar.benefit1',
        'topBar.benefit2',
        'topBar.benefit3',
    ]
})
```

## Client-Side Rendering

The component uses `<client-only>` to ensure the correct USPs are displayed after the user's country is determined during client-side execution.

## Internationalization

The component leverages translation keys (like 'topBar.benefit1') rather than hardcoded text, ensuring proper multilingual support through the i18n system.
