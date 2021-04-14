<template>
  <div id="app">
    <!-- Useful if we want to add an image or logo: <img alt="Vue logo" src="./assets/logo.png"> -->

    <h1>Restaurant Reservation Web App</h1>
    <h3>Dylan Vannatter and Johnathon Frocillo</h3>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppLogin from "./components/AppLogin.vue";
import CreateAccount from "./components/CreateAccount.vue";

@Component({
  components: {
    AppLogin,
    CreateAccount,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  /* background-color: #0099d1; */
}

h1,
h3 {
  color: #414042;
}
body {
  background-color: #0099d1;
}
button {
  background-color: #017eac;
  color: whitesmoke;
}
</style>
