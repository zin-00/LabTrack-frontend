import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'


export const useStates = defineStore('state', () => {
    const toast = useToast();
    const isLoading = ref(false);
    const students = ref([]);
    const admins = ref([]);
    const latestScan = ref([]);
    const selectedStatus = ref('all');
    const searchQuery = ref('');
    const selectedAdmin = ref(null);
    const isEditMode = ref(false);
    const showDropdown = ref(null);
    const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 7,
        total: 0
    })
    const isConfirmationModalOpen = ref(false);
    const modalState = ref(false);
    const statusFilter = ref('all');
    let echoChannel = null;
    const computerLogs = ref({
      data: [],
      meta: {}
    });
    const showFilters = ref(false);
    const dateFilter = ref({
      from: '',
      to: '',
    });

    const success = (message) => {
        toast.success(message)
    }

    const error = (message) => {
        toast.error(message)
    }

    const warning = (message) => {
        toast.warning(message)
    }

    const info = (message) => {
        toast.info(message)
    }

    return {
        // state
        isLoading,
        students,
        admins,
        selectedStatus,
        searchQuery,
        selectedAdmin,
        isEditMode,
        showDropdown,
        pagination,
        isConfirmationModalOpen,
        modalState,
        statusFilter,
        computerLogs,
        showFilters,
        dateFilter,
        latestScan,
        echoChannel,


        // Functions
        success,
        error,
        warning,
        info,
    }
})