<script setup>
import AuthenticatedLayout from '../../layouts/auth/AuthenticatedLayout.vue';
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
</script>
<template>
    <AuthenticatedLayout>
         <div class="py-4 max-w-7xl mx-auto sm:px-4 bg-white">
            <h2 class="text-lg font-semibold mb-6">Computer Management</h2>
        </div>
    </AuthenticatedLayout>
</template>