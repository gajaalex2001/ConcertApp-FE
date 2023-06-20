<template>
    <v-app>
      <v-app-bar elevation="3" app color="primary">
        
        <!-- <v-toolbar-title class="title" style="cursor: pointer" @click="redirectToHomePage">Concert App</v-toolbar-title> -->
        
        <v-app-bar-title>Concert App</v-app-bar-title>

        <v-btn icon="mdi-home" color="white" @click="redirectToHomePage"></v-btn>
        <v-btn icon="mdi-plus" color="white" @click="redirectToAddConcertPage"></v-btn>
        <v-btn icon="mdi-logout" color="white" @click="logout"></v-btn>
      </v-app-bar>
      <router-view></router-view>
    </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';

const store = useAppStore();
const router = useRouter();

const logout = () => {
    store.logout();
    router.push('/login');
}

const redirectToHomePage = () => {
  router.push('/concerts');
}

const redirectToAddConcertPage = () => {
  router.push('/concerts/add-concert');
}
</script>

<style>
html {
  overflow-y: auto !important
}
</style>