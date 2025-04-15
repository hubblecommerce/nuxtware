# Coding Standards

This document outlines the coding standards and style guidelines for the Nuxtware project.

## Formatting

- **Indentation**: Use 4 spaces for indentation (not tabs)
- **Quotes**: Prefer single quotes for JavaScript/TypeScript strings
- **Semicolons**: Don't use semicolons at the end of statements
- **Line Length**: Aim to keep lines under 100 characters

## Vue Components

- Use `<script setup lang="ts">` syntax for Vue components
- Component names should use PascalCase
- Props should be properly typed with TypeScript interfaces
- Use composition API instead of options API

## TypeScript

- Use explicit type annotations where possible
- Use interfaces for object shapes
- Prefix interface names with appropriate context (e.g., `WidgetSearchInputProps`)
- Use semicolons within type definitions 

## JSON Files

- JSON files should be properly formatted with 4-space indentation
- Each key should appear only once at each level
- Nested properties should maintain consistent indentation

## CSS/Tailwind

- Use utility classes where appropriate
- Custom CSS should follow BEM naming convention when needed

## I18n Translations

- Keys should be organized hierarchically by feature/component
- Keys should be descriptive of their purpose
- Translation files should mirror each other in structure between languages
- Always use `$t()` for translatable text, avoid hardcoded strings
