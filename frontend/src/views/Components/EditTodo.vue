<template>

    <b-modal
        id="modal-edit-todo"
        ref="modal"
        :title="modalTitle"
        @hidden="setModalValues"
        @ok="handleOk"
    >
        <div>
            <form ref="form" @submit.stop.prevent="handleSubmit" v-if="groupPermissions == null | groupPermissions > 0">
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

                <!-- <b-form-group
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
                </b-form-group> -->

                <b-form-group
                    label="Description"
                    label-for="desc-input"
                    invalid-feedback="Description is required or it is to short"
                    :state="descState"
                >
                    <quill-editor
                        v-model="description"
                        :options="editorOption"
                        :class="isDark? 'darkEditor': ''"
                        :state="descState"
                        required
                    />
                </b-form-group>
                <b-form-group
                    label="Status"
                    label-for="stat-input"
                >
                    <b-form-checkbox
                        id="stat-input"
                        v-model="status"
                    ></b-form-checkbox>
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
        </div>
        

        <div v-if="groupPermissions == 0 && todo">
            <!-- <div style="font-size: 1.5rem;">
                {{todo.name}}
            </div> -->

            <div class="my-2">
                <quill-editor
                    v-model="description"
                    :class="isDark? 'darkEditor topBorder': ''"
                    :options="bubbleEditor"
                    :disabled='true'
                />
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
    import { quillEditor } from 'vue-quill-editor'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'
    import vSelect from 'vue-select'
    
    // eslint-disable-next-line
    import 'quill/dist/quill.core.css'
    // eslint-disable-next-line
    import 'quill/dist/quill.snow.css'
    // eslint-disable-next-line
    import 'quill/dist/quill.bubble.css'

    export default {
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        },
        components: {
            vSelect,
            BModal,
            BFormInput,
            BFormGroup,
            BButton,
            BFormCheckbox,
            quillEditor
        },
        computed: {
            groupPermissions() {
                console.log(this.selectedGroup)
                console.log(this.$store.getters['todo/getGroupPremissions'](this.selectedGroup))
                return this.$store.getters['todo/getGroupPremissions'](this.selectedGroup)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            },
            tags() {
                return this.$store.getters['todo/getAllTags']
            },
            todoGroups() {
                return this.$store.getters['todo/getAllGroups']
            }
        },
        props: {
            todo:{
                type: Object
            }
        },
        data() {
            return {
                selectedTags: [],
                bubbleEditor:{
                    theme: 'bubble',
                    readOnly: true
                },
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                            [{ 'color': [] }, { 'background': [] }]
                        ]
                    },
                    placeholder: 'Enter description...',
                    readOnly: true,
                    theme: 'snow'
                },
                modalTitle: '',
                name: '',
                description: '',
                status: '',
                nameState: null,
                descState: null
            }
        },
        watch:{
            todo(val) {
                if (val) this.setModalValues()
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
                let valid = this.$refs.form.checkValidity()
                this.nameState = valid
                this.descState = valid

                if (!this.description || this.description.length <= 10) {
                    this.descState = false
                    valid = false
                } 

                return valid
            },
            setModalValues() {
                if (this.groupPermissions === 0) this.modalTitle = this.todo.name
                else this.modalTitle = 'Edit todo'
                this.name = this.todo.name
                this.nameState = null
                this.description = this.todo.description
                this.status = this.todo.status
                this.descState = null
                this.selectedTags = this.todo.tags
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
                const group = this.selectedGroup
                const todoId = this.todo._id

                console.log(this.status)

                const payload = {
                    'name': this.name,
                    'description': this.description,
                    'status': this.status,
                    'tags': this.selectedTags
                }
                try {
                    const data = await this.$http.put(`/api/todo/${todoId}`, payload)

                    this.$store.dispatch('todo/edit_todo', { 'idGroup': group, 'idTodo': todoId, 'todo_new': data.data})

                    this.$bvModal.hide('modal-edit-todo')
                    this.$printSuccess('Todo was successfully changed!')
                } catch (err) {
                    console.log(err)
                    this.$printError('Error occured when editing todo!')
                }
                

            }
           
        }
    }
</script>

<style lang="scss">
    .darkEditor .ql-toolbar.ql-snow{
        border: 1px solid #3b4253 !important;
    }
    .darkEditor .ql-container{
        border: none !important;
    }
    .ql-editor {
        height: 35vh;
        overflow-y: scroll;
    }
    .darkEditor .ql-editor {
        border-left: 1px solid #3b4253 !important;
        border-right: 1px solid #3b4253 !important;
        border-bottom: 1px solid #3b4253 !important;
    }

    .topBorder .ql-editor {
        border-top: 1px solid #3b4253 !important;
        
    }

    .darkEditor .ql-toolbar .ql-stroke {
        fill: none;
        stroke: #fff;
    }

    .darkEditor .ql-toolbar .ql-fill {
        fill: #fff;
        stroke: none;
    }

    .darkEditor .ql-toolbar .ql-picker {
        color: #fff;
    }
</style>
