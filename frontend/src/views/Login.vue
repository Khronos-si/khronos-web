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
                class="d-none d-lg-flex align-items-center px-5 pt-5 mt-2"
            >
                <div class="row">
                    <div class="col-xl-5 col-12 d-flex align-items-center">
                        <div>
                            <div class="text-left" style="font-size: 2.5rem; color:#a19bf3; font-family: 'Montserrat'; font-weight: bold;">ORGANIZE YOUR LIFE WITH KHRONOS</div>
                            <div class="text-left mt-4" style="font-size: 1.5rem;">
                                Khronos gives you the confidence that everything’s organized and accounted for, so you can make progress on the things that are important to you.
                            </div>
                            <div class="text-left mt-2" style="font-size: 1.5rem;">
                                You are one click away from greatness!
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-7 col-12 d-flex align-items-center justify-content-center">
                        <div class="end px-5">
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
                        Please sign-in to your account and start the adventure!
                    </b-card-text>

                    <!-- form -->
                    <validation-observer ref="loginValidation">
                        <b-form
                            class="auth-login-form mt-2"
                            @submit.prevent
                        >
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
                                    <b-link :to="{name:'auth-forgot-password-v2'}">
                                        <small>Forgot Password?</small>
                                    </b-link>
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

                            <!-- checkbox -->
                            <b-form-group>
                                <b-form-checkbox
                                    id="remember-me"
                                    v-model="rememberMe"
                                    name="checkbox-1"
                                >
                                    Remember Me
                                </b-form-checkbox>
                            </b-form-group>

                            <!-- submit buttons -->
                            <b-button
                                type="submit"
                                variant="primary"
                                block
                                @click="validationForm"
                            >
                                Sign in
                            </b-button>
                        </b-form>
                    </validation-observer>

                    <b-card-text class="text-center mt-2">
                        <span>New on our platform? </span>
                        <b-link :to="{name:'register'}">
                            <span>&nbsp;Create an account</span>
                        </b-link>
                    </b-card-text>

                    <!-- divider -->
                    <!-- <div class="divider my-2">
                        <div class="divider-text">
                            or
                        </div>
                    </div> -->

                    <!-- social buttons -->
                    <!-- <div class="auth-footer-btn d-flex justify-content-center">
                        <b-button
                            variant="facebook"
                            href="javascript:void(0)"
                        >
                            <feather-icon icon="FacebookIcon" />
                        </b-button>
                        <b-button
                            variant="twitter"
                            href="javascript:void(0)"
                        >
                            <feather-icon icon="TwitterIcon" />
                        </b-button>
                        <b-button
                            variant="google"
                            href="javascript:void(0)"
                        >
                            <feather-icon icon="MailIcon" />
                        </b-button>
                        <b-button
                            variant="github"
                            href="javascript:void(0)"
                        >
                            <feather-icon icon="GithubIcon" />
                        </b-button>
                    </div> -->
                </b-col>
            </b-col>
            <!-- /Login-->
        </b-row>
    </div>
</template>

<script>
/* eslint-disable global-require */
    import { ValidationProvider, ValidationObserver } from 'vee-validate'
    // import VuexyLogo from '@core/layouts/components/Logo.vue'
    import {
        BRow, BCol, BLink, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BFormCheckbox, BCardText, BCardTitle, BImg, BForm, BButton
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
            BFormCheckbox,
            BCardText,
            BCardTitle,
            BImg,
            BForm,
            BButton,
            // VuexyLogo,
            ValidationProvider,
            ValidationObserver
        },
        mixins: [togglePasswordVisibility],
        data() {
            return {
                password: '',
                userEmail: '',
                rememberMe: false,
                sideImg: require('@/assets/svg/LoginImage.svg'),
                // validation rulesimport store from '@/store/index'
                required,
                email
            }
        },
        computed: {
            registeredUser() {
                return this.$store.getters['user/getNewEmail']
            },
            passwordToggleIcon() {
                return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
            },
            imgUrl() {
                if (store.state.appConfig.layout.skin === 'dark') {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.sideImg = require('@/assets/svg/LoginImage1.svg')
                    return this.sideImg
                }
                return this.sideImg
            }
        },
        methods: {
            validationForm() {
                this.$refs.loginValidation.validate().then(() => {
                    this.loginJWT()
                })
            },
            async loginJWT() {
                const thisIns = this
                thisIns.$store.state.app.showLoader = true

                const payload = {
                    email: thisIns.userEmail,
                    password: thisIns.password
                }

                try {
                    // odvisno od zasnova projekta, lahko login vrne samo JWT token
                    // ali pa vrne tudi vse informacije o uporanbiku,
                    // v našem primeru rabimo narediti 2 klica, prilagodi po svoje po želji
                    const loginResponse = await this.$http.post('/api/user/login', payload)
                    const userData = loginResponse.data
                    console.log(loginResponse)
                    const token = loginResponse.headers['auth-token']
                    thisIns.$store.dispatch('user/login', token)
                    this.$store.dispatch('user/setUserData', {email: payload.email, userData})
                } catch (error) {
                    console.log(error)
                    thisIns.$printWarning(this.$t('login.wrong_password'))
                } finally {
                    thisIns.$store.state.app.showLoader = false
                }
            }

        },
        mounted() {
            if (this.registeredUser !== '') {
                this.userEmail = this.registeredUser
                this.$store.dispatch('user/registered_user', { 'email': ''})
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');
</style>
