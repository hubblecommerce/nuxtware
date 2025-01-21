import withNuxt from './.playground/.nuxt/eslint.config.mjs'

export default withNuxt().overrideRules({
    'vue/no-multiple-template-root': null
})

