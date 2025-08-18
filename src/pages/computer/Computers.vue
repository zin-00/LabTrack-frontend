<script setup>
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue';
import AuthenticatedLayout from '../../layouts/auth/AuthenticatedLayout.vue';
import { useToast } from 'vue-toastification';
import { EllipsisVerticalIcon } from '@heroicons/vue/16/solid';
import TextInput from '../../components/input/TextInput.vue';
import Modal from '../../components/modal/Modal.vue';
import { useComputerStore} from '../../composable/computers';
import { useRouter } from 'vue-router';

const toast = useToast();
const route = useRouter();
// Stores
const func = useComputerStore();

// Unlock form
const form = reactive({ rfid_uid: '' });

// Refs
const rfidInputRef = ref(null);

const newComputer = reactive({
  computer_number: '',
  ip_address: '',
  mac_address: '',
  laboratory_id: 1,
  status: 'active',
  // is_unlock: true,
  // is_online: false,
});

let currentChannel = null;

const showModal = ref(false);
const showComputerModal = ref(false);
const selectedComputer = ref(null);
const selectedLab = ref('all');
const selectedStatus = ref('all');
const showDropdown = ref(null);
const isSubmitting = ref(false);

const hasError = ref(false);
const errorMessage = ref('');
const isSuccess = ref(false);
const successMessage = ref('Tag accepted. Unlocking…');

const filteredComputers = computed(() => {
  return func.computers.filter((computer) => {
    const labMatch =
      selectedLab.value === 'all' || computer.laboratory_id === parseInt(selectedLab.value);
    const statusMatch =
      selectedStatus.value === 'all' || computer.status === selectedStatus.value;
    return labMatch && statusMatch;
  });
});

const openModal = (computer) => {
  selectedComputer.value = computer;
  showModal.value = true;
  hasError.value = false;
  isSuccess.value = false;
  form.tag = '';
};

const closeModal = () => {
  if (isSubmitting.value) return;
  showModal.value = false;
  selectedComputer.value = null;
  form.tag = '';
};

const toggleDropdown = (id) => {
  showDropdown.value = showDropdown.value === id ? null : id;
};

const openAddComputerModal = () => {
  selectedComputer.value = null;
  Object.assign(newComputer, {
    computer_number: '',
    ip_address: '',
    laboratory_id: func.labs?.[0]?.id || 1,
    status: 'active'
  });
  showComputerModal.value = true;
};

const saveComputer = async () => {
  try {
    if (selectedComputer.value) {
      await func.updateComputer(selectedComputer.value.id, newComputer);
    } else {
      await func.storeComputer(newComputer);
    }
     func.fetchComputers();
    showComputerModal.value = false;
  } catch (error) {
    toast.error('Failed to save computer.');
    console.error(error);
  }
};

const editComputer = (computer) => {
  selectedComputer.value = computer;
  Object.assign(newComputer, {
    computer_number: computer.computer_number?.toString() ?? '',
    ip_address: computer.ip_address ?? '',
    mac_address: computer.mac_address ?? '',
    laboratory_id: computer.laboratory_id ?? func.labs?.[0]?.id ?? 1,
    status: computer.status ?? 'active'
  });
  showComputerModal.value = true;
};

const deleteComputer_func = async (id) => {
  try {
    await func.deleteComputer(id);
    func.fetchComputers();
  } catch (error) {
    toast.error('Failed to delete computer.');
    console.error(error);
  }
};

const clearError = () => {
  hasError.value = false;
  errorMessage.value = '';
};

const unlockComputer = async () => {
  if (!form.rfid_uid) {
    hasError.value = true;
    errorMessage.value = 'Please enter a tag.';
    toast.error(errorMessage.value);
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const success = await func.unlockComputer(selectedComputer.value.id, form.rfid_uid);
    
    if (success) {
      isSuccess.value = true;
      successMessage.value = 'Computer unlocked successfully!';
      setTimeout(() => {
        isSubmitting.value = false;
        closeModal();
      }, 1200);
    } else {
      isSubmitting.value = false;
    }
  } catch (error) {
    hasError.value = true;
    errorMessage.value = 'Failed to unlock computer.';
    isSubmitting.value = false;
  }
};
const listenToComputerEvents = () => {
    if(!window.echo){
        toast.error('Echo is not initialized!');
        console.error('Echo is not initialized!');
        return;
    }
    
    // Listen to all computer status updates
    window.echo.channel(`computer-status`)
    .listen('.ComputerStatusUpdated', (e) => {
        if (!e.computer) {
            toast.error('No computer data in event:', e);
            return;
        }
        toast.success('Event received: Computer status updated');
        const updatedComputer = e.computer;
        const index = func.computers.findIndex(c => c.id === updatedComputer.id);
        
        if (index !== -1) {
            // Update the computer in the store
            func.computers[index] = { ...func.computers[index], ...updatedComputer };
        } else {
            func.computers.push(updatedComputer);
        }
        
        toast.info(`Computer (${updatedComputer.ip_address}) is now ${updatedComputer.is_online ? 'online' : 'offline'}`);
    });
}

