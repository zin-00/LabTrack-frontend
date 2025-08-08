<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import AuthenticatedLayout from '../../layouts/auth/AuthenticatedLayout.vue';
import { useToast } from 'vue-toastification';
import { ArrowPathIcon, PlusIcon, ArrowDownTrayIcon, XMarkIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline';
import { useLaboratoryStore } from '../../composable/laboratory';
import { storeToRefs } from 'pinia';
import {useRouter} from 'vue-router';
import Modal from '../../components/modal/Modal.vue';
import { Ellipsis } from 'lucide-vue-next';
import Button from '../../components/button/Button.vue';
import { useComputerStore } from '../../composable/computers';

const router = useRouter();
const labStore = useLaboratoryStore();
const cstore = useComputerStore();
const toast = useToast();


const {laboratories,
        isLoading,
        statusFilter,
        selectedLab,
        isModalOpen,
        isEditMode,
        isImportModalOpen,
        showDropdown,
        addModal,
        searchQuery,
        populateModal,
        unassignedComputers,
        selectedComputers,
        currentLabId,
    } = storeToRefs(labStore);

const { fetchLaboratories,
        storeLaboratory,
        updateLaboratory,
        deleteLaboratory,
        selectedLabFilter,
        } = labStore;
const {computers} = storeToRefs(cstore);
const {
        fetchComputers,
        fetchNoLabComputers,
        assignLabToComputer
        } = cstore;

const props = defineProps({
    LabName: String,
})

const newLab = reactive({
    name: '',
    code: '',
    description: '',
    status: 'active',
});

const goToLaboratory = (lab) => {
    router.push({ name: 'computer', params: { lab: lab.id} });
};

const filterLaboratories = computed(() => {
  return (laboratories.value || []).filter((lab) => {
    const matchesQuery = lab.name?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !statusFilter.value || lab.status === statusFilter.value;
    return matchesQuery && matchesStatus;
  });
});

const saveLaboratory = () => {
    try{
        if(selectedLab.value.id) {
           updateLaboratory(selectedLab.value.id, newLab);
        } else {
           storeLaboratory(newLab);
        }
        fetchLaboratories();
        clearForm();
        isModalOpen.value = false;
    }catch (error) {
        console.error('Error saving laboratory:', error);
    }
}

const clearForm = () => {
    newLab.id = null;
    newLab.name = '';
    newLab.code = '';
    newLab.description = '';
    newLab.status = 'active';
}

const editlab = (laboratory) => {
    selectedLab.value = laboratory;
    Object.assign(newLab, {
        id: laboratory.id,
        name: laboratory.name,
        code: laboratory.code,
        description: laboratory.description,
        status: laboratory.status,
    });
    isModalOpen.value = true;
}
  const openAddModal = () => {
    selectedLab.value = null;
    Object.assign(selectedLab, {
      id: null,
      name: '',
      code: '',
      description: '',
      status: 'active',
    });
    isModalOpen.value = true;
  }
  const toggleDropdown = (id) => {
    showDropdown.value = showDropdown.value === id ? null : id;
  };

  const openPopulateModal = (labId) => {
    currentLabId.value = labId;
    populateModal.value = true;
    selectedComputers.value = [];
    loadUnassignedComputers();
  };

  const toggleComputerSelection = (computerId) => {
    if (selectedComputers.value.includes(computerId)) {
      selectedComputers.value = selectedComputers.value.filter(id => id !== computerId);
    } else {
      selectedComputers.value.push(computerId);
    }
  };

  const loadUnassignedComputers = () => {
    fetchNoLabComputers();

    unassignedComputers.value = computers.value.filter(computer => !computer.laboratory_id);
  };
const assignComputers = async () => {
  try {
    if (selectedComputers.value.length === 0) {
      toast.error('Please select at least one computer');
      return;
    }

    const success = await assignLabToComputer(selectedComputers.value, currentLabId.value);
    
    if (success) {
      toast.success(`${selectedComputers.value.length} computer(s) assigned successfully`);
      selectedComputers.value = [];
      populateModal.value = false;
    }
  } catch (error) {
    toast.error('Failed to assign computers');
    console.error(error);
  }
};

onMounted(() => {
    fetchLaboratories();
    loadUnassignedComputers();
});

</script>
<template>
    <AuthenticatedLayout>
        <div class="py-4 max-w-7xl mx-auto sm:px-4 bg-white">
            <h2 class="text-lg font-semibold mb-6">Laboratory Management</h2>
                <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                     <div class="flex flex-wrap gap-2 items-center">
                    <!-- Search Box -->
                    <div class="relative">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search globally..."
                            class="w-64 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            >
                        <Button
                            v-if="searchQuery"
                            @click="searchQuery = ''"
                            class="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                            >
                            <XMarkIcon class="w-4 h-4" />
                        </Button>
                    </div>

                    <!-- Status Filter -->
                    <select
                        v-model="statusFilter"
                        class="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                       
                    <!-- Year Level Filter -->
                    
                </div>
                     <div class="flex gap-2">

                        <Button
                            @click="openAddModal"
                            title="Add User"
                            class=" inline-flex items-center p-2  text-white text-sm  bg-gray-800 hover:bg-gray-700 rounded-md transition duration-200"
                            >
                            <PlusIcon class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <!-- Laboratory Card Content -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div
                        v-for="lab in filterLaboratories"
                        :key="lab.id"
                        @click="goToLaboratory(lab)"
                        class="relative flex flex-col justify-between border border-black rounded-lg p-6 shadow-sm transition transform hover:scale-[1.02] hover:shadow-md bg-white"
                        >
                        <!-- Dropdown Button -->
                        <button 
                            @click.stop="toggleDropdown(lab.id)"
                            class="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
                        >
                            <EllipsisVerticalIcon class="h-5 w-5" />
                        </button>

                        <!-- Dropdown Menu -->
                        <div
                            v-if="showDropdown === lab.id"
                            class="absolute right-2 top-8 w-28 bg-white rounded-md shadow-lg border border-gray-200 z-10 py-1 text-xs"
                        >
                            <button 
                            @click.stop="editlab(lab)"
                            class="block w-full text-left px-2 py-1 hover:bg-gray-100"
                            >
                            Edit
                            </button>
                            <button 
                            @click.stop="deleteLaboratory(lab.id)"
                            class="block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100"
                            >
                            Delete
                            </button>
                        </div>

                        <!-- Lab Details -->
                        <div>
                            <h3 class="text-lg font-bold text-black">{{ lab.name }}</h3>
                            <p class="mt-2 text-sm text-gray-700">{{ lab.code }}</p>
                        </div>
                        <!-- Status and Button in Same Row -->
                            <div class="flex items-center justify-between mt-4 border-t border-gray-300 pt-2">
                                <div class="text-xs text-gray-500">
                                    Status:
                                    <span class="font-semibold capitalize text-black">{{ lab.status }}</span>
                                </div>
                               <Button
                                    @click.stop="openPopulateModal(lab.id)"
                                    class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                    Assign Computers
                                </Button>
                            </div>
                        </div>
                </div>

           <!-- Add this new modal at the bottom of your template -->
                <Modal :show="populateModal" @close="populateModal = false">
                    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto relative">
                        <h2 class="text-lg font-semibold mb-4">Assign Computers to Laboratory</h2>
                        
                        <div v-if="unassignedComputers.length > 0" class="max-h-96 overflow-y-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Select
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Computer #
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                IP Address
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                MAC Address
                                </th>
                            </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="computer in unassignedComputers" :key="computer.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    :checked="selectedComputers.includes(computer.id)"
                                    @change="toggleComputerSelection(computer.id)"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                >
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ computer.computer_number }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ computer.ip_address }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ computer.mac_address || 'N/A' }}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                        
                        <div v-else class="text-center py-4 text-gray-500">
                        No unassigned computers available
                        </div>
                        
                        <div class="flex justify-end gap-2 mt-6">
                        <Button
                            @click="populateModal = false"
                            class="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </Button>
                        <Button
                            @click="assignComputers"
                            :disabled="selectedComputers.length === 0"
                            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            Assign Selected ({{ selectedComputers.length }})
                        </Button>
                        </div>
                    </div>
                </Modal>
        <!-- Add and edit Modal -->
            <Modal :show="isModalOpen" @close="isModalOpen = false">
                <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
                <h2 class="text-lg font-semibold mb-4">
                    {{ selectedLab ? 'Edit Laboratory' : 'Add New Laboratory' }}
                </h2>
                
                    <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                        v-model="newLab.name"
                        type="text"
                        required
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <input
                        v-model="newLab.code"
                        type="text"
                        required
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        >
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                        v-model="newLab.description"
                        rows="3"
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        ></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                        v-model="newLab.status"
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                    <Button
                        type="button"
                        @click="isModalOpen = false"
                        class="px-4 py-2 text-sm bg-gray-500 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </Button>
                    <Button
                        @click="saveLaboratory"
                        type="submit"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Save
                    </Button>
                    </div>
                </div>
            </Modal>
        </div>
    </AuthenticatedLayout>
</template>