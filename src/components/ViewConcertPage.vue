<template>
  <div class="container" v-if="concert">
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-card elevation="10" class="pa-5" id="organizer-card">
            <h2>Organizer Information</h2>
            <v-card-text>
              <div>
                <strong>Email:</strong>
                <p>{{ concert.organizer.email }}</p>
              </div>
              <div>
                <strong>First Name:</strong>
                <p>{{ concert.organizer.firstName }}</p>
              </div>
              <div>
                <strong>Last Name:</strong>
                <p>{{ concert.organizer.lastName }}</p>
              </div>
              <div>
                <strong>Phone Number:</strong>
                <p>{{ concert.organizer.phoneNumber }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card elevation="10" class="pa-5" id="concert-card">
            <h2>{{ concert.name }}</h2>
            <v-card-text class="concert-container">
              <div>
                <div>
                  <strong>Number of Participants:</strong>
                  <p>{{ concert.noParticipants }}</p>
                </div>
                <div>
                  <strong>Capacity:</strong>
                  <p>{{ concert.capacity }}</p>
                </div>
                <div>
                  <strong>Start Date:</strong>
                  <p>{{ parseDate(concert.startDate) }}</p>
                </div>
                <div>
                  <strong>End Date:</strong>
                  <p>{{ parseDate(concert.endDate) }}</p>
                </div>
              </div>
            </v-card-text>
            <div
                v-if="concert.organizer.email !== store.user.email && shouldShowParticipationButtons"
                style="padding-left: 15px;"
              >
                <div v-if="!concert.isParticipating">
                  <v-btn color="primary" @click="addParticipant" text>
                    Participate
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn color="primary" @click="removeParticipant" text>
                    Cancel Participation
                  </v-btn>
                </div>
              </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card elevation="10" class="pa-5 mt-5" id="description-card">
            <h2>Concert Description</h2>
            <v-card-text>
              <p style="white-space: pre-line;" v-if="concert.description !== ''">{{ concert.description }}</p>
              <h4 v-else>This concert has no description.</h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="showAlert" timeout="2000" :color="alertColor">
      {{ alertMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { computed } from "vue";

const store = useAppStore();
const route = useRoute();
const concert = ref(null);
const concertId = route.params.id;

const showAlert = ref(false);
const alertMessage = ref("This is an error");
const alertColor = ref("red");

const getConcertData = async () => {
  const response = await store.getConcertDetails({
    concertId: concertId,
    email: store.user.email,
  });

  if (response.status == 200) {
    concert.value = await response.data;
  }
};

const addParticipant = async () => {
  const response = await store.addParticipant({
    email: store.user.email,
    concertId: concertId,
  });

  if (response.status === 200) {
    showAlert.value = true;
    alertMessage.value = "You are now participating to this concert.";
    alertColor.value = "green";
    concert.value.isParticipating = !concert.value.isParticipating;
    concert.value.noParticipants++;
  } else if (response.status === 409) {
    showAlert.value = true;
    alertColor.value = "red";

    if (response.data.ErrorCode === 204) {
      alertMessage.value = "The concert has already passed.";
    } else if (response.data.ErrorCode === 205) {
      alertMessage.value = "The concert has reached its maximum capacity.";
    }
  } else {
    showAlert.value = true;
    alertMessage.value = "Server error";
    alertColor.value = "red";
  }
};

const removeParticipant = async () => {
  const response = await store.removeParticipant({
    email: store.user.email,
    concertId: concertId,
  });

  if (response.status === 200) {
    showAlert.value = true;
    alertMessage.value = "You are no longer participating to this concert.";
    alertColor.value = "green";
    concert.value.isParticipating = !concert.value.isParticipating;
    concert.value.noParticipants--;
  } else if (response.status === 409) {
    showAlert.value = true;
    alertColor.value = "red";
    alertMessage.value = "The concert has already passed.";
  } else {
    showAlert.value = true;
    alertMessage.value = "Server error";
    alertColor.value = "red";
  }
};

onMounted(() => {
  getConcertData();
});

const shouldShowParticipationButtons = computed(() => {
  var concertDate = new Date(concert.value.startDate);
  var today = new Date().setHours(0, 0, 0, 0);

  return concertDate > today;
})

const parseDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const localDateString = new Intl.DateTimeFormat("en-US", options).format(date);
  const formattedDate = localDateString.replace(/,\s/g, ' ');
  return formattedDate;
};
</script>

<style scoped>
.container {
  margin-top: 64px;
}

#organizer-card,
#concert-card,
#description-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  word-wrap: break-word;  
  height: 100%;
}

.concert-container {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
}
</style>
