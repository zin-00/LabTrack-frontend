
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
        MailWarningIcon,
        LaptopMinimalIcon,
        FlaskConicalIcon,
        LayoutPanelLeftIcon,
        FolderMinusIcon,
        MailIcon,
        FolderKanbanIcon,
        TicketsIcon
        } from 'lucide-vue-next';
import { 
        HomeModernIcon,
        ComputerDesktopIcon,
        AdjustmentsHorizontalIcon,
        UsersIcon,
        EnvelopeIcon,
        AcademicCapIcon
        } from '@heroicons/vue/24/outline';
import { 
        AkDashboard,
        LaUserTieSolid,
        CaReportData
        } from '@kalimahapps/vue-icons';
import { useAuthStore } from '../../composable/useAuth';
import SideBar from '../../components/sidebar/SideBar.vue';

const auth = useAuthStore();
const router = useRouter();
const showingNavigationDropdown = ref(false);
const showingSettingsDropdown = ref(false);

const sidebarState = ref(localStorage.getItem('sidebarState') || 'full');

// Watch for sidebar state changes and update localStorage
watch(sidebarState, (newState) => {
  localStorage.setItem('sidebarState', newState);
}, { immediate: true });

const handleSidebarChange = (state) => {
  sidebarState.value = state;
};

// Computed property for main content classes - this ensures reactivity
const mainContentClasses = computed(() => {
  const classes = [];
  
  switch (sidebarState.value) {
    case 'full':
      classes.push('lg:ml-60');
      break;
    case 'icon':
      classes.push('lg:ml-16');
      break;
    case 'closed':
    default:
      classes.push('ml-0');
      break;
  }
  
  return classes.join(' ');
});

const SideItems = ref([
  { id: 'dashboard',        label: 'Dashboard',         icon: AkDashboard, to: '/dashboard'},
  { id: 'users',            label: 'Users',  icon: UsersIcon, to: '/users' , children: [
    {
        id: 'students',     label: 'Students', icon: AcademicCapIcon, to: '/students'
    },
    {
        id: 'admin',        label: 'Admin', icon: LaUserTieSolid, to: '/admin'
    }
  ]},
  { id: 'computers',        label: 'Computers',         icon: LaptopMinimalIcon, to: '/computers' },
  { id: 'laboratory',       label: 'Laboratory',        icon: FlaskConicalIcon, to: '/laboratory' },
  { id: 'computer_logs',    label: 'Logs',              icon: FolderMinusIcon, to: '/computer_logs'},
  { id: 'request_access',   label: 'Request Access',    icon: MailIcon, to: '/request-access'},
  { id: 'reports',          label: 'Reports',           icon: TicketsIcon, to: '/reports'}
]);

const logout_func = async () => {
  try {
    await auth.logout();
    // Clear sidebar state on logout
    localStorage.removeItem('sidebarState');
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if logout fails
    router.push('/login');
  }
};

const closeDropdowns = () => {
  showingSettingsDropdown.value = false;
  showingNavigationDropdown.value = false;
};

const toggleSettingsDropdown = () => {
  showingSettingsDropdown.value = !showingSettingsDropdown.value;
};

const handleClickOutside = (event) => {
  if (!(event.target.closest('.dropdown-container'))) {
    closeDropdowns();
  }
};

// Handle window resize to adjust sidebar on mobile
const handleResize = () => {
  if (window.innerWidth < 1024 && sidebarState.value !== 'closed') {
    sidebarState.value = 'closed';
  }
};