// Lifecycle
onMounted(() => {
  func.fetchComputers();
  func.fetchLabs();
  listenToComputerEvents();

    if (window.echo && window.echo.connector && window.echo.connector.socket) {
    const socket = window.echo.connector.socket;

    socket.on('connect', () => {
      console.log('Connected to Reverb websocket server');
      toast.success('Connected to Reverb websocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Reverb websocket server');
      toast.error('Disconnected from Reverb websocket server');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      toast.error('WebSocket error: ' + error.message);
    });
  }

});

watch(selectedComputer, (newComputer, oldComputer) => {
  if(currentChannel && oldComputer){
      currentChannel.unsubscribe();
  }
  if(newComputer && newComputer.ip_address){
      currentChannel = window.echo.channel(`computer-status.${newComputer.ip_address}`);  // use public channel here

      currentChannel.listen('.ComputerStatusUpdated', (event) => {
          if (!event.computer) {
              toast.error('No computer data in event:', event);
              return;
          }
          toast.success('Event received: Computer status updated');
          const updatedComputer = event.computer;
          const index = func.computers.findIndex(c => c.id === updatedComputer.id);
          
          if(index !== -1) {
              func.computers[index] = { ...func.computers[index], ...updatedComputer };
          } else {
              func.computers.push(updatedComputer);
          }
          toast.info(`Computer (${updatedComputer.ip_address}) is now ${updatedComputer.is_online ? 'online' : 'offline'}`);
      });
  }
});


watch(showModal, async (newVal) => {
  if (newVal) {
    await nextTick();
    rfidInputRef.value?.focus();
  } else {
    form.tag = '';
  }
});
</script>

