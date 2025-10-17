<template>
    <div class="mx-auto w-full max-w-8xl">
        <div class="flex flex-col justify-start items-center gap-4 py-4">
            <FoundationLink href="/">Link to internal via NuxtLink / Vue Router</FoundationLink>
            <FoundationLink href="/" type="external">Link to external via anchor tag</FoundationLink>
            <FoundationLink href="/" variant="underline">Link underline</FoundationLink>
            <FoundationLink href="/" disabled>Link disabled</FoundationLink>
            <FoundationLink href="/lib/foundations/links">Link to current (active) page</FoundationLink>
            <FoundationLink text="Link with text via prop" href="/" />
            <FoundationLink href="/home">Link to home</FoundationLink>
            <FoundationLink href="/home" :style="{ '--color-link': 'pink', '--color-link-visited': 'pink' }">Link with overridden color</FoundationLink>
        </div>
    </div>
</template>
