<template>

    <b-modal
        id="modal-add-event"
        ref="modal-add-event"
        title="Add event"
        transition=""
        @show="enterModal"
        @hidden="modalHidden"
        @ok="handleOk"
    >   
        <form ref="form" @submit.stop.prevent="handleSubmit">

            <!-- NAME -->
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

            <!-- DESCRIPTION -->
            <b-form-group
                label="Description"
                label-for="desc-input"
                :state="descState"
                invalid-feedback="Description is required"
            >
                <b-form-input
                    id="desc-input"
                    v-model="description"
                    required
                ></b-form-input>
            </b-form-group>

            <!-- START DATE -->
            <b-form-group
                label="Start Date"
                label-for="date-start-input"
                invalid-feedback="Start date is required"
                :state="permState"
            >
                <!-- START DATE WITH TIME PICKER -->
                <date-picker v-model="dateStart" mode="dateTime" class="datePicker w-100 p-0" :minute-increment="5" :class="isDark == true? 'datePicker-dark': 'datePicker-light'" v-if="!allDay" is24hr>  
                    <template v-slot="{ inputValue, inputEvents }">
                        <input
                            class="border px-2 py-1 rounded"
                            :class="isDark == true ? 'calendarInput-dark': 'calendarInput-light'"
                            :value="inputValue"
                            placeholder="Enter start date"
                            v-on="inputEvents"
                        />
                    </template>
                </date-picker>

                <!-- START DATE ONLY -->
                <date-picker v-model="dateStart" mode="date" class="datePicker w-100 p-0" :class="isDark == true? 'datePicker-dark': 'datePicker-light'" v-if="allDay">  
                    <template v-slot="{ inputValue, inputEvents }">
                        <input
                            class="border px-2 py-1 rounded"
                            :class="isDark == true ? 'calendarInput-dark': 'calendarInput-light'"
                            :value="inputValue"
                            placeholder="Enter start date"
                            v-on="inputEvents"
                        />
                    </template>
                </date-picker>
            </b-form-group>

            <!-- END DATE -->
            <b-form-group
                label="End Date"
                label-for="date-end-input"
                invalid-feedback="End date is required"
                :state="permState"
            >
                <div v-if="!recurrences">
                    <!-- END DATE WITH TIME PICKER -->
                    <date-picker :min-date="dateStart" v-model="dateEnd" mode="dateTime" class="datePicker w-100 p-0" :class="isDark == true? 'datePicker-dark': 'datePicker-light'" v-if="!allDay" :minute-increment="5" is24hr>  
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                                class="border px-2 py-1 rounded"
                                :class="isDark == true ? 'calendarInput-dark': 'calendarInput-light'"
                                :value="inputValue"
                                placeholder="Enter start date"
                                v-on="inputEvents"
                            />
                        </template>
                    </date-picker>

                    <!-- END DATE ONLY -->
                    <date-picker :min-date="dateStart" v-model="dateEnd" mode="date" class="datePicker w-100 p-0" :class="isDark == true? 'datePicker-dark': 'datePicker-light'" v-if="allDay">  
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                                class="border px-2 py-1 rounded"
                                :class="isDark == true ? 'calendarInput-dark': 'calendarInput-light'"
                                :value="inputValue"
                                placeholder="Enter start date"
                                v-on="inputEvents"
                            />
                        </template>
                    </date-picker>

                </div>
               
                <!-- TIME PICKER ONLY -->
                <date-picker v-model="dateEnd" mode="time" class="datePicker w-100 p-0" :class="isDark == true? 'datePicker-dark': 'datePicker-light'" v-if="recurrences" is24hr>  
                </date-picker>
            </b-form-group>

            <!-- CHECKBOX -->
            <div class="d-flex">

                <!-- CHECKBOX ALL DAY -->
                <b-form-group
                    label="All Day"
                    label-for="all-day-checkbox"
                >
                    <b-form-checkbox id="checkbox-1"
                                     v-model="allDay"></b-form-checkbox>
                </b-form-group>

                <!-- CHECKBOX RECURRENCE-->
                <b-form-group
                    class="ml-2"
                    label="Recurrences"
                    label-for="recurrences-checkbox"
                >
                    
                    <b-form-checkbox v-model="recurrences" @change="setEndDate()"></b-form-checkbox>
                </b-form-group>
            </div>

            <!-- RECURRENCES -->
            <div class="mb-2" v-if="recurrences">
                <!-- <div>
                    RECURRENCES
                </div> -->
                <div class="d-flex align-items-center">
                    Repeat every
                    <input v-model="repeatTimeValue" type="number" placeholder="1" min="1" step="3" class="ml-2 mr-1 text-center" style="height: 37px !important; width: 40px; background: transparent; border: 1px solid #404656; border-radius: 5px; color:white;"> 
                    <v-select
                        v-model="repeatTime"
                        placeholder="Month"
                        :options="optionRepeat"
                        style="width: 200px;"
                        class="repeatOn"
                    >
                        <template #selected-option="option">
                            <div>
                                {{option.label}}
                            </div>
                        </template>
                    </v-select>
                </div>
                <div class="d-flex mt-1 align-items-center" style="height: 30px;" v-if="repeatTime && repeatTime.label === 'Week'">
                    <div class="mr-2 d-flex align-items-center">
                        Repeat On
                    </div>
                    <div class="d-flex" style="height:25px;">
                                
                        <!-- MONDAY-->
                        <div>
                            <input type="checkbox" id="checkbox_monday" v-model="selectedDayMonday">
                            <label class="d-flex justify-content-center align-items-center" for="checkbox_monday">M</label>
                        </div>

                        <!-- TUESDAY -->
                        <div>
                            <input type="checkbox" id="checkbox_tuesday" v-model="selectedDayTuesday">
                            <label class="d-flex justify-content-center align-items-center" for="checkbox_tuesday">T</label>
                        </div>

                        <!-- WEDNESDAY -->
                        <div>
                            <input type="checkbox" id="checkbox_wednesday"  v-model="selectedDayWednesday">
                            <label class="d-flex justify-content-center align-items-center" for="checkbox_wednesday">W</label>
                        </div>

                        <!-- THURSDAY -->
                        <div>
                            <input type="checkbox" id="checkbox_thursday" v-model="selectedDayThursday">
                            <label class="d-flex justify-content-center align-items-center" for="checkbox_thursday">T</label>
                        </div>

                        <!-- FRIDAY -->
                        <div>
                            <input type="checkbox" id="checkbox_friday" v-model="selectedDayFriday">
                            <label class="d-flex justify-content-center align-items-center" for="checkbox_friday">F</label>
                        </div>

                        <!-- SATURDAY -->
                        <div>
                            <input type="checkbox" id="checkbox_saturday" v-model="selectedDaySaturday">
                            <label class="d-flex justify-content-center align-items-center" for="checkbox_saturday">S</label>
                        </div>

                        <!-- SUNDAY -->
                        <div>
                            <input type="checkbox" id="checkbox_sunday" v-model="selectedDaySunday">
                            <label class="d-flex justify-content-center align-items-center" for="checkbox_sunday">S</label>
                        </div>
                    </div>
                </div>

                <div class="d-flex align-items-center mt-2" v-if="repeatTime && repeatTime.label === 'Month'">
                    Repeat on days:
                    <v-select
                        v-model="repeatOnDays"
                        placeholder="Enter days [1-31]"
                        style="width: 240px;"
                        class="ml-1 repeatOn"
                        multiple
                        taggable
                    >
                        <!-- <template #selected-option="option">
                            <div style="display: flex; align-items: baseline;" :class="option.label > 0 && option.label <= 31? '':'emailDoesntExist'">
                                {{option.label}}
                            </div>
                        </template> -->
                        <span slot="no-options" >
                            Add days of month from range [1-31] or last (for ever last day of month)
                        </span>
                    </v-select>
                </div>

               
                <div class="mt-1">
                    Ends
                </div>
                <div class="mt-1">
                    <b-form-group>
                        <div> 
                            <b-form-radio v-model="endsOnType" name="ends-on-type" value="1">Never</b-form-radio>
                        </div>
                        <div class="mt-1 d-flex align-items-center" >
                            <b-form-radio style="margin-right: 35px;" v-model="endsOnType" name="ends-on-type" value="2">On</b-form-radio>
                            <date-picker :min-date="new Date()" v-model="endsOnDate" mode="date" class="datePicker p-0" :class="isDark == true? 'datePicker-dark': 'datePicker-light'">  
                                <template v-slot="{ inputValue, inputEvents }">
                                    <input
                                        style="height: 30px; width: 100px !important;"
                                        class="border px-2 py-1 rounded text-center"
                                        :class="{'calendarInput-dark': isDark, 'calendarInput-light': !isDark, 'disabledClass': endsOnType != 2}"
                                        :value="inputValue"
                                        placeholder="Enter date"
                                        v-on="inputEvents"
                                    />
                                </template>
                            </date-picker>
                        </div>
                        <div class="mt-1 d-flex align-items-center" :class="endsOnType != 3? 'disabledClass' :''">
                            <b-form-radio v-model="endsOnType" name="ends-on-type" value="3">After</b-form-radio>
                            <!-- :disabled="endsOnType != 3 ? '' : disabled" -->
                            <input type="number" min="1" max="20" class="ml-2 mr-1 text-center" placeholder="1" v-model="maxOccurrences" style="height: 30px; width: 40px; background: transparent; border: 1px solid #404656; border-radius: 5px; color:white;" > 
                            Occurrences
                        </div>
                    </b-form-group>
                </div>
                
            </div>
            

            <!-- CALENDAR GROUP -->
            <b-form-group
                label="Calendar"
                label-for="cal-select"
                invalid-feedback="Calendar is required"
                :state="calState"
            >
                <v-select
                    v-model="calendarInput"
                    :options="calendarGroups"
                    placeholder="Choose calendar"
                    :reduce="ele => ele._id"
                    label="name"
                >
                    <template #selected-option="option">
                        <div style="display: flex; align-items: baseline;">
                            <span class="bullet bullet-sm mr-1" :style="'background:' + option.color + '!important;'"></span>{{option.name}}
                        </div>
                    </template>

                    <template #option="option">
                        <span class="bullet bullet-sm mr-1" :style="'background:' + option.color + '!important;'"></span> {{option.name}}
                    </template>

                </v-select>
            </b-form-group>

            <!-- PERMISSIONS -->
            <b-form-group
                label="Permisions"
                label-for="perm-input"
                invalid-feedback="Permisions are required"
                :state="permState"
                v-if="sharedWith.length > 0"
            >
                <v-select
                    v-model="permissions"
                    label="title"
                    :options="optionPermissions"
                    placeholder="Choose permissions"
                />
            </b-form-group>

            <!-- SHARED WITH -->
            <b-form-group
                label="Shared with"
                label-for="shared-select"
            >
                <v-select
                    id="shared-select"
                    v-model="sharedWith"
                    multiple
                    taggable
                    push-tags
                    placeholder="Add Options"
                >
                    <template #selected-option="option">
                        <div style="display: flex; align-items: baseline;" :class="checkIfEmailExist(option.label)? '':'emailDoesntExist'">
                            {{option.label}}
                        </div>
                    </template>
                </v-select>
            </b-form-group>
        </form>
    </b-modal>
