# Collaboration Guidelines

This document outlines the required collaboration methods when working with AI assistants on this project. These guidelines are designed to ensure consistent, careful, and methodical development processes when collaborating with AI tools.

## Communication Style

### Conceptualization Phase
- When phrases like "let's think about," "let's conceptualize," or similar brainstorming language is used, **do not** start editing files immediately.
- Instead, share your thoughts and proposed approach first.
- Ask explicitly for permission before making any actual changes to files.
- Wait for explicit confirmation before proceeding with file modifications.
- Use clear language distinguishing conceptualization from implementation: "Let's think about...", "Let's discuss...", or "Let's consider..." indicates you are in conceptualization phase.

### Decision Making Process
- Present options when multiple approaches are possible
- Provide pros and cons for different solutions
- Respect the final decision made by the human collaborator

## File Modifications

- Always seek explicit permission before:
  - Creating new files
  - Modifying existing files
  - Deleting or renaming files
  - Making structural changes to the project

- When granted permission to modify files:
  - Make changes as discussed
  - Summarize the changes made
  - Explain any additional considerations or follow-up actions needed

## Code Explanations

- Provide explanations for complex code changes when requested
- Focus on the "why" behind architectural decisions
- Highlight any potential impacts on other parts of the codebase

## Documentation Updates

- Keep documentation in sync with code changes
- Suggest documentation updates when implementing new features
- Follow the established documentation style and format
- Only create component documentation for complex components whose code is not self-explanatory
- Place component documentation in the `/docs` directory, not alongside the component
- Use prop comments in the TypeScript interface to document component props

## Git Operations

- **Never** perform Git operations (commit, push, pull, merge, etc.) without explicit permission
- **Only commit changes when explicitly instructed to do so** with a clear command like "commit these changes"
- Do not make assumptions about when to commit - always wait for a direct instruction
- Always present planned Git actions before suggesting any Git commands
- When suggesting Git operations:
  - Outline the specific files to be committed
  - Provide suggested commit messages
  - Explain the rationale for the commit structure
  - Wait for explicit approval before providing actual Git commands
- Do not execute any Git commands that would push changes to remote repositories

## Recommended AI Collaboration Prompt

To ensure these guidelines are followed properly, use the following prompt template when starting a new conversation with an AI assistant:

```
Please read the nuxtware/docs directory, especially collaboration-guidelines.md, before proceeding.

For [specific task], please:
1. Present 2-3 conceptual approaches with pros/cons
2. Do NOT modify any files until explicitly authorized
3. Start with your understanding of the task and project structure

I'll review your options and explicitly authorize implementation when ready.
```

## Common Collaboration Errors to Avoid

- **Immediate Implementation**: Starting to write code or modify files without going through a conceptualization phase.
- **Unauthorized File Creation**: Creating new files without explicit permission.
- **Assumption of Approach**: Deciding on an implementation approach without presenting options.
- **Skipping Structural Discussions**: Not discussing the architectural implications of changes.
- **Proceeding Without Clear Permission**: Making any file modifications without hearing "Yes, please implement that approach" or similar explicit approval.
