<template>
    <div class="navbar-header d-xl-block d-none">
        <ul class="nav navbar-nav">
            <li class="nav-item">
                <b-link
                    class="navbar-brand"
                    to="/"
                >
                    <span class="brand-logo">
                        <b-img
                            :src="appLogoImage"
                            alt="logo"
                            v-if="isDark"
                        />
                        <b-img
                            :src="appLogoImageLight"
                            alt="logo"
                            v-if="!isDark"
                        />
                    </span>
                    <h2 class="brand-text mb-0">
                        {{ appName }}
                    </h2>
                </b-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import { BLink, BImg } from 'bootstrap-vue'
    import { $themeConfig } from '@themeConfig'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'

    export default {
        components: {
            BLink,
            BImg
        },
        setup() {
            // App Name
            const { appName, appLogoImage } = $themeConfig.app
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')
            return {
                appName,
                appLogoImage,
                skin, 
                isDark 
            }
        }
    }
</script>

<style>

</style>