onMounted( async () => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  
  if(!auth.user){
    await auth.loadUser()
  }
  
  // Set initial sidebar state based on screen size
  if (window.innerWidth < 1024) {
    sidebarState.value = 'closed';
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>
<template>
    <div>
        <div class="min-h-screen bg-gray-100">
            <nav class="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white">
                <!-- Primary Navigation Menu -->
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="flex h-16 justify-between">
                        <div class="flex">
                            <!-- Logo -->
                             <div class="flex items-center space-x-3">
                                <div class="flex items-center justify-center">
                                    <img src="/src/assets/LABTrackv2.png" alt="" srcset="" class="h-8 w-8 sm:h-10 sm:w-10">
                                </div>
                                    <p class="font-[Orbitron] text-sm font-bold">LAB<span class="text-[#12e19f] ">TRACK</span></p>
                                </div>
                             </div>

                        <div class="hidden sm:ms-6 sm:flex sm:items-center">
                            <!-- Settings Dropdown -->
                            <div class="relative ms-3 dropdown-container">
                                <div class="relative">
                                    <!-- Dropdown Trigger -->
                                   <button
                                        v-if="auth.user"
                                        @click="toggleSettingsDropdown"
                                        type="button"
                                        class="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                        <span class="hidden sm:inline">{{ auth.user.name }}</span>
                                        <span class="sm:hidden">{{ auth.user.name.charAt(0) }}</span>
                                        <svg
                                            class="-me-0.5 ms-2 h-4 w-4 transition-transform duration-150"
                                            :class="{ 'rotate-180': showingSettingsDropdown }"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                            fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    <!-- Dropdown Content -->
                                    <Transition
                                        enter-active-class="transition ease-out duration-200"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95"
                                    >
                                        <div
                                            v-show="showingSettingsDropdown"
                                            class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        >
                                            <!-- Profile Link -->
                                            <button>
                                                <router-link
                                                    to="/profile"
                                                    @click="closeDropdowns"
                                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                >
                                                    Profile
                                                </router-link>
                                            </button>
                                            
                                            <!-- Settings Link -->
                                            <button>
                                                <router-link
                                                    to="/settings"
                                                    @click="closeDropdowns"
                                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                >
                                                    Settings
                                                </router-link>
                                            </button>
                                            
                                            <!-- Logout Button -->
                                            <button
                                                @click="logout_func"
                                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile Hamburger -->
                        <div class="-me-2 flex items-center sm:hidden">
                            <button
                                @click="showingNavigationDropdown = !showingNavigationDropdown"
                                class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    class="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        :class="{
                                            hidden: showingNavigationDropdown,
                                            'inline-flex': !showingNavigationDropdown,
                                        }"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        :class="{
                                            hidden: !showingNavigationDropdown,
                                            'inline-flex': showingNavigationDropdown,
                                        }"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Responsive Navigation Menu -->
                <div
                    :class="{
                        block: showingNavigationDropdown,
                        hidden: !showingNavigationDropdown,
                    }"
                    class="sm:hidden"
                >
                    <!-- Mobile Navigation Links -->
                    <div class="space-y-1 pb-3 pt-2">
                        <router-link
                            v-for="item in SideItems"
                            :key="item.id"
                            :to="item.to"
                            @click="showingNavigationDropdown = false"
                            class="block py-2 pe-4 ps-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50 focus:text-gray-700 transition duration-150 ease-in-out"
                            active-class="bg-indigo-50 border-indigo-400 text-indigo-700 focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700"
                        >
                            {{ item.label }}
                        </router-link>
                    </div>

                    <!-- Responsive Settings Options -->
                    <div class="border-t border-gray-200 pb-1 pt-4">
                        <div v-if="auth.user" class="px-4">
                            <div class="text-base font-medium text-gray-800">
                                {{ auth.user.name }}
                            </div>
                            <div class="text-sm font-medium text-gray-500">
                                {{ auth.user.email }}
                            </div>
                        </div>

                        <div class="mt-3 space-y-1">
                            <!-- <router-link
                                to="/profile"
                                @click="showingNavigationDropdown = false"
                                class="block py-2 pe-4 ps-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50 focus:text-gray-700 transition duration-150 ease-in-out"
                            >
                                Profile
                            </router-link> -->
                           
                            <button
                                @click="logout_func"
                                class="block w-full text-left py-2 pe-4 ps-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50 focus:text-gray-700 transition duration-150 ease-in-out"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

           <SideBar 
               @sidebarStateChange="handleSidebarChange" 
               @logout="logout_func"
               :customMenuItems="SideItems" 
           />

           <!-- Main Content Area with proper reactive classes -->
           <div 
               class="transition-all duration-300 ease-in-out pt-16 min-h-screen"
               :class="mainContentClasses"
           >
                <header class="bg-white shadow" v-if="$slots.header">
                    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <slot name="header" />
                    </div>
                </header>

                <main class="p-4">
                    <slot />
                </main>
            </div>
        </div>
    </div>
</template>
