<template>

    <b-modal
        id="modal-add-todo"
        ref="modal"
        title="Add todo"
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
                label="Description"
                label-for="desc-input"
                invalid-feedback="Description is required"
                :state="descState"
            >
                <b-form-input
                    id="desc-input"
                    v-model="description"
                    :state="descState"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group
                label="Tags"
                label-for="tags"
            >
                <!-- <v-select
                    id="shared-select"
                    v-model="selectedTags"
                    multiple
                    taggable
                    push-tags
                    placeholder="Add tags"
                >
                    <template #selected-option="">
                        <div style="display: flex; align-items: baseline;">
                            {{option.name}}
                        </div>
                    </template>
                </v-select> -->
                <v-select
                    v-model="selectedTags"
                    label="name"
                    multiple
                    taggable
                    placeholder="Choose tags"
                    :selectable="() => selectedTags.length < 5"
                    :options="tags"
                > 
                    <template #selected-option="{ name, color }">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + color + '!important;'"></span> {{name}}

                    </template>
                    <template #option="{ name, color }">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + color + '!important;'"></span>
                        <span> {{ name }}</span>
                    </template>
                </v-select>
            </b-form-group>
        </form>
    </b-modal>
</template>

<script>
    import { BModal, BFormInput, BFormGroup  } from 'bootstrap-vue'
    import vSelect from 'vue-select'


    export default {
        components: {
            BModal,
            BFormInput,
            BFormGroup,
            vSelect
        },
        computed: {
            tags() {
                return this.$store.getters['tags/getAllTags']
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        data() {
            return {
                option: [{name: 'test'}, {name: 'test1'}, {name: 'test2'}],
                selectedTags: [],
                name: '',
                description: '',
                nameState: null,
                descState: null
            }
        },
        methods: {
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()
                this.nameState = valid
                this.descState = valid
                return valid
            },
            resetModal() {
                this.selectedTags = []
                this.name = ''
                this.nameState = null
                this.description = ''
                this.descState = null
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
                
                this.addTodo()
            },
            showModal() {
                this.$refs['my-modal'].show()
            },
            async addTodo() {

                const finalTags = []
                if (this.selectedTags && this.selectedTags.length > 0) {
                    for (const item of this.selectedTags) {
                        finalTags.push(item._id)
                    }
                }

                const todo = this.selectedGroup

                const payload = {
                    'todoGroupId': todo,
                    'name': this.name,
                    'description': this.description,
                    'status': false,
                    'tags': finalTags
                }

                const data = await this.$http.post('/api/todo', payload)

                this.$store.dispatch('todo/add_todo_item', { 'todo_item': data.data, 'todo_group': todo})

                console.log(data)

                this.$bvModal.hide('modal-add-todo')

            }
           
        }
    }
</script>

<style>
    
</style>
