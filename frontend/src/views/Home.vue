<template>
    <div >
        <div class="row">
            <div class="col-lg-3 col-1">
                <b-card class="mojCard m-0" >
                    <div class="mb-2 p-0" style="font-size: 1.5rem;">Upcoming eventi</div>
                    <div style="height: 73vh !important; overflow-y: auto; overflow-x: hidden;" class="pr-1 pb-2">
                        <div v-for="(object,id) in eventsInThisWeek" :key="'UpcomingEventi_' + id" >
                            <div class="text-left d-flex justify-content-between w-100 mt-1 overflow-hidden" >
                                <div style="width: 55% !important;">
                                    {{object.event.name}}
                                    <div class="text" style="font-size: 0.7rem;">{{object.event.description}}</div>
                                </div>
                                <div class="d-flex align-items-center justify-content-end ml-1">
                                    <span class="badge badge-pill" :style="'background:' + object.event.color + '!important; margin-bottom: 5px;'">{{moment(object.date).format('ll')}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </b-card>

            </div>
           
            <div class="col-lg-4 col-4">
                <b-card style="height: 30vh;" class="h-30">
                    <calendar trim-weeks class="w-100" :class="isDark? 'dark-theme': ''" :attributes="events" ref="test-calendar" id="id123"> 
                        <template v-slot:day-popover="{ day, attributes }">
                            <div style="width: 300px;">
                                <div class="d-flex justify-content-center">
                                    {{day.date.toLocaleDateString(undefined,options)}}
                                </div>
                                <div v-for="(event, id) in attributes" :key="'event_id_' + event.key">
                                    <div class="d-flex" v-if="id < 5">
                                        <div class="d-flex justify-content-center">
                                            <span class="bullet bullet-sm" style="width: 6px !important; height: 6px !important; margin-top: 6px; margin-right: 5px; margin-left: 5px;" :style="'background:' + event.customData.color + '!important;'"></span>
                                        </div>
                                        {{event.customData.name}}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </calendar>
                </b-card>
                
                <b-card class="w-100 mt-2 mb-0 h-70 mojCard">
                    <div style="font-size: 1.5rem;">Upcoming taski</div>
                    <div style="height: 42vh; overflow-y: scroll; overflow-x: hidden;">
                        <div v-for="(task, id) in lastAddedTodos" :key="'Home_page_task_' + id" >
                            <div class="row py-1 item" >
                                <div class="col-2 d-flex justify-content-center align-items-center">
                                    <b-form-checkbox
                                    ></b-form-checkbox>
                                </div>
                                <div class="col-10 text-left d-flex justify-content-between" style="cursor: pointer;">
                                    <div style="width: 50%;">
                                        {{task.name}}
                                        <div style="font-size: 0.7rem;" class="text">{{task.description || stripHTML}}</div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-end ml-1">
                                        <div  class="text-right" >
                                            <span class="badge badge-pill mr-1" :style="'background:' + task.group.color +  '!important; margin-bottom: 5px;'">{{task.group.name}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    
                </b-card>
            </div>
            <div class="col-lg-5 col-7">
                <b-card class="w-100 h-100">
                    <div class="text-center" style="font-size: 1.5rem;">Pregled dnevnih opravil</div>
                    <clock-with-task :events="eventsToday"></clock-with-task>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    import { BCard, BFormCheckbox } from 'bootstrap-vue'
    import ClockWithTask from './Components/ClockWithTask.vue'
    import { Calendar } from 'v-calendar'
    import useAppConfig from '@core/app-config/useAppConfig'
    import { computed } from '@vue/composition-api'
    // import Vue from 'vue'

    export default {
        components: {
            BCard,
            ClockWithTask,
            Calendar,
            BFormCheckbox
        },
        data() {
            return {
                eventsToday: [],
                lastAddedTodos: null,
                start: null,
                eventsInThisWeek: [],
                firstDayOfWeek: null,
                lastDayOfWeek: null,
                dataWritenFinish: false,
                options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            }
        },
        computed:{
            events() {
                return this.$store.getters['calendar/getEventsHome']
            }
        },
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        },
        methods: {
            async getAllData() {

                try {

                    const data = await this.$http.get('/api/event')

                    // if (data.data && data.data.length === 0) {
                    //     throw 'Prislo je do napake'
                    // }

                    for (const event of data.data) {
                        event.selected = true
                    }

                    this.$store.dispatch('calendar/update_events', { 'events': data.data})
                } catch (err) {
                    console.log(err)
                    this.$printError('Prislo je do napake pri pridobivanju podatkov!')
                }

                try {

                    const data = await this.$http.get('/api/todo/latest/10')

                    // if (data.data && data.data.length === 0) {
                    //     throw 'Prislo je do napake'
                    // }

                    this.lastAddedTodos = data.data
                } catch (err) {
                    console.log(err)
                    this.$printError('Prislo je do napake pri pridobivanju podatkov!')
                }
                this.test123()
            },
            test123() {
                const allEvents = this.$refs['test-calendar'].pages[0].days

                for (const day of allEvents) {
                    if (day.attributes && day.attributes.length > 0) {
                        if (this.sameDate(new Date(), day.date)) {
                            for (const eventInDay of day.attributes) {
                                this.eventsToday.push(eventInDay.customData)
                            }
                        }

                        if (new Date(day.date) >= new Date(this.firstDayOfWeek) && new Date(day.date) <= new Date(this.lastDayOfWeek)) {
                            for (const eventInDay of day.attributes) {
                                this.eventsInThisWeek.push({'event': eventInDay.customData, 'date': day.date})
                            }
                        }
                    }
                }

            },
            sameDate(first, second) {
                return first.getFullYear() === second.getFullYear() &&
                    first.getMonth() === second.getMonth() &&
                    first.getDate() === second.getDate()
            }
        },
        mounted() {
            this.getAllData()
            this.eventsInThisWeek = []

            const weekStart = this.moment().startOf('week').toDate()
            const weekEnd = this.moment().endOf('week').toDate()
            const monthEnd = this.moment().endOf('month').toDate()

            this.firstDayOfWeek = weekStart
            this.lastDayOfWeek = weekEnd

            if (weekEnd > monthEnd) this.lastDayOfWeek = monthEnd
            
        }
    }
</script>

<style lang="scss" scoped>
.text {
        display: block;
        // width: 10vw;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        
    }
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
</style>>

<style lang="scss">
    .mojCard .card-body{
        padding-bottom: 0px !important;
        padding-right: 0px !important;
        margin: 0px  !important;
    }
    .vc-container {
        border-radius: 0;
        width: 100%;
        border: none;

        .vc-day{
            color: #53afbe !important;
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
    }

    .dark-theme.vc-container {
        background: #2e3134 !important;

        .vc-arrow:hover{
            background: #282A2D;
        }
       
    }
</style>
