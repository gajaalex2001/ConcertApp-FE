<template>
  <div>
    <div class="container">
      <div class="filters">
        <div class="fixed">
          <h2>Filters</h2>
          <v-radio-group v-model="pendingFilterType">
            <v-radio label="Participant" value="participant"></v-radio>
            <v-radio label="Organizer" value="organizer"></v-radio>
            <v-radio label="Any" value="any"></v-radio>
          </v-radio-group>
          <v-autocomplete
            v-model="pendingFilterGenre"
            :items="musicGenreArray"
            label="Genre"
            clearable
          ></v-autocomplete>
          <v-btn @click="applyFilters" :disabled="filtersChanged()"
            >Apply Filters</v-btn
          >

          <div v-if="length !== 0">
            <h2 class="pt-16 pb-2">Recommendations</h2>

            <v-card flat rounded="0">
              <v-card-actions class="justify-space-between">
                <v-btn
                  variant="plain"
                  icon="mdi-chevron-left"
                  @click="prev"
                ></v-btn>
                <v-item-group
                  v-model="selectedCard"
                  class="text-center"
                  mandatory
                >
                  <v-item
                    v-for="n in length"
                    :key="`btn-${n}`"
                    v-slot="{ isSelected, toggle }"
                    :value="n"
                  >
                    <v-btn
                      :variant="isSelected ? 'outlined' : 'text'"
                      icon="mdi-record"
                      @click="toggle"
                    ></v-btn>
                  </v-item>
                </v-item-group>
                <v-btn
                  variant="plain"
                  icon="mdi-chevron-right"
                  @click="next"
                ></v-btn>
              </v-card-actions>
              <v-window v-model="selectedCardComputed">
                <v-window-item
                  v-for="concert in recommendations"
                  :key="concert.id"
                >
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      class="concert-card mt-3"
                      :elevation="isHovering ? 8 : 4"
                      v-bind="props"
                      hover
                      @click="redirectToViewConcertPage(concert.id)"
                    >
                      <v-card-title class="card-title">{{
                        concert.name
                      }}</v-card-title>
                      <v-card-text>
                        <div
                          v-if="concert.description !== ''"
                          class="card-description"
                        >
                          {{ concert.description
                          }}{{
                            concert.description.length === 100 ? "..." : ""
                          }}
                        </div>
                        <div v-else class="card-description">
                          <strong>This concert has no description.</strong>
                        </div>
                        <div class="card-info">
                          <div><b>Location:</b> {{ concert.location }}</div>
                          <div>
                            <b>Genre:</b> {{ musicGenreArray[concert.genre] }}
                          </div>
                          <div><b>Capacity:</b> {{ concert.capacity }}</div>
                          <div>
                            <b>Participants:</b> {{ concert.noParticipants }}
                          </div>
                          <div>
                            <b>Start Date:</b>
                            {{ parseDate(concert.startDate) }}
                          </div>
                          <div>
                            <b>End Date:</b> {{ parseDate(concert.endDate) }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-window-item>
              </v-window>
            </v-card>
          </div>
        </div>
      </div>
      <div class="concerts">
        <v-alert
          class="rounded-4"
          v-model="displaySignUpAlert"
          color="info"
          icon="info"
          text="No concerts with the given filters exist."
        />
        <v-virtual-scroll ref="scroller" height="84vh" :items="concerts">
          <template v-slot:default="{ item }">
            <v-hover v-slot="{ isHovering, props }" :key="item.id">
              <v-card
                class="concert-card"
                :elevation="isHovering ? 8 : 4"
                v-bind="props"
                hover
                @click="redirectToViewConcertPage(item.id)"
              >
                <v-card-title class="card-title">{{ item.name }}</v-card-title>
                <v-card-text>
                  <div v-if="item.description !== ''" class="card-description">
                    {{ item.description
                    }}{{ item.description.length === 100 ? "..." : "" }}
                  </div>
                  <div v-else class="card-description">
                    <strong>This concert has no description.</strong>
                  </div>
                  <div class="card-info">
                    <div><b>Location:</b> {{ item.location }}</div>
                    <div><b>Genre:</b> {{ musicGenreArray[item.genre] }}</div>
                    <div><b>Capacity:</b> {{ item.capacity }}</div>
                    <div><b>Participants:</b> {{ item.noParticipants }}</div>
                    <div>
                      <b>Start Date:</b> {{ parseDate(item.startDate) }}
                    </div>
                    <div><b>End Date:</b> {{ parseDate(item.endDate) }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </template>
        </v-virtual-scroll>
      </div>
    </div>
    <v-pagination
      elevation="3"
      v-model="currentPage"
      :length="totalPages"
      @update:model-value="changePage"
      :class="[totalPages === 0 ? 'd-none' : '']"
    ></v-pagination>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { musicGenre, musicGenreArray } from "../utils/musicGenre.js";
import { userStatus } from "../utils/userStatus.js";
import { computed } from "vue";

const store = useAppStore();
const router = useRouter();

const concerts = ref([]);

const pendingFilterType = ref("any");
const pendingFilterGenre = ref(null);
const filterType = ref("any");
const filterGenre = ref(null);

const scroller = ref(null);

const currentPage = ref(1);
const totalPages = ref(1);

const recommendations = ref([]);
const length = ref(0);

const selectedCard = ref(1);
const selectedCardComputed = computed(() => {
  return selectedCard.value - 1;
});

const displaySignUpAlert = computed(() => {
  return totalPages.value === 0;
});

const redirectToViewConcertPage = (concertId) => {
  router.push(`/concerts/${concertId}`);
};

const applyFilters = () => {
  filterGenre.value = pendingFilterGenre.value;
  filterType.value = pendingFilterType.value;

  currentPage.value = 1;
  const PageRequest = {
    PageIndex: currentPage.value,
    ItemsPerPage: 5,
  };
  const Filters = {
    Email: filterType.value !== "any" ? store.user.email : null,
    UserStatus:
      filterType.value !== "any" ? userStatus[filterType.value] : null,
    MusicGenre: filterGenre.value
      ? musicGenre[filterGenre.value.replace(/\s/g, "")]
      : null,
  };
  getConcerts(PageRequest, Filters, true);
  scroller.value.scrollToIndex(0);
};

const changePage = () => {
  const PageRequest = {
    PageIndex: currentPage.value,
    ItemsPerPage: 5,
  };
  const Filters = {
    Email: filterType.value !== "any" ? store.user.email : null,
    UserStatus:
      filterType.value !== "any" ? userStatus[filterType.value] : null,
    MusicGenre: musicGenre[filterGenre.value],
  };

  getConcerts(PageRequest, Filters);
  scroller.value.scrollToIndex(0);
};

const getConcerts = async (pageRequest, filters, updateTotalPage = false) => {
  const response = await store.getConcerts({
    PageRequest: pageRequest,
    Filters: filters,
  });

  if (!response.hasError) {
    concerts.value = response.data.items;

    if (updateTotalPage) {
      totalPages.value =
        response.data.noItems % 5 !== 0
          ? ((response.data.noItems / 5) | 0) + 1
          : (response.data.noItems / 5) | 0;
    }
  }
};

const getRecommendations = async () => {
  const response = await store.getRecommendations(store.user.email);

  if (!response.hasError) {
    recommendations.value = response.data;
    length.value = recommendations.value.length;
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

const filtersChanged = () => {
  return !(
    pendingFilterGenre.value !== filterGenre.value ||
    pendingFilterType.value !== filterType.value
  );
};

onMounted(() => {
  const PageRequest = {
    PageIndex: currentPage.value,
    ItemsPerPage: 5,
  };

  getConcerts(PageRequest, {}, true);
  currentPage.value = 1;
  getRecommendations();
});

const next = () => {
  selectedCard.value =
    selectedCard.value + 1 > length.value ? 1 : selectedCard.value + 1;
};

const prev = () => {
  selectedCard.value =
    selectedCard.value - 1 <= 0 ? length.value : selectedCard.value - 1;
};
</script>

<style scoped>
.container {
  margin-top: 64px;
  display: flex;
}

.filters {
  flex: 1;
  padding: 20px;
}

.fixed {
  position: fixed;
  width: 20%;
}

.concerts {
  flex: 4;
  overflow: auto;
  margin-bottom: 20px;
  margin-left: 20px;
}

.concert-card {
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-description {
  margin-bottom: 10px;
}

.card-info {
  font-size: 14px;
}

.card-info div {
  margin-bottom: 5px;
}
</style>
