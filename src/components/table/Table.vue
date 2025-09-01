<script setup>
import { ref, computed, defineProps, defineEmits, useSlots } from 'vue'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 8,
      from: null,
      to: null
    })
  }
})

const emit = defineEmits(['edit', 'delete', 'view', 'page-change'])

const sortField = ref('')
const sortDirection = ref('asc')
const showActions = ref({})

const slots = useSlots()

const sortedUsers = computed(() => {
  if (!sortField.value) return props.users
  return [...props.users].sort((a, b) => {
    let aValue = a[sortField.value] ?? ''
    let bValue = b[sortField.value] ?? ''
    aValue = aValue.toString().toLowerCase()
    bValue = bValue.toString().toLowerCase()
    return sortDirection.value === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  })
})

const sort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return null
  return sortDirection.value === 'asc' ? ChevronUpIcon : ChevronDownIcon
}

const headerLabels = {
  id: 'ID',
  student_id: 'Student ID',
  first_name: 'First Name',
  middle_name: 'Middle Name',
  last_name: 'Last Name',
  email: 'Email',
  year_level_id: 'Year Level',
  section_id: 'Section',
  program: 'Program',
  status: 'Status'
}

const formatProgram = (program) => {
  const map = {
    bsit: 'BSIT',
    bsais: 'BSAIS',
    bsa: 'BSA',
    bscs: 'BSCS'
  }
  return map[program] || (program ? program.toUpperCase() : '—')
}

const formatName = (user) => {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
  return name || '—'
}

const toggleActions = (userId) => {
  showActions.value = { [userId]: !showActions.value[userId] }
}

const handleEdit = (user) => emit('edit', user)
const handleDelete = (user) => emit('delete', user)
const handleView = (user) => emit('view', user)

const changePage = (page) => {
  if (page >= 1 && page <= props.pagination.last_page) {
    emit('page-change', page)
  }
}

const getVisiblePages = () => {
  const current = props.pagination.current_page
  const total = props.pagination.last_page
  const pages = []
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) pages.push(i)
    }
    
    if (current < total - 2) pages.push('...')
    if (total > 1) pages.push(total)
  }
  
  return pages
}
</script>

<template>
  <div class="w-full">
    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead v-if="!slots.header" class="bg-gray-50">
          <tr>
            <th
              v-for="field in ['student_id', 'first_name','middle_name', 'last_name','email', 'year_level_id', 'section_id','program', 'status']"
              :key="field"
              class="px-3 py-2 text-xs font-medium text-gray-600 text-left cursor-pointer hover:bg-gray-100 transition-colors"
              @click="sort(field)"
            >
              <div class="flex items-center gap-1">
                {{ headerLabels[field] }}
                <component
                  :is="getSortIcon(field)"
                  v-if="getSortIcon(field)"
                  class="w-3 h-3"
                />
              </div>
            </th>
            <th class="px-3 py-2 text-xs font-medium text-gray-600 text-center w-20">Actions</th>
          </tr>
        </thead>
        <slot name="header" v-else />

        <tbody class="divide-y divide-gray-100">
          <template v-if="!slots.default">
            <tr v-if="loading">
              <td colspan="5" class="px-3 py-8 text-center text-gray-500">
                <div class="flex justify-center items-center gap-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
                  Loading…
                </div>
              </td>
            </tr>

            <tr v-else-if="!users.length">
              <td colspan="5" class="px-3 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <UserCircleIcon class="w-8 h-8 text-gray-300" />
                  <span class="text-sm">No users found</span>
                </div>
              </td>
            </tr>

            <tr
              v-for="user in sortedUsers"
              :key="user.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- <td class="px-3 py-2 text-gray-900 font-medium">{{ user.id }}</td> -->
              <td class="px-3 py-1 text-gray-900 font-medium">{{ user.student_id }}</td>

              <td class="px-3 py-1 text-gray-900 text-xs">{{user.first_name}}</td>
              <td class="px-3 py-1 text-gray-900 text-xs">{{user.middle_name}}</td>
              <td class="px-3 py-1 text-gray-900 text-xs">{{user.last_name}}</td>
              <td class="px-3 py-1">
                <a
                  v-if="user.email"
                  :href="`mailto:${user.email}`"
                  class="text-blue-600 hover:underline text-sm"
                >
                  {{ user.email }}
                </a>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="px-3 py-1">{{ user.year_level_id }}</td>
              <td class="px-3 py-1">{{ user.section_id }}</td>
              <td class="px-3 py-1">
                <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {{ formatProgram(user.program?.program_code) }}
                </span>
              </td>
              <td class="px-3 py-1">
                <span
                  v-if="user.status"
                  :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.status }}
                </span>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="px-3 py-2">
                <div class="flex items-center justify-center gap-1">
                  <button @click="handleView(user)" class="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    <EyeIcon class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleEdit(user)" class="p-1.5 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                    <PencilIcon class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleDelete(user)" class="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    <TrashIcon class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <slot />
          </template>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-3">
      <div v-if="loading" class="flex justify-center py-8">
        <div class="flex items-center gap-2 text-gray-500">
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
          Loading…
        </div>
      </div>

      <div v-else-if="!users.length" class="flex flex-col items-center py-8 text-gray-500">
        <UserCircleIcon class="w-12 h-12 text-gray-300 mb-2" />
        <span>No users found</span>
      </div>

      <div
        v-for="user in sortedUsers"
        :key="user.id"
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-medium text-gray-900">{{ formatName(user) }}</h3>
            <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
          </div>
          <div class="relative">
            <button 
              @click="toggleActions(user.id)"
              class="p-1 hover:bg-gray-100 rounded-md"
            >
              <EllipsisHorizontalIcon class="w-5 h-5 text-gray-400" />
            </button>
            <div 
              v-if="showActions[user.id]"
              class="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
            >
              <button @click="handleView(user); showActions[user.id] = false" class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <EyeIcon class="w-4 h-4" />
                View
              </button>
              <button @click="handleEdit(user); showActions[user.id] = false" class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <PencilIcon class="w-4 h-4" />
                Edit
              </button>
              <button @click="handleDelete(user); showActions[user.id] = false" class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                <TrashIcon class="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <div v-if="user.email" class="flex items-center gap-2">
            <span class="text-xs text-gray-400 w-16">Email:</span>
            <a :href="`mailto:${user.email}`" class="text-sm text-blue-600 hover:underline">
              {{ user.email }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 w-16">Program:</span>
            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {{ formatProgram(user.program?.program_code) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Pagination -->
    <div
      v-if="pagination.last_page > 1"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4"
    >
      <div class="text-xs text-gray-600 order-2 sm:order-1">
        {{ pagination.from ?? ((pagination.current_page - 1) * pagination.per_page + 1) }}-{{ pagination.to ?? (pagination.current_page * pagination.per_page > pagination.total ? pagination.total : pagination.current_page * pagination.per_page) }} of {{ pagination.total }}
      </div>

      <div class="flex items-center gap-1 order-1 sm:order-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>

        <template v-for="page in getVisiblePages()" :key="page">
          <button
            v-if="page !== '...'"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 text-xs rounded-md border transition-colors',
              page === pagination.current_page
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-2 text-gray-400">...</span>
        </template>

        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Click outside to close dropdown */
@media (max-width: 768px) {
  .relative button + div {
    animation: fadeIn 0.15s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
</style>