import authService from '../../auth/authService'

const userDefaults = {
  uid: 0,
  displayName: '',
  about: '',
  photoURL: require('@/assets/images/portrait/small/avatar-s-11.jpg'), // From Auth
  status: 'online',
  userRole: '/'
}

export default {
  namespaced: true,
  state: {
    AppActiveUser: userDefaults,
    loggedIn: false,
    userData: null,
    registerEmail: ''
  },
  getters: {
    getUserData: state => {
      return state.userData
    },
    getNewEmail: state => {
      return state.registerEmail
    }
  },
  mutations: {
    SET_LOGGED_IN(state) {
      state.loggedIn = true
    },
    UPDATE_USER_DATA(state, data) {
      state.userData = data
    },
    REGISTERED_USER(state, payload) {
      state.registerEmail = payload.email
    }
  },
  actions: {
    login({ commit }, payload) {
      authService.setLoginParameters(payload)
      commit('SET_LOGGED_IN')
    },
    registered_user({ commit }, payload) {
      commit('REGISTERED_USER', payload)
    },
    setUserData({ commit }, payload) {
      commit('UPDATE_USER_DATA', payload)
      localStorage.setItem('userData', JSON.stringify(payload))

      window.location = '/'
    }
  }
}
