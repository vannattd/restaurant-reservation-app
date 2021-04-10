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
    <button type="button" id="signUp" :disabled="noInput" @click="createAccount()">
      Sign Up!
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CreateAccount extends Vue {
  private userEmail = "";
  private userPassword = "";
  private firstName = "";
  private lastName = "";
  private phoneNumber = "";

  get noInput(): boolean {
    return (
      this.userEmail.length === 0 ||
      this.userPassword.length === 0 ||
      this.firstName.length === 0 ||
      this.lastName.length === 0 ||
      this.phoneNumber.length === 0
    );
  }

    createAccount(): void {
        // Create the firebase account
        // this.$appAuth
        //     .createUserWithEmailAndPassword(this.userEmail, this.userPassword)
        //     .then((u: UserCredential) => {
        //     this.showMessage(`User create UID ${u.user?.uid}`);
        //     })
        //     .catch((err: any) => {
        //     this.showMessage(`Unable to create account ${err}`);
        //     });
        // //this.$router.push({ path: "/category" });

        // add them to the users collection along with fname, lastname, etc.
        //...

        
    }
}
</script>

<style scoped></style>
