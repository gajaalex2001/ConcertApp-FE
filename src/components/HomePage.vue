<template>
    <div>
        <div>
            <v-btn @click="logout">
                Log out
            </v-btn>
        </div>
        <div class="container">
            <div class="filters">
            <h2>Filters</h2>
            <v-radio-group v-model="filterType">
                <v-radio label="Participant" value="participant"></v-radio>
                <v-radio label="Organizer" value="organizer"></v-radio>
                <v-radio label="Any" value="any"></v-radio>
            </v-radio-group>
            <v-autocomplete
                v-model="filterGenres"
                :items="genres"
                label="Genres"
                multiple
                chips
            ></v-autocomplete>
            </div>
            <div class="concerts">
            <v-card v-for="concert in concerts" :key="concert.id" class="concert-card">
                <v-card-title>{{ concert.name }}</v-card-title>
                <v-card-text>
                <div>{{ concert.description }}</div>
                <div>{{ concert.location }}</div>
                <div>{{ concert.genre }}</div>
                <div>{{ concert.capacity }}</div>
                <div>{{ concert.participants }}</div>
                <div>{{ concert.startDate }}</div>
                <div>{{ concert.endDate }}</div>
                </v-card-text>
            </v-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';

const store = useAppStore();
const router = useRouter();
const concerts = ref([]);
const genres = ["Rock", "Dubstep", "Jazz"]
const filterType = ref("");
const filterGenres = ref([]);

const logout = () => {
    store.logout();
    router.push('/login');
}

onMounted(async () => {
  const response = await store.getConcerts({
    PageRequest: {
        PageIndex: 1,
        ItemsPerPage: 5
    },
    Filters: {}
  });
  
  if(!response.hasError){
    concerts.value = response.concerts.items;
  }
})
</script>

<style scoped>
.container {
  display: flex;
}

.filters {
  flex: 1;
  padding: 20px;
}

.concerts {
  flex: 3;
}

.concert-card {
  margin-bottom: 20px;
}
</style>