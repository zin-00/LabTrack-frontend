import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useApiUrl } from '../api/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const { api, getAuthHeader } = useApiUrl();



// Program functions
  export const useProgramStore = defineStore('program', () => {
    const programs = ref([]);

    const fetchPrograms = async () => {
      try{
        const response =  await axios.get(`${api}/programs`, getAuthHeader());
        programs.value = response.data.programs || [];
        console.log(programs.value);
      }catch(error){
        programs.value = [];
        toast.error('Failed to fetch programs');
        console.error('Error fetching programs:', error);
      }
    };
  
    return {
      programs,
      fetchPrograms,
    };
  });