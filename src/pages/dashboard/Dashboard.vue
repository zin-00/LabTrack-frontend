<script setup>
import StatCard from '../../components/card/StatCard.vue';
import AuthenticatedLayout from '../../layouts/auth/AuthenticatedLayout.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useStatusDistributionStore } from '../../composable/statistics';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import Table from '../../components/table/Table.vue';

const toast = useToast();
const func = useStatusDistributionStore();
const { fetchStatusDistribution, fetchDataDistribution } = func;

const { 
  onlineCount,
  offlineCount,
  lockedCount,
  unlockedCount,
  totalCount,
  activeCount,
  inactiveCount,
  maintenanceCount,
  usageLab,
  computerCount,
  studentCount,
  activeComputerCount,
  inactiveComputerCount,
  maintenanceComputerCount,
  latestLogs
} = storeToRefs(func);

// Reactive data
const searchQuery = ref('');
const selectedPeriod = ref('week');
const selectedCampaignFilter = ref('all');
const isLoading = ref(true);

// Toast helper
function showError(error) {
  toast.error(`Failed to fetch data: ${error}`);
}

const loadDataDistribution = async () => {
  isLoading.value = true;
  try {
    await fetchDataDistribution(selectedPeriod.value);
  } catch (error) {
    console.error(error);
    showError(error.message || 'Unknown error');
  } finally {
    isLoading.value = false;
  }
};

watch(selectedPeriod, () => {
  loadDataDistribution();
});

const radialSeries = computed(() => [
  activeCount.value || 0,
  inactiveCount.value || 0,
  maintenanceCount.value || 0
]);

const lineChartSeries = computed(() => [
  { name: "Active Units", data: activeComputerCount.value || [] },
  { name: "Inactive Units", data: inactiveComputerCount.value || [] },
  { name: "Maintenance Units", data: maintenanceComputerCount.value || [] },
  {
    name: "Units Used",
    data: (activeComputerCount.value || []).map((val, i) =>
      val + (inactiveComputerCount.value[i] || 0) + (maintenanceComputerCount.value[i] || 0)
    )
  }
]);

const lineChartCategories = computed(() => {
  if (selectedPeriod.value === 'month') {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  } else if (selectedPeriod.value === 'week') {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  } else if (selectedPeriod.value === 'day' || selectedPeriod.value === 'today') {
    return ['Today'];
  }
  return [];
});

const lineChartOptions = computed(() => ({
  chart: { 
    toolbar: { show: false },
    dropShadow: {
      enabled: true,
      top: 3,
      left: 3,
      blur: 3,
      opacity: 0.1
    }
  },
  xaxis: {
    categories: lineChartCategories.value,
    labels: { 
      style: { colors: '#6B7280', fontSize: '12px' }
    }
  },
  yaxis: {
    labels: { 
      style: { colors: '#6B7280', fontSize: '12px' }
    }
  },
  stroke: { 
    curve: "smooth",
    width: 1
  },
  colors: ['#2ef085','#f04a69' ,'#F59E0B', '#2e9cf0'],
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 5
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: function (val) {
        return val;
      }
    }
  }
}));

const barChartSeries = [
  { 
    name: 'Earnings',
    data: [40, 52, 38, 60, 47, 59, 70] 
  }
];

const barChartOptions = {
  chart: { 
    toolbar: { show: false },
    sparkline: { enabled: false }
  },
  xaxis: { 
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    labels: { 
      style: { colors: '#6B7280', fontSize: '11px' }
    }
  },
  yaxis: {
    labels: { 
      style: { colors: '#6B7280', fontSize: '11px' },
      formatter: function (val) {
        return '$' + val + 'K';
      }
    }
  },
  plotOptions: { 
    bar: { 
      columnWidth: "45%",
      borderRadius: 4,
      distributed: false
    } 
  },
  colors: ['#0F172A'],
  grid: {
    show: true,
    borderColor: '#F3F4F6',
    strokeDashArray: 3,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } }
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'light',
    y: {
      formatter: function (val) {
        return '$' + val + 'K';
      }
    }
  }
};

const radialOptions = {
  chart: {
    type: 'radialBar',
    sparkline: { enabled: false }
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '55%',
        background: 'transparent'
      },
      track: {
        background: '#F3F4F6',
        strokeWidth: '100%'
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          offsetY: -10
        },
        value: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#111827',
          offsetY: 5,
          formatter: function (val) {
            return parseFloat(val).toFixed(2) + '%';
          }
        },
        total: {
          show: true,
          label: 'Total',
          fontSize: '13px',
          color: '#6B7280',
          formatter: function (w) {
            const total = w.globals.series.reduce((a, b) => a + b, 0);
            return total.toFixed(2) + '%';
          }
        }
      }
    }
  },
  colors: ['#10B981', '#F43F5E', '#F59E0B'],
  labels: ['Active', 'Inactive', 'Maintenance'],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '12px',
    markers: { width: 8, height: 8 }
  }
};
const setPeriod = (period) => {
  selectedPeriod.value = period;
};

const setCampaignFilter = (filter) => {
  selectedCampaignFilter.value = filter;
};

