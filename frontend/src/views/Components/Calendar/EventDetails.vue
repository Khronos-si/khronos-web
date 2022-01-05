<template>

    <b-modal
        id="modal-event-details"
        ref="modal"
        :title="modalTitle"
        @hidden="setModalValues"
        @ok="handleOk"
    >
        
        <quill-editor
            v-model="description"
            :class="isDark? 'darkEditor topBorder': ''"
            :options="bubbleEditor"
            :disabled='true'
        />

        <div class="mt-1">
            Event time: {{moment(this.startDate).format("HH:mm")}} - {{moment(this.endDate).format("HH:mm")}}
        </div>

        <template #modal-footer="{ ok, cancel }">
           
            <!-- <div v-if="groupPermissions == null || groupPermissions > 0"> -->

            <b-button class="btn-danger btn" @click="deleteTodo()">
                Delete
            </b-button>

            <b-button class="btn-secondary btn" @click="cancel()">
                Cancel
            </b-button>

            <button class="btn btn-primary" @click="ok()">
                OK
            </button>

            <button class="btn btn-primary" @click="hide()">
                Done
            </button>

        </template>

    </b-modal>
</template>

<script>
    import { BModal, BButton  } from 'bootstrap-vue'
    import { quillEditor } from 'vue-quill-editor'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'
    
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
            // vSelect,
            BModal,
            BButton,
            quillEditor
        },
        computed: {
            
            event() {
                return this.$store.getters['calendar/getEventById'](this.eventId)
            }
            
        },
        props: {
            eventId:{
                type: String
            }
        },
        data() {
            return {
                startDate: null,
                endDate: null,
                selectedTags: [],
                bubbleEditor:{
                    theme: 'bubble',
                    readOnly: true
                },
                modalTitle: '',
                name: '',
                description: ''
            }
        },
        watch:{
            event(val) {
                if (val) this.setModalValues()
            }
        },
        methods: {
            async deleteTodo() {

                const todoId = this.eventId

                console.log(this.eventId)

                try {
                    const data = await this.$http.delete(`/api/event/${todoId}`)
                    
                    if (data.status === 200) {
                        console.log('USPESNO')
                    }

                    this.$bvModal.hide('modal-event-details')
                    this.$printSuccess('Event was deleted!')

                } catch (err) {
                    console.log(err)
                    this.$printError('Error occured while deleting event!')
                }

                try {

                    const data = await this.$http.get('/api/event')

                    if (data.data && data.data.length === 0) {
                        throw 'Prislo je do napake'
                    }

                    for (const event of data.data) {
                        event.selected = true
                    }

                    this.$store.dispatch('calendar/update_events', { 'events': data.data})
                } catch (err) {
                    console.log(err)
                    this.$printError('Error fetching data!')
                }

            },
            setModalValues() {
                this.modalTitle = this.event.name
                this.description = this.event.description
                this.startDate = this.event.dates.start
                this.endDate = this.event.dates.end
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
                } catch (err) {
                    console.log(err)
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
