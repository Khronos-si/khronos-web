<template>

    <b-modal
        id="modal-add-todo"
        ref="modal"
        title="Add task"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >
        <form ref="form" @submit.stop.prevent="handleSubmit">

            <!-- TODO GROUP -->
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
                    :reduce="ele => ele._id"
                >
                    <template #selected-option="group">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + group.color + '!important;'"></span> {{group.name}}
                    </template>
                    
                    <template #option="group">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + group.color + '!important;'"></span> {{group.name}}
                    </template>

                </v-select>
            </b-form-group>

            <!-- NAME -->
            <b-form-group
                label="Name"
                label-for="name-input"
                invalid-feedback="Name is required"
                :state="nameState"
            >
                <b-form-input
                    placeholder="Input name"
                    id="name-input"
                    v-model="name"
                    :state="nameState"
                    required
                ></b-form-input>
            </b-form-group>

            <!-- DESCRIPTION -->
            <b-form-group
                label="Description"
                label-for="desc-input"
                invalid-feedback="Description is required"
                :state="descState"
            >
                <b-form-input
                    placeholder="Input description"
                    id="desc-input"
                    v-model="description"
                    :state="descState"
                    required
                ></b-form-input>
            </b-form-group>

            <!-- TAGS -->
            <b-form-group
                label="Tags"
                label-for="tags"
            >
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
                return this.$store.getters['todo/getAllTags']
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            },
            todoGroups() {
                return this.$store.getters['todo/getAllGroups']
            },
            selectedGroupData() {
                return this.$store.getters['todo/getGroupById'](this.selectedGroup)
            }
        },
        data() {
            return {
                groupState: null,
                groupInput: null,
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
                this.groupState = valid
                return valid
            },
            resetModal() {
                this.groupInput = this.selectedGroupData
                this.groupState = null
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
                    'todoGroupId': this.groupInput,
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
