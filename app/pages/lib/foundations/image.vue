<template>
    <div class="container mx-auto px-4 py-8">
        <FoundationHeadline tag="h1" class="mb-8">
            FoundationImage Component
        </FoundationHeadline>
        
        <div class="prose prose-lg mb-8">
            <p>The FoundationImage component is a simple wrapper around NuxtImg that allows for global adjustments while maintaining full NuxtImg functionality. Use CSS containers for aspect ratios and styling.</p>
        </div>

        <!-- Basic Usage -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Basic Usage
            </FoundationHeadline>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-3">Basic Image</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300"
                        alt="Basic example image"
                        class="w-full h-full object-cover rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">With Placeholder</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300?random=1"
                        alt="Image with placeholder"
                        class="w-full h-full object-cover rounded-lg shadow-md"
                        placeholder
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Preloaded (No Spinner)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300?random=2"
                        alt="Preloaded image"
                        class="w-full h-full object-cover rounded-lg shadow-md"
                        preload
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </div>
        </section>

        <!-- Aspect Ratios -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Aspect Ratios
            </FoundationHeadline>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-3">Square (1:1)</h3>
                    <div class="aspect-square w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/400/400?random=3"
                            alt="Square aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Video (16:9)</h3>
                    <div class="aspect-video w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/800/450?random=4"
                            alt="Video aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Portrait (3:4)</h3>
                    <div class="aspect-[3/4] w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/400/533?random=5"
                            alt="Portrait aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Landscape (4:3)</h3>
                    <div class="aspect-[4/3] w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/533/400?random=6"
                            alt="Landscape aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Wide (16:9)</h3>
                    <div class="aspect-[16/9] w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/800/450?random=7"
                            alt="Wide aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Ultra Wide (21:9)</h3>
                    <div class="aspect-[21/9] w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/800/343?random=8"
                            alt="Ultra wide aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- Custom Aspect Ratio -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Custom Aspect Ratio
            </FoundationHeadline>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-3">Custom 5:2 Banner</h3>
                    <div class="aspect-[5/2] w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/1000/400?random=9"
                            alt="Custom 5:2 aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Custom 2:3 Tall</h3>
                    <div class="aspect-[2/3] w-full rounded-lg shadow-md overflow-hidden">
                        <FoundationImage 
                            src="https://picsum.photos/400/600?random=10"
                            alt="Custom 2:3 aspect ratio"
                            class="w-full h-full object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- Responsive Gallery -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Responsive Gallery
            </FoundationHeadline>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div 
                    v-for="i in 12"
                    :key="i"
                    class="aspect-square w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                    <FoundationImage 
                        :src="`https://picsum.photos/400/400?random=${i + 10}`"
                        :alt="`Gallery image ${i}`"
                        class="w-full h-full object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'FoundationImage Component Examples',
    meta: [
        {
            name: 'description',
            content: 'Examples and usage patterns for the FoundationImage component with responsive design, aspect ratios, and NuxtImg integration.'
        }
    ]
})
</script>