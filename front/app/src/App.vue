<template>
  <v-app id="keep">
    <v-app-bar app clipped-right>
      <v-img
        src="./assets/logo.svg"
        lazy-src="./assets/logo.svg"
        aspect-ratio="1"
        class="pa-2 cursor"
        contain
        max-width="50"
        max-height="50"
        @click.stop="backToHome"
      ></v-img>
      <v-layout column ml-2
        ><v-flex class="font-weight-thin font-italic">Beta</v-flex
        ><v-flex class="font-weight-bold caption">{{
          chainName
        }}</v-flex></v-layout
      >
      <v-spacer></v-spacer>
      <span class="subtitle hidden-xs-only"
        >Unlock your DAI<span class="hidden-sm-and-down"
          >'s true potential</span
        ></span
      >
      <v-spacer></v-spacer>
      <v-flex text-sm-right class="cursor">
        <div @click="drawer = !drawer" v-if="hasWeb3">
          <v-icon color="green" small class="mr-2">fas fa-circle</v-icon
          ><span :class="{ caption: $vuetify.breakpoint.xs }">{{
            userAddress | formatAddress
          }}</span>
        </div>
        <template v-else>
          <web3-btn activateButton action="activateWeb3" color="primary"
            >CONNECT YOUR WALLET</web3-btn
          >
        </template>
      </v-flex>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout wrap grid-list-sm>
          <v-flex sm12 text-sm-center>
            <v-tabs
              v-model="tab"
              light
              centered
              show-arrows
              class="tabs-parent"
            >
              <v-tab to="/choose">
                CHOOSE
              </v-tab>
              <v-tab to="/create">
                CREATE
              </v-tab>
              <v-tab to="/deposit" :disabled="!interfaceHat">
                DEPOSIT
              </v-tab>
              <v-tab to="/redeem">
                REDEEM
              </v-tab>
              <v-tab to="/interest" v-if="$route.name === 'interest'">
                INTEREST
              </v-tab>
            </v-tabs>
            <router-view />
          </v-flex>
        </v-layout>
        <Web3Modal />
      </v-container>
    </v-content>

    <v-navigation-drawer
      v-model="drawer"
      v-if="hasWeb3"
      app
      right
      clipped
      color="white"
      :mobile-break-point="640"
      class="elevation-3"
      width="350"
    >
      <app-drawer />
    </v-navigation-drawer>
    <app-snackbar />
    <v-footer fixed ma-2 app>
      <a
        href="https://twitter.com/rDAI_dao"
        target="_blank"
        style="text-decoration: none;color:rgb(29, 161, 242)"
        ><v-icon style="color:rgb(29, 161, 242)">fab fa-twitter</v-icon
        >@rDAI_dao</a
      >
      <a
        href="https://discordapp.com/invite/J8ymQV9"
        target="_blank"
        class="ml-3"
        style="text-decoration: none;color:#7289DA"
        ><v-icon style="color: #7289DA">fab fa-discord</v-icon>#support
        channel</a
      >
      <v-spacer />
      <span class="text-sm-right grey--text">
        {{ new Date().getFullYear() }} -
        <a
          href="https://www.decentral.ee"
          class="grey--text"
          style="text-decoration:none;"
          >Decentral.ee</a
        >
      </span>
    </v-footer>
  </v-app>
</template>

<style media="screen">
.subtitle {
  font-family: "Gugi", cursive;
}
.cursor:hover {
  cursor: pointer;
}
.round {
  border-radius: 100%;
}
.v-select__selections * {
  font-size: 1.3em !important;
}
.tabs-parent .v-tab {
  font-weight: 600;
  padding-right: 2.3em;
  padding-left: 2.3em;
}
</style>

<script>
import Vue from "vuex";
import router from "@/router.js";
import Drawer from "@/components/Drawer.vue";
import Snackbar from "@/components/Snackbar.vue";
import Web3Modal from "@/components/Web3Modal.vue";
import Vuex from "vuex";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: {
    source: String
  },
  components: {
    "app-drawer": Drawer,
    "app-snackbar": Snackbar,
    Web3Modal
  },
  data: () => ({
    tab: "/choose",
    showLoader: true,
    drawer: false
  }),
  computed: {
    ...mapState([
      "account",
      "allHats",
      "hatInCreation",
      "loadingPage",
      "loadingWeb3"
    ]),
    ...mapGetters([
      "userAddress",
      "userHat",
      "interfaceHat",
      "hasWeb3",
      "chainName",
      "userBalances"
    ]),
    donations() {
      return this.$route.name === "donation" && this.userBalances.rdai <= 0;
    }
  },
  methods: {
    ...mapActions(["activateWeb3"]),
    backToHome() {
      if (this.$route.name === "donation") return;
      else this.$router.push("/choose");
    }
  },
  watch: {
    drawer(newV){
      if(newV){
        console.log("this.tab: ", this.tab);
        const val = this.tab;
        this.tab = "interest";
        setTimeout(()=> {
          this.tab = val;
        }, 200);
      }
    },
    hasWeb3(newV){
      if(newV){
        this.drawer = true;
      }
    }
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
