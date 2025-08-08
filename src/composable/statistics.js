  import { defineStore } from 'pinia';
  import { ref } from 'vue';
  import axios from 'axios';
  import {useApiUrl} from '../api/api';
  import { useToast } from 'vue-toastification';
  
  const toast = useToast();
  const { api, getAuthHeader } = useApiUrl();
  
  export const useStatusDistributionStore = defineStore('statusDistribution', () => {

    const onlineCount = ref(0);
    const offlineCount = ref(0);
    const lockedCount = ref(0);
    const unlockedCount = ref(0);
    const totalCount = ref(0);
    const activeCount = ref(0);
    const inactiveCount = ref(0);
    const maintenanceCount = ref(0);

    const fetchStatusDistribution = async () => {
      try {
        const response = await axios.get(`${api}/computer/status-distribution`, getAuthHeader());
        const data = response.data;

        onlineCount.value = data.online_count || 0;
        offlineCount.value = data.offline_count || 0;
        lockedCount.value = data.locked_count || 0;
        unlockedCount.value = data.unlocked_count || 0;
        totalCount.value = data.computers || 0;
        activeCount.value = data.active_count || 0;
        inactiveCount.value = data.inactive_count || 0;
        maintenanceCount.value = data.maintenance_count || 0;


      } catch (error) {
        console.error('Error fetching status distribution:', error);
        toast.error('Failed to fetch status distribution');
      }
    };
    return {
      onlineCount,
      offlineCount,
      lockedCount,
      unlockedCount,
      totalCount,
      activeCount,
      inactiveCount,
      maintenanceCount,
      fetchStatusDistribution,
    };
  });
