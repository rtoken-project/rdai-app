<template>
  <v-flex>
    <v-img v-if="importedSvg" :src="path" :max-width="size" contain />
    <cryptoicon v-else :symbol="symbol" :size="size" />
  </v-flex>
</template>

<script>
import Vue from "vue";
//import Rdai from "../assets/rdai.svg";
//import Cdai from "../assets/cdai.svg";
//import Dai from "../assets/dai.svg";
//import Metamask from "../assets/metamask.svg";

export default {
  name: "TokenSvg",
  components: {
  },
  props: {
    symbol: String,
    size: Number
  },
  data: () => ({
    allowed: ["rdai", "cdai", "dai", "metamask"]
  }),
  computed: {
    importedSvg() {
      return this.allowed.includes(this.symbol.toLowerCase());
    },
    path() {
      return require(`@/assets/${this.symbol.toLowerCase()}.svg`);
    }
  }
};
</script>

<style lang="css" scoped></style>
