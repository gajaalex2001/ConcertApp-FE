<template>
    <div class="container">
        <span>Add concert page</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';

const store = useAppStore();
const router = useRouter();
</script>

<style scoped>
.container {
    margin-top: 64px;
}
</style>