<template>
  <v-app class="background">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dense>
          <v-col cols="4">
            <v-card elevation="8">
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    label="Email"
                    name="Email"
                    prepend-inner-icon="mdi-mail"
                    type="email"
                    variant="outlined"
                  />
                  <v-text-field
                    label="Password"
                    name="Password"
                    prepend-inner-icon="mdi-lock"
                    append-inner-icon="mdi-eye"
                    @click:append-inner="togglePasswordVisibility"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    variant="outlined"
                  />
                  <v-btn type="submit" rounded="false" width="100%"
                    >Sign up</v-btn
                  >
                </v-form>
                <v-card-actions class="justify-end">
                  <v-btn
                    prepend-icon="mdi-arrow-left"
                    @click="router.push('/login')"
                    >Login</v-btn
                  >
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const login = () => {
  console.log("clicked submit!");
};

const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<style scoped>
.background {
  background: url("../assets/Images/authConcertImage.jpg") no-repeat center
    center fixed;
  background-size: contain;
}
</style>
