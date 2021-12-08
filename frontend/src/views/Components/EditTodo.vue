<template>

    <b-modal
        id="modal-edit-todo"
        ref="modal"
        :title="modalTitle"
        @hidden="resetModal"
        @ok="handleOk"
    >
        <form ref="form" @submit.stop.prevent="handleSubmit" v-if="groupPermissions == null || groupPermissions > 0">
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
                label="Status"
                label-for="stat-input"
            >
                <b-form-checkbox
                    id="stat-input"
                    v-model="status"
                    required
                ></b-form-checkbox>
            </b-form-group>
        </form>

        <div v-if="groupPermissions == 0">
            <!-- <div style="font-size: 1.5rem;">
                {{todo.name}}
            </div> -->

            <div class="my-2">
                {{todo.description}}
            </div>
        </div>

        <template #modal-footer="{ ok, cancel }">
           
            <!-- <div v-if="groupPermissions == null || groupPermissions > 0"> -->

            <b-button class="btn-danger btn" @click="deleteTodo()" v-if="groupPermissions == null || groupPermissions == 2">
                Delete
            </b-button>

            <b-button class="btn-secondary btn" @click="cancel()" v-if="groupPermissions == null || groupPermissions > 0">
                Cancel
            </b-button>

            <button class="btn btn-primary" @click="ok()" v-if="groupPermissions == null || groupPermissions > 0">
                OK
            </button>

            <button class="btn btn-primary" @click="hide()" v-if="groupPermissions == 0">
                Done
            </button>

        </template>

    </b-modal>
</template>

<script>
    import { BModal, BFormInput, BFormGroup, BFormCheckbox, BButton  } from 'bootstrap-vue'

    export default {
        components: {
            BModal,
            BFormInput,
            BFormGroup,
            BButton,
            BFormCheckbox
        },
        computed: {
            groupPermissions() {
                return this.$store.getters['todo/getGroupPremissions'](this.selectedGroup)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        props: {
            todo:{
                type: Object
            }
        },
        data() {
            return {
                modalTitle: '',
                name: '',
                description: '',
                status: '',
                nameState: null,
                descState: null
            }
        },
        watch:{
            todo() {
                this.setModalValues()
            }
        },
        methods: {
            async deleteTodo() {

                const todoId = this.todo._id

                try {
                    const data = await this.$http.delete(`/api/todo/${todoId}`)
                    
                    if (data.status === 200) {
                        this.$store.dispatch('todo/delete_todo', { 'idGroup': this.selectedGroup, 'idTodo': todoId})
                    }

                    this.$bvModal.hide('modal-edit-todo')

                } catch (err) {
                    console.log(err)
                }

            },
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()
                this.nameState = valid
                this.descState = valid
                return valid
            },
            setModalValues() {
                console.log(this.todo.name)
                if (this.groupPermissions === 0) this.modalTitle = this.todo.name
                else this.modalTitle = 'Edit todo'

                this.name = this.todo.name
                this.nameState = null
                this.description = this.todo.description
                this.status = this.todo.status
                this.descState = null
            },
            resetModal() {
                this.name = ''
                this.nameState = null
                this.description = ''
                this.status = ''
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
                
                this.editTodo()
            },
            async editTodo() {
                const todo = this.selectedGroup

                const payload = {
                    'todoGroupId': todo,
                    'name': this.name,
                    'description': this.description,
                    'status': this.status
                }
                console.log(payload)

                // const data = await this.$http.post('/api/todo', payload)

                // this.$store.dispatch('todo/add_todo_item', { 'todo_item': data.data, 'todo_group': todo})


                this.$bvModal.hide('modal-edit-todo')

            }
           
        }
    }
</script>

<style>
    
</style>
