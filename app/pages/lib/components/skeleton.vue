<template>
  <div class="container m-auto p-2">
    <h1 class="text-2xl font-bold mb-6">Skeleton Component Examples</h1>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Basic Presets</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Text</h3>
          <ComponentSkeleton preset="text" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Heading</h3>
          <ComponentSkeleton preset="heading" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Button</h3>
          <ComponentSkeleton preset="button" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Image</h3>
          <ComponentSkeleton preset="image" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Avatar</h3>
          <ComponentSkeleton preset="avatar" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Card</h3>
          <ComponentSkeleton preset="card" />
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Animation Types</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Pulse Animation</h3>
          <ComponentSkeleton preset="text" animation="pulse" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Wave Animation</h3>
          <ComponentSkeleton preset="text" animation="wave" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">No Animation</h3>
          <ComponentSkeleton preset="text" animation="none" />
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Custom Dimensions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Custom Width</h3>
          <ComponentSkeleton width="50%" height="20px" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Custom Height</h3>
          <ComponentSkeleton width="100%" height="40px" />
        </div>
        
        <div class="p-4 border rounded">
          <h3 class="text-lg font-medium mb-2">Circle</h3>
          <ComponentSkeleton width="60px" height="60px" circle />
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Product Card Skeleton</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Example of a customized product card skeleton -->
        <div class="flex flex-col w-full justify-start border p-3 gap-3">
          <ComponentSkeleton preset="image" />
          <ComponentSkeleton preset="text" width="80%" />
          <ComponentSkeleton height="24px" width="40%" />
        </div>
        
        <div class="flex flex-col w-full justify-start border p-3 gap-3">
          <ComponentSkeleton preset="image" />
          <ComponentSkeleton preset="text" width="70%" />
          <ComponentSkeleton height="24px" width="40%" />
        </div>
        
        <div class="flex flex-col w-full justify-start border p-3 gap-3">
          <ComponentSkeleton preset="image" />
          <ComponentSkeleton preset="text" width="90%" />
          <ComponentSkeleton height="24px" width="40%" />
        </div>
        
        <div class="flex flex-col w-full justify-start border p-3 gap-3">
          <ComponentSkeleton preset="image" />
          <ComponentSkeleton preset="text" width="60%" />
          <ComponentSkeleton height="24px" width="40%" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// This is an example page showing different uses of the ComponentSkeleton
</script>
