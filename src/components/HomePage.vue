<template>
    <div>
        <v-btn @click="logout">
            Log out
        </v-btn>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';

const store = useAppStore();
const router = useRouter();

const logout = () => {
    store.logout();
    router.push('/login');
}
</script>