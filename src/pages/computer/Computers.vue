<script setup>
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue';
import AuthenticatedLayout from '../../layouts/auth/AuthenticatedLayout.vue';
import { useToast } from 'vue-toastification';
import { EllipsisVerticalIcon } from '@heroicons/vue/16/solid';
import TextInput from '../../components/input/TextInput.vue';
import Modal from '../../components/modal/Modal.vue';
import { useComputerStore} from '../../composable/useFuncion';

const toast = useToast();

// Stores
const func = useComputerStore();

// Unlock form
const form = reactive({ rfid_uid: '' });

// Refs
const rfidInputRef = ref(null);

const newComputer = reactive({
  computer_number: '',
  ip_address: '',
  laboratory_id: 1,
  status: 'active'
});

const showModal = ref(false);
const showComputerModal = ref(false);
const selectedComputer = ref(null);
const selectedLab = ref('all');
const selectedStatus = ref('all');
const showDropdown = ref(null);
const isSubmitting = ref(false);

// Success/error flags for RFID form (add as needed)
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

// Methods
const loadComputers = async () => {
  try {
    await func.fetchComputers();
  } catch (error) {
    toast.error('Failed to fetch computers.');
    console.error(error);
  }
};

const loadLabs = async () => {
  try {
    await func.fetchLabs();
  } catch (error) {
    toast.error('Failed to fetch laboratories.');
    console.error(error);
  }
};

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
    await loadComputers();
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
    laboratory_id: computer.laboratory_id ?? func.labs?.[0]?.id ?? 1,
    status: computer.status ?? 'active'
  });
  showComputerModal.value = true;
};

const deleteComputer_func = async (id) => {
  try {
    await func.deleteComputer(id);
    await loadComputers();
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

// Lifecycle
onMounted(() => {
  loadComputers();
  loadLabs();
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
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-6">Computer Management</h2>

      <!-- Filters + Add -->
      <div class="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-end mb-6">
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
            class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Add Computer</span>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-gray-200 mb-6" />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="computer in filteredComputers"
        :key="computer.id"
        class="group relative rounded-lg border border-gray-200 bg-white p-4 cursor-pointer transition-all hover:shadow-sm hover:border-blue-300"
      >
        <!-- Status dot with Online/Offline Label -->
        <div class="absolute top-2 left-2 flex items-center">
          <div
            class="w-3 h-3 rounded-full mr-2"
            :class="{
              'bg-green-500': computer.is_online,
              'bg-red-500': !computer.is_online
            }"
          ></div>
          <span class="text-xs font-medium text-gray-600">
            {{ computer.is_online ? 'Online' : 'Offline' }}
          </span>
        </div>

        <!-- Menu -->
        <div class="absolute top-2 right-2">
          <button
            @click.stop="toggleDropdown(computer.id)"
            class="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <EllipsisVerticalIcon class="h-4 w-4" />
          </button>

          <div
            v-if="showDropdown === computer.id"
            class="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 text-sm"
          >
            <button
              @click.stop="editComputer(computer)"
              class="block w-full text-left px-3 py-1.5 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              @click.stop="deleteComputer_func(computer.id)"
              class="block w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Computer Info -->
        <div @click="openModal(computer)">
          <h2 class="text-base font-semibold mt-2 text-gray-900">
            PC {{ computer.computer_number }}
          </h2>
          <p class="text-xs text-gray-500 mt-1">IP: {{ computer.ip_address }}</p>
          <p class="text-xs text-gray-500 mt-1">
            Lab: {{ func.labs?.find(l => l.id === computer.laboratory_id)?.name || 'Unknown' }}
          </p>
          
          <p class="mt-2">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-50 text-green-700 border border-green-200': computer.status === 'active',
                'bg-red-50 text-red-700 border border-red-200': computer.status === 'inactive',
                'bg-yellow-50 text-yellow-700 border border-yellow-200': computer.status === 'maintenance'
              }"
            >
              {{ computer.status }}
            </span>
          </p>

           <p class="mt-2">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-50 text-green-700 border border-green-200': computer.is_lock,
                'bg-red-50 text-red-700 border border-red-200': !computer.is_lock,
              }"
            >
              {{ computer.is_lock ? 'Locked' : 'Unlocked' }}
            </span>
          </p>
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
