<script setup>
import StatCard from '../../components/card/StatCard.vue';
import AuthenticatedLayout from '../../layouts/auth/AuthenticatedLayout.vue';
import { ref, computed, onMounted} from 'vue';
import { useStatusDistributionStore } from '../../composable/statistics';

const func = useStatusDistributionStore();

// Reactive data
const searchQuery = ref('');
const selectedPeriod = ref('week');
const selectedCampaignFilter = ref('all');

const lineChartSeries = [
  {
    name: "Active Units",
    data: [20, 40, 35, 50, 49, 60, 70, 91, 125]
  },
  {
    name: "Inactive Units", 
    data: [10, 30, 25, 40, 39, 50, 60, 81, 115]
  },
    {
        name: "Maintenance Units",
        data: [5, 15, 10, 20, 19, 30, 40, 61, 95]
    },
    {
        name: "Units Used",
        data: [35, 85, 70, 110, 107, 140, 170, 233, 335]
    }
]

const lineChartOptions = {
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
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
        return val + "K"
      }
    }
  }
}

const barChartSeries = [
  { 
    name: 'Earnings',
    data: [40, 52, 38, 60, 47, 59, 70] 
  }
]

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
        return '$' + val + 'K'
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
        return '$' + val + 'K'
      }
    }
  }
}

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


// Sample data for latest campaigns
const latestCampaigns = ref([
  {
    id: 1,
    name: 'Kathryn Murphy',
    avatar: 'https://i.pravatar.cc/40?img=1',
    date: '15 August 2023',
    budget: '$5K',
    status: 'Active',
    location: 'Singapore',
    performance: '+12.5%',
    trend: 'up'
  },
  {
    id: 2,
    name: 'Floyd Miles',
    avatar: 'https://i.pravatar.cc/40?img=2',
    date: '15 August 2023', 
    budget: '$20K',
    status: 'Paused',
    location: 'Singapore',
    performance: '-2.1%',
    trend: 'down'
  },
  {
    id: 3,
    name: 'Jerome Bell',
    avatar: 'https://i.pravatar.cc/40?img=3',
    date: '14 August 2023',
    budget: '$8.5K',
    status: 'Active',
    location: 'Malaysia',
    performance: '+8.3%',
    trend: 'up'
  },
  {
    id: 4,
    name: 'Brooklyn Simmons',
    avatar: 'https://i.pravatar.cc/40?img=4',
    date: '14 August 2023',
    budget: '$15K',
    status: 'Completed',
    location: 'Thailand',
    performance: '+25.7%',
    trend: 'up'
  }
])

// Quick stats data
const quickStats = ref([
  { title: 'Total Computers', value: '$13,446,500', change: '+4.3%', icon: '💰' },
  { title: 'Conversion Rate', value: '3.64%', change: '+0.8%', icon: '📈' },
  { title: 'Active Campaigns', value: '24', change: '+2', icon: '🎯' },
  { title: 'Total Reach', value: '2.4M', change: '+12.5%', icon: '👥' }
])

// Computed properties
const filteredCampaigns = computed(() => {
  if (selectedCampaignFilter.value === 'all') return latestCampaigns.value
  return latestCampaigns.value.filter(campaign => 
    campaign.status.toLowerCase() === selectedCampaignFilter.value
  )
})

