 import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { useApiUrl } from '../api/api';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import {useStates} from '../composable/states';

const toast = useToast();
const { api, getAuthHeader } = useApiUrl();
 
 export const useComputerStore = defineStore('computer', () => {
 const states = useStates();

  const {
        success,
        error,
        } = states;
  const computers = ref([]);
  const labs = ref([]);
  const isLoading = ref(false);
  const modal = ref(false);
  const recentScans = ref([]);
  const isSubmitting = ref(false);
  const errorMessage = ref("");
  const latestScan = ref([]);

  const data = reactive({
    rfid_uid: '',
  });

  const fetchComputers = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get(`${api}/computers?include=laboratory`, getAuthHeader());
      computers.value = response.data.computers || [];
    } catch (error) {
      computers.value = [];
      toast.error('Failed to fetch computers');
      console.error('Error fetching computers:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchLabs = async () => {
    try {
      const response = await axios.get(`${api}/laboratories`, getAuthHeader());
      labs.value = response.data.laboratories || [];
    } catch (error) {
      labs.value = [];
      toast.error('Failed to fetch labs');
      console.error('Error fetching labs:', error);
    }
  };

  const fetchNoLabComputers = async () => {
    try{
        const response = await axios.get(`${api}/computers/null-lab`, getAuthHeader());
        computers.value = response.data.computers || [];
        console.log(computers.value);
    }catch(error) {
      toast.error('Failed to fetch computers without labs');
      console.error('Error fetching computers without labs:', error);
    }
  }

  const storeComputer = async (data) => {
    try {
      const response = await axios.post(`${api}/computers`, data, getAuthHeader());
      toast.success(response.data.message || 'Computer added successfully!');
      await fetchComputers();
    } catch (error) {
      toast.error('Failed to add computer.');
      console.error('Error storing computer:', error);
    }
  };

  const updateComputer = async (id, data) => {
    try {
      await axios.put(`${api}/computers/update/${id}`, data, getAuthHeader());
      toast.success('Computer updated successfully!');
      await fetchComputers();
    } catch (error) {
      toast.error('Failed to update computer.');
      console.error('Error updating computer:', error);
    }
  };

  const assignLabToComputer = async (computerIds, labId) => {
    try {
        const response = await axios.post(`${api}/assign-laboratories`, {computer_ids: computerIds, laboratory_id: labId }, getAuthHeader());
        toast.success(response.data.message || 'Lab assigned to computer successfully!');
        fetchNoLabComputers();
        
    } catch (error) {
      toast.error('Failed to assign lab to computer.');
      console.error('Error assigning lab to computer:', error);
        
    }
  }

  const deleteComputer = async (id) => {
    try {
      await axios.delete(`${api}/computers/${id}`, getAuthHeader());
      toast.success('Computer deleted successfully!');
      await fetchComputers();
    } catch (error) {
      toast.error('Failed to delete computer.');
      console.error('Error deleting computer:', error);
    }
  };

  const unlockComputer = async (id, rfid_uid) => {
    try {
      const response = await axios.put(
        `${api}/computer/state/${id}`,
        { rfid_uid },
        getAuthHeader()
      );
      
      toast.success(response.data.message || 'Computer unlocked successfully!');
      console.log(response.data.message);
      await fetchComputers();
      return true;
    } catch(error) {
      toast.error(error.response?.data?.message || 'Failed to unlock computer.');
      console.error(error);
      return false;
    }
  }

const unlockAssignedComputer = async (rfid_uid) => {
  try {
    isSubmitting.value = true;
    errorMessage.value = "";
    
    const response = await axios.post(
      `${api}/computer-unlock`, 
      { rfid_uid },
      getAuthHeader()
    );
    
    console.log('Full response:', response);
    console.log('Message:', response.data.message);
    console.log('Computers:', response.data.computers);
    console.log('Student:', response.data.student);
    
    success(response.data.message);
    
    // Add to recent scans with proper data
    if (response.data.computers && response.data.computers.length > 0) {
      response.data.computers.forEach(computer => {
        recentScans.value.unshift({
          id: computer.log_id || Date.now(),
          name: response.data.student?.name || "Unknown Student", 
          computerNumber: `PC-${computer.computer_number}`,
          ipAddress: computer.ip_address,
          timestamp: new Date().toLocaleString()
        });
      });
    }
    
  } catch (err) {
    console.error('Error details:', err);
    console.error('Response data:', err.response?.data);
    
    errorMessage.value = err.response?.data?.message || "An error occurred";
    error(err.response?.data?.message || "An error occurred");
  } finally {
    isSubmitting.value = false;
  }
}


  return {
    // State
    computers,
    labs,
    isLoading,
    modal,
    data,
    recentScans,
    isSubmitting,
    errorMessage,
    latestScan,



    // Functions
    fetchComputers,
    fetchNoLabComputers,
    fetchLabs,
    storeComputer,
    updateComputer,
    deleteComputer,
    unlockComputer,
    unlockAssignedComputer,
    assignLabToComputer,
  };
});
