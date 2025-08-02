<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  UsersIcon, 
  HomeIcon,
  ChartBarIcon, 
  MapIcon, 
  ClipboardDocumentCheckIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  ChevronDownIcon,
  CalendarDaysIcon,
  DocumentCheckIcon, 
  ClipboardDocumentListIcon,
  CogIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';

// Props for customization
const props = defineProps({
  customMenuItems: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['sidebarStateChange']);

// Reactive state
const sidebarState = ref(localStorage.getItem('sidebarState') || 'full');
const screenWidth = ref(window.innerWidth);
const openDropdowns = ref([]);
const route = useRoute();

const defaultMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    to: '/dashboard'
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: UsersIcon,
    to: '/employees'
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: ClipboardDocumentCheckIcon,
    children: [
      {
        id: 'live-attendance',
        label: 'Live Attendance',
        icon: ClipboardDocumentListIcon,
        to: '/attendance/view'
      },
      {
        id: 'attendance-records',
        label: 'Attendance Records',
        icon: DocumentCheckIcon,
        to: '/attendance-records'
      },
      {
        id: 'attendance-history',
        label: 'History',
        icon: MapIcon,
        to: '/attendance/history'
      }
    ]
  },
  {
    id: 'schedules',
    label: 'Schedule',
    icon: CalendarDaysIcon,
    to: '/schedules'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: ChartBarIcon,
    children: [
      {
        id: 'daily-reports',
        label: 'Daily Reports',
        icon: ClockIcon,
        to: '/reports/daily'
      },
      {
        id: 'monthly-reports',
        label: 'Monthly Reports',
        icon: CalendarDaysIcon,
        to: '/reports/monthly'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: CogIcon,
    children: [
      {
        id: 'profile',
        label: 'Profile',
        icon: UserIcon,
        to: '/settings/profile'
      },
      {
        id: 'company',
        label: 'Company',
        icon: BuildingOfficeIcon,
        to: '/settings/company'
      }
    ]
  }
];

const menuItems = computed(() => {
  return props.customMenuItems.length > 0 ? props.customMenuItems : defaultMenuItems;
});

watch(sidebarState, (newState) => {
  localStorage.setItem('sidebarState', newState);
  emit('sidebarStateChange', newState);
  if (newState === 'icon' || newState === 'closed') {
    openDropdowns.value = [];
  }
});

// Methods
const toggleSidebar = () => {
  sidebarState.value = sidebarState.value === 'full' ? 'icon' : 'full';
};

const closeSidebar = () => {
  sidebarState.value = 'closed';
};

const toggleDropdown = (itemId) => {
  if (sidebarState.value !== 'full') return;
  
  const index = openDropdowns.value.indexOf(itemId);
  if (index > -1) {
    openDropdowns.value.splice(index, 1);
  } else {
    openDropdowns.value.push(itemId);
  }
};

const isActiveRoute = (routePath) => {
  return route.path === routePath;
};

const isActiveParent = (children) => {
  return children.some(child => route.path === child.to);
};

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
  
  if (screenWidth.value < 1024) {
    sidebarState.value = 'closed';
  }
  
  // Auto-open dropdown if current route is a child
  menuItems.value.forEach(item => {
    if (item.children && isActiveParent(item.children)) {
      if (!openDropdowns.value.includes(item.id)) {
        openDropdowns.value.push(item.id);
      }
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth);
});
</script>

<template>
  <div>
    <!-- Toggle Button -->
    <button 
      @click="toggleSidebar" 
      class="fixed top-1/2 left-4 z-40 p-2 rounded-lg text-gray-700 focus:outline-none transition-all duration-300 transform -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl"
      :class="{
        'left-[0px]': sidebarState === 'closed',
        'left-[40px]': sidebarState === 'icon',
        'left-[210px]': sidebarState === 'full'
      }"
    >
      <ChevronLeftIcon v-if="sidebarState === 'full'" class="h-6 w-6 font-bold" />
      <ChevronRightIcon v-else-if="sidebarState === 'icon'" class="h-6 w-6 font-bold" />
      <ChevronRightIcon v-else class="h-6 w-6 font-bold" />
    </button>
    
    <!-- Overlay for mobile/small screens -->
    <div 
      v-if="sidebarState !== 'closed' && screenWidth < 1024" 
      @click="closeSidebar" 
      class="fixed inset-0 bg-transparent z-30 lg:hidden"
    />
    
    <!-- Sidebar -->
    <div 
      class="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg overflow-y-auto"
      :class="{
        'w-60': sidebarState === 'full',
        'w-16': sidebarState === 'icon',
        'w-0': sidebarState === 'closed',
        'translate-x-0': sidebarState !== 'closed',
        '-translate-x-full': sidebarState === 'closed'
      }"
    >
      <div class="py-4">
        <ul class="space-y-2 font-medium px-2">
          <li v-for="item in menuItems" :key="item.id">
            <!-- Regular menu item -->
            <router-link 
              v-if="!item.children" 
              :to="item.to" 
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200': isActiveRoute(item.to) }"
            >
              <component :is="item.icon" class="h-6 w-6 flex-shrink-0" />
              <span 
                class="ms-3 transition-all duration-200 overflow-hidden whitespace-nowrap"
                :class="{ 'opacity-0 w-0': sidebarState === 'icon', 'opacity-100': sidebarState === 'full' }"
              >
                {{ item.label }}
              </span>
              <span 
                v-if="isActiveRoute(item.to)" 
                class="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                :class="{ 'opacity-0': sidebarState === 'icon' }"
              />
            </router-link>
            
            <!-- Dropdown menu item -->
            <div v-else>
              <button 
                @click="toggleDropdown(item.id)"
                class="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200': isActiveParent(item.children) }"
              >
                <component :is="item.icon" class="h-6 w-6 flex-shrink-0" />
                <span 
                  class="ms-3 transition-all duration-200 overflow-hidden whitespace-nowrap"
                  :class="{ 'opacity-0 w-0': sidebarState === 'icon', 'opacity-100': sidebarState === 'full' }"
                >
                  {{ item.label }}
                </span>
                <ChevronDownIcon 
                  v-if="sidebarState === 'full'"
                  class="ml-auto h-4 w-4 transition-transform duration-200"
                  :class="{ 'rotate-180': openDropdowns.includes(item.id) }"
                />
                <span 
                  v-if="isActiveParent(item.children)" 
                  class="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                  :class="{ 'opacity-0': sidebarState === 'icon' }"
                />
              </button>
              
              <!-- Dropdown items -->
              <div 
                v-if="sidebarState === 'full'"
                class="overflow-hidden transition-all duration-300"
                :class="{ 'max-h-0': !openDropdowns.includes(item.id), 'max-h-96': openDropdowns.includes(item.id) }"
              >
                <ul class="pl-6 mt-2 space-y-1">
                  <li v-for="child in item.children" :key="child.id">
                    <router-link 
                      :to="child.to"
                      class="flex items-center p-2 text-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                      :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200': isActiveRoute(child.to) }"
                    >
                      <component :is="child.icon" class="h-5 w-5 flex-shrink-0" />
                      <span class="ms-3">{{ child.label }}</span>
                      <span 
                        v-if="isActiveRoute(child.to)" 
                        class="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                      />
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Custom scrollbar for sidebar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>