<template>
    <div class="d-inline text-center section">
        <div class="m-0 p-0" style="float: left" >
            <!-- border-right: 1px solid rgba(110,110,110,0.3); -->
            <div class="p-0  m-0 py-2 px-0" style="height: 75vh !important; "> 
                <!-- v-if="groupPermissions == null || groupPermissions > 0" -->
                <div class="px-2 pb-1 d-flex justify-content-center" >
                    <b-button class="btn btn-primary btn-custom btn-block px-3"  v-b-modal.modal-add-event >Add Event</b-button>
                </div>
                <div class="d-flex justify-content-between px-2" style="padding-bottom: 5px;">
                    <div>
                        My Calendars
                    </div>
                    <div class="d-flex" style="cursor: pointer;">
                        <div  v-on:click="addTag()">
                            <plus-icon size="1.4x" class="custom-class"></plus-icon>
                        </div>
                        <div>
                            <b-dropdown id="dropdown-1" text="Dropdown Button" toggle-class="dropdown-custom p-0" class="my-0 p-0 dropdown-custom" :boundary="cardDiv" no-caret>
                                <template #button-content>
                                    <more-vertical-icon size="1.4x" :class="isDark? '': 'iconColorWhite'" class="p-0 custom-class"></more-vertical-icon>
                                </template>
                                <b-dropdown-item-button @click="editCalendar()" class="w-100" style="width: 100% !important;">Edit</b-dropdown-item-button>
                                <b-dropdown-item-button @click="deleteCalendar()">Delete</b-dropdown-item-button>
                            </b-dropdown>
                        </div>
                    </div>
                </div>
                <div class="mt-1" v-if="eventGroups && eventGroups.length > 0">
                    <!-- :class="(selectedGroup == group._id)? 'selectedGroup': 'normalGroup'" -->
                    <!-- v-for="(group,id) in todoGroups" :key="'button_todo_group_' + id" v-on:click="setGroup(group._id)" -->
                    <div v-for="(event, id) in eventGroups" :key="'Calendar_event_' + id" class="pl-2 pr-2 d-flex justify-content-between test"  :style="'cursor: pointer; --color:' + event.color + ';'">
                        <div class="d-flex">
                            <!-- group.color -->
                            <!-- <span class="bullet bullet-sm mr-1" :style="'background: green !important;'"></span> -->
                            <b-form-checkbox v-model="event.selected" class="test" selected></b-form-checkbox>
                            {{event.name}}
                        </div>
                        <!-- v-if="userEmail != group.owner.email" -->
                        <div  >
                            <!-- {{group.owner.email}} -->
                            <!-- <span class="badge badge-pill badge-warning ml-1">Shared</span> -->
                        <!-- <settings-icon size="1.4x" class="custom-class"  style="color: #434343"></settings-icon> -->
                        <!-- <more-vertical-icon size="1.4x" class="custom-class" style="color: #434343"></more-vertical-icon> -->
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="m-0 p-0" style="overflow-y: auto; overflow-x: hidden; max-height: 75vh;">
            
            <div v-if="modelConfig">
                <calendar
                    class="max-w-full p-1 " :class="isDark? 'theme-default-dark custom-calendar-dark' : 'theme-default-white custom-calendar-light'"
                    :masks="masks"
                    :attributes="events"
                    disable-page-swipe
                    is-expanded
                >
                    <template v-slot:day-content="{ day, attributes }">
                        <div class="overflow-scroll py-0.5 px-md-1" :class="isDark? 'card-dark': 'card-white'" style="padding-top: 5px;" @click="addCalendarOnDay(day.date)">
                            <div class="d-flex align-items-center justify-content-center" style="margin-bottom: 5px;" :class="sameDate(day.date, new Date())? 'bg-circle':''">
                                <div class="p-0" >{{ day.day }} </div>
                            </div>
                            <div class="">
                                <div
                                    v-for="attr in attributes"
                                    :key="attr.customData._id"
                                    class="text-xs rounded text-center text-black bg-custom text preventUserSelection"
                                    style="padding-left: 5px !important; padding-right: 5px !important; margin-bottom: 5px; cursor: pointer;"
                                    :style="'--color:' + attr.customData.color + ';'"
                                    v-on:click="showEvent($event,attr.customData._id)"
                                >
                                    {{ attr.customData.name}}
                                </div>
                            </div>
                    
                        </div>
                    </template>
                </calendar>
            </div>
            
        </div>

        <add-event :calendarDate="inputCalendarDay"></add-event>
        <add-tag></add-tag>
        <delete-calendar-tag></delete-calendar-tag>
        <edit-calendar></edit-calendar>
        <event-details :eventId="eventDetailsId"></event-details>
    </div>
