<template>
    <div class="d-inline text-center section">
        <div class="m-0 p-0" style="float: left" >
            <div class="p-0  m-0 py-2 px-0" style="height: 75vh !important; border-right: 1px solid rgba(110,110,110,0.3);">
                <!-- v-if="groupPermissions == null || groupPermissions > 0" -->
                <div class="px-2 pb-1 d-flex justify-content-center" >
                    <b-button class="btn btn-primary btn-custom btn-block px-3"  v-b-modal.modal-add-event >Add Event</b-button>
                </div>
                <div class="d-flex justify-content-between px-2" style="padding-bottom: 5px;">
                    <div>
                        My Calendars
                    </div>
                    <div v-on:click="addTag()" style="cursor: pointer;">
                        <plus-icon size="1.4x" class="custom-class"></plus-icon>
                    </div>
                </div>
                <div class="mt-1">
                    <!-- :class="(selectedGroup == group._id)? 'selectedGroup': 'normalGroup'" -->
                    <!-- v-for="(group,id) in todoGroups" :key="'button_todo_group_' + id" v-on:click="setGroup(group._id)" -->
                    <div  class="pl-2 pr-2 d-flex justify-content-between test"  style="cursor: pointer; --color: #feb449;">
                        <div class="d-flex">
                            <!-- group.color -->
                            <!-- <span class="bullet bullet-sm mr-1" :style="'background: green !important;'"></span> -->
                            <b-form-checkbox class="test"></b-form-checkbox>
                            <!-- {{group.name}} -->
                            test 123
                        </div>
                        <!-- v-if="userEmail != group.owner.email" -->
                        <div  >
                            <!-- {{group.owner.email}} -->
                            <!-- <span class="badge badge-pill badge-warning ml-1">Shared</span> -->
                        <!-- <settings-icon size="1.4x" class="custom-class"  style="color: #434343"></settings-icon> -->
                        <!-- <more-vertical-icon size="1.4x" class="custom-class" style="color: #434343"></more-vertical-icon> -->
                        </div>
                    </div>
                    <div  class="pl-2 pr-2 d-flex justify-content-between test"  style="cursor: pointer; --color: #6ec193;">
                        <div class="d-flex">
                            <!-- group.color -->
                            <!-- <span class="bullet bullet-sm mr-1" :style="'background: green !important;'"></span> -->
                            <b-form-checkbox class="test"></b-form-checkbox>
                            <!-- {{group.name}} -->
                            test 1234
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

            <calendar
                class="max-w-full p-1 custom-calendar" :class="isDark? 'theme-default-dark ' : 'theme-default-white '"
                :model-config="modelConfig"
                :masks="masks"
                :attributes="attributes"
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
                                :key="attr.key"
                                class="text-xs rounded text-center"
                                style="padding-left: 5px !important; padding-right: 5px !important; margin-bottom: 5px;"
                                :class="attr.customData.class"
                            >
                                {{ attr.customData.title }}
                            </div>
                        </div>
                    
                    </div>
                </template>
            </calendar>

        </div>

        <add-event></add-event>
        <add-tag></add-tag>
    </div>
</template>

<script>
    import { Calendar } from 'v-calendar'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'
    import AddEvent from './Components/Calendar/AddEvent.vue'
    import { PlusIcon } from 'vue-feather-icons'
    import { BButton, BFormCheckbox } from 'bootstrap-vue'
    import AddTag from './Components/Calendar/AddTag.vue'


    export default {
        components:{
            Calendar,
            AddEvent,
            PlusIcon,
            BButton,
            BFormCheckbox,
            AddTag
        },
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        },
        data() {
            const month = new Date().getMonth()
            const year = new Date().getFullYear()
            return {
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
                },
                attributes: [
                    {
                        key: 1,
                        customData: {
                            title: 'Lunch with mom.',
                            class: 'bg-secondary text-black'
                        },
                        dates: new Date(year, month, 1)
                    },
                    {
                        key: 2,
                        customData: {
                            title: 'Take Noah',
                            class: 'bg-primary text-black'
                        },
                        dates: new Date(year, month, 2)
                    },
                    {
                        key: 3,
                        customData: {
                            title: 'Noah\'s basketball game.',
                            class: 'bg-primary text-black'
                        },
                        dates: new Date(year, month, 5)
                    },
                    {
                        key: 4,
                        customData: {
                            title: 'Take car to the shop',
                            class: 'bg-info text-black'
                        },
                        dates: new Date(year, month, 5)
                    },
                    {
                        key: 5,
                        customData: {
                            title: 'Meeting with new client.',
                            class: 'bg-warning text-black'
                        },
                        dates: new Date(year, month, 7)
                    },
                    {
                        key: 6,
                        customData: {
                            title: 'Mia\'s gymnastics practice.',
                            class: 'bg-success text-black'
                        },
                        dates: new Date(year, month, 11)
                    },
                    {
                        key: 7,
                        customData: {
                            title: 'Cookout with friends.',
                            class: 'bg-success text-black'
                        },
                        dates: { months: 5, ordinalWeekdays: { 2: 1 } }
                    },
                    {
                        key: 8,
                        customData: {
                            title: 'Mia\'s gymnastics recital.',
                            class: 'bg-success text-black'
                        },
                        dates: new Date(year, month, 22)
                    },
                    {
                        key: 9,
                        customData: {
                            title: 'Visit great grandma.',
                            class: 'bg-secondary text-black'
                        },
                        dates: new Date(year, month, 25)
                    },
                    {
                        key: 92,
                        customData: {
                            title: 'Visit great grandma.',
                            class: 'bg-secondary text-black'
                        },
                        dates: new Date(year, month, 25)
                    },
                    {
                        key: 93,
                        customData: {
                            title: 'Visit great grandma.',
                            class: 'bg-secondary text-black'
                        },
                        dates: new Date(year, month, 25)
                    },
                    {
                        key: 94,
                        customData: {
                            title: 'Visit great grandma.',
                            class: 'bg-secondary text-black'
                        },
                        dates: new Date(year, month, 25)
                    },
                    {
                        key: 95,
                        customData: {
                            title: 'Visit great grandma.',
                            class: 'bg-secondary text-black'
                        },
                        dates: new Date(year, month, 25)
                    }
                ]
            }
        },
        methods:{
            addCalendarOnDay(date) {
                console.log(`EVENT ON DAY: ${  date}`)
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
            }
           
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@core/scss/base/bootstrap-extended/include';

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
        // border-radius: 50%;
    }
 
    .vc-title{
        color: white !important;
    }
     .custom-calendar.vc-container {
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
</style>