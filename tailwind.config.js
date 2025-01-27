/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors need to be set as :root variables in /theme.css
        primary: 'var(--primary-color)',
        'primary-shade-light': 'var(--primary-color-shade-light)',
        'primary-shade-dark': 'var(--primary-color-shade-dark)',
        'primary-content': 'var(--primary-content-color)',
        secondary: 'var(--secondary-color)',
        'secondary-shade-light': 'var(--secondary-color-shade-light)',
        'secondary-shade-dark': 'var(--secondary-color-shade-dark)',
        'secondary-content': 'var(--secondary-content-color)',
        tertiary: 'var(--tertiary-color)',
        'tertiary-shade-light': 'var(--tertiary-color-shade-light)',
        'tertiary-shade-dark': 'var(--tertiary-color-shade-dark)',
        'tertiary-content': 'var(--tertiary-content-color)',
        // Tailwind Components
        btn: 'var(--btn-color, --primary-color)',
        'btn-color-shade-light': 'var(--btn-color-shade-light, --primary-color-shade-light)',
        'btn-color-shade-dark': 'var(--btn-color-shade-dark, --primary-color-shade-dark)',
        'btn-content': 'var(--btn-content-color, --primary-content-color)',
        link: 'var(--theme-link-color)',
        'link-visited': 'var(--theme-link-visited-color)',
        'link-hover': 'var(--theme-link-hover-color)',
        'link-active': 'var(--theme-link-active-color)',
        'focus-color': 'var(--primary-color)',
      },
    },
  },
  variants: {},
  plugins: [],
}
