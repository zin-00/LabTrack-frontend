<script setup>
import AuthBase from '../../layouts/AuthLayout.vue'
import Button from '../../components/button/Button.vue'
import Label from '../../components/label/Label.vue'
import TextInput from '../../components/input/TextInput.vue'
import InputError from '../../components/input/InputError.vue'
import { LoaderCircle } from 'lucide-vue-next'
import { useAuthStore } from '../../composable/useAuth'
import { storeToRefs } from 'pinia';
import Modal from '../../components/modal/Modal.vue';

const auth = useAuthStore()

const {
    login,
    checkEmail,
    closeModal,
    submitRequest,
} = auth;
const {
    errors,
    processing,
    step,
    email,
    password,
    remember,
    isModalOpen,
    isLoading,
    isSuccess,
    errorMessage,
    requestData,
    resetForm,
    handleSubmit
    } = storeToRefs(auth);
</script>

<template>
  <AuthBase title="Log in to your account" description="Enter your email and password below to log in">
    <form @submit.prevent="step === 1 ? checkEmail() : login()" class="flex flex-col gap-6">
      
      <!-- Step 1: Email -->
      <div v-if="step === 1" class="grid gap-2">
        <Label for="email">Email address</Label>
        <TextInput
          id="email"
          type="email"
          required
          autofocus
          v-model="email"
          placeholder="email@example.com"
        />
        <InputError :message="errors.email" />
        <Button variant="dark" type="submit" class="mt-4 h-[50px] w-full" :disabled="processing">
          <LoaderCircle v-if="processing" class="h-4 w-4 animate-spin" />
          Next
        </Button>
      </div>

      <!-- Step 2: Password -->
      <div v-else class="grid gap-2">
        <Label for="password">Password</Label>
        <TextInput
          id="password"
          type="password"
          required
          v-model="password"
          placeholder="Password"
        />
        <InputError :message="errors.password" />

        <div class="flex items-center justify-between">
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="remember" />
            <span>Remember me</span>
          </label>
        </div>

        <Button variant="dark" type="submit" class="mt-4 h-[50px] w-full" :disabled="processing">
          <LoaderCircle v-if="processing" class="h-4 w-4 animate-spin" />
          Log in
        </Button>
      </div>

    </form>

    <div class="text-center text-sm text-muted-foreground mt-4">
      Don’t have an account? <button
      @click="isModalOpen = true"
       class="text-blue-600 hover:underline cursor-pointer">Request Access</button>
    </div>


     <Modal :show="isModalOpen" @close="isModalOpen = false">
        <!-- Modal Backdrop -->
        <div class="fixed inset-0 bg-transparent z-40 bg-opacity-50 flex items-center justify-center p-4">
        <div 
            class="bg-white rounded-lg shadow-xl relative"
            :class="{
            'w-full max-w-md': isSuccess,
            'w-full max-w-4xl': !isSuccess,
            'h-auto max-h-[90vh]': true
            }"
        >
            <!-- Close Button -->
            <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1"
            >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            </button>

            <!-- Scrollable Content Area -->
            <div class="overflow-y-auto p-8 h-full">
            <!-- Success State -->
            <div v-if="isSuccess" class="text-center py-8">
                <div class="mb-4">
                <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
                <p class="text-gray-600 mb-6">Your access request has been submitted successfully.</p>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 font-medium">⏳ Waiting for approval</p>
                <p class="text-yellow-700 text-sm mt-1">You will be notified once your request is reviewed.</p>
                </div>
                <button 
                @click="resetForm"
                class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                Submit Another Request
                </button>
            </div>

            <!-- Form State -->
            <div v-else>
                <h2 class="text-2xl font-bold mb-6 text-gray-800">Request Access</h2>
                
                <form>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <!-- Student ID -->
                    <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        ID Number <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="requestData.id_number"
                        type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your student ID"
                        :disabled="isLoading"
                        required
                    />
                    </div>
                    
                    <!-- Full Name -->
                    <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="requestData.fullname"
                        type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your full name"
                        :disabled="isLoading"
                        required
                    />
                    </div>
                    
                    <!-- Email -->
                    <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="requestData.email"
                        type="email"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your email address"
                        :disabled="isLoading"
                        required
                    />
                    </div>
                    
                    <!-- Role -->
                    <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Role <span class="text-red-500">*</span>
                    </label>
                    <select
                        v-model="requestData.role"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        :disabled="isLoading"
                        required
                    >
                        <option value="" disabled>-- Select Role --</option>
                        <option value="admin">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="staff">IT Staff</option>
                        <option value="student">Student</option>
                    </select>
                    </div>

                    <!-- Password -->
                    <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Password <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="requestData.password"
                        type="password"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter password"
                        :disabled="isLoading"
                        required
                        minlength="6"
                    />
                    </div>

                    <!-- Confirm Password -->
                    <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="requestData.password_confirmation"
                        type="password"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Confirm your password"
                        :disabled="isLoading"
                        required
                    />
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex items-center">
                    <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-red-700 text-sm font-medium">{{ errorMessage }}</p>
                    </div>
                </div>
                <!-- Submit Button -->
                <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                    type="button"
                    @click="closeModal"
                    class="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    :disabled="isLoading"
                    >
                    Cancel
                    </button>
                    <button
                    @click="submitRequest"
                    class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
                    :disabled="isLoading"
                    >
                    <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isLoading ? 'Submitting...' : 'Submit Request' }}
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
    </div>
  </Modal>

  </AuthBase>
</template>
<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>