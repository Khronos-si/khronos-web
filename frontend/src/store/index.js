import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import user from './user'
import todo from './todo'
import tags from './tags'
import calendar from './calendar'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    user,
    todo,
    tags,
    calendar
  },
  strict: process.env.DEV
})
