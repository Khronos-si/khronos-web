<template>
    <div>
        <div class="row">
            <div class="col-lg-3 col-1">
                <b-card class="w-100 h-100 mojCard">
                    <div class="mb-2" style="font-size: 1.5rem;">Upcoming eventi</div>
                    <div class="text-left d-flex justify-content-between w-100" >
                        <div>
                            Grupa 1234
                            <div style="font-size: 0.7rem;">Test test edit 12345</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #53afbe !important; margin-bottom: 5px;">20.8.2020</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            Nov opis bla bla
                            <div style="font-size: 0.7rem;">asdasdas</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #6ec193 !important; margin-bottom: 5px;">20.8.2020</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            Jutrisni task adsa
                            <div style="font-size: 0.7rem;">fddsfysfgada</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #feb449 !important; margin-bottom: 5px;">21.8.2020</span>
                        </div>
                    </div>

                    
                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            Task enkrat bla bla
                            <div style="font-size: 0.7rem;">fddsfysfgada dasas</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #53afbe !important; margin-bottom: 5px;">26.8.2020</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            FRi izpit juhejs juhjes
                            <div style="font-size: 0.7rem;">fddsfysfgada dasas 123123</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #53afbe !important; margin-bottom: 5px;">29.8.2020</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            Naloga tpo juhej
                            <div style="font-size: 0.7rem;">fddsfysfgada</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #feb449 !important; margin-bottom: 5px;">30.9.2020</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            BOZICEK
                            <div style="font-size: 0.7rem;">JUHEJ</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #fe5c36 !important; margin-bottom: 5px;">24.12.2020</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            NOVO LETO JUHEJ
                            <div style="font-size: 0.7rem;">JUHEJ</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #feb449 !important; margin-bottom: 5px;">31.12.2020</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            Konc semestra
                            <div style="font-size: 0.7rem;">fddsfysfgada dasas 123123</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #53afbe !important; margin-bottom: 5px;">1.1.2021</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            konc faksa
                            <div style="font-size: 0.7rem;">fddsfysfgada dasas 123123</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #6ec193 !important; margin-bottom: 5px;">2.4.2021</span>
                        </div>
                    </div>

                    <div class="text-left d-flex justify-content-between w-100 mt-1" >
                        <div>
                            Sluzba
                            <div style="font-size: 0.7rem;">fddsfysfgada dasas 123123</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end ml-1">
                            <span class="badge badge-pill" style="background: #fe5c36 !important; margin-bottom: 5px;">31.8.2021</span>
                        </div>
                    </div>
                </b-card>

            </div>
            <div class="col-lg-4 col-4 h-100">
                <calendar trim-weeks class="w-100" :class="isDark? 'dark-theme': ''"> </calendar>
                <b-card class="w-100 mt-2">
                    <div style="font-size: 1.5rem;">Upcoming taski</div>
                    <div class="row py-1 item" >
                        <div class="col-2 d-flex justify-content-center align-items-center">
                            <b-form-checkbox
                            ></b-form-checkbox>
                        </div>
                        <div class="col-10 text-left d-flex justify-content-between" style="cursor: pointer;">
                            <div>
                                Test
                                <div style="font-size: 0.7rem;">test description</div>
                            </div>
                            <div class="d-flex align-items-center justify-content-end ml-1">
                                <div  class="text-right" >
                                    <span class="badge badge-pill mr-1" style="background: #53afbe !important; margin-bottom: 5px;">Important</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row py-1 item" >
                        <div class="col-2 d-flex justify-content-center align-items-center">
                            <b-form-checkbox
                            ></b-form-checkbox>
                        </div>
                        <div class="col-10 text-left d-flex justify-content-between" style="cursor: pointer;">
                            <div>
                                Test
                                <div style="font-size: 0.7rem;">test description</div>
                            </div>
                            <div class="d-flex align-items-center justify-content-end ml-1">
                                <div  class="text-right" >
                                    <span class="badge badge-pill mr-1" style="background: #53afbe !important; margin-bottom: 5px;">Important</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row py-1 item" >
                        <div class="col-2 d-flex justify-content-center align-items-center">
                            <b-form-checkbox
                            ></b-form-checkbox>
                        </div>
                        <div class="col-10 text-left d-flex justify-content-between" style="cursor: pointer;">
                            <div>
                                Test
                                <div style="font-size: 0.7rem;">test description</div>
                            </div>
                            <div class="d-flex align-items-center justify-content-end ml-1">
                                <div  class="text-right" >
                                    <span class="badge badge-pill mr-1" style="background: #53afbe !important; margin-bottom: 5px;">Important</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row py-1 item" >
                        <div class="col-2 d-flex justify-content-center align-items-center">
                            <b-form-checkbox
                            ></b-form-checkbox>
                        </div>
                        <div class="col-10 text-left d-flex justify-content-between" style="cursor: pointer;">
                            <div>
                                Test
                                <div style="font-size: 0.7rem;">test description</div>
                            </div>
                            <div class="d-flex align-items-center justify-content-end ml-1">
                                <div  class="text-right" >
                                    <span class="badge badge-pill mr-1" style="background: #53afbe !important; margin-bottom: 5px;">Important</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row py-1 item" >
                        <div class="col-2 d-flex justify-content-center align-items-center">
                            <b-form-checkbox
                            ></b-form-checkbox>
                        </div>
                        <div class="col-10 text-left d-flex justify-content-between" style="cursor: pointer;">
                            <div>
                                Test
                                <div style="font-size: 0.7rem;">test description</div>
                            </div>
                            <div class="d-flex align-items-center justify-content-end ml-1">
                                <div  class="text-right" >
                                    <span class="badge badge-pill mr-1" style="background: #53afbe !important; margin-bottom: 5px;">Important</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </b-card>
            </div>
            <div class="col-lg-5 col-7">
                <b-card class="w-100 h-100">
                    <div class="text-center" style="font-size: 1.5rem;">Pregled dnevnih opravil</div>
                    <clock-with-task class=""></clock-with-task>
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

    export default {
        components: {
            BCard,
            ClockWithTask,
            Calendar,
            BFormCheckbox
        },
        setup() {
            const { skin } = useAppConfig()

            const isDark = computed(() => skin.value === 'dark')

            return { skin, isDark }
        }
    }
</script>

<style lang="scss" scoped>

</style>>

<style lang="scss">
    .mojCard .card-body{
        padding-bottom: 0px !important;
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
