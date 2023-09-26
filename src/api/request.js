import axios from 'axios'
import Cookies from 'js-cookie'
const client = axios.create({baseURL : 'http://192.168.1.100:8000/api'})
export const  request = async ({...options}) => {
    client.defaults.headers.common.Authorization = `Bearer ${Cookies.get('_toddily_admin_token')}`
    return client(options)
    .then((res) => res)
}

export const baseURLImage = 'http://192.168.1.100:8000'
