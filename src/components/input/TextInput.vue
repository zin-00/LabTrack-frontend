<script setup>
import { onMounted, ref } from 'vue';

// Use defineModel properly (Vue 3.3+)
const model = defineModel({
  type: String,
  required: true,
});

const input = ref(null);

onMounted(() => {
  if (input.value?.hasAttribute('autofocus')) {
    input.value.focus();
  }
});

// Expose a focus method for parent components
defineExpose({
  focus: () => input.value?.focus(),
});
</script>

<template>
  <input
    v-model="model"
    ref="input"
    autofocus
    class="p-3 border border-black shadow-sm focus:border-green-500 focus:ring focus:ring-indigo-500"
  />
</template>