<template>
  <AuthenticatedLayout>
    <div class="py-4 max-w-7xl mx-auto sm:px-4 bg-white">
     <div>
        <h2 class="text-2xl font-bold text-gray-900">Computer Management</h2>
         <p class="mt-1 text-sm text-gray-600">Manage computers, unlock remotely, and perform CRUD.</p>
      </div>

      <!-- Filters + Add -->
      <div class="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-end mb-6 mt-5">
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-1">
          <!-- Lab -->
          <div class="w-full sm:w-auto min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Laboratory</label>
            <select
              v-model="selectedLab"
              class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="all">All Laboratories</option>
              <option v-for="lab in func.labs || []" :key="lab.id" :value="lab.id">
                {{ lab.name }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div class="w-full sm:w-auto min-w-[160px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <!-- Add -->
        <div class="w-full sm:w-auto">
          <button
            @click="openAddComputerModal"
            class="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
          >
           
            <span>Add Computer</span>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-gray-200 mb-6" />

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        <div
          v-for="computer in filteredComputers"
          :key="computer.id"
          class="relative border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
          :class="computer.is_online ? 'border-gray-800 bg-white' : 'border-gray-400 bg-gray-50'"
          @click="openModal(computer)"
        >
          <!-- Menu -->
          <button
            @click.stop="toggleDropdown(computer.id)"
            class="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
          >
            <EllipsisVerticalIcon class="h-3 w-3 text-gray-600" />
          </button>

          <div
            v-if="showDropdown === computer.id"
            class="absolute right-0 top-8 w-24 bg-white rounded-md shadow-lg border border-gray-200 z-10 py-1 text-xs"
          >
            <button @click.stop="editComputer(computer)" class="block w-full text-left px-2 py-1 hover:bg-gray-100">
              Edit
            </button>
            <button @click.stop="deleteComputer_func(computer.id)" class="block w-full text-left px-2 py-1 text-gray-900 hover:bg-gray-100">
              Delete
            </button>
          </div>

          <!-- Content -->
          <div class="pr-6">
            <div class="flex items-center mb-2">
              <div 
                class="w-2 h-2 rounded-full mr-2 border"
                :class="computer.is_online ? 'bg-green-500 border-black' : 'bg-red-500 border-gray-400'"
              ></div>
              <span class="text-sm font-medium text-gray-900">PC {{ computer.computer_number }}</span>
            </div>
            
            <div class="text-xs text-gray-600 space-y-1">
              <div>{{ computer.ip_address }}</div>
              <div>{{ computer.mac_address || 'No MAC' }}</div>
              <div>{{ func.labs?.find(l => l.id === computer.laboratory_id)?.name || 'Unknown' }}</div>
            </div>
            
            <div class="flex gap-1 mt-2">
              <span
                class="px-2 py-0.5 rounded-full text-xs border capitalize"
                :class="{
                  'bg-green-500 text-white': computer.status === 'active',
                  'bg-red-500 text-white ': computer.status === 'inactive',
                  'bg-orange-500 text-white ': computer.status === 'maintenance'
                }"
              >
                {{ computer.status }}
              </span>
              
              <span
                class="px-2 py-0.5 rounded-full text-xs border"
                :class="computer.is_lock 
                  ? 'bg-green-500 text-white ' 
                  : 'bg-red-500 text-white '"
              >
                {{ computer.is_lock ? 'Lock' : 'Unlock' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Unlock Modal -->
      <Modal :show="showModal" @close="closeModal" :closeable="!isSubmitting">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <!-- lock icon -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 11V7a4 4 0 10-8 0v4M5 11h6m4 0h2a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2"
                  />
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Scan RFID Card</h2>
            </div>
            <button
              v-if="!isSubmitting"
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 text-xl leading-none px-1 rounded-md hover:bg-gray-100 transition"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <!-- Computer info -->
          <div class="mb-6 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p class="text-xs text-blue-700">Computer to unlock:</p>
            <p class="text-base font-medium text-blue-900">
              Computer {{ selectedComputer?.computer_number ?? 'N/A' }}
            </p>
          </div>

          <!-- RFID input -->
          <div class="mb-4">
            <label for="rfid_input" class="block text-sm font-medium text-gray-700 mb-1">
              RFID Tag
            </label>
            <div class="relative">
              <TextInput
                ref="rfidInputRef"
                id="rfid_input"
                type="password"
                placeholder="Scan card..."
                v-model="form.rfid_uid"
                class="w-full text-center text-lg px-4 py-3 border-2 rounded-md transition-colors"
                :class="{
                  'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !hasError && !isSuccess,
                  'border-red-500 focus:border-red-500 focus:ring-red-500': hasError,
                  'border-green-500 focus:border-green-500 focus:ring-green-500': isSuccess,
                  'cursor-not-allowed opacity-50': isSubmitting
                }"
                maxlength="10"
                :disabled="isSubmitting"
                autocomplete="off"
                @keyup.enter="unlockComputer"
                @input="clearError"
              />

              <!-- Spinner -->
              <div
                v-if="isSubmitting"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
              </div>

              <!-- Success check -->
              <div
                v-else-if="isSuccess"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <!-- Feedback -->
            <p v-if="hasError" class="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </p>
            <p v-if="isSuccess" class="mt-2 text-sm text-green-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 13l4 4L19 7" />
              </svg>
              {{ successMessage }}
            </p>
          </div>

          <!-- Tag length -->
          <p v-if="form.tag" class="mt-2 text-xs text-gray-500 text-center">
            Tag length: {{ form.rfid_uid.length }}/10
          </p>

          <!-- Actions -->
          <div class="flex justify-end gap-2 mt-6">
            <button
              v-if="!isSubmitting"
              @click="closeModal"
              class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              :disabled="isSubmitting"
              @click="unlockComputer"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {{ isSubmitting ? 'Unlocking…' : 'Unlock' }}
            </button>
          </div>
        </div>
      </Modal>

      <!-- Add / Edit Computer Modal -->
      <Modal :show="showComputerModal" @close="showComputerModal = false">
           <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative">

          <h2 class="text-lg font-semibold mb-4">
            {{ selectedComputer ? 'Edit Computer' : 'Add New Computer' }}
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Computer Number</label>
              <input
                v-model="newComputer.computer_number"
                type="text"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
              <input
                v-model="newComputer.ip_address"
                type="text"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
              <input
                v-model="newComputer.mac_address"
                type="text"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Laboratory</label>
              <select
                v-model="newComputer.laboratory_id"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option v-if="(func.labs?.length ?? 0) === 0" disabled>No labs</option>
                <option
                  v-for="lab in func.labs || []"
                  :key="lab.id"
                  :value="lab.id"
                >
                  {{ lab.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="newComputer.status"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button
              @click="showComputerModal = false"
              class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              @click="saveComputer"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </AuthenticatedLayout>
</template>
