<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: boolean;
    disabled?: boolean;
    label: string;
    labelPosition?: 'left' | 'right' | 'hidden';
    size?: 'toggle-sm' | 'toggle-md' | 'toggle-lg';
    id?: string;
    name?: string;
    theme?: 'toggle-default' | 'toggle-primary' | 'toggle-secondary' | 'toggle-tertiary' | 'toggle-error' | 'toggle-success' | 'toggle-warning' | 'toggle-info';
}>(), {
    labelPosition: 'left',
    size: 'toggle-md',
    id: '',
    name: '',
    theme: 'toggle-default',
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'change': [value: boolean];
}>();

const toggle = () => {
    if (!props.disabled) {
        const newValue = !props.modelValue;
        emit('update:modelValue', newValue);
        emit('change', newValue);
    }
};

const handleKeyDown = (event: KeyboardEvent) => {
    if (props.disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        toggle();
    }
};

const uniqueId = props.id || useId();

const sizeClass = computed(() => `${props.size || 'toggle-md'}`);
const themeClass = computed(() => `${props.theme || 'toggle-primary'}`);
</script>

<template>
    <div 
        class="flex items-center gap-2" 
        :class="{
            'cursor-not-allowed opacity-60': disabled,
            'flex-row-reverse justify-end': labelPosition === 'right',
        }"
    >
        <FoundationLabel 
            :id="`${uniqueId}-label`"
            :for="uniqueId" 
            :class="{
                'sr-only': labelPosition === 'hidden',
                'text-sm': size === 'toggle-sm',
                'text-base': size === 'toggle-md' || !size,
                'text-lg': size === 'toggle-lg',
                'cursor-not-allowed': disabled,
            }"
        >
            {{ label }}
        </FoundationLabel>

        <button
            :id="uniqueId"
            type="button"
            role="switch"
            :aria-checked="modelValue"
            :aria-labelledby="`${uniqueId}-label`"
            :disabled="disabled"
            :class="[
                'toggle-button',
                sizeClass,
                themeClass,
                'outline-none',
                {'focus-style': !disabled}
            ]"
            @click="toggle"
            @keydown="handleKeyDown"
        >
            <span 
                :class="[
                    'toggle', 
                    sizeClass, 
                    themeClass,
                    'inline-block relative'
                ]"
            >
                <span class="toggle-track" />
                <span 
                    class="toggle-dot" 
                    :class="{'toggle-dot-checked': modelValue}"
                />
                <span class="sr-only">{{ modelValue ? 'On' : 'Off' }}</span>
            </span>
        </button>
    </div>
</template>