// Methods
const getStatusColor = (status) => {
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Paused': 'bg-yellow-100 text-yellow-800', 
    'Completed': 'bg-blue-100 text-blue-800',
    'Draft': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getTrendIcon = (trend) => {
  return trend === 'up' ? '📈' : '📉'
}

const setPeriod = (period) => {
  selectedPeriod.value = period
}

const setCampaignFilter = (filter) => {
  selectedCampaignFilter.value = filter
}

const total = computed(() => func.activeCount + func.inactiveCount + func.maintenanceCount || 1);

const active = computed(() =>
  parseFloat(((func.activeCount || 0) / total.value * 100).toFixed(2))
);
const inactive = computed(() =>
  parseFloat(((func.inactiveCount || 0) / total.value * 100).toFixed(2))
);
const maintenance = computed(() =>
  parseFloat(((func.maintenanceCount || 0) / total.value * 100).toFixed(2))
);





onMounted(() => {
  func.fetchStatusDistribution();
  console.log(func.activeCount, func.inactiveCount, func.maintenanceCount, total.value);

});
</script>

<template>
  <AuthenticatedLayout>
    <div class="min-h-screen bg-gray-50 p-6">
      <!-- Enhanced Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-xs font-bold text-gray-900">Campaign Dashboard</h1>
          <p class="text-gray-600 mt-1">Monitor and manage your marketing campaigns</p>
        </div>
       
      </div>

      <!-- Main Grid Section -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Left Side - Takes 3 columns -->
        <div class="xl:col-span-3 space-y-6">
          <!-- Enhanced Stat Cards -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-900">System Node Status</h2>
                <span class="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium cursor-pointer"><router-link to="/computer_logs">View Logs</router-link></span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard title="Online Nodes" :value="func.onlineCount" change="+1.26%" />
                <StatCard title="Offline Nodes" :value="func.offlineCount" change="-1.56%" />
                <StatCard title="Active Sessions" :value="func.activeCount" change="+3.26%" />
                <StatCard title="Total Units" :value="func.totalCount" change="+3.25%" />
            </div>
        </div>

          <!-- Enhanced Line Chart -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Campaign Statistics</h3>
              <div class="flex gap-2">
                
                <button 
                  @click="setPeriod('month')"
                  :class="selectedPeriod === 'month' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors">
                  Month
                </button>
                <button 
                  @click="setPeriod('week')"
                  :class="selectedPeriod === 'week' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors">
                  Week
                </button>
                <button 
                  @click="setPeriod('day')"
                  :class="selectedPeriod === 'day' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'"
                  class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors">
                  Day
                </button>
              </div>
            </div>
            <apexchart
              height="320"
              type="area"
              :options="lineChartOptions"
              :series="lineChartSeries"
            />
          </div>

          <!-- Latest Campaigns Table -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Latest Campaigns</h3>
              <div class="flex gap-2">
                <select 
                  v-model="selectedCampaignFilter"
                  class="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                  <option value="all">All Campaigns</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
                <span class="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium">View All</span>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="campaign in filteredCampaigns" :key="campaign.id"
                   class="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-4">
                  <img :src="campaign.avatar" :alt="campaign.name" class="w-10 h-10 rounded-full">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ campaign.name }}</h4>
                    <p class="text-sm text-gray-500">{{ campaign.date }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-6">
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">{{ campaign.budget }}</p>
                    <p class="text-sm text-gray-500">{{ campaign.location }}</p>
                  </div>
                  <span :class="getStatusColor(campaign.status)" 
                        class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ campaign.status }}
                  </span>
                  <div class="flex items-center space-x-1">
                    <span class="text-sm font-medium" 
                          :class="campaign.trend === 'up' ? 'text-green-600' : 'text-red-600'">
                      {{ campaign.performance }}
                    </span>
                    <span class="text-lg">{{ getTrendIcon(campaign.trend) }}</span>
                  </div>
                  <button class="p-1 hover:bg-gray-200 rounded">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
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
                height="250"
                type="radialBar"
                :options="radialOptions"
                :series="[active, inactive, maintenance]"
            />
        </div>

         <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Weekly Earnings</h3>
              <p class="text-3xl font-bold text-gray-900">$3,190,523</p>
              <p class="text-sm text-green-600 mt-1">+8.2% from last week</p>
            </div>
            <apexchart
              height="180"
              type="bar"
              :options="barChartOptions"
              :series="barChartSeries"
            />
          </div>


          <!-- Total Earning Summary -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Total Earning</h3>
            <div class="mb-4">
              <p class="text-2xl font-bold text-gray-900">$13,446,500</p>
              <p class="text-sm text-green-600">+4.3% increase</p>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">Bounce</span>
                </div>
                <span class="text-sm font-medium text-gray-900">45%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">Investment</span>
                </div>
                <span class="text-sm font-medium text-gray-900">30%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">Saving</span>
                </div>
                <span class="text-sm font-medium text-gray-900">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>