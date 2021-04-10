import Vue from 'vue'
import App from './App.vue'
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"
import { AppRouter } from "./app-routing"

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyCWO-YxXJHTi0PNphri-2hcJb4OzOR53yo",
  authDomain: "restaurant-reservation-a-ce7fa.firebaseapp.com",
  projectId: "restaurant-reservation-a-ce7fa",
  storageBucket: "restaurant-reservation-a-ce7fa.appspot.com",
  messagingSenderId: "149987673058",
  appId: "1:149987673058:web:9273a6c04b85a99a9cefbb",
  measurementId: "G-Z0V64ZWVK3"
};
firebase.initializeApp(firebaseConfig);
Vue.prototype.$appAuth = firebase.auth();
Vue.prototype.$appDB = firebase.firestore();

new Vue({
  router: AppRouter,
  render: h => h(App)
}).$mount('#app')
