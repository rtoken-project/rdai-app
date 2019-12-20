<template>
  <v-layout
    center
    wrap
    py-5
    fluid
    pa-0
    :class="{
      wrap: $vuetify.breakpoint.smAndDown,
      nowrap: $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-flex xs12 mb-5 py-5>
      Exchange your rSAI back to SAI<br />Withdrawn rSAI will immediately stop
      accruing interest
    </v-flex>
    <v-flex xs12 sm5 shrink ml-auto>
      <v-text-field
        v-model="amount"
        placeholder="Quantity to redeem"
        outlined
        label="redeem rSAI"
      >
        <template slot="append">
          <div
            @click="calcMax"
            class="pointer align-center mt-1 mr-3 grey--text"
          >
            MAX
          </div>
          <token-svg symbol="rdai" :size="24"></token-svg>
        </template>
      </v-text-field>
    </v-flex>
    <v-flex xs2 sm1 shrink pt-3 mx-2>
      <v-icon>fa fa-exchange-alt</v-icon>
    </v-flex>
    <v-flex xs9 sm5 shrink mr-auto>
      <v-text-field
        :value="formattedAmount"
        placeholder="Quantity you receive back"
        outlined
        disabled
        label="receive SAI"
      >
        <token-svg slot="append" symbol="dai" :size="24"></token-svg>
      </v-text-field>
    </v-flex>
    <v-flex sm8 mx-auto>
      <web3-btn
        color="primary"
        action="redeem"
        :params="{ amount }"
        :disabled="amount === 0"
        symbolAppend="dai"
      >
        Redeem rSAI
      </web3-btn>
    </v-flex>
  </v-layout>
</template>

<style lang="css" scoped>
.pointer{
  cursor: pointer;
}
</style>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "redeem",
  props: {},
  data: () => ({
    amount: 0
  }),
  computed: {
    ...mapGetters(["userBalances"]),
    formattedAmount() {
      var a = parseFloat(this.amount);
      if (a % 1 >= 0 && a % 1 < 0.0001) return a.toFixed(2);
      else return a;
    }
  },
  methods: {
    ...mapActions(["redeem", "getBalance"]),
    async calcMax() {
      await this.getBalance("rdai");
      this.amount = this.userBalances.rdai;
    }
  }
};
</script>
