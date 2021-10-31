import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import moment from 'moment-timezone'
import router from './router'
import store from './store'
import App from './App.vue'
import i18n from './i18n/i18n'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

console.log('asdasd')

//FontAwesome
library.add(fas)
Vue.component('fa', FontAwesomeIcon)

// axios
import axios from './axios.js'

// ADDS BEARER JWT TO EVERY REQUEST
axios.interceptors.request.use(
  config => {
    const jwt = localStorage.getItem('accessToken')
    if (jwt !== '') config.headers.common.Authorization = `Bearer ${jwt}`

    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

// Moment.js
moment.tz.setDefault('SI')
Vue.prototype.moment = moment

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

Vue.prototype.$printError = function(error) {
  this.$toast({
    component: ToastificationContent,
    props: {
      title: 'Error',
      icon: 'DangerOctagonIcon',
      text: error,
      variant: 'danger'
    }
  })
}

Vue.prototype.$printWarning = function(message) {
  this.$toast({
    component: ToastificationContent,
    props: {
      title: 'Warning',
      icon: 'AlertTriangleIcon',
      text: message,
      variant: 'warning'
    }
  })
}

Vue.prototype.$printSuccess = function(message) {
  this.$toast({
    component: ToastificationContent,
    props: {
      title: 'Success',
      icon: 'CheckCircleIcon',
      text: message,
      variant: 'success'
    }
  })
}

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
