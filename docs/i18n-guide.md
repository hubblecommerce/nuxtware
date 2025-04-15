# Internationalization Guide

This document explains how internationalization (i18n) is implemented and maintained in the Nuxtware project.

## Structure

- Translations are stored in the `i18n/` directory
- Each language has its own subdirectory (`en-GB`, `de-DE`)
- Translations are organized by feature in separate JSON files
- All translations are imported via the `index.ts` file in each language directory

## Adding New Translations

1. Identify all translatable text in components
2. Choose the appropriate JSON file based on feature/component
3. Add translation keys with proper nesting structure
4. Add the translation to all language files
5. Replace hardcoded text with `$t('key.path')` in components

## Translation Key Guidelines

- Use hierarchical organization (e.g., `component.subcomponent.action`)
- Keep keys descriptive and specific
- Group related translations together
- Follow existing patterns where possible

## Common Translation Categories

- **UI Elements**: Labels, buttons, headings
- **Form Fields**: Labels, placeholders, validation messages
- **Error Messages**: User-facing error messages
- **Accessibility**: Screen reader text, ARIA labels

## Best Practices

- Never use hardcoded text in templates - always use `$t()`
- Always provide translations for all supported languages
- For dynamic content, use translation parameters: `$t('greeting', { name: userName })`
- Screen reader text (e.g., `<span class="sr-only">`) should also be translated
- Remember to translate ARIA attributes (`aria-label`, etc.)

## Adding a New Language

1. Create a new directory for the language code (e.g., `fr-FR`)
2. Copy all JSON files from an existing language
3. Create/update an `index.ts` file to import all translations
4. Update the `nuxt.config.ts` file to include the new locale
