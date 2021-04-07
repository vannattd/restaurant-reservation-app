<template>
  <div class="AppLogin">
    <label for="email">Email </label>
    <input
      type="text"
      v-model="userEmail"
      id="email"
      name="email"
    /><br /><br />
    <label for="password">Password </label>
    <input
      type="password"
      v-model="userPassword"
      id="password"
      name="password"
    /><br /><br />
    <button
      type="button"
      :disabled="noInput"
      id="signIn"
      @click="authenticate()"
    >
      Sign In
    </button>
    <button
      type="button"
      :disabled="noInput"
      id="signUp"
      @click="createAccount()"
    >
      Sign Up
    </button>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";

@Component
export default class AppLogin extends Vue {
  //MARK: Copied from HW
  readonly $appAuth!: FirebaseAuth;
  private message = "";
  private userEmail = "";
  private userPassword = "";
  get noInput(): boolean {
    return this.userEmail.length === 0 || this.userPassword.length === 0;
  }
  createAccount(): void {
    this.$appAuth
      .createUserWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((u: UserCredential) => {
        this.showMessage(`User create UID ${u.user?.uid}`);
      })
      .catch((err: any) => {
        this.showMessage(`Unable to create account ${err}`);
      });
    //this.$router.push({ path: "/category" });
  }

  authenticate(): void {
    this.$appAuth
      .signInWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((u: UserCredential) => {
        this.showMessage(`Login successful UID ${u.user?.uid}`);
      })
      .catch((err: any) => {
        this.showMessage(`Unable to login ${err}`);
      });
    //this.$router.push({ path: "/expenses" });
  }

  showMessage(m: string): void {
    this.message = m;
    setTimeout(() => {
      // Auto disappear after 5 seconds
      this.message = "";
    }, 5000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
