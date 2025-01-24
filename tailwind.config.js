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
        // Theme colors need to be set as :root variables in /theme.css
        // Components
        btn: 'var(--btn-color, --primary-color)',
        'btn-content': 'var(--btn-content-color, --primary-content-color)',
        link: 'var(--theme-link-color)',
        'link-visited': 'var(--theme-link-visited-color)',
        'link-hover': 'var(--theme-link-hover-color)',
        'link-active': 'var(--theme-link-active-color)',
      },
    },
  },
  variants: {},
  plugins: [],
}
