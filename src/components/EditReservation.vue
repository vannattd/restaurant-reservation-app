<template>
  <div>
    <h2>Edit Reservation for {{ restaurantName }}</h2>
    <label for="first-name">First Name </label>
    <input type="text" v-model="firstName" /><br /><br />
    <label for="last-name">Last Name </label>
    <input
      type="text"
      id="last-name"
      name="last-name"
      v-model="lastName"
    /><br /><br />
    <label for="party-select">How many people? </label>
    <input type="number" v-model.number="partySize" id="party-select" />
    <br /><br />
    <label for="date-select">Date and time for the reservation </label>
    <input type="datetime-local" v-model="date" id="date-select" />
    <br /><br />
    <button :disabled="noInput" @click="saveReservation()">Save</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";
import {
  FirebaseFirestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@firebase/firestore-types";

@Component
export default class EditReservation extends Vue {
  @Prop() readonly id!: string;
  readonly $appAuth!: FirebaseAuth;
  readonly $appDB!: FirebaseFirestore;
  private date = "";
  private firstName = "";
  private lastName = "";
  private location = "";
  private partySize = 0;
  private restaurantName = "";

  get noInput(): boolean {
    return (
      this.date.length === 0 ||
      this.partySize === 0 ||
      this.firstName.length === 0 ||
      this.lastName.length === 0
    );
  }

  saveReservation(): void {
    console.log("Saved!");
    this.$appDB
      .collection("users")
      .doc(`${this.$appAuth.currentUser?.uid}`)
      .collection("reservations")
      .doc(this.id)
      .set({
        date: this.date,
        firstName: this.firstName,
        lastName: this.lastName,
        location: this.location,
        partySize: this.partySize,
        restaurantName: this.restaurantName,
      })
      .then(() => {
        // Save it to 'allReservations' as well, to update the table
        let docToUpdateID: string;
        this.$appDB
          .collection("allReservations")
          .where("reservationID", "==", this.id)
          .limit(1)
          .get()
          .then((docRef) => {
            docRef.forEach((doc) => {
              docToUpdateID = doc.id;
            });
          })
          .then(() => {
            this.$appDB
              .collection("allReservations")
              .doc(docToUpdateID)
              .set({
                restaurantName: this.restaurantName,
                partySize: this.partySize,
                date: this.date,
                reservationID: this.id,
              });
          });
      })
      .then(() => {
        this.$router.back();
      });
  }

  mounted(): void {
    this.$appDB
      .collection("users")
      .doc(`${this.$appAuth.currentUser?.uid}`)
      .collection("reservations")
      .doc(this.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data != undefined) {
            this.date = data.date;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.location = data.location;
            this.partySize = data.partySize;
            this.restaurantName = data.restaurantName;
          }
        }
      });
  }
}
</script>

<style scoped></style>
