import Vue from "vue";
import Router from "vue-router";
import featured from "./featured.js";
import store from "./store/";

Vue.use(Router);


const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/deposit/:hatID?",
            name: "deposit",
            props: true,
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Deposit.vue")
        },
        {
            path: "/create",
            name: "create",
            component: () =>
                import(/* webpackChunkName: "interface" */ "@/views/Create.vue")
        },
        {
            path: "/donate/:shortTitle",
            name: "donate",
            props: true,
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Deposit.vue")
        },
        {
            path: "/interest",
            name: "interest",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Interest.vue")
        },
        {
            path: "/redeem",
            name: "redeem",
            component: () =>
                import(/* webpackChunkName: "interface" */ "./views/Redeem.vue")
        },
        {
            path: "*",
            name: "choose",
            component: () =>
                import(/* webpackChunkName: "donations" */ "./views/Choose.vue")
        }
    ]
});


router.beforeEach((to, from, next) => {
    const { hasWeb3 } = store.getters;
    const { web3modal } = store.state;
    const { hatID, shortTitle } = to.params;
    console.log("to: ", to);
    if( !hasWeb3 && (to.name === 'donate' || to.name === 'deposit')){
      store.commit('TOGGLEWEBMODAL', true);
      store.commit('STOREURLHAT', {hatID, shortTitle});
    };
    next(true);
});
router.afterEach((to, from) => {
    const { exchangeRate } = store.state;
    if( exchangeRate <= 0){
        console.log("first load of page");
        store.dispatch("onPageLoad");
    }
});

export default router;
