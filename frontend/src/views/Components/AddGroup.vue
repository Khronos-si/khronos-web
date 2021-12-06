<template>

    <b-modal
        id="modal-add-group"
        ref="modal"
        title="Add group"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >   
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
                label="Name"
                label-for="name-input"
                invalid-feedback="Name is required"
                :state="nameState"
            >
                <b-form-input
                    id="name-input"
                    v-model="name"
                    :state="nameState"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label="Permisions"
                label-for="perm-input"
                invalid-feedback="Permisions are required"
                :state="permState"
            >
                <!-- <b-form-input
                    type="number"
                    id="perm-input"
                    v-model="permissions"
                    :state="permState"
                    required
                ></b-form-input> -->
                <v-select
                    v-model="permissions"
                    label="title"
                    :options="optionPermissions"
                    placeholder="Choose permissions"
                />
            </b-form-group>

            <b-form-group
                label="Shared with"
                label-for="shared-select"
            >
                <v-select
                    id="shared-select"
                    v-model="sharedWith"
                    multiple
                    taggable
                    push-tags
                    placeholder="Add Options"
                />
            </b-form-group>
        </form>
    </b-modal>
</template>

<script>
    import { BModal, BFormInput, BFormGroup   } from 'bootstrap-vue'
    import vSelect from 'vue-select'
    // import 'vue-select/dist/vue-select.css'
    // import 'vue-select/src/scss/vue-select.scss'
    // import 'vue-select/dist/vue-select.css';


    export default {
        components: {
            BModal,
            BFormInput,
            BFormGroup,
            vSelect
        },
        computed: {
            todos() {
                return this.$store.getters['todo/getTodos'](this.selectedGroup)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        data() {
            return {
                optionPermissions: [{ title: 'Read', permisson: 0 }, { title: 'Read/Edit', permisson: 1 }, { title: 'Read/Edit/Delete', permisson: 2}],
                name: '',
                permissions: '',
                sharedWith: [],
                nameState: null,
                permState: null
            }
        },
        methods: {
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()
                this.nameState = valid
                this.permState = valid
                return valid
            },
            resetModal() {
                this.name = ''
                this.nameState = null
                this.permissions = ''
                this.sharedWith = ''
                this.permState = null
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.handleSubmit()
            },
            handleSubmit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return
                }
                
                this.addGroup()
            },
            showModal() {
                this.$refs['my-modal'].show()
            },
            async addGroup() {

                const payload = {
                    'name': this.name,
                    'permissions': this.permissions.permisson,
                    'shareWith': this.sharedWith
                }

                const data = await this.$http.post('/api/todo/group', payload)
                
                const newGroup = data.data
                newGroup.todos = []

                console.log(newGroup)

                this.$store.dispatch('todo/add_group', { 'new_group': newGroup})

                this.$bvModal.hide('modal-add-group')

            }
           
        }
    }
</script>

<style lang="scss">
    @import '~@core/scss/vue/libs/vue-select.scss';

    button.vs__deselect{
        fill: rgb(32, 31, 31) !important;
    }
</style>

