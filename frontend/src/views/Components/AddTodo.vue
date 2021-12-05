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
    </b-modal>
</template>

<script>
    import { BModal, BFormInput, BFormGroup, BFormCheckbox  } from 'bootstrap-vue'


    export default {
        components: {
            BModal,
            BFormInput,
            BFormGroup,
            BFormCheckbox
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
                name: '',
                description: '',
                status: '',
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
                
                this.addTodo()
            },
            showModal() {
                this.$refs['my-modal'].show()
            },
            async addTodo() {
                const todo = this.selectedGroup

                const payload = {
                    'todoGroupId': todo,
                    'name': this.name,
                    'description': this.description,
                    'status': this.status
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
