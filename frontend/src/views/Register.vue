<template>
    <div class="auth-wrapper auth-v2">
        <b-row class="auth-inner m-0">

            <!-- Brand logo-->
            <b-link class="brand-logo">
                <!-- <vuexy-logo /> -->
                <h2 class="brand-text text-primary ml-1">
                    <b-img :src="appLogoImage" style="width: 180px !important;" v-if="skin == 'dark'"></b-img>
                    <b-img :src="appLogoImageLightTheme" style="width: 180px !important;" v-if="skin != 'dark'"></b-img>
                </h2>
            </b-link>
            <!-- /Brand logo-->

            <!-- Left Text-->
            <b-col
                lg="8"
                class="d-none d-lg-flex align-items-center p-5"
            >
                <div class="row">
                    <div class="col-xl-5 col-12 d-flex align-items-center">
                        <div>
                            <div class="text-left" style="font-size: 2.5rem; color:#a19bf3; font-family: 'Montserrat'; font-weight: bold;">ONE CLICK SEPERATES YOU FROM BETTER LIFE!</div>
                            <div class="text-left mt-4" style="font-size: 1.5rem;">
                                Khronos will change your life. You are on your verge to become master of your life!
                            </div>
                            <div class="text-center mt-3" style="font-size: 1.5rem;">
                                "SUCCESS IS NEVER GETTING TO THE BOTTOM OF YOUR TO-DO LIST!"
                                <div style="font-size: 1rem;">Marrisa Mayer, CEO of Yahoo</div>
                            </div>
                            <!-- <div class="text-left mt-3" style="font-size: 2rem;">
                                You are one click away from greatness!
                            </div> -->
                        </div>
                    </div>
                    <div class="col-xl-7 col-12 d-flex justify-content-center align-items-center">
                        <div class=" px-5">
                            <b-img
                                fluid
                                :src="imgUrl"
                                alt="Login V2"
                                style="height: 50vh !important;"
                            />
                        </div>
                    </div>
                </div>
            </b-col>
            <!-- /Left Text-->

            <!-- Login-->
            <b-col
                lg="4"
                class="d-flex align-items-center auth-bg px-2 p-lg-5"
            >
                <b-col
                    sm="8"
                    md="6"
                    lg="12"
                    class="px-xl-2 mx-auto"
                >
                    <b-card-title
                        title-tag="h2"
                        class="font-weight-bold mb-1"
                    >
                        Welcome to Khronos!
                    </b-card-title>
                    <b-card-text class="mb-2">
                        Please enter you info.
                    </b-card-text>

                    <!-- form -->
                    <validation-observer ref="loginValidation">
                        <b-form
                            class="auth-login-form mt-2"
                            @submit.prevent
                        >
                            <!-- name -->
                            <b-form-group
                                label="Name"
                                label-for="login-name"
                                invalid-feedback="Name is required"
                                :state="nameState"
                            >
                                <b-form-input
                                    id="login-name"
                                    v-model="userName"
                                    :state="nameState"
                                    placeholder="John Doe"
                                    required
                                />
                            </b-form-group>

                            <!-- email -->
                            <b-form-group
                                label="Email"
                                label-for="login-email"
                            >
                                <validation-provider
                                    #default="{ errors }"
                                    name="Email"
                                    rules="required|email"
                                >
                                    <b-form-input
                                        id="login-email"
                                        v-model="userEmail"
                                        :state="errors.length > 0 ? false:null"
                                        name="login-email"
                                        placeholder="john@example.com"
                                    />
                                    <small class="text-danger">{{ errors[0] }}</small>
                                </validation-provider>
                            </b-form-group>

                            <!-- forgot password -->
                            <b-form-group>
                                <div class="d-flex justify-content-between">
                                    <label for="login-password">Password</label>
                                </div>
                                <validation-provider
                                    #default="{ errors }"
                                    name="Password"
                                    rules="required"
                                >
                                    <b-input-group
                                        class="input-group-merge"
                                        :class="errors.length > 0 ? 'is-invalid':null"
                                    >
                                        <b-form-input
                                            id="login-password"
                                            v-model="password"
                                            :state="errors.length > 0 ? false:null"
                                            class="form-control-merge"
                                            :type="passwordFieldType"
                                            name="login-password"
                                            placeholder="············"
                                        />
                                        <b-input-group-append is-text>
                                            <feather-icon
                                                class="cursor-pointer"
                                                :icon="passwordToggleIcon"
                                                @click="togglePasswordVisibility"
                                            />
                                        </b-input-group-append>
                                    </b-input-group>
                                    <small class="text-danger">{{ errors[0] }}</small>
                                </validation-provider>
                            </b-form-group>

                            <!-- submit buttons -->
                            <b-button
                                type="submit"
                                variant="primary"
                                block
                                @click="validationForm"
                            >
                                Create an account
                            </b-button>
                        </b-form>
                    </validation-observer>

                    <div class="text-center pt-1 text-success" v-if="registrationSuccessfull">
                        Registration sucesfull. Redirecting you to login. 
                        <div class="mt-1">
                            <b-spinner
                                variant="success"
                            ></b-spinner>
                        </div>
                        
                    </div>

                    <b-card-text class="text-center mt-2">
                        <span>Already singed up?</span>
                        <b-link :to="{name:'login'}">
                            <span>&nbsp;Login to your account</span>
                        </b-link>
                    </b-card-text>
                </b-col>
            </b-col>
            <!-- /Login-->
        </b-row>
    </div>
