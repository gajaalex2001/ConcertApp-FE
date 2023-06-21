<template>
  <div>
    <v-app>
      <v-app-bar elevation="3" app color="primary">
        <v-app-bar-title>Welcome, {{ loggedUser }}</v-app-bar-title>

        <v-badge
          class="pr-10"
          offset-y="12"
          offset-x="12"
          :content="noUpcomingConcerts"
          :color="upcomingConcerts ? 'error' : 'transparent'"
        >
          <v-btn
            icon="mdi-bell"
            color="white"
            @click="displayUpcomingConcerts"
          ></v-btn>
        </v-badge>

        <v-btn
          icon="mdi-home"
          color="white"
          @click="redirectToHomePage"
        ></v-btn>
        <v-btn
          icon="mdi-plus"
          color="white"
          @click="redirectToAddConcertPage"
        ></v-btn>
        <v-btn icon="mdi-logout" color="white" @click="logout"></v-btn>
      </v-app-bar>
      <router-view :key="$route.fullPath"></router-view>
    </v-app>

    <v-dialog v-model="isDialogVisible" width="700px">
      <v-card>
        <v-card-title>
          <h2>Your upcoming concerts</h2>
        </v-card-title>
        <v-divider ver></v-divider>
        <v-window continuous v-model="selectedTab" show-arrows>
          <v-window-item v-for="(concert, index) in upcomingConcerts" :key="concert.id">
            <v-card height="200px" elevation="10" class="d-flex align-center">
              <div class="upcoming-concert-card">
                <v-card-title class="card-title">
                  <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <div
                        v-ripple
                        @click="redirectToViewConcertPage(concert.id)"
                        v-bind="props"
                        :style="{
                          color: isHovering ? '#AFA2FF' : '',
                          cursor: 'pointer',
                          borderRadius: '8px',
                        }"
                      >
                        <span> {{index + 1}}. {{ concert.name }}</span>
                      </div>
                    </template>
                  </v-hover>
                </v-card-title>
                <v-card-text>
                  <div
                    v-if="concert.description !== ''"
                    class="card-description"
                  >
                    {{ concert.description
                    }}{{ concert.description.length === 100 ? "..." : "" }}
                  </div>
                  <div v-else class="card-description">
                    <strong>This concert has no description.</strong>
                  </div>
                  <div class="card-info">
                    <div><b>Location:</b> {{ concert.location }}</div>
                    <div>
                      <b>Start Date:</b>
                      {{ parseDate(concert.startDate) }}
                    </div>
                    <div><b>End Date:</b> {{ parseDate(concert.endDate) }}</div>
                  </div>
                </v-card-text>
              </div>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { onMounted, ref } from "vue";

const store = useAppStore();
const router = useRouter();

const loggedUser = ref("");

const upcomingConcerts = ref(null);
const noUpcomingConcerts = ref(0);

const isDialogVisible = ref(false);

const selectedTab = ref(0);

const redirectToViewConcertPage = (concertId) => {
  isDialogVisible.value = false;
  router.push(`/concerts/${concertId}`);
};

const displayUpcomingConcerts = () => {
  isDialogVisible.value = true;
};

const logout = () => {
  store.logout();
  router.push("/login");
};

const redirectToHomePage = () => {
  router.push("/concerts");
};

const redirectToAddConcertPage = () => {
  router.push("/concerts/add-concert");
};

const getUpcomingConcerts = async () => {
  const payload = {
    email: store.user.email,
    currentDate: new Date().toISOString(),
  };

  const response = await store.getUpcomingConcerts(payload);

  if (response.status === 200) {
    upcomingConcerts.value = response.data;
    noUpcomingConcerts.value = upcomingConcerts.value.length;
  }
};

const parseDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const localDateString = new Intl.DateTimeFormat("en-US", options).format(
    date
  );
  const formattedDate = localDateString.replace(/,\s/g, " ");
  return formattedDate;
};

onMounted(() => {
  loggedUser.value = `${store.user.firstName} ${store.user.lastName}`;
  getUpcomingConcerts();
});
</script>

<style>
.card-description {
  margin-bottom: 10px;
}

.upcoming-concert-card {
  padding-right: 20%;
  padding-left: 20%;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
