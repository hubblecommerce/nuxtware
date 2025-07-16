export type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type ImageObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
export type ImageAspectRatio = 'square' | 'video' | 'portrait' | 'landscape' | 'wide' | 'ultra-wide'

export interface ImageProps {
    src: string
    alt?: string
    size?: ImageSize
    width?: number | string
    height?: number | string
    aspectRatio?: ImageAspectRatio
    objectFit?: ImageObjectFit
    lazy?: boolean
    placeholder?: string
    fallback?: string
    rounded?: boolean
    border?: boolean
    shadow?: boolean
    loading?: boolean
    errorText?: string
    useNuxtImg?: boolean
    sizes?: string
    format?: string
    quality?: number
    fit?: string
    presets?: string
}