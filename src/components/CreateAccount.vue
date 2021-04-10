<template>
  <div id="createAnAccount">
    <h1>Create Your Account</h1>
    <input
      type="text"
      v-model="userEmail"
      id="userEmail"
      placeholder="Email"
    /><br /><br />
    <input
      type="password"
      v-model="userPassword"
      id="userPassword"
      placeholder="Password"
    /><br /><br />
    <input
      type="text"
      v-model="firstName"
      id="firstName"
      placeholder="First Name"
    /><br /><br />
    <input
      type="text"
      v-model="lastName"
      id="lastName"
      placeholder="Last Name"
    /><br /><br />
    <input
      type="text"
      v-model="phoneNumber"
      id="phoneNumber"
      placeholder="Phone Number"
    /><br /><br />
    <button
      type="button"
      id="signUp"
      :disabled="noInput"
      @click="createAccount()"
    >
      Sign Up!
    </button>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";
import { FirebaseFirestore } from "@firebase/firestore-types";

@Component
export default class CreateAccount extends Vue {
  private userEmail = "";
  private userPassword = "";
  private firstName = "";
  private lastName = "";
  private phoneNumber = "";
  private message = "";
  readonly $appAuth!: FirebaseAuth;
  readonly $appDB!: FirebaseFirestore;
  private uid = "";

  get noInput(): boolean {
    return (
      this.userEmail.length === 0 ||
      this.userPassword.length === 0 ||
      this.firstName.length === 0 ||
      this.lastName.length === 0 ||
      this.phoneNumber.length === 0
    );
  }

  showMessage(m: string): void {
    this.message = m;
    setTimeout(() => {
      // Auto disappear after 5 seconds
      this.message = "";
    }, 5000);
  }

  createAccount(): void {
    //Create the firebase account
    this.$appAuth
      .createUserWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((u: UserCredential) => {
        this.showMessage(`User create UID ${u.user?.uid}`);
        this.uid = `${u.user?.uid}`;
        //add them to the users collection along with fname, lastname, etc.
        this.$appDB
          .collection(`users`)
          .doc(`${this.uid}`)
          .set({
            email: this.userEmail,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            // maybe an array of reservation ids eventually?
          })
          .then(() => {
            this.$router.replace({ path: "/dashboard" });
          });
      })
      .catch((err: any) => {
        this.showMessage(`Unable to create account ${err}`);
      });
  }
}
</script>

<style scoped></style>
