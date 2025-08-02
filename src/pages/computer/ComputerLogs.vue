<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import AuthenticatedLayout from '../../layouts/auth/AuthenticatedLayout.vue';
import Table from '../../components/table/Table.vue';
import { useToast } from 'vue-toastification';
import * as XLSX from 'xlsx';
import { useComputerLogStore } from '../../composable/useFuncion';
import { DocumentArrowDownIcon, ExclamationCircleIcon} from '@heroicons/vue/24/outline';

const toast = useToast();
const loading = ref(false);

const func = useComputerLogStore();



const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 7,          
  from: 1,
  to: 10,
});
const selectedStatus = ref('all');

// Date filter
const dateFilter = ref({
  from: '',
  to: '',
});

const filteredLogs = computed(() => {
  if (!func.computerLogs.data) return [];
  
  return func.computerLogs.data.filter((log) => {
    if (dateFilter.value.from && new Date(log.created_at) < new Date(dateFilter.value.from)) return false;
    if (dateFilter.value.to && new Date(log.created_at) > new Date(dateFilter.value.to)) return false;
    return true;
  });
});

const fetchLogs = async (page =1) => {
    func.fetchComputerLogs(page)
}

const EventListener = () => {
  window.Echo.channel('computers')
    .listen('ComputerUnlocked', (e) => {
      toast.success('Computer unlocked by ' + (e.user?.name || 'Unknown'));

      logs.value.unshift({
        id: e.log?.id || Date.now(),
        computer_id: e.computer?.id || 'Unknown',
        user: e.user?.name || 'Unknown',
        ip: e.ip || 'N/A',
        event_type: 'Unlock',
        created_at: new Date().toISOString(),
      });

      if (logs.value.length > 50) {
        logs.value = logs.value.slice(0, 50);
      }
    });
};

onMounted(() => {
  EventListener();
  fetchLogs();
});


// Export to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredLogs.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ActivityLogs');
  XLSX.writeFile(workbook, 'activity_logs.xlsx');
};
</script>

<template>
  <AuthenticatedLayout>
    <div class="py-4 max-w-7xl mx-auto sm:px-4">
      <h2 class="text-lg font-semibold mb-3">Activity Log</h2>

      <!-- Filters -->
      <div class="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-end mb-6">
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-1">
          <!-- Status -->
          <div class="w-full sm:w-auto min-w-[160px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <!-- Date From -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input type="date" v-model="dateFilter.from" class="border rounded px-2 py-1 text-sm" />
          </div>

          <!-- Date To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="date" v-model="dateFilter.to" class="border rounded px-2 py-1 text-sm" />
          </div>
        </div>

        <!-- Export Button -->
         <div class="w-full sm:w-auto flex gap-3">
          <button
            title="Incident Report"
            @click="exportToExcel"
            class="py-2 text-white rounded-md text-sm cursor-pointer"
          >
            <ExclamationCircleIcon class="w-5 h-5 text-black" />
          </button>
        </div>
         <div class="w-full sm:w-auto flex gap-3">
          <button
            title="Export to Excel"
            @click="exportToExcel"
            class="py-2 text-white rounded-md cursor-pointer text-sm"
          >
           <DocumentArrowDownIcon class="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-gray-200 mb-6" />

      <!-- Table -->
      <div class="mt-4">
       <Table :pagination="func.computerLogs" :loading="func.isLoading" :data="filteredLogs">
            <template #header>
                <thead class="bg-gray-100 text-gray-700 text-xs uppercase">
                <tr>
                    <th class="px-4 py-2 text-left">ID</th>
                    <th class="px-4 py-2 text-left">Computer</th>
                    <th class="px-4 py-2 text-left">Laboratory</th>
                    <th class="px-4 py-2 text-left">StudentID</th>
                    <th class="px-4 py-2 text-left">Full Name</th>
                    <th class="px-4 py-2 text-left">Ip Address</th>
                    <th class="px-4 py-2 text-left">Mac Address</th>
                    <th class="px-4 py-2 text-left">Event</th>
                    <th class="px-4 py-2 text-left">Uptime</th>
                    <th class="px-4 py-2 text-left">Date and Time</th>
                </tr>
                </thead>
            </template>

            <tr v-for="log in filteredLogs" :key="log.id">
                <td class="px-4 py-2">{{ log.id }}</td>
                <td class="px-4 py-2">
                PC {{log.computer?.computer_number  || 'N/A' }}
                </td>
                <td class="px-4 py-2">
                {{ log.computer?.laboratory?.name || 'N/A' }}
                </td>
                <td class="px-4 py-2">{{ log.student?.student_id || 'N/A' }}</td>
                <td class="px-4 py-2">
                {{ log.student?.first_name + ' ' + log.student?.last_name || log.student_id || 'N/A' }}
                </td>
                <td class="px-4 py-2">{{ log.ip_address || 'N/A' }}</td>
                <td class="px-4 py-2">{{ log.mac_address || 'N/A' }}</td>
                <td class="px-4 py-2">{{ log.event_type || 'N/A' }}</td>
                <td class="px-4 py-2">{{ log.uptime || 'N/A' }}</td>
                <td class="px-4 py-2">{{ new Date(log.created_at).toLocaleString() }}</td>
            </tr>
        </Table>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
