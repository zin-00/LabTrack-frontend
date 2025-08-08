import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useApiUrl } from '../api/api';
import { useToast } from 'vue-toastification';


const toast = useToast();
const { api, getAuthHeader } = useApiUrl();

// Students functions
export const useStudentStore = defineStore('student', () => {
  const students = ref([]);
  const isLoading = ref(false);

  const storeStudent = async (data) => {
    try{
      const response = await axios.post(`${api}/students`, data, getAuthHeader());
      toast.success(response.data.message || 'Student added successfully!');
    }catch(error){
      toast.error('Failed to add student.');
      console.error('Error storing student:', error);
    }
  }
  const fetchStudents = async (page = 1) => {
    try{
      isLoading.value = true;
      const response = await axios.get(`${api}/students?page=${page}`, getAuthHeader());
      students.value = response.data.students || [];
      console.log(students.value);
      
    }catch(error){
      students.value = [];
      toast.error('Failed to fetch students');
      console.error('Error fetching students:', error);
    }finally{
      isLoading.value = false;
    }
  }

  const updateStudent = async (id, data) => {
    try{
      await axios.put(`${api}/students/${id}`, data, getAuthHeader());
      toast.success('Student updated successfully!');
      await fetchStudents();
    }catch(error){
      toast.error('Failed to update student.');
      console.error('Error updating student:', error);
    }
  }

  const deleteStudent = async (id) => {
    try{
      await axios.delete(`${api}/students/${id}`, getAuthHeader());
      toast.success('Student deleted successfully!');
      await fetchStudents();
    }catch(error){
      toast.error('Failed to delete student.');
      console.error('Error deleting student:', error);
    }
  }

  return{
    students,
    isLoading,
    storeStudent,
    fetchStudents,
    updateStudent,
    deleteStudent,
  }

});
