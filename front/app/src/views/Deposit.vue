<template>
  <div>
    <FeaturedHat v-if="featuredHat" />
    <CustomHat v-else />
    <v-divider />
    <Mint :hat="interfaceHat" />
  </div>
</template>

<script>
import CustomHat from "@/components/CustomHat";
import Mint from "@/components/Mint";
import FeaturedHat from "@/components/FeaturedHat";

export default {
  name: "Create",
  components: {
    Mint,
    CustomHat,
    FeaturedHat
  },
  computed: {
    route() {
      return this.$route.name;
    },
    interfaceHat() {
      return this.$store.state.interfaceHat;
    },
    featuredHat() {
      if (this.interfaceHat.hasOwnProperty("shortTitle")) return true;
      else if (this.$store.state.storedUrlHat.hasOwnProperty("shortTitle"))
        return true;
      else return false;
    }
  }
};
</script>
