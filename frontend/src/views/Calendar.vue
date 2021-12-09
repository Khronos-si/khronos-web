<template>
    <div class="text-center section">
        <calendar
            class="max-w-full p-1 custom-calendar" :class="isDark? 'theme-default-dark ' : 'theme-default-white '"
            :masks="masks"
            :attributes="attributes"
            disable-page-swipe
            is-expanded
        >
            <template v-slot:day-content="{ day, attributes }">
                <div class="overflow-hidden py-0.5 px-md-1" :class="isDark? 'card-dark': 'card-white'" style="padding-top: 5px;">
                    <div class="d-flex align-items-center justify-content-center" style="margin-bottom: 5px;" :class="sameDate(day.date, new Date())? 'bg-circle':''">
                        <div class="p-0" >{{ day.day }} </div>
                    </div>
                    <div class="flex-grow overflow-y-auto overflow-x-auto">
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
</template>

<script>
    import { Calendar } from 'v-calendar'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'

    export default {
        components:{
            Calendar
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
                    }
                ]
            }
        },
        methods:{
            sameDate(first, second) {
                return first.getFullYear() === second.getFullYear() &&
                    first.getMonth() === second.getMonth() &&
                    first.getDate() === second.getDate()
            }
           
        }
    }
</script>

<style lang="scss" scoped>

.card-dark{
    width: 95%; 
    height: 90%; 
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
    .vc-title{
        color: white !important;
    }
     .custom-calendar.vc-container {
        --day-width: 10vw;
        --day-height: 12vh;
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