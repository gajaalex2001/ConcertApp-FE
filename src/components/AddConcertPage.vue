<template>
  <div class="container">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="5">
            <v-card elevation="22">
              <v-card-title class="text-h6 text-center">
                Create a concert
              </v-card-title>
              <v-divider></v-divider>
              <v-snackbar
                v-model="showAlert"
                timeout="2000"
                :color="alertColor"
              >
                {{ alertMessage }}
              </v-snackbar>
              <v-card-text>
                <v-form
                  ref="form"
                  @submit.prevent="addConcert"
                  v-model="isDataValid"
                >
                  <v-text-field
                    label="Name"
                    name="name"
                    prepend-inner-icon="mdi-calendar-blank-outline"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.nameRules]"
                    v-model.trim="inputName"
                    hint="Between 10 and 100 alphanumeric characters, including space, dash, dot, comma"
                  />

                  <v-textarea
                    clearable
                    label="Description"
                    no-resize
                    counter
                    class="mb-2"
                    variant="outlined"
                    :rules="[...rules.descriptionRules]"
                    v-model.trim="inputDescription"
                    hint="Maximum 2000 alphanumeric characters, including space, dash, dot, comma"
                  >
                  </v-textarea>

                  <v-text-field
                    label="Location"
                    name="location"
                    prepend-inner-icon="mdi-map-marker"
                    variant="outlined"
                    class="mb-2"
                    :rules="[rules.required, ...rules.locationRules]"
                    v-model.trim="inputLocation"
                    hint="Between 2 and 100 alphanumeric characters, including space, dash, dot, comma"
                  />

                  <v-autocomplete
                    v-model="inputGenre"
                    :items="musicGenreArray"
                    prepend-inner-icon="mdi-music"
                    label="Genre"
                    clearable
                    class="mb-2"
                    :rules="[rules.required]"
                    variant="outlined"
                  ></v-autocomplete>

                  <v-text-field
                    label="Capacity"
                    name="capacity"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    type="number"
                    class="mb-2"
                    :rules="[rules.required, ...rules.capacityRules]"
                    v-model.trim="inputCapacity"
                    hint="Between 1 and 100000"
                  />

                  <Datepicker
                    class="dp__theme_light"
                    :offset="10"
                    v-model="inputDateInterval"
                    range
                    :state="isDateRangeValid === false ? false : null"
                    @closed="validateDate"
                    utc
                    :min-date="getMinDateForPicker()"
                    placeholder="Select starting date and ending date"
                  ></Datepicker>

                  <div
                    style="
                      margin-top: 10px;
                      display: flex;
                      justify-content: space-between;
                    "
                  >
                    <v-btn
                      :disabled="!isFormSubmittable"
                      type="submit"
                      rounded="false"
                      width="40%"
                      >Create Concert</v-btn
                    >
                    <v-btn rounded="false" width="20%" @click="clearFields"
                      >Clear Fields</v-btn
                    >
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { regexes } from "@/utils/regexes";
import { musicGenre, musicGenreArray } from "../utils/musicGenre.js";
import Datepicker from "@vuepic/vue-datepicker";

const store = useAppStore();
const router = useRouter();

const rules = {
  required: (value) => !!value || "This field is required!",
  nameRules: [
    (value) =>
      value.length >= 10 && value.length <= 100
        ? true
        : "Name should be between 10 and 100 characters.",
    (value) =>
      regexes.AlphaNumericSpaceDashDotComma.test(value)
        ? true
        : "Name format invalid.",
  ],
  descriptionRules: [
    (value) =>
      value.length <= 2000
        ? true
        : "Description can have maximum 2000 characters.",
    (value) =>
      regexes.AlphaNumericSpaceDashDotComma.test(value)
        ? true
        : "Description format invalid.",
  ],
  locationRules: [
    (value) =>
      value.length >= 2 && value.length <= 100
        ? true
        : "Location should be between 2 and 100 characters.",
    (value) =>
      regexes.AlphaNumericSpaceDashDotComma.test(value)
        ? true
        : "Location format invalid.",
  ],
  capacityRules: [
    (value) =>
      value >= 1 && value <= 100000
        ? true
        : "Capacity should be between 1 and 100000.",
  ],
  startDateRules: [],
};

const inputName = ref("");
const inputDescription = ref("");
const inputLocation = ref("");
const inputGenre = ref(null);
const inputCapacity = ref(null);
const inputDateInterval = ref([]);

const showAlert = ref(false);
const alertMessage = ref("This is an error");
const alertColor = ref("red");

const addConcert = async () => {
  const response = await store.addConcert({
    email: store.user.email,
    name: inputName.value,
    description: inputDescription.value,
    location: inputLocation.value,
    genre: musicGenre[inputGenre.value.replace(/\s/g, "")],
    capacity: inputCapacity.value,
    startDate: inputDateInterval.value[0],
    endDate: inputDateInterval.value[1],
  });

  if (response.status === 200) {
    showAlert.value = true;
    alertMessage.value = "Concert created successfully.";
    alertColor.value = "green";
    clearFields();
  } else {
    showAlert.value = true;
    alertMessage.value = "Server error";
    alertColor.value = "red";
  }
};

const getMinDateForPicker = () => {
  var date = new Date(); // current date and time

  date.setDate(date.getDate() + 1); // add one day
  date.setHours(0, 0, 0, 0); // set time to 00:00:00.000

  return date;
};

const isDateRangeValid = ref(null);
const isDataValid = ref(false);
const isFormSubmittable = computed(() => {
  return isDataValid.value && isDateRangeValid.value === true;
});

const form = ref(null);

const clearFields = () => {
  form.value.resetValidation();
  inputName.value = "";
  inputDescription.value = "";
  inputLocation.value = "";
  inputGenre.value = null;
  inputCapacity.value = null;
  inputDateInterval.value = [];
};

const validateDate = () => {
  isDateRangeValid.value =
    inputDateInterval.value != null &&
    inputDateInterval.value[0] != null &&
    inputDateInterval.value[1] != null;
};
</script>

<style scoped>
.container {
  margin-top: 64px;
}

.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #1976d2;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #aaaeb7;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #212121;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-icon-color: #959595;
  --dp-danger-color: #b3261e;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
  --dp-box-shadow: white;
  padding-bottom: 20px;
}
</style>
