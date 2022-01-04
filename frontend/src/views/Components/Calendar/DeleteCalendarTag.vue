<template>

    <b-modal
        id="modal-delete-calendar-tag"
        ref="modal"
        title="Delete calendar"
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
                    v-model="calendarInput"
                    label="name"
                    :options="calendarTags"
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
            calendarInput() {
                this.resetModal()
            }
        },
        computed: {
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            },
            calendarTags() {
                return this.$store.getters['calendar/getAllGroups']
            }
        },
        data() {
            return {
                tagState: null,
                calendarInput: null
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
                if (!this.calendarInput && this.calendarTags) {
                    this.calendarInput = this.calendarTags[0]
                }

            },
            async refreshData() {
                try {

                    const data = await this.$http.get('/api/event')

                    if (data.data.length === 0) {
                        return
                    }

                    for (const event of data.data) {
                        event.selected = true
                    }

                    this.$store.dispatch('calendar/update_events', { 'events': data.data})
                } catch (err) {
                    this.$printError('Error while loading my groups')//todo
                    console.log(err)
                }
            },
            async deleteTag() {
                try {
                    console.log(this.calendarInput._id)
                    const tag = this.calendarInput._id
                    await this.$http.delete(`/api/event/tag/${tag}`)
                    this.$$printSuccess('Calendar was successfully deleted!')//todo
                } catch (err) {
                    this.$printError('Request was not sucesfull!')//todo
                    console.log(err)
                    return
                }

                this.calendarInput = null
                await this.refreshData()
                this.$printSuccess('Calendar was sucesfull deleted')
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

