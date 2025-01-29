<template>
    <div class="container m-auto">
        <div class="flex flex-col justify-start items-center gap-4 py-4">
            <FoundationInput size="xs" placeholder="Input x-small" />
            <FoundationInput size="sm" color="primary" placeholder="Input small primary" />
            <FoundationInput size="md" color="secondary" placeholder="Input medium secondary"/>
            <FoundationInput size="lg" color="tertiary" disabled placeholder="Input large tertiary disabled" />
            <FoundationInput size="xl" bordered placeholder="Input XL bordered" />
            <FoundationInput size="2xl" bordered placeholder="Input XXL bordered" />
        </div>
    </div>
</template>
