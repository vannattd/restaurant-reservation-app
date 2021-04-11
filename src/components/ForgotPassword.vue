<template>
  <div>
    <h1>Reset Your Password</h1>
    <input type="text" v-model="email" placeholder="Email" /><br /><br />
    <button :disabled="noInput" @click="resetPasswordClick()">
      Reset Password
    </button>
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ForgotPassword extends Vue {
  private message = "";
  private email = "";

  get noInput(): boolean {
    return this.email.length === 0;
  }

  showMessageAndDismiss(m: string) {
    this.message = m;
    setTimeout(() => {
      // Auto disappear after 5 seconds
      this.message = "";
      this.$router.back();
    }, 3000);
  }

  showMessage(m: string) {
    this.message = m;
    setTimeout(() => {
      // Auto disappear after 5 seconds
      this.message = "";
    }, 3000);
  }

  resetPasswordClick() {
    // call firebase thing to reset password. Plenty of docs from firebase website
    var auth = firebase.auth();
    auth
      .sendPasswordResetEmail(this.email)
      .then(() => {
        this.showMessageAndDismiss(
          "Check your email for a link to reset your password!"
        );
      })
      .catch((err) => {
        this.showMessage(err);
      });
  }
}
</script>

<style scoped></style>
