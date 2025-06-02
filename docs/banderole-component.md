# Banderole Component

## Overview

The `ComponentBanderole` component incorporates icons to enhance visual communication alongside text content. Icons serve as visual cues that complement the textual USPs (Unique Selling Propositions), making the information more scannable and engaging for users.

### ComponentBanderole

The banderole component is a generic component that:
- Accepts an array of text items to display
- Supports text animations
- Can display icons alongside text

## Implementation Details

### Icon Property

The `ComponentBanderole` component accepts an `icons` property, which allows for flexible icon integration:

- The property accepts an array of icon names (e.g., `['check']`)
- This allows different icons to be used for different types of messages
- Icons are mapped to component library's icon system or framework
- If different Icons per Text should be displayed the amount of icons must match the amount of texts

### Example from LayoutTopBar

In the `LayoutTopBar` implementation, the check icon is used consistently across all USP messages:

```
typescript <ComponentBanderole animation="blink" :items="uspsByShippingCountry[salesChannelCountryId]" :icons="['check']" />
```

This implementation passes a single icon ('check') that will be applied to all items in the banderole.

### Animations

Blinking animation: all items blink at the same time. Mobile only one item is shown and blinking to prevent an overflow in the container.
Flow animation: items appear to be scrolled from right to left.
Default: using no prop on the component will default to a non-animated banderole. Mobile the items are shown individually (same as the blinking animation), but they do not blink.