const getFullName = (log) => {
  if (log.student?.first_name || log.student?.last_name) {
    return `${log.student.first_name || ''} ${log.student.last_name || ''}`.trim()
  }
  return log.student_id || 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

onMounted(async () => {
  try {
    await fetchStatusDistribution();
    await loadDataDistribution();
  } catch (error) {
    console.error('Error loading data:', error);
    showError(error.message || 'Unknown error');
  } finally {
    isLoading.value = false;
  }
});
</script>


<template>
  <AuthenticatedLayout>
    <div class="py-4 max-w-7xl mx-auto sm:px-4 bg-white">
      <!-- Enhanced Header -->
          <div>
          <h2 class="text-2xl font-bold text-gray-900">Overview</h2>
          <p class="mt-1 text-sm text-gray-600"> Track computer activity, usage statistics, and system events in real time.</p>
        </div>

      <!-- Main Grid Section -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Left Side - Takes 3 columns -->
        <div class="xl:col-span-3 space-y-6">
          <!-- Enhanced Stat Cards -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-900">System Node Status</h2>
              <span class="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium cursor-pointer">
                <router-link to="/computer_logs">View Logs</router-link>
              </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard title="Online Nodes" :value="onlineCount" change="+1.26%" />
              <StatCard title="Offline Nodes" :value="offlineCount" change="-1.56%" />
              <StatCard title="Active Sessions" :value="activeCount" change="+3.26%" />
              <StatCard title="Total Units" :value="totalCount" change="+3.25%" />
            </div>
          </div>

          <!-- Enhanced Line Chart -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Campaign Statistics</h3>
              <!-- Period filter buttons -->
              <div class="flex gap-2">
                  <button 
                    @click="setPeriod('month')"
                    :class="selectedPeriod === 'month' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
                  >
                    Month
                  </button>
                  <button 
                    @click="setPeriod('week')"
                    :class="selectedPeriod === 'week' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
                  >
                    Week
                  </button>
                  <button 
                    @click="setPeriod('day')"
                    :class="selectedPeriod === 'day' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors"
                  >
                    Day
                  </button>
              </div>

            </div>
            <apexchart
              v-if="!isLoading"
              height="320"
              type="area"
              :options="lineChartOptions"
              :series="lineChartSeries"
            />
            <div v-else class="h-80 flex items-center justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>

          <!-- Latest Logs Table -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Latest Logs</h3>
                                            <span class="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium">View All</span>

            </div>
          <div class="space-y-3">
            <Table>
              <template #header>
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-xs font-medium text-gray-600 text-left">
                      Student ID
                    </th>
                    <th class="px-3 py-2 text-xs font-medium text-gray-600 text-left">
                      Full Name
                    </th>
                    <th class="px-3 py-2 text-xs font-medium text-gray-600 text-left hidden sm:table-cell">
                      Laboratory
                    </th>
                    <th class="px-3 py-2 text-xs font-medium text-gray-600 text-left hidden md:table-cell">
                      Computer
                    </th>
                    <th class="px-3 py-2 text-xs font-medium text-gray-600 text-left hidden lg:table-cell">
                      IP Address
                    </th>
                    <th class="px-3 py-2 text-xs font-medium text-gray-600 text-left">
                      Date & Time
                    </th>
                  </tr>
                </thead>
              </template>
              
              <template #default>
                <tr 
                  v-for="log in latestLogs" 
                  :key="log.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-3 py-3 text-sm font-medium text-gray-900">
                    {{ log.student?.student_id || '—' }}
                  </td>
                  <td class="px-3 py-3 text-sm text-gray-900">
                    <div class="max-w-xs truncate">
                      {{ getFullName(log) }}
                    </div>
                  </td>
                  <td class="px-3 py-3 text-sm text-gray-700 hidden sm:table-cell">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {{ log.computer?.laboratory?.name || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-sm text-gray-700 hidden md:table-cell">
                    <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      PC-{{ log.computer?.computer_number || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-sm text-gray-700 hidden lg:table-cell">
                    <code class="text-xs bg-gray-100 px-2 py-1 rounded">
                      {{ log.ip_address || 'N/A' }}
                    </code>
                  </td>
                  <td class="px-3 py-3 text-sm text-gray-700">
                    <div class="text-xs">
                      <div class="font-medium">{{ formatDate(log.created_at) }}</div>
                      <div class="text-gray-500">{{ formatTime(log.created_at) }}</div>
                    </div>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-if="!latestLogs || latestLogs.length === 0">
                  <td colspan="6" class="px-3 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-sm">No logs found</span>
                    </div>
                  </td>
                </tr>
              </template>
            </Table>
          </div>

          <!-- Mobile Card View (Alternative for very small screens) -->
          <div class="block sm:hidden space-y-3 mt-4">
            <div 
              v-for="log in latestLogs" 
              :key="`mobile-${log.id}`"
              class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-medium text-gray-900">{{ getFullName(log) }}</h3>
                  <p class="text-sm text-gray-500">ID: {{ log.student?.student_id || '—' }}</p>
                </div>
                <div class="text-right">
                  <div class="text-xs font-medium text-gray-900">{{ formatDate(log.created_at) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(log.created_at) }}</div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span class="text-gray-500">Lab:</span>
                  <span class="ml-1 text-gray-900">{{ log.computer?.laboratory?.name || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-gray-500">PC:</span>
                  <span class="ml-1 font-mono text-xs">{{ log.computer?.computer_number || 'N/A' }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-gray-500">IP:</span>
                  <code class="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">{{ log.ip_address || 'N/A' }}</code>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- Right Side - Takes 1 column -->
        <div class="space-y-6">
          <!-- Enhanced Campaign Earning Radial -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Node Activity</h3>
              <p class="text-sm text-gray-600">Uptime distribution</p>
            </div>
            <apexchart
              v-if="!isLoading"
              height="250"
              type="radialBar"
              :options="radialOptions"
              :series="radialSeries"
            />
            <div v-else class="h-64 flex items-center justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Weekly Usage</h3>
              <p class="text-3xl font-bold text-gray-900">3,190,523</p>
              <p class="text-sm text-green-600 mt-1">+8.2% from last week</p>
            </div>
            <apexchart
              height="180"
              type="bar"
              :options="barChartOptions"
              :series="barChartSeries"
            />
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>