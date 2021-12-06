// axios
import axios from 'axios'

const baseURL = ((process.env.NODE_ENV !== 'production') ? `${window.location.origin}/api/` : ':3000/api/')
// const baseURL = ((process.env.NODE_ENV !== 'production') ? 'http://127.0.0.1/api/' : '/api/')

export default axios.create({
  baseURL
  // You can add your headers here
})
