interface SanitizeOptions {
    allowedTags?: string[]
    removeElements?: string[]
    removeAttributes?: string[]
}

interface SanitizeStringOptions {
    allowedChars?: string
    replaceWith?: string
}

/**
 * Composable for content sanitization utilities
 */
export function useSanitization() {
    /**
     * Sanitizes HTML content by removing potentially harmful attributes and elements
     * @param html - The HTML string to sanitize
     * @param options - Sanitization options
     * @returns Sanitized HTML string
     */
    function sanitizeHtml(html: string | undefined, options: SanitizeOptions = {}): string {
        if (!import.meta.client || !html) {
            return html ?? ''
        }

        const div = document.createElement('div')
        div.innerHTML = html.trim()
        
        // Default harmful attributes to remove
        const defaultRemoveAttrs = [
            'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousemove', 
            'onmouseenter', 'onmouseleave', 'onkeydown', 'onkeyup', 'onchange',
            'onsubmit', 'onreset', 'onfocus', 'onblur', 'onerror', 'onresize',
            'onscroll', 'onselect', 'onunload', 'onbeforeunload'
        ]
        
        // Default harmful elements to remove
        const defaultRemoveElements = ['script', 'object', 'embed', 'applet', 'iframe']
        
        const removeAttrs = options.removeAttributes ?? defaultRemoveAttrs
        const removeElements = options.removeElements ?? defaultRemoveElements
        
        // Get all elements to sanitize
        const elements = div.querySelectorAll('*')
        
        elements.forEach(element => {
            // Remove potentially harmful attributes
            removeAttrs.forEach(attr => element.removeAttribute(attr))
        })

        // Remove elements - either use allowedTags whitelist or removeElements blacklist
        if (options.allowedTags) {
            // Whitelist approach - remove elements not in allowedTags
            elements.forEach(element => {
                if (!options.allowedTags!.includes(element.tagName.toLowerCase())) {
                    element.remove()
                }
            })
        } else {
            // Blacklist approach - remove elements in removeElements
            removeElements.forEach(tagName => {
                div.querySelectorAll(tagName).forEach(node => node.remove())
            })
        }

        // If looking for a specific element type, return only that element
        if (options.allowedTags && options.allowedTags.length === 1 && options.allowedTags[0]) {
            const targetElement = div.querySelector(options.allowedTags[0])
            return targetElement ? targetElement.outerHTML : ''
        }

        return div.innerHTML
    }

    /**
     * Sanitizes text strings by removing or replacing specific characters
     * @param text - The text string to sanitize
     * @param options - Sanitization options
     * @returns Sanitized text string
     */
    function sanitizeString(text: string, options: SanitizeStringOptions = {}): string {
        const { allowedChars = 'a-zA-Z0-9 ', replaceWith = '' } = options
        const pattern = new RegExp(`[^${allowedChars}]`, 'g')
        return text.replace(pattern, replaceWith)
    }

    return {
        sanitizeHtml,
        sanitizeString
    }
}