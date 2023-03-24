<template>
  <v-app class="background">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dense>
          <v-col cols="3">
            <v-card elevation="8">
              <v-card-title class="text-h6 text-center"> Log in </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-form @submit.prevent="login" v-model="isFormValid">
                  <v-text-field
                    label="Email"
                    name="Email"
                    prepend-inner-icon="mdi-mail"
                    type="email"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.emailRules]"
                    v-model="inputEmail"
                  />
                  <v-text-field
                    label="Password"
                    name="Password"
                    prepend-inner-icon="mdi-lock"
                    append-inner-icon="mdi-eye"
                    @click:append-inner="togglePasswordVisibility"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.passwordRules]"
                    v-model="inputPassword"
                  />
                  <v-btn
                    :disabled="!isFormValid"
                    type="submit"
                    rounded="false"
                    width="100%"
                    >Log in</v-btn
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

import { regexes } from "../utils/regexes.js";

const inputEmail = ref('');
const inputPassword = ref('');

const isFormValid = ref(false);
const rules = {
  required: (value) => !!value || "This field is required!",
  emailRules: [
    (value) =>
      value.length >= 10 && value.length <= 100 && regexes.Email.test(value)
        ? true
        : "Email is invalid.",
  ],
  passwordRules: [
    (value) =>
      value.length >= 3 &&
      value.length <= 30 &&
      regexes.NoWhiteSpace.test(value)
        ? true
        : "Password is invalid.",
  ],
};

const login = () => {
  console.log(`You submitted ${inputEmail.value} | ${inputPassword.value}`);
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
