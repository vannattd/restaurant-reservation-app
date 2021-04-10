<template>
  <div>
    <button v-if="userLoggedIn()" @click="logout()">Logout</button>
    <h1>Welcome [[Logged in user]]!</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FirebaseAuth, UserCredential } from "@firebase/auth-types";

@Component
export default class Dashboard extends Vue {
  readonly $appAuth!: FirebaseAuth;

  userLoggedIn(): boolean {
    return this.$appAuth.currentUser?.uid !== undefined;
  }

  logout(): void {
      this.$appAuth.signOut();
      this.$router.back();
  }
}
</script>

<style scoped></style>
