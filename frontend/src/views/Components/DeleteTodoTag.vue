<template>

    <b-modal
        id="modal-delete-todo-tag"
        ref="modal"
        title="Edit tag"
        transition=""
        @show="resetModal"
        @hidden="resetModal"
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
                        <span class="bullet bullet-sm mr-1" :style="'background:' + tag.color + '!important;'"></span> {{tag.name}}
                    </template>
                    
                    <template #option="tag">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + tag.color + '!important;'"></span> {{tag.name}}
                    </template>

                </v-select>
            </b-form-group>
        </form>
            
        <template #modal-footer="{ cancel }">
           
            <b-button class="btn-danger btn" @click="deleteTag()">
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
    // import 'vue-select/dist/vue-select.css'
    // import 'vue-select/src/scss/vue-select.scss'
    // import 'vue-select/dist/vue-select.css';


    export default {
        components: {
            BModal,
            BFormGroup,
            vSelect,
            BButton
        },
        watch:{
            tagInput() {
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
                tagInput: null
            }
        },
        methods: {
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()

                this.tagState = valid

                return valid
            },
            resetModal() {
                            
                this.tagState = null
                if (!this.tagInput && this.todoTags) {
                    this.tagInput = this.todoTags[0]
                }

            },
            async refreshData() {
                try {

                    const data = await this.$http.get('/api/todo/group')

                    if (data.data.length === 0) {
                        throw 'Prislo je do napake!'
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
                        throw 'Prislo je do napake!'
                    }

                    this.$store.dispatch('todo/set_shared_group', { 'todos': data.data})
                } catch (err) {
                    if (err !== 'Prislo je do napake!') this.$printError('Error while loading shared Groups')//todo
                }

                try {

                    const data = await this.$http.get('/api/todo/tag')
                 
                    this.$store.dispatch('todo/set_tags', { 'tags': data.data})
                } catch (err) {
                    this.$printError('Error while loading tags')//todo
                }
            },
            async deleteTag() {
                try {
                    const tag = this.tagInput._id
                    await this.$http.delete(`/api/todo/tag/${tag}`)
                    

                } catch (err) {
                    this.$printError('Request was not sucesfull!')//todo
                    return
                }

                this.tagInput = null
                await this.refreshData()
                this.$printSuccess('Tag was sucesfull deleted')

                if (!this.todoTags || (this.todoTags && this.todoTags.length <= 0)) {
                    this.$bvModal.hide('modal-delete-todo-tag')
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

