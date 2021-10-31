<template>
    <ul>
        <component
            :is="resolveNavItemComponent(item)"
            v-for="item in displayedItems"
            :key="item.header || item.title"
            :item="item"
        />
    </ul>
</template>

<script>
    import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
    import { provide, ref } from '@vue/composition-api'
    import VerticalNavMenuHeader from '../vertical-nav-menu-header'
    import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'
    import VerticalNavMenuGroup from '../vertical-nav-menu-group/VerticalNavMenuGroup.vue'

    export default {
        components: {
            VerticalNavMenuHeader,
            VerticalNavMenuLink,
            VerticalNavMenuGroup
        },
        props: {
            items: {
                type: Array,
                required: true
            }
        },
        mounted() {
            this.filterItems()
        },
        data() {
            return {
                displayedItems: []
            }
        },
        methods: {
            filterItems() {
                this.displayedItems = this.items

                // ODKOMENTIRAJ DA BO UPOŠTEVALO PERMISSIONE
                // const role = this.$store.state.user.userData.type

                // for (let i = 0; i < this.items.length; i++) {
                //     if (!this.items[i].required_permission) {
                //         this.displayedItems.push(this.items[i])
                //     } else if (this.items[i].required_permission === role) {
                //         this.displayedItems.push(this.items[i])
                //     }
                // }
            }
        },
        setup() {
            provide('openGroups', ref([]))

            return {
                resolveNavItemComponent
            }
        }
    }
</script>
