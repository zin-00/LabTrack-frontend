import {defineStore} from 'pinia'
import { ref } from 'vue'
// import { useApiUrl } from './useApi';
import axios from 'axios'
import { useApiUrl } from '../api/api';

const {api, getAuthHeader} = useApiUrl();

export const useUserStore = defineStore('user', () => {
    const user = ref(null);
    
    const setUser = (userData) => {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(userData))
    }
    const loadUser = () => {
        const data = localStorage.getItem('user');
        if(data){
            user.value = JSON.parse(data)
        }
    }
    const clearUser = () => {
        user.value = null;
        localStorage.removeItem('user')
    }

     const destroy = async () => {
        try {
          await axios.delete(`${api}/auth/logout`, getAuthHeader());

          clearUser();
          useStoreToken().clearToken();
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
    return {
        user, setUser, loadUser, clearUser, destroy
    }

})

export const useStoreToken = defineStore('token', () => {
  const token = ref(null)

  const setToken = (tokenData) => {
    token.value = tokenData
    localStorage.setItem('token', tokenData)
  }

  const loadToken = () => {
    const data = localStorage.getItem('token')
    if (data) {
      token.value = data
    }
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('token')
  }

  return { token, setToken, loadToken, clearToken }
})