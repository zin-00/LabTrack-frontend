import { defineStore } from "pinia";
import { useApiUrl } from "../api/api";
import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const {api , getAuthHeader} = useApiUrl();

export const useAdminStore = defineStore('admin', () => {
    const admins = ref([]);
    const isLoading = ref(false);
    const selectedStatus = ref('all');
    const searchQuery = ref('');
    const selectedAdmin = ref(null);
    const isEditMode = ref(false);
    const showDropdown = ref(null);
    const toast = useToast();

        const pagination = ref({
        current_page: 1,
        last_page: 1,
        per_page: 7,
        total: 0
    });
    
    const isConfirmationModalOpen = ref(false);
    const modalState = ref(false);

    const statusFilter = ref('all');

    const storeAdmin = async (data) => {
        try {
            const response = await axios.post(`${api}/admin/users`, data, getAuthHeader());
            modalState.value = false;
            if (response.data.success) {
                admins.value.push(response.data.user);
                toast.success(response.data.message || 'Admin added successfully!');
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to add admin.');
            }
        } catch(error) {
            console.error('Error storing admin:', error);
            toast.error(error.response?.data?.message || 'Error storing admin');
            throw error;
        }
    }

    const fetchAdmins = async (page = 1) => {
        try {
            isLoading.value = true;
            const response = await axios.get(`${api}/admin/users?page=${page}`, getAuthHeader());
            
            admins.value = response.data.users.data || [];
            pagination.value = {
                current_page: response.data.users.current_page,
                last_page: response.data.users.last_page,
                per_page: response.data.users.per_page,
                total: response.data.users.total
            };
        } catch(error) {
            admins.value = [];
            toast.error(error.response?.data?.message || 'Failed to fetch admins');
        } finally {
            isLoading.value = false;
        }
    }

    const updateAdmin = async (id, data) => {
        try{
            await axios.put(`${api}/admins/users/${id}`, data, getAuthHeader());
            toast.success('Admin updated successfully!');
            await fetchAdmins(pagination.value.currentPage);
        }catch(error){
            toast.error('Failed to update admin.');
            console.error('Error updating admin:', error);
        }
    }

    const deleteAdmin = async (id) => {
        try{
            await axios.delete(`${api}/admins/users/${id}`, getAuthHeader());
            toast.success('Admin deleted successfully!');
            await fetchAdmins(pagination.value.currentPage);
        }catch(error){
            toast.error('Failed to delete admin.');
            console.error('Error deleting admin:', error);
        }
    }
    return{

        // State
        admins,
        isLoading,
        modalState,
        isConfirmationModalOpen,
        selectedStatus,
        searchQuery,
        selectedAdmin,
        isEditMode,
        showDropdown,
        statusFilter,
        pagination,

        // Functions
        storeAdmin,
        fetchAdmins,
        updateAdmin,
        deleteAdmin,
    
    }


});