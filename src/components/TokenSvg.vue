<template>
  <v-flex>
    <v-img v-if="importedSvg" :src="path" :max-width="size" contain />
    <cryptoicon v-else :symbol="symbol.toLowerCase()" :size="size" />
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
    allowed: ["rdai", "cdai", "dai", "sai", "metamask"]
  }),
  computed: {
    importedSvg() {
      return this.allowed.includes(this.symbol.toLowerCase());
    },
    path() {
      return require(`@/assets/${this.symbol.toLowerCase()}.svg`);
    }
  },
  mounted(){
    console.log("ok so it should show the asset: " + this.symbol + " and it should be equal to: " + this.path);
  }
};
</script>

<style lang="css" scoped></style>
