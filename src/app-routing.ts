import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import AppLogin from "./components/AppLogin.vue";
import CreateAccount from "./components/CreateAccount.vue";
import ForgotPassword from "./components/ForgotPassword.vue";
import Dashboard from "./components/Dashboard.vue";
Vue.use(VueRouter);

const myRoutes: Array<RouteConfig> = [
    {
        name: "Login",
        path: "/",
        component: AppLogin,
    },
    {
        name: "CreateAccount",
        path: "/createAccount",
        component: CreateAccount
    },
    {
        name: "ForgotPassword",
        path: "/forgotPassword",
        component: ForgotPassword
    },
    {
        name: "Dashboard",
        path: "/dashboard",
        component: Dashboard
    }
];

export const AppRouter = new VueRouter({
    routes: myRoutes,
    mode: "history"
})