</template>

<script>
    import { DatePicker } from 'v-calendar'
    import { BModal, BFormInput, BFormGroup, BFormCheckbox, BFormRadio    } from 'bootstrap-vue'
    import vSelect from 'vue-select'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'

    // import 'vue-select/dist/vue-select.css'
    // import 'vue-select/src/scss/vue-select.scss'
    // import 'vue-select/dist/vue-select.css';


    export default {
        components: {
            BFormRadio,
            BModal,
            BFormInput,
            BFormGroup,
            vSelect,
            DatePicker,
            BFormCheckbox
        },
        props:{
            calendarDate:{
                type: Date
            }
        },
        computed: {
            calendarGroups() {
                return this.$store.getters['calendar/getAllGroups']
            },
            todos() {
                return this.$store.getters['todo/getTodos'](this.selectedGroup)
            },
            selectedGroup() {
                return this.$store.getters['todo/getSelectedGroup']
            }
        },
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        },
        data() {
            return {
                repeatOnDays: [],
                maxOccurrences: null,
                selectedDays: null,
                selectedDayMonday: null,
                selectedDayTuesday: null,
                selectedDayWednesday: null,
                selectedDayThursday: null,
                selectedDayFriday: null,
                selectedDaySaturday: null,
                selectedDaySunday: null,
                endsOnDate: new Date(),
                repeatTimeValue: null,
                endsOnType: 1,
                repeatTime: null,
                optionRepeat: [{'label': 'Day'}, {'label': 'Week'}, {'label': 'Month'}, {'label': 'Year'}],
                stop_after: null,
                recurrences: null,
                descState: null,
                description: '',
                calState: null,
                calendarInput: null,
                allDay: false,
                dateStart: null,
                dateEnd: null,
                optionColor: ['#7367F0', '#6EC193', '#53AFBE', '#FEB449', '#FE5C36', '#739BAA', '#F5C89F', '#8EBFB5', '#FEA6B0', '#95B2D1', '#42A48D', '#86415E', '#BC1654', '#F53435', '#FBF37C', '#7F7F7F', '#58555A'],
                optionPermissions: [{ title: 'Read', permisson: 0 }, { title: 'Read/Edit', permisson: 1 }, { title: 'Read/Edit/Delete', permisson: 2}],
                color: '',
                name: '',
                permissions: '',
                sharedWith: [],
                nameState: null,
                permState: null,
                colorState: null,
                emailThatDoesntExist: []
            }
        },
        watch:{
            calendarDate(val) {
                this.dateStart = val
                this.dateEnd = val
            },
            dateStart(val) {
                if (this.recurrences) {
                    this.dateEnd = val
                }
            },
            repeatOnDays(val) {

                if (val[val.length - 1].toLowerCase() === 'last') {
                    val[val.length - 1] = 'Last day of month' 
                    return
                }

                if (val[val.length - 1] <= 0 || val[val.length - 1] > 31) val.splice(val.length - 1, 1)
            }
        },
        methods: {
            setEndDate() {
                if (this.recurrences) {
                    this.dateEnd = this.dateStart
                }
            },
            checkIfEmailExist(email) {
                if (this.emailThatDoesntExist && this.emailThatDoesntExist.length > 0) {
                    for (const item of this.emailThatDoesntExist) {
                        if (item === email) return false
                    }
                }
                return true
            },
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()
                
                // if ((this.color === '' || !this.color)) valid = false 

                // if (this.sharedWith && this.sharedWith.length > 0 && (this.permissions === '' || !this.permissions)) valid = false
                    
                this.nameState = valid
                this.permState = valid
                this.colorState = valid
                this.calState = valid
                this.descState = valid

                return true
            },
            enterModal() {
                this.resetModal()
            },
            resetModal() {
                this.recurrences = null
                this.color = ''
                this.name = ''
                this.description = ''
                this.nameState = null
                this.allDay = false
                this.permissions = ''
                this.sharedWith = ''
                this.permState = null
                this.colorState = null
                this.endsOnDate = new Date()
                this.repeatTime = null
                this.emailThatDoesntExist = []
                this.selectedDayTuesday = false
                this.selectedDayMonday = false
            },
            clicked(bvModalEvt) {
                console.log(bvModalEvt)
                console.log('TEST 1')
            },
            modalHidden() {
                this.dateStart = null
                this.dateEnd = null
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
                
                this.addGroup()
            },
            showModal() {
                this.$refs['my-modal'].show()
            },
            async addGroup() {

                this.selectedDays = []


                if (this.selectedDayMonday) this.selectedDays.push(2)
                if (this.selectedDayTuesday) this.selectedDays.push(3)
                if (this.selectedDayWednesday) this.selectedDays.push(4)
                if (this.selectedDayThursday) this.selectedDays.push(5)
                if (this.selectedDayFriday) this.selectedDays.push(6)
                if (this.selectedDaySaturday) this.selectedDays.push(7)
                if (this.selectedDaySunday) this.selectedDays.push(1)

                const dates = {
                    'start': this.dateStart,
                    'monthlyInterval': 1,
                    'days': [1, -1]
                }

                console.log(JSON.stringify(dates))

                if (this.selectedDays.length > 0 && this.recurrences) dates.weekdays = this.selectedDays

                console.log(this.repeatTime)

                if (this.repeatTime && this.repeatTime.label === 'Day') {
                    dates.dailyInterval = this.repeatTimeValue
                } else if (this.repeatTime && this.repeatTime.label === 'Week') {
                    dates.weeklyInterval = this.repeatTimeValue
                } else if (this.repeatTime && this.repeatTime.label === 'Month') {
                    dates.monthlyInterval = this.repeatTimeValue
                } else if (this.repeatTime && this.repeatTime.label === 'Year') {
                    dates.yearlyInterval = this.repeatTimeValue
                }

                console.log('TEST')
                console.log(this.endsOnType === '2')

                if (!this.recurrences) {
                    dates.end = this.dateEnd
                }
                
                if (this.recurrences && this.endsOnType === '2') {
                    console.log('SM KLE')
                    dates.end = this.endsOnDate
                }

                if (this.recurrences && this.repeatTime && this.endsOnType === '3' && this.repeatTime.label === 'Week') {

                    if (this.selectedDays.length > 0 && this.recurrences) { // this.maxOccurrences
                        const currentDayOfWeek = this.dateStart.getDay()
                        let daysToFirstEvent = -1
                        let elementsHigher = 0

                        console.log('Current day of week')
                        console.log(currentDayOfWeek)

                        for (const key in this.selectedDays) {

                            if (this.selectedDays[key] - 1 === 0 &&  currentDayOfWeek > 0) {
                                elementsHigher++
                            }

                            if (this.selectedDays[key] - 1 >= currentDayOfWeek) {
                                elementsHigher++
                            }
                        }

                        daysToFirstEvent = 7 - (currentDayOfWeek - 1)

                        const numberOfEventsInWeek = this.selectedDays.length
                        const numberOfWeeks = parseInt((this.maxOccurrences - elementsHigher) / numberOfEventsInWeek)
                        const numberOfEventsInLastWeek = (this.maxOccurrences - elementsHigher) % this.selectedDays.length

                        let daysToAdd = (numberOfWeeks * 7)

                        console.log('DAYS TO BEGG')
                        console.log(daysToAdd)

                        if ((this.maxOccurrences - elementsHigher) % numberOfEventsInWeek === 0) {
                            if (this.selectedDays[this.selectedDays.length - 1] !== 1) {
                                daysToAdd -= (7 - (this.selectedDays[this.selectedDays.length - 1] - 1))
                                console.log('Days to remove')
                                console.log((7 - (this.selectedDays[this.selectedDays.length - 1] - 1)))
                            }
                        }

                        console.log(this.selectedDays)
                        
                        // console.log(this.selectedDays[this.selectedDays.length - 1])
                        console.log('DAYS TO ADD BEFORE')
                        console.log(daysToAdd)

                        if (numberOfEventsInLastWeek > 0) {
                            if (this.selectedDays[numberOfEventsInLastWeek - 1] === 2) daysToAdd += 1
                            else if (this.selectedDays[numberOfEventsInLastWeek - 1] === 1) daysToAdd += 6
                            else daysToAdd += this.selectedDays[numberOfEventsInLastWeek - 1] - 1
                        }
                        
                        console.log('EVENT IN LAST WEEK')
                        console.log(numberOfEventsInLastWeek)
                        console.log('ST TEDNOV')
                        console.log(numberOfWeeks)
                        console.log('EVNTI NAD DNEVOM')
                        console.log(elementsHigher)
                        console.log('DAY TO FIRST EVENT')
                        console.log(daysToFirstEvent)
                        console.log('DAYS TO ADD')
                        console.log(daysToAdd)


                        const newDate = new Date(this.dateStart)
                        newDate.setDate(newDate.getDate() + (daysToAdd + daysToFirstEvent - 1))
                        console.log(newDate)
                        return
                    }


                    dates.end = this.endsOnDate
                }

                const payload = {
                    'name': this.name,
                    'description': this.description,
                    'sharedWith': [],
                    dates,
                    'eventTagId': this.calendarInput
                }

                console.log(payload)

                
                // try {
                //     const data = await this.$http.post('/api/event', payload)
                
                //     console.log(data)
                //     const newEvent = data.data

                //     this.$store.dispatch('calendar/add_event', { 'tag_id': this.calendarInput, 'event': newEvent})

                //     this.$bvModal.hide('modal-add-event')
                // } catch (err) {
                //     this.$printError('Error while trying to add calendar')
                //     console.log(err)
                // }
               

            }
           
        }
    }
