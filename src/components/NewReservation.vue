<template>
  <div class="NewReservation">
    <input type="checkbox" id="name" name="name" v-model="sameName" />
    <label for="name">Use the same name as on your account? </label><br /><br />
    <div v-if="!sameName">
      <label for="first-name">First Name </label>
      <input
        type="text"
        id="first-name"
        name="first-name"
        v-model="firstName"
      /><br /><br />
      <label for="last-name">Last Name </label>
      <input
        type="text"
        id="last-name"
        name="last-name"
        v-model="lastName"
      /><br /><br />
    </div>
    <p>
      Enter a zip code
      <input type="text" v-model.lazy="zip" />
    </p>
    <template v-if="availableRestaurants.length > 0">
      <label for="restaurant-select">Choose a restaurant </label>
      <select
        id="restaurant-select"
        v-model.number="selectedRestaurantIndex"
        @change="onRestaurantSelected"
      >
        <option value="-1" disabled selected>Select a restaurant</option>
        <option
          v-for="(r, pos) in availableRestaurants"
          :key="pos"
          :value="pos"
        >
          {{ r }}
        </option></select
      ><br /><br />
    </template>
    <label for="party-select">How many people? </label>
    <input type="number" v-model.number="partySize" id="party-select" />
    <br /><br />
    <label for="date-select">Date and time for the reservation </label>
    <input type="datetime-local" v-model="date" id="date-select" />
    <br /><br />
    <button :disabled="noInput" @click="createReservation()">Create</button>
    <button @click="done()">Done</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { FirebaseFirestore } from "@firebase/firestore-types";
import { FirebaseAuth } from "@firebase/auth-types";
import axios, { AxiosResponse } from "axios";

@Component
export default class NewReservation extends Vue {
  readonly $appDB!: FirebaseFirestore;
  readonly $appAuth!: FirebaseAuth;
  private selectedRestaurantIndex = -1;
  private partySize = 0;
  private date = "";
  private availableRestaurants: string[] = [];
  private availableAddresses: string[] = [];
  private restaurantName = "";
  private zip = "";
  private restaurantLocation = "";
  private sameName = false;
  private firstName = "";
  private lastName = "";
  private accFirstName = "";
  private accLastName = "";
  private uid = "none";

  get noInput(): boolean {
    return (
      this.date.length === 0 ||
      this.partySize === 0 ||
      this.selectedRestaurantIndex == -1 ||
      (!this.sameName &&
        this.firstName.length === 0 &&
        this.lastName.length === 0)
    );
  }

  mounted(): void {
    this.uid = this.$appAuth.currentUser?.uid ?? "none";
    this.$appDB
      .collection("users")
      .doc(`${this.$appAuth.currentUser?.uid}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data != undefined) {
            this.accFirstName = data.firstName;
            this.accLastName = data.lastName;
          }
        }
      });
  }

  done(): void {
    this.$router.back();
  }

  @Watch("zip")
  zipChanged() {
    axios
      .get(`https://documenu.p.rapidapi.com/restaurants/zip_code/${this.zip}`, {
        headers: {
          "x-api-key": "07c2912ef38c7f578410c209b4171bf0",
          "x-rapidapi-key":
            "68b19d4a36msh74ac6ec4cd68426p13d8c2jsnfe9d7328898d",
          "x-rapidapi-host": "documenu.p.rapidapi.com",
          useQueryString: true,
        },
        params: {},
      })
      .then((r: AxiosResponse) => r.data)
      .then((restList: any) => {
        for (const restaurant of Object.keys(restList.data)) {
          this.availableRestaurants.push(
            restList.data[restaurant].restaurant_name
          );
          this.availableAddresses.push(
            restList.data[restaurant].address.formatted
          );
        }
        console.log(this.availableRestaurants);
        console.log(this.availableAddresses);
      });
  }
  onRestaurantSelected() {
    this.restaurantName = this.availableRestaurants[
      this.selectedRestaurantIndex
    ];
    this.restaurantLocation = this.availableAddresses[
      this.selectedRestaurantIndex
    ];
  }

  createReservation(): void {
    if (this.sameName) {
      this.firstName = this.accFirstName;
      this.lastName = this.accLastName;
    }
    this.$appDB.collection(`users/${this.uid}/reservations`).add({
      restaurantName: this.restaurantName,
      firstName: this.firstName,
      lastName: this.lastName,
      location: this.restaurantLocation,
      partySize: this.partySize,
      date: this.date,
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
