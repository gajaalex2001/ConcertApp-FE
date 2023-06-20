<template>
  <v-app class="background">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" dense>
          <v-col cols="3">
            <v-card elevation="8">
              <v-card-title class="text-h6 text-center"> Log in </v-card-title>
              <v-divider></v-divider>
              <v-alert
                class="rounded-0"
                closable
                v-model="loginFailed"
                color="error"
                icon="$error"
                title="Error"
                :text="loginErrorText"
              />
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
                    v-model.trim="inputEmail"
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
                    v-model.trim="inputPassword"
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
                  <v-checkbox
                    v-model="isRememberMe"
                    label="Remember me"
                    hide-details
                  />
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
import { useAppStore } from "@/store/app";
import { regexes } from "../utils/regexes.js";
import { useRouter } from "vue-router";

const store = useAppStore();
const router = useRouter();

const inputEmail = ref("");
const inputPassword = ref("");
const isRememberMe = ref(false);

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

const loginFailed = ref(false);
const loginErrorText = ref("");

const login = async () => {
  const response = await store.login({
    email: inputEmail.value,
    password: inputPassword.value,
    isRemembered: isRememberMe.value,
  });

  if (response === 200) {
    router.push("/concerts");
  } else if (response === 409) {
    loginErrorText.value = "Account not found";
    loginFailed.value = true;
  } else {
    loginErrorText.value = "Authentication error";
    loginFailed.value = true;
  }
};

const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<style scoped>
.background {
  background: url("../assets/Images/bg3.jpg") no-repeat center
    center fixed;
  background-size: cover;
}
</style>
