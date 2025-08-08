<script setup>
import { ref, computed, defineProps, defineEmits, useSlots } from 'vue'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserCircleIcon
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
  first_name: 'First Name',
  last_name: 'Last Name',
  email: 'Email',
  program: 'Program',
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

const getStatusBadge = (status) => {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border'
  const map = {
    Active: `${base} border-green-300 text-green-700 bg-green-50`,
    Inactive: `${base} border-red-300 text-red-700 bg-red-50`,
    Pending: `${base} border-yellow-300 text-yellow-700 bg-yellow-50`
  }
  return map[status] || `${base} border-gray-300 text-gray-600 bg-gray-50`
}

const handleEdit = (user) => emit('edit', user)
const handleDelete = (user) => emit('delete', user)
const handleView = (user) => emit('view', user)

const changePage = (page) => {
  if (page >= 1 && page <= props.pagination.last_page) {
    emit('page-change', page)
  }
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full table-auto text-sm bg-white border border-gray-200 rounded-md overflow-hidden">
      <!-- Custom header slot or default header -->
      <thead v-if="!slots.header" class="bg-gray-50 text-xs uppercase text-gray-500">
        <tr>
          <th
            v-for="field in ['id','first_name','last_name','email','program']"
            :key="field"
            scope="col"
            class="px-4 py-2 font-medium text-left cursor-pointer select-none hover:bg-gray-100"
            @click="sort(field)"
          >
            <div class="flex items-center gap-1">
              {{ headerLabels[field] }}
              <component
                :is="getSortIcon(field)"
                v-if="getSortIcon(field)"
                class="w-3.5 h-3.5"
              />
            </div>
          </th>
          <th scope="col" class="px-4 py-2 font-medium text-left select-none">Actions</th>
        </tr>
      </thead>
      <slot name="header" v-else />

      <tbody class="divide-y divide-gray-100">
        <!-- Default body (if no slot used) -->
        <template v-if="!slots.default">
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-6 text-center text-gray-500">
              <div class="flex justify-center items-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-transparent"></div>
                Loading…
              </div>
            </td>
          </tr>

          <tr v-else-if="!users.length">
            <td colspan="7" class="px-4 py-10 text-center text-gray-500">
              <div class="flex flex-col items-center gap-2">
                <UserCircleIcon class="w-10 h-10 text-gray-300" />
                No users found.
              </div>
            </td>
          </tr>

          <tr
            v-for="user in sortedUsers"
            :key="user.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-2 text-gray-900">{{ user.id }}</td>
            <td class="px-4 py-2 text-gray-900">{{ user.first_name || '—' }}</td>
            <td class="px-4 py-2 text-gray-900">{{ user.last_name || '—' }}</td>
            <td class="px-4 py-2 text-gray-900">
              <a
                v-if="user.email"
                :href="`mailto:${user.email}`"
                class="text-blue-600 hover:underline"
              >
                {{ user.email }}
              </a>
              <span v-else>—</span>
            </td>
            <td class="px-4 py-2 text-gray-900">{{ formatProgram(user.program?.program_code) }}</td>
            <!-- <td class="px-4 py-2">
              <span :class="getStatusBadge(user.status)">
                {{ user.status || 'Unknown' }}
              </span>
            </td> -->
            <td class="px-4 py-2 text-gray-500">
              <div class="flex items-center gap-1.5">
                <button @click="handleView(user)" class="p-1 hover:text-blue-600 hover:bg-gray-100 rounded">
                  <EyeIcon class="w-4 h-4" />
                </button>
                <button @click="handleEdit(user)" class="p-1 hover:text-green-600 hover:bg-gray-100 rounded">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button @click="handleDelete(user)" class="p-1 hover:text-red-600 hover:bg-gray-100 rounded">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </template>

        <!-- Custom body slot -->
        <template v-else>
          <slot />
        </template>
      </tbody>
    </table>

    <!-- Pagination -->
    <div
      v-if="pagination.last_page > 1"
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-sm"
    >
      <div class="text-gray-600">
        Showing
        <span class="font-medium">{{ pagination.from ?? ((pagination.current_page - 1) * pagination.per_page + 1) }}</span>
        to
        <span class="font-medium">{{ pagination.to ?? (pagination.current_page * pagination.per_page > pagination.total ? pagination.total : pagination.current_page * pagination.per_page) }}</span>
        of
        <span class="font-medium">{{ pagination.total }}</span>
        results
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-2.5 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        <template v-for="page in pagination.last_page" :key="page">
          <button
            @click="changePage(page)"
            :class="[
              'px-2.5 py-1 rounded-md border transition',
              page === pagination.current_page
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-2.5 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
