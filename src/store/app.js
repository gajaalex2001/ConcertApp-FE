// Utilities
import axios from "axios";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    user: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  }),
  getters: {
    isAuthenticated() {
      return (
        !!this.user.email &&
        !!this.user.firstName &&
        !!this.user.lastName &&
        !!this.user.phoneNumber
      );
    },
  },
  actions: {
    async signUp(payload) {
      let response;
      await axios
        .post("https://localhost:44379/api/user/create-user", {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phoneNumber: payload.phoneNumber,
          password: payload.password,
        })
        .then((result) => {
          response = result;
        })
        .catch((error) => {
          response = error.response;
        });

      return response.status;
    },
    async login(payload) {
      let response;
      await axios
        .post("https://localhost:44379/api/user/login", {
          email: payload.email,
          password: payload.password,
        })
        .then((result) => {
          response = result;
        })
        .catch((error) => {
          response = error.response;
        });

      if (response.status === 200) {
        const responseData = response.data;

        if (payload.isRemembered) {
          localStorage.setItem("email", responseData.email);
          localStorage.setItem("firstName", responseData.firstName);
          localStorage.setItem("lastName", responseData.lastName);
          localStorage.setItem("phoneNumber", responseData.phoneNumber);
        }

        this.user.email = responseData.email;
        this.user.firstName = responseData.firstName;
        this.user.lastName = responseData.lastName;
        this.user.phoneNumber = responseData.phoneNumber;
      }

      return response.status;
    },
    logout() {
      localStorage.removeItem("email");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("phoneNumber");

      this.user.email = "";
      this.user.firstName = "";
      this.user.lastName = "";
      this.user.phoneNumber = "";
    },
    tryLogin() {
      const email = localStorage.getItem("email");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      const phoneNumber = localStorage.getItem("phoneNumber");

      this.user.email = email;
      this.user.firstName = firstName;
      this.user.lastName = lastName;
      this.user.phoneNumber = phoneNumber;
    },
  },
});