</script>

<style scoped>
    .disabledClass{
        color: gray !important;
    }

    input[type="checkbox"]:not(:checked), 
    input[type="checkbox"]:checked {
        position: absolute;
        left: -9999%;
    }
    input[type="checkbox"] + label {
        width: 25px;
        height: 25px;
        margin-right: 10px;
        font-size: 0.8rem;
        display: inline-block;
        cursor: pointer;
        border: 1px solid grey;
        border-radius: 50%;
        background-color: #2E3134;
        color: white;
        margin-bottom: 10px;
    }
    input[type="checkbox"]:checked + label {
        border: none;
        color: white;
        background-color: #53afbe;
    }
</style>

<style lang="scss">
    @import '~@core/scss/vue/libs/vue-select.scss';

    .emailDoesntExist{
        color: #fe5c36 !important;
    }

    button.vs__deselect{
    fill: rgb(32, 31, 31) !important;
    }

    .datePicker-dark .vc-pane-container {
        border: none !important;
        background: #2E3134 !important;
    }
    .datePicker .vc-popover-content{
        border: none !important;
    }
    
   
    .datePicker-light .vc-popover-content-wrapper{
        border: none !important; 
        .vc-day{
            color: #53afbe !important;
        }
        .vc-month{
            color: grey !important;
        }
        .vc-weekday{
            color: #feb449 !important;
        }
        .vc-year{
            color: #6ec193 !important;
        }
        .vc-title{
            color: #6ec193 !important;
        }
        .vc-select > select{
            border: none;
        // border: 1px solid #b4b7bd;
        background: #f8f8f8 ;
        color: grey;
        }
        .vc-am-pm{
            color: white !important;
            background: #f8f8f8;
        }
        .vc-am-pm .active{
            background: #53afbe !important;
        }
        .vc-am-pm button{
            color: white !important;
        }

        span.vc-day-content.is-disabled{
            color: #fe5c36 !important;
        }   
        span.vc-day-content.is-disabled:hover{
            background: transparent !important;
            cursor: not-allowed;
            // color: #fe5c36 !important;
        }
        span.vc-day-content.is-disabled:focus{
            background: transparent !important;
            font-weight: 600;
            // color: #fe5c36 !important;
        } 
        
    }

    .datePicker-dark.vc-container.vc-blue{

        *::-webkit-scrollbar {
            width: 2px;
        }

        /* Track */
        *::-webkit-scrollbar-track {
            background: transparent; 
        }
    
        /* Handle */
        *::-webkit-scrollbar-thumb {
            background: #888; 
        }

        /* Handle on hover */
        *::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }


        border: 1px solid #3b4253 !important; 
        background: #2E3134 ;

        .vc-day{
            color: #53afbe !important;
        }
        .vc-month{
            color: white !important;
        }
        .vc-weekday{
            color: #feb449 !important;
        }
        
        .vc-select > select{
            border: none;
        // border: 1px solid #b4b7bd;
            background: #2E3134 ;
            color: white;
            
        }
        .vc-time > span{
            border: none;
            background: #2E3134 ;
            color: white;
        }

        span.vc-day-content.is-disabled{
            color: #fe5c36 !important;
        }   
        span.vc-day-content.is-disabled:hover{
            background: transparent !important;
            cursor: not-allowed;
            // color: #fe5c36 !important;
        }
        span.vc-day-content.is-disabled:focus{
            background: transparent !important;
            font-weight: 600;
            // color: #fe5c36 !important;
        } 
        
    }

    .datePicker-dark .vc-popover-content-wrapper{

        *::-webkit-scrollbar {
            width: 2px;
        }

        /* Track */
        *::-webkit-scrollbar-track {
            background: transparent; 
        }
    
        /* Handle */
        *::-webkit-scrollbar-thumb {
            background: #888; 
        }

        /* Handle on hover */
        *::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }

        border: none !important; 
        .vc-day{
            color: #53afbe !important;
        }
        .vc-month{
            color: white !important;
        }
        .vc-weekday{
            color: #feb449 !important;
        }
        
        .vc-select > select{
            border: none;
        // border: 1px solid #b4b7bd;
        background: #2E3134 ;
        color: white;
        }
        .vc-am-pm{
            color: white !important;
            background: #2E3134;
        }
        .vc-am-pm .active{
            background: #53afbe !important;
        }
        .vc-am-pm button{
            color: white !important;
        }

        span.vc-day-content.is-disabled{
            color: #fe5c36 !important;
        }   
        span.vc-day-content.is-disabled:hover{
            background: transparent !important;
            cursor: not-allowed;
            // color: #fe5c36 !important;
        }
        span.vc-day-content.is-disabled:focus{
            background: transparent !important;
            font-weight: 600;
            // color: #fe5c36 !important;
        } 
        
    }
    .calendarInput-light{
        width: 100% !important;
        background: white !important;
        color: #b4b7bd !important;
        padding: 8px !important;
    }

    .calendarInput-dark{
        width: 100% !important;
        background: #2E3134 !important;
        color: #b4b7bd !important;
        padding: 8px !important;
    }
</style>

