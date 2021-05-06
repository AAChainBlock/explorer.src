import axios from 'axios'
import {
    from
} from 'rxjs'

// let storeage = window.LocalStoreApi.get('mongoPath')

// window.baseUrl = storeage? storeage:window.baseUrl
window.baseUrl = window.baseUrl
const post = (url, parms) => {
    return from(axios.post(window.baseUrl + url, parms))
}
const get = (url, parms) => {
    return from(axios.get(window.baseUrl + url, parms))
}
export const mongoApi = {
    post,
    get
}