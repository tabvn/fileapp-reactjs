import axios from 'axios'
import {apiUrl} from '../config'


export const createUser = (user) => {

	const url = `${apiUrl}/users`
    return axios.post(url, user);
}


export const login = (email = null, password = null) => {
	const url = `${apiUrl}/users/login`
    return axios.post(url, {
    	email: email,
    	password: password
    });
}