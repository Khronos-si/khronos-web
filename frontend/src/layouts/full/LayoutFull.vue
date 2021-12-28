<template>
    <layout-full>
        <router-view />
    </layout-full>
</template>

<script>
    import LayoutFull from '@core/layouts/layout-full/LayoutFull.vue'

    export default {
        components: {
            LayoutFull
        }
    }
</script>

<style lang="scss" scoped>
    *::-webkit-scrollbar {
        width: 2px;
    }

    /* Track */
    *::-webkit-scrollbar-track {
        background: transparent; 
    }
    
    /* Handle */
    *::-webkit-scrollbar-thumb {
        background: #888; 
    }

    /* Handle on hover */
    *::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
</style>