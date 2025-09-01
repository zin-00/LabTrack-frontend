<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  rows: {
    type: Number,
    default: 8
  },
  columns: {
    type: Array,
    default: () => [
      { key: 'student_id', width: 'w-20' },
      { key: 'name', width: 'w-32' },
      { key: 'email', width: 'w-40' },
      { key: 'program', width: 'w-16', rounded: true },
      { key: 'status', width: 'w-14', rounded: true },
      { key: 'actions', width: 'w-20', type: 'actions' }
    ]
  }
})

const skeletonRows = computed(() => {
  return Array.from({ length: props.rows }, (_, i) => ({ id: `skeleton-${i}` }))
})
</script>

<template>
  <!-- Desktop Skeleton -->
  <div class="hidden md:block">
    <tr v-for="row in skeletonRows" :key="row.id" class="animate-pulse">
      <td 
        v-for="column in columns" 
        :key="column.key" 
        class="px-3 py-3"
      >
        <!-- Actions column -->
        <div v-if="column.type === 'actions'" class="flex items-center justify-center gap-1">
          <div class="w-6 h-6 bg-gray-200 rounded"></div>
          <div class="w-6 h-6 bg-gray-200 rounded"></div>
          <div class="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
        <!-- Regular columns -->
        <div 
          v-else
          :class="[
            'h-4 bg-gray-200',
            column.rounded ? 'rounded-full h-6' : 'rounded',
            column.width
          ]"
        ></div>
      </td>
    </tr>
  </div>

  <!-- Mobile Skeleton -->
  <div class="md:hidden space-y-3">
    <div
      v-for="row in skeletonRows"
      :key="row.id"
      class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
    >
      <div class="flex items-start justify-between mb-3">
        <div class="space-y-2">
          <div class="h-5 bg-gray-200 rounded w-32"></div>
          <div class="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div class="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
      
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="h-3 bg-gray-200 rounded w-12"></div>
          <div class="h-4 bg-gray-200 rounded w-40"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 bg-gray-200 rounded w-16"></div>
          <div class="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Skeleton shimmer animation */
@keyframes skeleton-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.animate-pulse .bg-gray-200 {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200px 100%;
  animation: skeleton-shimmer 1.5s infinite;
}
</style>