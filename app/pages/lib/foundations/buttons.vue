<script setup lang="ts">
function handleClick () {
    console.log('click')
}
</script>

<template>
    <div class="mx-auto w-full max-w-8xl">
        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="Button Default Primary Small"
                size="small"
                color="primary"
                :disabled="true"
                @click="handleClick"
            />
            <FoundationButton
                text="Button Default Primary Medium"
                size="medium"
                color="primary"
                loading
                @click="handleClick"
            />
            <FoundationButton
                text="Button Default Primary Large"
                size="large"
                color="primary"
                @click="handleClick"
            />
        </div>

        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="Button Outline Secondary Small"
                size="small"
                variant="outline"
                color="secondary"
                @click="handleClick"
            />
            <FoundationButton
                text="Button Outline Secondary Medium"
                size="medium"
                variant="outline"
                color="secondary"
                @click="handleClick"
            />
            <FoundationButton
                text="Button Outline Secondary Large"
                size="large"
                variant="outline"
                color="secondary"
                @click="handleClick"
            />
        </div>

        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="Button Ghost Tertiary Small"
                size="small"
                variant="ghost"
                color="tertiary"
                @click="handleClick"
            />
            <FoundationButton
                text="Button Ghost Tertiary Medium"
                size="medium"
                variant="ghost"
                color="tertiary"
                @click="handleClick"
            />
            <FoundationButton
                text="Button Ghost Tertiary Large"
                size="large"
                variant="ghost"
                color="tertiary"
                @click="handleClick"
            />
        </div>

        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="X"
                size="small"
                color="primary"
                circle
                @click="handleClick"
            />
            <FoundationButton
                text="X"
                variant="outline"
                color="primary"
                circle
                @click="handleClick"
            />
            <FoundationButton
                text="X"
                variant="ghost"
                size="large"
                color="primary"
                circle
                @click="handleClick"
            />
        </div>

        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="X"
                size="small"
                color="primary"
                square
                @click="handleClick"
            />
            <FoundationButton
                text="X"
                variant="outline"
                color="primary"
                square
                @click="handleClick"
            />
            <FoundationButton
                text="X"
                variant="ghost"
                size="large"
                color="primary"
                square
                @click="handleClick"
            />
        </div>
    </div>
</template>
