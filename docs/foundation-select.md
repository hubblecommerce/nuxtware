# FoundationSelect Component

The `FoundationSelect` component provides a consistent, accessible, and styleable select input that integrates with the Nuxtware design system.

## Basic Usage

```vue
<FoundationSelect
  v-model="selectedValue"
  :options="options"
  placeholder="Select an option"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | Required | Array of options for the select |
| `placeholder` | `string` | `''` | Placeholder text shown when no option is selected |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `required` | `boolean` | `false` | Whether the select is required |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant of the select |
| `color` | `'' \| 'primary' \| 'secondary' \| 'tertiary'` | `''` | Color theme of the select |
| `error` | `boolean` | `false` | Whether to show error styling |
| `name` | `string` | `''` | Name attribute for form submission |

### SelectOption Type

```typescript
interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
```

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Custom icon to display before the select text |

## Events

| Event | Description |
|-------|-------------|
| `update:modelValue` | Emitted when the selected value changes |

## CSS Variables

The component uses the following design system variables:

- `--color-select`: Base color for themed selects
- `--color-select-content`: Text color for themed selects

## Examples

### Basic Select

```vue
<FoundationSelect
  v-model="selectedValue"
  :options="[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]"
  placeholder="Select an option"
/>
```

### With Error State

```vue
<FoundationSelect
  v-model="selectedValue"
  :options="options"
  error
  placeholder="Select an option"
/>
```

### With Icon

```vue
<FoundationSelect
  v-model="selectedValue"
  :options="options"
  placeholder="Select a user"
>
  <template #icon>
    <FoundationIcon name="user" class="w-4 h-4" />
  </template>
</FoundationSelect>
```

### Different Sizes

```vue
<FoundationSelect
  v-model="selectedValue"
  :options="options"
  size="small"
  placeholder="Small select"
/>

<FoundationSelect
  v-model="selectedValue"
  :options="options"
  size="medium"
  placeholder="Medium select"
/>

<FoundationSelect
  v-model="selectedValue"
  :options="options"
  size="large"
  placeholder="Large select"
/>
```

### Color Variants

```vue
<FoundationSelect
  v-model="selectedValue"
  :options="options"
  color="primary"
  placeholder="Primary color"
/>

<FoundationSelect
  v-model="selectedValue"
  :options="options"
  color="secondary"
  placeholder="Secondary color"
/>

<FoundationSelect
  v-model="selectedValue"
  :options="options"
  color="tertiary"
  placeholder="Tertiary color"
/>
```

## Accessibility

The FoundationSelect component follows accessibility best practices:

- Uses native `<select>` element for optimal screen reader compatibility
- Includes proper ARIA attributes for states (disabled, invalid)
- Provides adequate color contrast for all states
- Supports keyboard navigation

## Design System Integration

The component integrates with the Nuxtware design system through:

- Consistent sizing with other foundation components
- Color theming that matches buttons and inputs
- Standard focus states for improved usability
- Compatible with the project's typography scale

## Component Structure

The FoundationSelect consists of:
- Native HTML select element for core functionality
- Optional icon placement using a named slot
- Custom chevron indicator to match design system
- Wrapper element for proper positioning
