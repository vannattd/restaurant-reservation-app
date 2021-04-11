<template>
  <div>
    <button v-if="userLoggedIn()" @click="logout()">Logout</button><br /><br />
    <h1>Welcome {{ firstName }} {{ lastName }}!</h1>
    <br />
    <button id="newReservation">New Reservation</button><br /><br />
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
      <tbody></tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";
import { FirebaseFirestore } from "@firebase/firestore-types";

@Component
export default class Dashboard extends Vue {
  readonly $appAuth!: FirebaseAuth;
  readonly $appDB!: FirebaseFirestore;
  private firstName = "";
  private lastName = "";

  userLoggedIn(): boolean {
    return this.$appAuth.currentUser?.uid !== undefined;
  }

  logout(): void {
    this.$appAuth.signOut();
    this.$router.back();
  }

  mounted(): void {
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
  }
}
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
