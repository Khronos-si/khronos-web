<template>

    <b-modal
        id="modal-add-event"
        ref="modal-add-event"
        title="Add event"
        transition=""
        @show="enterModal"
        @hidden="resetModal"
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
                    <b-form-checkbox v-model="recurrences"></b-form-checkbox>
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
                        style="width: 150px;"
                        class="repeatOn"
                    >
                        <template #selected-option="option">
                            <div>
                                {{option.label}}
                            </div>
                        </template>
                    </v-select>
                </div>
                <div class="d-flex mt-1 align-items-center" style="height: 30px;">
                    <div class="mr-2 d-flex align-items-center">
                        Repeat On
                    </div>
                    <div class="d-flex" style="height:25px;">

                        <!-- MONDAY -->
                        <div>
                            <input type="checkbox" id="repeat_mon" v-model="repeatMon">
                            <label class="d-flex justify-content-center align-items-center" for="repeat_mon">M</label>
                        </div>

                        <!-- TUESDAY -->
                        <div>
                            <input type="checkbox" id="repeat_tue" v-model="repeatTue">
                            <label class="d-flex justify-content-center align-items-center" for="repeat_tue">T</label>
                        </div>

                        <!-- WEDNESDAY -->
                        <div>
                            <input type="checkbox" id="repeat_wed" v-model="repeatWed">
                            <label class="d-flex justify-content-center align-items-center" for="repeat_wed">W</label>
                        </div>

                        <!-- THURSDAY -->
                        <div>
                            <input type="checkbox" id="repeat_thu" v-model="repeatThu">
                            <label class="d-flex justify-content-center align-items-center" for="repeat_thu">T</label>
                        </div>

                        <!-- FRIDAY -->
                        <div>
                            <input type="checkbox" id="repeat_fri" v-model="repeatFri">
                            <label class="d-flex justify-content-center align-items-center" for="repeat_fri">F</label>
                        </div>

                        <!-- SATURDAY -->
                        <div>
                            <input type="checkbox" id="repeat_sat" v-model="repeatSat">
                            <label class="d-flex justify-content-center align-items-center" for="repeat_sat">S</label>
                        </div>

                        <!-- SUNDAY -->
                        <div>
                            <input type="checkbox" id="repeat_sun" v-model="repeatSun">
                            <label class="d-flex justify-content-center align-items-center" for="repeat_sun">S</label>
                        </div>
                    </div>
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
                            <date-picker :min-date="new Date()" v-model="endsOnDate" mode="date" class="datePicker p-0" :class="isDark == true? 'datePicker-dark': 'datePicker-light'" disabled>  
                                <template v-slot="{ inputValue, inputEvents }">
                                    <input
                                        style="height: 30px; width: 100px !important;"
                                        class="border px-2 py-1 rounded text-center"
                                        :class="{'calendarInput-dark': isDark, 'calendarInput-light': !isDark, 'disabledClass': endsOnType != 2}"
                                        :value="inputValue"
                                        placeholder="Enter date"
                                        v-on="inputEvents"
                                        :disabled="endsOnType != 2 ? '' : disabled"
                                    />
                                </template>
                            </date-picker>
                        </div>
                        <div class="mt-1 d-flex align-items-center" :class="endsOnType != 3? 'disabledClass' :''">
                            <b-form-radio v-model="endsOnType" name="ends-on-type" value="3">After</b-form-radio>
                            <input type="number" min="1" max="20" class="ml-2 mr-1 text-center" placeholder="1" style="height: 30px; width: 40px; background: transparent; border: 1px solid #404656; border-radius: 5px; color:white;" :disabled="endsOnType != 3 ? '' : disabled"> 
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
    import { BModal, BFormInput, BFormGroup, BFormCheckbox, BFormRadio   } from 'bootstrap-vue'
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
                
                // if ((this.color === '' || !this.color)) valid = false 

                if (this.sharedWith && this.sharedWith.length > 0 && (this.permissions === '' || !this.permissions)) valid = false
                    
                this.nameState = valid
                this.permState = valid
                this.colorState = valid
                this.calState = valid
                this.descState = valid

                return valid
            },
            enterModal() {
                this.resetModal()
            },
            resetModal() {
                this.recurrences = null
                this.color = ''
                this.name = ''
                this.nameState = null
                this.permissions = ''
                this.sharedWith = ''
                this.permState = null
                this.colorState = null
            },
            clicked(bvModalEvt) {
                console.log(bvModalEvt)
                console.log('TEST 1')
            },
            modalHidden(bvModalEvt) {
                console.log(bvModalEvt)
                // console.log('TEST')
                // bvModalEvt.preventDefault()
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

                const payload = {
                    'name': this.name,
                    'description': this.description,
                    // 'color': this.color,
                    'repeatType': -1,
                    'repeatFor': -1,
                    'sharedWith': [],
                    'start': this.dateStart,
                    'end': this.dateEnd,
                    'eventTagId': this.calendarInput

                }

                
                try {
                    const data = await this.$http.post('/api/event', payload)
                
                    console.log(data)
                    const newGroup = data.data

                    this.$store.dispatch('calendar/add_event', { 'new_group': newGroup})

                    this.$bvModal.hide('modal-add-event')
                } catch (err) {
                    console.log(err.data)
                }
               

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

    .datePicker-dark .vc-popover-content-wrapper{
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

