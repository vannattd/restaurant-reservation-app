<template>
  <div>
    <button v-if="userLoggedIn()" @click="logout()">Logout</button><br /><br />
    <h1>Welcome {{ firstName }} {{ lastName }}!</h1>
    <br />
    <button id="newReservation" @click="newReservation()">
      New Reservation</button
    ><br /><br />
    <h2>Past Reservations</h2>
    <table>
      <thead>
        <tr>
          <th>Restaurant Name</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Location</th>
          <th>Party Size</th>
          <th>Reservation Date/Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(z, pos) in allReservations" :key="pos">
          <td>{{ z.name }}</td>
          <td>{{ z.firstName }}</td>
          <td>{{ z.lastName }}</td>
          <td>{{ z.location }}</td>
          <td>{{ z.partySize }}</td>
          <td>{{ z.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";
import { FirebaseFirestore, QueryDocumentSnapshot, QuerySnapshot } from "@firebase/firestore-types";

@Component
export default class Dashboard extends Vue {
  readonly $appAuth!: FirebaseAuth;
  readonly $appDB!: FirebaseFirestore;
  private firstName = "";
  private lastName = "";
  private uid = "none";
  private allReservations: any[] = [];


  userLoggedIn(): boolean {
    return this.$appAuth.currentUser?.uid !== undefined;
  }

  logout(): void {
    this.$appAuth.signOut();
    this.$router.back();
  }

  newReservation(): void {
    this.$router.push({ path: "/newReservation" });
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
            this.firstName = data.firstName;
            this.lastName = data.lastName;
          }
        }
      });

    this.$appDB
      .collection(`users/${this.uid}/reservations`)
      .orderBy("date") // Sort by date
      .onSnapshot((qs: QuerySnapshot) => {
        this.allReservations.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const resData = qds.data();
            this.allReservations.push({
              name: resData.restaurantName,
              firstName: resData.firstName,
              lastName: resData.lastName,
              location: resData.location,
              partySize: resData.partySize,
              date: resData.date,
            });
          }
        });
  })
</script>

<style scoped>
#newReservation {
  font-size: 1em;
  background-color: aqua;
}

table {
  margin: auto;
}

th {
  padding: 2em 2em 0em 2em;
  border-bottom: 1px solid black;
}

td {
  padding: 2em;
}
</style>
