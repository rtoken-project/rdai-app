<template>
  <v-layout align-center wrap pt-5 mt-5 fluid fill-height pa-0>
    <v-flex text-center mt-4 xs12>
      <h3>Lookup address</h3>
      <p>Find out if an address has a pool assigned</p>
    </v-flex>
    <v-flex sm8 shrink mx-auto text-xs-center>
      <v-text-field
        label="Lookup Address"
        single-line
        v-model="lookupAddress"
        :counter="42"
        :disabled="disableInput"
      >
        <template slot="append">
          <div
            v-if="lookupAddress.length === 0 && hasWeb3"
            @click="lookupAddress = userAddress"
            class="pointer align-center mt-1 mr-3 grey--text"
          >
            {{ userAddress | formatAddress }}
          </div>
        </template>
      </v-text-field>
    </v-flex>
    <v-flex xs12 mb-4 text-center shrink text-center>
      <web3-btn
        color="primary"
        outlined
        :disabled="lookupAddress.length !== 42"
        action="getHatByAddress"
        @btn-clicked="getHatByAddressClicked"
        @then="getHatByAddressThen"
        @catch="getHatByAddressCatch"
        :params="{ address: lookupAddress }"
      >
        Lookup Pool
      </web3-btn>
      <app-custom-hat
        v-if="typeof foundHat !== 'undefined'"
        :hat="foundHat"
      ></app-custom-hat>
    </v-flex>
  </v-layout>
</template>

<style lang="css" scoped>
.pointer{
  cursor: pointer;
}
</style>

<script>
import Vue from "vue";
import vuex from "vuex";
import CustomHat from "./CustomHat.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "app-interest",
  components: {
    "app-custom-hat": CustomHat
  },
  props: {},
  data: () => ({
    lookupAddress: "",
    hatByAddress: undefined,
    disableInput: false,
    foundHat: undefined
  }),
  computed: {
    ...mapGetters(["userAddress", "hasWeb3"])
  },
  methods: {
    async getHatByAddressClicked() {
      this.foundHat = undefined;
      this.disableInput = true;
      this.hatByAddress = await this.$store.dispatch(
        "getHatByAddress",
        this.lookupAddress
      );
      this.disableInput = false;
      console.log("this.hatByAddress: ", this.hatByAddress);
    },
    getHatByAddressThen(value) {
      console.log("the hat I looked up is: ", value);
      this.foundHat = value;
      this.disableInput = false;
    },
    getHatByAddressCatch(value) {
      console.log("caught error: ", value);
      this.disableInput = false;
      this.foundHat = undefined;
    }
  }
};
</script>
