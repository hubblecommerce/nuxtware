<script setup lang="ts">
function handleClick () {
    console.log('click')
}
</script>

<template>
    <div>
        <div class="flex justify-start items-center gap-4 py-4">
            <FoundationButton
                text="Button Default Primary Small"
                size="small"
                @click="handleClick"
            />
            <FoundationButton
                text="Button Default Primary Medium"
                size="medium"
                @click="handleClick"
            />
            <FoundationButton
                text="Button Default Primary Large"
                size="large"
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
    </div>
</template>
