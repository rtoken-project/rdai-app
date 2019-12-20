<template>
  <v-container>
    <v-layout
      center
      mt-5
      :class="{
        wrap: $vuetify.breakpoint.smAndDown,
        nowrap: $vuetify.breakpoint.mdAndUp
      }"
    >
      <v-flex xs12 sm5 shrink ml-auto>
        <v-text-field
          v-model="amount"
          placeholder="SAI deposit amount"
          outlined
          label="deposit SAI"
        >
          <template slot="append">
            <div
              @click.stop="amount = userBalances.dai"
              class="pointer align-center mt-1 mr-3 grey--text"
            >
              MAX
            </div>
            <token-svg symbol="dai" :size="24"></token-svg>
          </template>
        </v-text-field>
      </v-flex>
      <v-flex xs2 sm1 shrink pt-3 mx-2>
        <v-icon>fa fa-exchange-alt</v-icon>
      </v-flex>
      <v-flex xs9 sm5 shrink mr-auto>
        <v-text-field
          :value="formattedAmount"
          placeholder="rSAI receive amount"
          outlined
          disabled
          label="receive rSAI"
        >
          <token-svg slot="append" symbol="rdai" :size="24"></token-svg>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout center mt-5 wrap>
      <v-flex
        xs12
        mx-auto
        caption
        mb-2
        text-center
        v-if="mintOrWhat === 'mintWithSelectedHat'"
      >
        This will change your pool from pool #{{ userHat.hatID }} to pool #{{
          interfaceHat.hatID
        }}.
        <br />
        <a @click="resetUserHat" class="pointer"
          >Click here to re-select your current pool (#{{ userHat.hatID }}).</a
        >
      </v-flex>
      <v-flex xs12 mx-auto>
        <web3-btn
          v-if="needsUnlock"
          color="primary"
          action="approve"
          symbolAppend="dai"
          :params="{ symbol: 'dai' }"
        >
          Please unlock SAI
        </web3-btn>
        <web3-btn
          v-else
          :action="mintOrWhat"
          :params="{ amount }"
          color="primary"
          symbolAppend="dai"
          :disabled="
            parseInt(amount) <= 0 ||
              userBalances.dai < parseInt(amount) ||
              !hatSelected
          "
        >
          {{ chosenHat }}
        </web3-btn>
      </v-flex>
      <v-flex xs12 mx-auto class="caption">
        You keep rSAI, interest goes to
        {{
          interfaceHat.shortTitle === "custom"
            ? "your chosen pool"
            : interfaceHat.shortTitle || "your chosen pool"
        }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="css" scoped>
.pointer{
  cursor: pointer;
}
</style>

<script>
import Vue from "vue";
import vuex from "vuex";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "mint",
  props: {
    hat: Object
  },
  data: () => ({
    placeholder: "SAI deposit amount",
    amount: 50 //preload with maximum balanceq
  }),
  computed: {
    ...mapState(["interfaceHat"]),
    ...mapGetters(["userHat", "userBalances", "userAllowances"]),
    hatSelected() {
      return (
        this.hat.hasOwnProperty("proportions") && this.hat.totalProportions > 0
      );
    },
    needsUnlock() {
      return this.userAllowances.dai.length <= this.amount.toString().length;
    },
    hatKind() {
      if (this.hat.hasOwnProperty("shortTitle")) return "featured";
      if (this.hat.hasOwnProperty("hatID")) return "custom";
      else return "create";
    },
    chosenHat() {
      if (this.userBalances.dai < parseInt(this.amount))
        return "You need more SAI";
      switch (this.mintOrWhat) {
        case "mint":
          return "Mint rSAI";
          break;
        case "mintWithSelectedHat":
          if (this.hatKind === "featured")
            return `Mint rSAI and switch to ${this.interfaceHat.shortTitle}`;
          else
            return `Mint rSAI and switch to pool #${this.interfaceHat.hatID} `;
        default:
          return "Direct to NEW pool";
      }
    },
    mintOrWhat() {
      if (this.hat.hasOwnProperty("hatID")) {
        if (this.userHat && this.userHat.hatID === this.hat.hatID)
          return "mint";
        else return "mintWithSelectedHat";
      } else return "mintWithNewHat";
    },
    formattedAmount() {
      if (this.amount.length < 1) return "";
      var a = parseFloat(this.amount);
      if (a % 1 >= 0 && a % 1 < 0.0001) return a.toFixed(2);
      else return a;
    }
  },
  methods: {
    resetUserHat() {
      this.$store.dispatch("setInterfaceHat", { hatID: this.userHat.hatID });
    }
  }
};
</script>
