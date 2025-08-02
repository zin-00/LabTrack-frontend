<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import AuthBase from '../../layouts/AuthLayout.vue'
import { LoaderCircle } from 'lucide-vue-next'
import Button from '../../components/button/Button.vue'
import Label from '../../components/label/Label.vue'
import InputError from '../../components/input/InputError.vue'
import Checkbox from '../../components/checkbox/Checkbox.vue'
import router from '@/router'
import { useToast } from 'vue-toastification'
import { useUserStore, useStoreToken} from '../../composable/useAuth'
import TextInput from '../../components/input/TextInput.vue'

const auth = useUserStore();
const authToken = useStoreToken();

const toast = useToast();


defineProps({
    status: String,
    canResetPassword: Boolean,
});


const form = reactive({
    email: '',
    password: '',
    remember: false,
    isLoading: false,
    processing: false,
    errors: '',
});

const login_func = async () => {
    form.isLoading = true;
    form.errors = {};

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
            email: form.email,
            password: form.password,
            remember: form.remember,
        });


        const data = response.data.user;
        const token = response.data.token;
        const message = response.data.message;
        
        if (data && token) {
            auth.setUser(data);
            authToken.setToken(token);

            toast.success(message);

            router.push({ name: 'dashboard' });
        }

        console.log('Login success:', response.data);
    } catch (error) {
        form.errors = error.response?.data?.errors || {
            email: 'Login failed. Please try again.',
        };
    } finally {
        form.isLoading = false;
    }
};
</script>


<template>
    <AuthBase title="Log in to your account" description="Enter your email and password below to log in">

        <div v-if="status" class="mb-4 text-center text-sm font-medium text-green-600">
            {{ status }}
        </div>

        <form @submit.prevent="login_func" class="flex flex-col gap-6">
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <TextInput
                        id="email"
                        type="email"
                        required
                        autofocus
                        :tabindex="1"
                        autocomplete="email"
                        v-model="form.email"
                        placeholder="email@example.com"
                    />
                    <InputError :message="form.errors.email" />
                </div>

                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>
                        <!-- <TextLink v-if="canResetPassword" :href="route('password.request')" class="text-sm" :tabindex="5">
                            Forgot password?
                        </TextLink> -->
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        required
                        :tabindex="2"
                        autocomplete="current-password"
                        v-model="form.password"
                        placeholder="Password"
                    />
                    <InputError :message="form.errors.password" />
                </div>

                <div class="flex items-center justify-between">
                    <Label for="remember" class="flex items-center space-x-3">
                        <Checkbox id="remember" v-model="form.remember" :tabindex="3" />
                        <span>Remember me</span>
                    </Label>
                </div>

                <Button variant="dark" type="submit" class="mt-4 w-full" :tabindex="4" :disabled="form.processing">
                    <LoaderCircle v-if="form.processing" class="h-4 w-4 animate-spin" />
                    Log in
                </Button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Don't have an account?
                <!-- <TextLink :href="route('register')" :tabindex="5">Sign up</TextLink> -->
                 <router-link to="/register">Sign up</router-link>
            </div>
        </form>
    </AuthBase>
</template>
