<template>
  <v-app class="background">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="3">
            <v-card elevation="8">
              <v-card-title class="text-h6 text-center">
                Create an account
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-form @submit.prevent="signUp" v-model="isFormValid">
                  <v-text-field
                    label="Email"
                    name="email"
                    prepend-inner-icon="mdi-mail"
                    type="email"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.emailRules]"
                    v-model="inputEmail"
                  />

                  <v-text-field
                    label="First Name"
                    name="firstName"
                    prepend-inner-icon="mdi-account-box"
                    type="text"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.firstNameRules]"
                    v-model="inputFirstName"
                  />

                  <v-text-field
                    label="Last Name"
                    name="lastName"
                    prepend-inner-icon="mdi-account-box"
                    type="text"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.lastNameRules]"
                    v-model="inputLastName"
                  />

                  <v-text-field
                    label="Phone number"
                    name="phoneNumber"
                    prepend-inner-icon="mdi-cellphone"
                    type="text"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.phoneNumberRules]"
                    v-model="inputPhoneNumber"
                  />

                  <v-text-field
                    label="Password"
                    name="password"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { regexes } from "../utils/regexes.js";

const router = useRouter();

const isFormValid = ref(false);
const rules = {
  required: (value) => !!value || "This field is required!",
  emailRules: [
    (value) =>
      value.length >= 10 && value.length <= 100
        ? true
        : "Email should be between 10 and 100 characters.",
    (value) => (regexes.Email.test(value) ? true : "Email format invalid."),
  ],
  firstNameRules: [
    (value) =>
      value.length >= 2 && value.length <= 100
        ? true
        : "First Name should be between 2 and 100 characters.",
    (value) =>
      regexes.AlphaNumericSpaceDash.test(value)
        ? true
        : "First Name format invalid.",
  ],
  lastNameRules: [
    (value) =>
      value.length >= 2 && value.length <= 100
        ? true
        : "Last Name should be between 2 and 100 characters.",
    (value) =>
      regexes.AlphaNumericSpaceDash.test(value)
        ? true
        : "Last Name format invalid.",
  ],
  phoneNumberRules: [
    (value) =>
      value.length >= 10 && value.length <= 15
        ? true
        : "Phone Number should be between 10 and 15 characters.",
    (value) =>
      regexes.PhoneNumber.test(value) ? true : "Phone Number format invalid.",
  ],
  passwordRules: [
    (value) =>
      value.length >= 3 && value.length <= 30
        ? true
        : "Password should be between 3 and 30 characters.",
    (value) =>
      regexes.NoWhiteSpace.test(value) ? true : "Password format invalid.",
  ],
};

const inputEmail = ref("");
const inputFirstName = ref("");
const inputLastName = ref("");
const inputPhoneNumber = ref("");
const inputPassword = ref("");

const signUp = () => {
  console.log(
    `You have submitted: ${inputEmail.value} | ${inputFirstName.value} | ${inputLastName.value} | ${inputPhoneNumber.value} | ${inputPassword.value}`
  );
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
