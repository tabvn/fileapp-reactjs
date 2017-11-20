import axios from 'axios'
import {apiUrl} from '../config'


export const createUser = (user) => {

	const url = `${apiUrl}/users`
    return axios.post(url, user);
}