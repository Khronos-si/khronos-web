<template>

    <b-modal
        id="modal-add-group"
        ref="modal"
        title="Add group"
        transition=""
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
                label="Color"
                label-for="color-input"
                invalid-feedback="Color is required"
                :state="colorState"
            >
                <v-select
                    v-model="color"
                    label="color"
                    :options="optionColor"
                    placeholder="Choose color"
                    style="max-height: 100px;"
                >
                    <template #selected-option="item">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + item.color + '!important;'"></span> {{item.color}}

                    </template>
                    
                    <template #option="item">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + item.color + '!important;'"></span> {{item.color}}
                    </template>

                </v-select>
            </b-form-group>

            <b-form-group
                label="Permisions"
                label-for="perm-input"
                invalid-feedback="Permisions are required"
                :state="permState"
                v-if="sharedWith.length > 0"
            >
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
                >
                    <template #selected-option="option">
                        <div style="display: flex; align-items: baseline;" :class="checkIfEmailExist(option.label)? '':'emailDoesntExist'">
                            {{option.label}}
                        </div>
                    </template>
                </v-select>
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
                optionColor: ['#7367F0', '#6EC193', '#53AFBE', '#FEB449', '#FE5C36', '#739BAA', '#F5C89F', '#8EBFB5', '#FEA6B0', '#95B2D1', '#42A48D', '#86415E', '#BC1654', '#F53435', '#FBF37C', '#7F7F7F', '#58555A'],
                optionPermissions: [{ title: 'Read', permisson: 0 }, { title: 'Read/Edit', permisson: 1 }, { title: 'Read/Edit/Delete', permisson: 2}],
                color: '',
                name: '',
                permissions: '',
                sharedWith: [],
                nameState: null,
                permState: null,
                colorState: null,
                emailThatDoesntExist: []
            }
        },
        methods: {
            checkIfEmailExist(email) {
                console.log(this.emailThatDoesntExist)
                if (this.emailThatDoesntExist && this.emailThatDoesntExist.length > 0) {
                    console.log('tuki sm')
                    for (const item of this.emailThatDoesntExist) {
                        console.log('PRIMERJAM:')
                        console.log(item)
                        console.log(email)
                        console.log('')
                        if (item === email) return false
                    }
                }
                return true
            },
            checkFormValidity() {
                let valid = this.$refs.form.checkValidity()
                

                if ((this.color === '' || !this.color)) valid = false 

                if (this.sharedWith && this.sharedWith.length > 0 && (this.permissions === '' || !this.permissions)) valid = false
                    
                this.nameState = valid
                this.permState = valid
                this.colorState = valid

                return valid
            },
            resetModal() {
                this.color = ''
                this.name = ''
                this.nameState = null
                this.permissions = ''
                this.sharedWith = ''
                this.permState = null
                this.colorState = null
            },
            clicked(bvModalEvt) {
                console.log(bvModalEvt)
                console.log('TEST 1')
            },
            modalHidden(bvModalEvt) {
                console.log(bvModalEvt)
                // console.log('TEST')
                // bvModalEvt.preventDefault()
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
                    'shareWith': this.sharedWith,
                    'color': this.color
                }
                
                try {
                    const data = await this.$http.post('/api/todo/group', payload)
                
                    const newGroup = data.data

                    this.$store.dispatch('todo/add_group', { 'new_group': newGroup})

                    this.$bvModal.hide('modal-add-group')
                } catch (err) {
                    if (err.response.data) {
                        this.emailThatDoesntExist = err.response.data.users
                    }
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

