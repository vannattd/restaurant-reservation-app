<template>
  <div>
    <button v-if="userLoggedIn()" @click="logout()">Logout</button><br /><br />
    <h1>Welcome {{ firstName }} {{ lastName }}!</h1>
    <br />
    <button id="newReservation" @click="newReservation()">
      New Reservation</button
    ><br /><br />
    <h2>My Reservations</h2>
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
        <tr
          v-for="(z, pos) in myReservations"
          :key="pos"
          @mouseover="hover = true"
          @mouseleave="hover = false"
        >
          <td>{{ z.name }}</td>
          <td>{{ z.firstName }}</td>
          <td>{{ z.lastName }}</td>
          <td @click="showMap(z.location)">{{ z.location }}</td>
          <td>{{ z.partySize }}</td>
          <td>{{ z.date }}</td>
          <td><button v-if="hover" @click="editClicked(z.id)">Edit</button></td>
          <td>
            <button v-if="hover" @click="deleteClicked(z.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>All Reservations Today</h2>
    <table>
      <thead>
        <tr>
          <th>Restaurant Name</th>
          <th>Party Size</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(z, pos) in todayReservations" :key="pos">
          <td>{{ z.name }}</td>
          <td>{{ z.partySize }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";
import {
  FirebaseFirestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "@firebase/firestore-types";

@Component
export default class Dashboard extends Vue {
  readonly $appAuth!: FirebaseAuth;
  readonly $appDB!: FirebaseFirestore;
  private firstName = "";
  private lastName = "";
  private hover = false;
  private uid = "none";
  private myReservations: any[] = [];
  private allReservations: any[] = [];
  private todayReservations: any[] = [];

  showMap(location: string) {
    window.open(`http://google.com/search?q=${location}`);
  }

  userLoggedIn(): boolean {
    return this.$appAuth.currentUser?.uid !== undefined;
  }

  logout(): void {
    this.$appAuth.signOut();
    this.$router.back();
  }

  editClicked(id: string): void {
    this.$router.push({ path: `/editReservation/${id}` });
  }

  deleteClicked(id: string): void {
    let docToDelete: string;
    this.$appDB
      .collection("users")
      .doc(`${this.$appAuth.currentUser?.uid}`)
      .collection("reservations")
      .doc(id)
      .delete()
      .then(() => {
        this.$appDB
          .collection("allReservations")
          .where("reservationID", "==", id)
          .limit(1)
          .get()
          .then((docRef) => {
            docRef.forEach((doc) => {
              docToDelete = doc.id;
            });
          })
          .then(() => {
            this.$appDB
              .collection("allReservations")
              .doc(docToDelete)
              .delete();
          });
      })
      .then(() => {
        alert("Reservation Deleted.");
      });
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
      .orderBy("date", "desc") // Sort by date
      .onSnapshot((qs: QuerySnapshot) => {
        this.myReservations.splice(0); // remove old data
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const resData = qds.data();
            this.myReservations.push({
              name: resData.restaurantName,
              firstName: resData.firstName,
              lastName: resData.lastName,
              location: resData.location,
              partySize: resData.partySize,
              date: resData.date,
              id: qds.id,
            });
          }
        });
      });

    this.$appDB
      .collection(`allReservations`)
      .orderBy("partySize") // Sort by size
      .onSnapshot((qs: QuerySnapshot) => {
        this.allReservations.splice(0); // remove old data
        this.todayReservations.splice(0);
        console.log(this.allReservations);
        qs.forEach((qds: QueryDocumentSnapshot) => {
          if (qds.exists) {
            const resData = qds.data();
            this.allReservations.push({
              name: resData.restaurantName,
              partySize: resData.partySize,
              date: resData.date,
              id: resData.reservationID,
            });
          }
        });
        this.allReservations.forEach((reservation) => {
          var today = new Date();
          var resDate = new Date(reservation.date);
          console.log(today.getMonth(), today.getDate());
          console.log(resDate.getMonth(), resDate.getDate());

          if (
            resDate.getMonth() == today.getMonth() &&
            resDate.getDate() == today.getDate()
          ) {
            this.todayReservations.push(reservation);
          }
        });
      });
  }
}
</script>

<style scoped>
#newReservation {
  font-size: 1em;
  /* //background-color: aqua; */
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
  color: #414042;
}
</style>
