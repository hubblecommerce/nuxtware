# Nuxtware Roadmap

This document tracks the development progress and planned features for Nuxtware.

## Completed Features

### Product Features
- [x] **Listing**
    - [x] Pagination
    - [x] Limiter
    - [x] Sorter
    - [x] Filter
    - [x] Category Sidebar Navigation
    - [x] Card

- [x] **Product Detail**
    - [x] Gallery
    - [x] Buybox (Prices, Availability, Delivery Time, Reviews Link, Qty Selector, Add-To-Cart Button, Wishlist-Toggle, Sku)
    - [x] Variant Selection
    - [x] Tabs: Description / Reviews
        - [x] Description
        - [x] Reviews
    - [x] X-Selling (Product Carousel)

### Cart & Checkout
- [x] Cart
- [x] Checkout
    - [x] Index
    - [x] Success
    - [x] Error

### Customer Account
- [x] Account
    - [x] Login
    - [x] Register
    - [x] Password forgot
    - [x] Overview
    - [x] Orders
    - [x] Profile
    - [x] Addresses

### Wishlist
- [x] Wishlist functionality

### CMS
- [x] **Blocks (Community Edition)**
    - [x] Text Variations
    - [x] Image Variations
    - [x] Video Variations
    - [x] Text & Image Variations

- [x] **Elements (Community Edition)**
    - [x] Image
    - [x] Text
    - [x] Video
    - [x] Formular
    - [x] HTML

### UI Components
- [x] Skiplinks
- [x] Scroll To Top
- [x] Newsletter Form
    - [x] Newsletter double opt in return page (newsletter-subscribe)
- [x] Popups (Modals)
- [x] Footer
- [x] Topbar / Banderole
- [x] Language Switch
- [x] Currency Switch

### Technical Improvements
- [x] Refactor `<img>` to use nuxt-image component instead
- [x] Properly implement StructureElementImageGallery with Thumbnail Gallery and Full-Screen Gallery on click

## Planned Features

### CMS Enhancements
- [ ] **Blocks and elements from "licensed edition"**
    - [ ] Elements
        - [ ] 3D

### Additional Pages
- [ ] Brands Page
- [ ] Error pages
    - [ ] Maintenance Mode
    - [ ] 404 Page
- [ ] Customer group registration page (FrontendAccountCustomerGroupRegistrationPage.vue)

### Media & Privacy
- [ ] Add Consent Modal to Video CMS Element
- [ ] Add Cookie Consent

### Technical Enhancements
- [ ] Sync basic state like session/cart data between tabs
- [ ] CMS Meta Data (useCmsHead)
- [ ] Structured Data: Product JSONLD
- [ ] Lazy Loading of Structure Blocks
- [ ] Loading page indicator bar

### Server Features
- [ ] Server routes
    - [ ] Imitate customer
    - [ ] Sitemap

## API Constraints & Known Differences

These are known differences between the Shopware Store API and the Storefront API that affect implementation:

- **From Price Rendering**: Rendering correct "from price" in listing requires custom handling. See `composables/useProductPriceCustom.ts` for detailed info and solutions.
- **Review Check**: Store API lacks endpoint to check if current customer has already reviewed a specific product (requires client-side tracking via localStorage)
- **Review Updates**: Store API does not provide PATCH endpoint for updating existing reviews (edit functionality not available)

## Contributing to the Roadmap

If you have suggestions for features or improvements, please open an issue or discussion on the project repository.
