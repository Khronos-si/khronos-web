<template>

    <b-modal
        id="modal-edit-calendar"
        ref="modal"
        title="Edit calendar"
        transition=""
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >   
        <form ref="form" @submit.stop.prevent="handleSubmit">

            <!-- CALENDAR -->
            <b-form-group
                label="Calendar"
                label-for="calendar-input"
                invalid-feedback="Calendar is required"
                :state="calendarState"
            >
                <v-select
                    v-model="calendarInput"
                    label="name"
                    :options="eventGroups"
                    placeholder="Choose group"
                    style="max-height: 100px;"
                >
                    <template #selected-option="group">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + color + '!important;'"></span> {{group.name}}
                    </template>
                    
                    <template #option="group">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + group.color + '!important;'"></span> {{group.name}}
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
            singleEvent(val) {
                if (val) this.resetModal()
            }
        },
        computed: {
            eventGroups() {
                const groups = this.$store.getters['calendar/getAllGroupsEdit']
               
                return groups
            },
            singleEvent() {

                if (!this.calendarInput) return null

                return this.$store.getters['calendar/getEventById'](this.calendarInput._id)
            }
        },
        data() {
            return {
                calendarState: null,
                calendarInput: null,
                optionColor: ['#7367F0', '#6EC193', '#53AFBE', '#FEB449', '#FE5C36', '#739BAA', '#F5C89F', '#8EBFB5', '#FEA6B0', '#95B2D1', '#42A48D', '#86415E', '#BC1654', '#F53435', '#dbb039', '#7F7F7F', '#58555A'],
                color: '',
                name: '',
                nameState: null,
                colorState: null
            }
        },
        methods: {
            checkIfEmailExist(email) {
                if (this.emailThatDoesntExist && this.emailThatDoesntExist.length > 0) {
                    for (const item of this.emailThatDoesntExist) {
                        if (item === email) return false
                    }
                }
                return true
            },
            checkFormValidity() {
                let valid = this.$refs.form.checkValidity()
                

                if ((this.color === '' || !this.color)) valid = false 

                this.nameState = valid
                this.colorState = valid
                this.calendarState = valid

                return valid
            },
            resetModal() {
                this.nameState = null
                this.colorState = null
                this.calendarState = null

                if (this.eventGroups && this.eventGroups.length > 0) {
                    this.calendarInput = this.eventGroups[0]
                } else {
                    this.calendarInput = this.singleEvent
                }

                console.log(this.calendarInput)

                if (this.calendarInput) {
                    this.name = this.calendarInput.name
                    this.color = this.calendarInput.color

                }

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
            async editGroup() {


                if (!this.calendarInput) return

                const payload = {
                    'id': this.calendarInput._id,
                    'name': this.name,
                    'color': this.color
                }
                console.log(payload)
                try {
                    const calendarID = this.calendarInput._id
                    const data = await this.$http.put(`/api/event/tag/${calendarID}`, payload)

                    if (data.status === 200) {
                        const newCalendar = data.data
                        newCalendar.selected = true
                        
                        this.$store.dispatch('calendar/edit_tag', { 'calendar_new': newCalendar, 'calendar_id': calendarID})
                    }

                    this.$bvModal.hide('modal-edit-calendar')
                    this.$printSuccess('Calendar was succesfully updated!')
                } catch (err) {
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

