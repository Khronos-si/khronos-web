<template>

    <b-modal
        id="modal-edit-todo-tag"
        ref="modal"
        title="Edit tag"
        transition=""
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >   
        <form ref="form" @submit.stop.prevent="handleSubmit">

            <b-form-group
                label="Tag"
                label-for="tag-input"
                invalid-feedback="Tag is required"
                :state="tagState"
            >
                <v-select
                    v-model="tagInput"
                    label="name"
                    :options="todoTags"
                    placeholder="Choose tag"
                    style="max-height: 100px;"
                >
                    <template #selected-option="tag">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + color + '!important;'"></span> {{tag.name}}
                    </template>
                    
                    <template #option="tag">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + tag.color + '!important;'"></span> {{tag.name}}
                    </template>

                </v-select>
            </b-form-group>

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
        watch:{
            group() {
                this.resetModal()
            },
            tagInput() {
                console.log('RESETIRAM')
                this.resetModal()
            }
        },
        computed: {
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            },
            todoTags() {
                return this.$store.getters['todo/getAllTags']
            }
        },
        data() {
            return {
                tagState: null,
                tagInput: null,
                optionColor: ['#7367F0', '#6EC193', '#53AFBE', '#FEB449', '#FE5C36', '#739BAA', '#F5C89F', '#8EBFB5', '#FEA6B0', '#95B2D1', '#42A48D', '#86415E', '#BC1654', '#F53435', '#dbb039', '#7F7F7F', '#58555A'],
                color: '',
                name: '',
                nameState: null,
                colorState: null
            }
        },
        methods: {
            checkFormValidity() {
                let valid = this.$refs.form.checkValidity()

                if ((this.color === '' || !this.color)) valid = false 
                    
                this.nameState = valid
                this.colorState = valid
                this.tagState = valid

                return valid
            },
            resetModal() {
                            
                if (this.todoTags && this.todoTags.length > 0 && !this.tagInput) {
                    // this.color = this.todoTags[0].color
                    // this.name = this.todoTags[0].name
                    this.tagInput = this.todoTags[0]
                } else if (this.tagInput) {
                    this.color = this.tagInput.color
                    this.name = this.tagInput.name
                }
                
                this.nameState = null
                this.colorState = null
                this.tagState = null

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
                
                this.editGroup()
            },
            async refreshData() {
                try {

                    const data = await this.$http.get('/api/todo/group')

                    if (data.data.length === 0) {
                        return
                    }

                    this.$store.dispatch('todo/update_todos', { 'todos': data.data})
                    // this.$store.dispatch('todo/set_selected_group', { 'selectedGroup': data.data[0]['_id']})
                } catch (err) {
                    this.$printError('Error while loading my groups')//todo
                    console.log(err)
                }

                try {

                    const data = await this.$http.get('/api/todo/shared-with-me')

                    if (data.data.length === 0) {
                        return
                    }

                    this.$store.dispatch('todo/set_shared_group', { 'todos': data.data})
                } catch (err) {
                    this.$printError('Error while loading shared Groups')//todo
                    console.log(err)
                }

                try {

                    const data = await this.$http.get('/api/todo/tag')

                    this.$store.dispatch('todo/set_tags', { 'tags': data.data})
                } catch (err) {
                    this.$printError('Error while loading tags')//todo
                    console.log(err)
                }
            },
            async editGroup() {


                const payload = {
                    'id': this.tagInput._id,
                    'name': this.name,
                    'color': this.color
                }

                try {
                    const tag = this.tagInput._id
                    await this.$http.put(`/api/todo/tag/${tag}`, payload)

                    // if (data.status === 200) {
                    //     const newTag = data.data
                        
                    //     // this.$store.dispatch('todo/edit_tag', { 'tag_new': newTag, 'tag_id': tag})
                    // }

                } catch (err) {
                    this.$printError('Request was not sucesfull!')//todo
                    console.log(err)
                }

                await this.refreshData()

                this.$bvModal.hide('modal-edit-todo-tag')
                this.$printSuccess('Tag was sucesfull changed')
               

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

