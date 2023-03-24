<template>
  <v-app class="background">
    <v-main style="overflow: hidden">
      <v-container class="fill-height" style="overflow: hidden" fluid>
        <v-row align="center" justify="center" style="overflow: hidden" dense>
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
                    >Login</v-btn
                  >
                </v-form>
                <v-card-actions>
                  <v-checkbox label="Remember me" hide-details />
                  <v-spacer />
                  No account?
                  <router-link class="pl-2" to="/register"
                    >Sign Up!</router-link
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
import { ref } from "vue";

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
