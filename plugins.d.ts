import type { $t } from "vue-i18n/dist/vue-i18n";

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: $t;
    }
}