</template>

<script>
    import { ValidationProvider, ValidationObserver } from 'vee-validate'
    // import VuexyLogo from '@core/layouts/components/Logo.vue'
    import {
        BRow, BCol, BLink, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BCardText, BCardTitle, BImg, BForm, BButton, BSpinner
    } from 'bootstrap-vue'
    import { required, email } from '@validations'
    import { togglePasswordVisibility } from '@core/mixins/ui/forms'
    import store from '@/store/index'
    import { $themeConfig } from '@themeConfig'
    import useAppConfig from '@core/app-config/useAppConfig'


    export default {
        components: {
            BRow,
            BCol,
            BLink,
            BFormGroup,
            BFormInput,
            BInputGroupAppend,
            BInputGroup,
            BCardText,
            BCardTitle,
            BImg,
            BForm,
            BButton,
            // VuexyLogo,
            BSpinner,
            ValidationProvider,
            ValidationObserver
        },
        mixins: [togglePasswordVisibility],
        data() {
            return {
                registrationSuccessfull: false,
                nameState: null,
                userName: '',
                password: '',
                userEmail: '',
                sideImg: require('@/assets/svg/RegisterImage.svg'),
                // validation rulesimport store from '@/store/index'
                required,
                email
            }
        },
        computed: {
            passwordToggleIcon() {
                return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
            },
            imgUrl() {
                if (store.state.appConfig.layout.skin === 'dark') {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.sideImg = require('@/assets/svg/RegisterImage.svg')
                    return this.sideImg
                }
                return this.sideImg
            }
        },
        methods: {
            validationForm() {
                this.$refs.loginValidation.validate().then(() => {
                    this.register()
                })
            },
            async register() {
                const thisIns = this
                thisIns.$store.state.app.showLoader = true

                const payload = {
                    name: thisIns.userName,
                    email: thisIns.userEmail,
                    password: thisIns.password
                }

                try {
                    // odvisno od zasnova projekta, lahko login vrne samo JWT token
                    // ali pa vrne tudi vse informacije o uporanbiku,
                    // v našem primeru rabimo narediti 2 klica, prilagodi po svoje po želji
                    const loginResponse = await this.$http.post('/api/user/register', payload)
                    const email = loginResponse.data.email
                    // const email = payload.email
                    this.$store.dispatch('user/registered_user', { email})
                    this.registrationSuccessfull = true

                    const thisIns = this
                    setTimeout(function() {
                        thisIns.$router.push({ name: 'login' })
                    }, 3000)
                } catch (error) {
                    thisIns.$printWarning('Registration failed!')
                } finally {
                    thisIns.$store.state.app.showLoader = false
                }
            }

        },
        setup() {
            const { appName, appLogoImage, appLogoImageLightTheme } = $themeConfig.app
            const { skin } = useAppConfig()

            return {
                appLogoImageLightTheme,
                appName,
                appLogoImage,
                skin
            }
        }
    }
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
