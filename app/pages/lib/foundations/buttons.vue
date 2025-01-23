<script setup lang="ts">
function handleClick () {
    console.log('click')
}
</script>

<template>
    <div>
        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="Primary Button Small"
                size="small"
                variant="primary"
                color="#000000"
                @click="handleClick"
            />
            <FoundationButton
                text="Primary Button Medium"
                size="medium"
                variant="primary"
                @click="handleClick"
            />
            <FoundationButton
                text="Primary Button Large"
                size="large"
                variant="primary"
                @click="handleClick"
            />
        </div>

        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="Secondary Button Small"
                size="small"
                variant="secondary"
                @click="handleClick"
            />
            <FoundationButton
                text="Secondary Button Medium"
                size="medium"
                variant="secondary"
                @click="handleClick"
            />
            <FoundationButton
                text="Secondary Button Large"
                size="large"
                variant="secondary"
                @click="handleClick"
            />
        </div>

        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="Tertiary Button Small"
                size="small"
                variant="tertiary"
                @click="handleClick"
            />
            <FoundationButton
                text="Tertiary Button Medium"
                size="medium"
                variant="tertiary"
                @click="handleClick"
            />
            <FoundationButton
                text="Tertiary Button Large"
                size="large"
                variant="tertiary"
                @click="handleClick"
            />
        </div>
    </div>
</template>
