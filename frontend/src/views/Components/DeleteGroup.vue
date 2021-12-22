<template>

    <b-modal
        id="modal-delete-group"
        ref="modal"
        title="Delete group"
        transition=""
        @show="resetModal"
        @hidden="resetModal"
    >   
        <form ref="form" @submit.stop.prevent="handleSubmit">

            <b-form-group
                label="Group"
                label-for="group-input"
                invalid-feedback="Group is required"
                :state="groupState"
            >
                <v-select
                    v-model="groupInput"
                    label="name"
                    :options="todoGroups"
                    placeholder="Choose group"
                    style="max-height: 100px;"
                >
                    <template #selected-option="group">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + group.color + '!important;'"></span> {{group.name}}
                    </template>
                    
                    <template #option="group">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + group.color + '!important;'"></span> {{group.name}}
                    </template>

                </v-select>
            </b-form-group>
           
        </form>

        <template #modal-footer="{ cancel }">
           
            <b-button class="btn-danger btn" @click="deleteGroup()">
                Delete
            </b-button>

            <button class="btn btn-primary" @click="cancel()">
                Done
            </button>

        </template>

    </b-modal>
</template>

<script>
    import { BModal, BFormGroup, BButton   } from 'bootstrap-vue'
    import vSelect from 'vue-select'
    

    export default {
        components: {
            BModal,
            BFormGroup,
            vSelect,
            BButton
        },
        watch:{
            group() {
                this.resetModal()
            }
        },
        computed: {
            group() {
                let selected = null
                if (!this.groupInput) selected = this.$store.getters['todo/getGroupById'](this.selectedGroup)
                else selected = this.$store.getters['todo/getGroupById'](this.groupInput._id)

                return selected
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            },
            todoGroups() {
                return this.$store.getters['todo/getAllGroups']
            }
        },
        data() {
            return {
                groupState: null,
                groupInput: null
            }
        },
        methods: {
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()

                this.groupState = valid

                return valid
            },
            resetModal() {
                this.groupState = null
                this.groupInput = this.group
            },
            async deleteGroup() {

                if (!this.groupInput) return

                try {
                    const todoGroup = this.groupInput._id
                    const data = await this.$http.delete(`/api/todo/group/${todoGroup}`)

                    if (data.data && data.data.length === 0) {
                        throw 'Prislo je do napake'
                    }

                    if (data.status === 200) {
                        this.$store.dispatch('todo/delete_group', { 'group_id': todoGroup})
                    }

                    // this.$bvModal.hide('modal-delete-group')
                    this.$printSuccess('Group sucesfully deleted')
                } catch (err) {
                    this.$printError('Couldnt delete group')
                    console.log(err)
                }
               

            }
        }
    }
</script>

<style lang="scss">
    @import '~@core/scss/vue/libs/vue-select.scss';

    .emailDoesntExist{
        color: #fe5c36 !important;
    }

    button.vs__deselect{
        fill: rgb(32, 31, 31) !important;
    }
</style>

