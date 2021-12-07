import Vue from 'vue'
import VueRouter from 'vue-router'
import authService from '../auth/authService.js'
import store from '../store/index.js'
import i18n from '../i18n/i18n'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: i18n.t('general.home'),
        breadcrumb: [
          {
            text: 'Home',
            active: true
          }
        ],
        requiresAuth: true // UPORABNIKU NI TREBA BITI PRIJAVLJEN
        // PRESTAVI NA TRUE
        
        // roles: ['admin'] // dovolimo samo adminu vpogled na to stran
        // roles: ['user', 'superuser'] // dovoimo samo userju in superuserju
        // če pustimo prazno, se roles ne upošteva
      }
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('@/views/Todos.vue'),
      meta: {
        pageTitle: i18n.t('general.todos'),
        breadcrumb: [
          {
            text: 'Todos',
            active: true
          }
        ],
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        layout: 'full'
      }
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full'
      }
    },
    {
      path: '*',
      redirect: 'error-404'
    }
  ]
})

router.beforeEach((to, from, next) => {

  // pridobi loggedIn spremenljivko iz localStorage, ki jo ob loginu nastavimo na true
  const loggedIn = localStorage.getItem('loggedIn')
  if (loggedIn) {
    // ob reloadu strani (Ctrl + R) se vrednosti iz store (Vuex Store) pobrišejo
    // zato jih pridobimo iz localStorage in jih shranimo
    store.state.user.loggedIn = true
    const userData = localStorage.getItem('userData')
    if (userData) {
      store.state.user.userData = JSON.parse(userData)
    }
  }

  // če stran, na katero želimo iti vsebuje meta podatek requiresAuth
  // in iz authService zvemo, da user ni prijavljen, ga pošljemo na login 
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    return next('/login')
  }

  // če meta vsebuje array roles (npr ['user', 'superuser'] ali ['admin'])
  // pogledamo v vuex store, če ima prijavljen uporabnik ta role
  if (to.meta.roles) {
    if (to.meta.roles.includes(store.state.user.userData.type)) {
      return next() // z next() spustimo dalje
    }
    return next('/login')
  }
  next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