</template>

<script>
    import { Calendar } from 'v-calendar'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'
    import AddEvent from './Components/Calendar/AddEvent.vue'
    import { PlusIcon, MoreVerticalIcon } from 'vue-feather-icons'
    import { BButton, BFormCheckbox, BDropdown, BDropdownItemButton } from 'bootstrap-vue'
    import AddTag from './Components/Calendar/AddTag.vue'
    import DeleteCalendarTag from './Components/Calendar/DeleteCalendarTag.vue'
    import EventDetails from './Components/Calendar/EventDetails.vue'
    import EditCalendar from './Components/Calendar/EditCalendar.vue'


    export default {
        components:{
            Calendar,
            AddEvent,
            PlusIcon,
            BButton,
            BFormCheckbox,
            AddTag,
            MoreVerticalIcon,
            BDropdown,
            BDropdownItemButton,
            DeleteCalendarTag,
            EventDetails,
            EditCalendar
        },
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        },
        computed: {
            events() {
                return this.$store.getters['calendar/getEvents'](this.selectedGroup)
            },
            eventGroups() {
                return this.$store.getters['calendar/getAllGroups']
            }
        },
        data() {
            return {
                eventDetailsId: null,
                clickedOnEvent: false,
                inputCalendarDay: null,
                selectedGroup: null,
                cardDiv: null,
                modelConfig: {
                    start: {
                        timeAdjust: '00:00:00'
                    },
                    end: {
                        timeAdjust: '23:59:59'
                    }
                },
                masks: {
                    weekdays: 'WWW'
                }
            
            }
        },
        methods:{
            editCalendar() {
                this.$bvModal.show('modal-edit-calendar')
            },
            showEvent(event, id) {
                this.eventDetailsId = id
                event.stopPropagation()
                this.$bvModal.show('modal-event-details')
            },
            changeSelectedGroups(id) {
                console.log(id)
            },
            addCalendarOnDay(date) {
                this.inputCalendarDay = date
                this.$bvModal.show('modal-add-event')
            },
            addTag() {
                this.$bvModal.show('modal-add-calendar')
            },
            addEvent() {
                this.$bvModal.show('modal-add-event')
            },
            sameDate(first, second) {
                return first.getFullYear() === second.getFullYear() &&
                    first.getMonth() === second.getMonth() &&
                    first.getDate() === second.getDate()
            },
            deleteCalendar() {
                this.$bvModal.show('modal-delete-calendar-tag')
            },
            async getTodoGroups() {

                try {

                    const data = await this.$http.get('/api/event')

                    console.log(data.data)

                    if (data.data && data.data.length === 0) {
                        throw 'Prislo je do napake'
                    }

                    for (const event of data.data) {
                        event.selected = true
                    }

                    this.$store.dispatch('calendar/update_events', { 'events': data.data})
                    // this.$store.dispatch('calendar/set_selected_group', { 'set': true, 'selectedGroup': data.data[0]['_id']})
                } catch (err) {
                    console.log(err)
                    this.$printError('Prislo je do napake pri pridobivanju podatkov!')
                }
            }
           
        },
        mounted() {
            this.getTodoGroups()

            this.cardDiv = this.$refs['card-div']
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@core/scss/base/bootstrap-extended/include';

    .preventUserSelection{
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .text {
        display: block;
        // width: 8vw;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }


    .btn-custom{
        border-color: $blue !important;
        background-color: $blue !important;
    }
    .btn-custom:active{
        border-color: $blue !important;
        background-color: $blue !important;
    }
    .btn-custom:hover{
        box-shadow: 0 8px 25px -8px $blue !important;
    }
.card-dark{
    width: 95%; 
    height: 95%; 
    background: #3c4043; 
    border-radius: 10px; 
    box-shadow: 1px 1px 3px #202124;
}

.card-white{
    width: 95%; 
    height: 90%; 
    background: #f8f8f8; 
    border-radius: 10px; 
    box-shadow: 1px 1px 3px #9a9b9b;
}

.bg-circle{
    margin: auto;
    background: rgb(9, 184, 184) !important;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50%;
}

.theme-default-dark{
    color: white !important; 
    border: none;
    background: #2E3134 !important;
}

.theme-default-white{
    color: rgb(0, 0, 0) !important; 
    border: none;
    background: #ffffff !important;
}

::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  display: none;
}

.bg-custom{
    background: var(--color);
}

</style>

<style lang="scss">
    .test{
        padding-top: 3px;
    }
    .test .custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
        background-color: var(--color) !important;
        // border: 2px solid red !important;
    }
    .test .custom-checkbox .custom-control-input ~ .custom-control-label::before {
        // background-color: green!important;
        // width: 15px !important;
        // height: 15px !important;
        border: 2px solid var(--color) !important;
        border-radius: 50%;
    }
 
    .vc-title{
        color: white !important;
    }

    .custom-calendar-light.vc-container {
        --day-width: 20%;
        --day-height: 20vh;
        border-radius: 0;
        width: 100%;
        // #f8f8f8
        background: white !important;
        & .vc-pane-container{
            background: white !important;
        }
        & .vc-day {
            // padding: 0 5px 3px 5px;
            text-align: left;
            text-align: left;
            height: var(--day-height);
            min-width: var(--day-width);
            // &.weekday-1,
            // &.weekday-7 {
            //     // background-color: #eff8ff;
            // }
        }
        &:not(.on-bottom) {
            border-bottom: var(--day-border);
            &.weekday-1 {
                border-bottom: var(--day-border-highlight);
            }
        }       
        &:not(.on-right) {
        border-right: var(--day-border);
        }
        // & .vc-header {
        //     background-color: #f1f5f8;
        //     padding: 10px 0;
        // }
        & .vc-weeks {
            padding: 0;
        }
    }
    
    .custom-calendar-dark.vc-container {
        --day-width: 20%;
        --day-height: 20vh;
        border-radius: 0;
        width: 100%;
        & .vc-day {
            // padding: 0 5px 3px 5px;
            text-align: left;
            text-align: left;
            height: var(--day-height);
            min-width: var(--day-width);
            // &.weekday-1,
            // &.weekday-7 {
            //     // background-color: #eff8ff;
            // }
        }
        &:not(.on-bottom) {
            border-bottom: var(--day-border);
            &.weekday-1 {
                border-bottom: var(--day-border-highlight);
            }
        }       
        &:not(.on-right) {
        border-right: var(--day-border);
        }
        // & .vc-header {
        //     background-color: #f1f5f8;
        //     padding: 10px 0;
        // }
        & .vc-weeks {
            padding: 0;
        }
    }

    .dropdown-item {
        width: 100% !important;
    }

    .dropdown-custom{
        border: none;
        background: transparent !important;
    }

    .dropdown-custom:focus-visible{
        border: none;
        background: transparent !important;
    }
    .dropdown-custom:hover{
        box-shadow: none !important;
        border: none;
        background: transparent !important;
    }
    .dropdown-custom:focus{
        box-shadow: none !important;
        border: none;
        background: transparent !important;
    }
    .dropdown-custom:active{
        border: none;
        background: transparent !important;
    }
    .dropdown-custom:target{
        border: none;
        background-color: transparent !important;
    }
    .dropdown-custom:visited{
        border: none;
        background: transparent !important;
    }
</style>