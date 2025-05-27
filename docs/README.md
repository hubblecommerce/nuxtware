# Nuxtware Documentation

Welcome to the Nuxtware documentation. This collection of documents serves as a reference for working with the Nuxtware project.

## Contents

- [Project Overview](./project-overview.md) - High-level overview of the project
- [Coding Standards](./coding-standards.md) - Code formatting and style guidelines
- [Atomic Design](./atomic-design.md) - Component organization using atomic design principles
- [Skeleton Component](./component-skeleton.md) - Implementation and usage of skeleton loading components
- [I18n Guide](./i18n-guide.md) - Internationalization implementation and best practices
- [Common Workflows](./common-workflows.md) - Step-by-step guides for common tasks
- [API Client](./api-client.md) - Shopware API integration details
- [E-Commerce Components](./e-commerce-components.md) - Guidelines for implementing e-commerce features
- [Notification System](./notification-system.md) - Documentation for the global notification system
- [Collaboration Guidelines](./collaboration-guidelines.md) - How to work effectively with AI assistants

## How to Use These Documents

At the beginning of a new conversation with Claude, you can instruct it to:

1. Read these documentation files
2. Apply the standards and conventions described
3. Follow the workflows for specific types of tasks
4. Respect the collaboration guidelines

### Recommended Prompt Template

Use this improved prompt template when starting new conversations:

```
Please read the nuxtware/docs directory, especially the nuxtware/docs/README.md and it's linked contents, before proceeding. After that we will work on a new feature, improvement or bug fix. 
If you are sure about everything to move on, you don't need to summarize you understanding.
```

This prompt template ensures proper collaboration by enforcing a conceptualization phase before any implementation work begins.

## Updating Documentation

As the project evolves, these documents should be updated to reflect new patterns, standards, or workflows. Keep the documentation current to ensure it remains a useful reference.

Example instruction for updating documentation:

```
I've made some changes to the project since we last spoke. Please review the current state of the codebase and update the documentation in the /docs directory to reflect these changes. Specifically, we've [brief description of changes, e.g., 'added new components for user profiles' or 'implemented a new authorization system']. Make sure the documentation accurately reflects our current standards, workflows, and project structure.
```

For specific file updates:

```
Please update the i18n-guide.md in the /docs directory to include information about our new approach to handling pluralization in translations, and add a section about translation management tools we've started using.
```
