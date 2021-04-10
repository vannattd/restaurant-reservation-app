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
    <br /><br /><br />
    <button type="button" id="createAccount" @click="showNewAccountScreen()">
      Create an Account
    </button>
    <br /><br />
    <button @click="showForgotPasswordScreen()">Forgot Password</button>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
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

  showNewAccountScreen(): void {
    this.$router.push({ path: "/createAccount" });
  }

  showForgotPasswordScreen(): void {
    this.$router.push({ path: "/forgotPassword" });
  }

  authenticate(): void {
    this.$appAuth
      .signInWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((u: UserCredential) => {
        this.showMessage(`Login successful UID ${u.user?.uid}`);
        // Go to landing/dashboard screen
        this.$router.push({ path: "/dashboard" });
      })
      .catch((err: any) => {
        this.showMessage(`Unable to login ${err}`);
      });
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
<style scoped></style>
