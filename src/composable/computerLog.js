import { ref } from 'vue';
import { defineStore } from 'pinia';
import {useApiUrl} from '../api/api';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const toast = useToast();
const { api, getAuthHeader } = useApiUrl();
  
  // Computer log functions
  export const useComputerLogStore = defineStore('computerLog', () => {
    const computerLogs = ref({
      data: [],
      meta: {}
    });
    const isLoading = ref(false);

    const fetchComputerLogs = async (page = 1) => {
      try{
        const response = await axios.get(`${api}/logs?page=${page}`, getAuthHeader());
        computerLogs.value = response.data.computer_logs || [];
        console.log(computerLogs.value);
      }catch(error){
        computerLogs.value = [];
        toast.error('Failed to fetch computer logs');
        console.error('Error fetching computer logs:', error);
      
      }
    }

    return{
      computerLogs,
      isLoading,
      fetchComputerLogs,
    }
  });

 