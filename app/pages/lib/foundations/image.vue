<template>
    <div class="container mx-auto px-4 py-8">
        <FoundationHeadline tag="h1" class="mb-8">
            FoundationImage Component
        </FoundationHeadline>
        
        <div class="prose prose-lg mb-8">
            <p>The FoundationImage component wraps NuxtImg with responsive design enhancements, loading states, and error handling.</p>
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
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">With Placeholder</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300?random=1"
                        alt="Image with placeholder"
                        class="w-full rounded-lg shadow-md"
                        placeholder
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Preloaded (No Spinner)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300?random=2"
                        alt="Preloaded image"
                        class="w-full rounded-lg shadow-md"
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
                    <FoundationImage 
                        src="https://picsum.photos/400/400?random=3"
                        alt="Square aspect ratio"
                        aspect-ratio="square"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Video (16:9)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/800/450?random=4"
                        alt="Video aspect ratio"
                        aspect-ratio="video"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Portrait (3:4)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/533?random=5"
                        alt="Portrait aspect ratio"
                        aspect-ratio="portrait"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Landscape (4:3)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/533/400?random=6"
                        alt="Landscape aspect ratio"
                        aspect-ratio="landscape"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Wide (16:9)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/800/450?random=7"
                        alt="Wide aspect ratio"
                        aspect-ratio="wide"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Ultra Wide (21:9)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/800/343?random=8"
                        alt="Ultra wide aspect ratio"
                        aspect-ratio="ultra-wide"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
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
                    <FoundationImage 
                        src="https://picsum.photos/1000/400?random=9"
                        alt="Custom 5:2 aspect ratio"
                        aspect-ratio="aspect-[5/2]"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Custom 2:3 Tall</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/600?random=10"
                        alt="Custom 2:3 aspect ratio"
                        aspect-ratio="aspect-[2/3]"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </section>

        <!-- Responsive Gallery -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Responsive Gallery
            </FoundationHeadline>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <FoundationImage 
                    v-for="i in 12"
                    :key="i"
                    :src="`https://picsum.photos/400/400?random=${i + 10}`"
                    :alt="`Gallery image ${i}`"
                    aspect-ratio="square"
                    class="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
            </div>
        </section>

        <!-- Error Handling -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Error Handling
            </FoundationHeadline>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-3">Broken Image (Default Error)</h3>
                    <FoundationImage 
                        src="https://invalid-url.com/image.jpg"
                        alt="Broken image example"
                        aspect-ratio="video"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Custom Error Message</h3>
                    <FoundationImage 
                        src="https://another-invalid-url.com/image.jpg"
                        alt="Custom error example"
                        aspect-ratio="video"
                        class="w-full rounded-lg shadow-md"
                        error-text="Custom error: Image could not be loaded"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </section>

        <!-- Container Classes -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Container Classes
            </FoundationHeadline>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-3">Bordered with Shadow</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300?random=20"
                        alt="Bordered image"
                        aspect-ratio="landscape"
                        :container-classes="['border-2', 'border-primary', 'shadow-lg']"
                        class="w-full rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">Circular Image</h3>
                    <FoundationImage 
                        src="https://picsum.photos/300/300?random=21"
                        alt="Circular image"
                        aspect-ratio="square"
                        :container-classes="['rounded-full', 'shadow-md']"
                        class="w-48 h-48 mx-auto"
                        sizes="192px"
                    />
                </div>
            </div>
        </section>

        <!-- Loading States -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Loading States
            </FoundationHeadline>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-3">With Loading Spinner</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300?random=100"
                        alt="Loading spinner example"
                        aspect-ratio="landscape"
                        class="w-full rounded-lg shadow-md"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-3">No Spinner (Disabled)</h3>
                    <FoundationImage 
                        src="https://picsum.photos/400/300?random=101"
                        alt="No spinner example"
                        aspect-ratio="landscape"
                        class="w-full rounded-lg shadow-md"
                        :show-loading-spinner="false"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </section>

        <!-- Code Examples -->
        <section class="mb-12">
            <FoundationHeadline tag="h2" class="mb-6">
                Code Examples
            </FoundationHeadline>
            
            <div class="space-y-6">
                <div class="bg-gray-100 rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-3">Basic Example</h3>
                    <pre class="text-sm overflow-x-auto"><code>&lt;FoundationImage 
    src=\"https://picsum.photos/400/300\"
    alt=\"Example image\"
    class=\"w-full rounded-lg shadow-md\"
    sizes=\"(max-width: 768px) 100vw, 50vw\"
/&gt;</code></pre>
                </div>
                
                <div class="bg-gray-100 rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-3">Aspect Ratio Example</h3>
                    <pre class="text-sm overflow-x-auto"><code>&lt;FoundationImage 
    src=\"https://picsum.photos/400/400\"
    alt=\"Square image\"
    aspect-ratio=\"square\"
    class=\"w-48 mx-auto rounded-lg\"
    sizes=\"192px\"
/&gt;</code></pre>
                </div>
                
                <div class="bg-gray-100 rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-3">Responsive Gallery Example</h3>
                    <pre class="text-sm overflow-x-auto"><code>&lt;div class=\"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4\"&gt;
    &lt;FoundationImage 
        v-for=\"image in images\"
        :key=\"image.id\"
        :src=\"image.src\"
        :alt=\"image.alt\"
        aspect-ratio=\"square\"
        class=\"w-full rounded-lg\"
        sizes=\"(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw\"
    /&gt;
&lt;/div&gt;</code></pre>
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