import jsonwebtoken from 'jsonwebtoken'
import store from '../store/index.js'

const loggedIn = 'loggedIn'
const tokenExpiryKey = 'tokenExpiry'
const jwtToken = 'accessToken'

const authService = {

  logOut() {
    localStorage.removeItem(loggedIn)
    localStorage.removeItem(tokenExpiryKey)
    localStorage.removeItem('userData')

    store.state.user.loggedIn = false
    store.state.user.userData = null
  },

  setLoginParameters(token) {
    localStorage.setItem(loggedIn, 'true')
    localStorage.setItem(jwtToken, token)
    store.state.user.loggedIn = true
  },
  getDecodedJWT() {
    const jwt = localStorage.getItem(jwtToken)
    const decoded = jsonwebtoken.decode(jwt)

    return decoded
  },
  isAuthenticated() {
    const jwt = localStorage.getItem(jwtToken)
    const decoded = jsonwebtoken.decode(jwt)
    const timeNow = Math.floor(new Date().getTime() / 1000)

    return (
      jwt
      && timeNow < decoded.exp
      && localStorage.getItem(loggedIn) === 'true'
    )
  }

}

export default authService
