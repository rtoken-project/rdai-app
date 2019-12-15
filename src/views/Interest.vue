<template>
  <div>
    <LookupInterest />
    <v-divider />
    <LookupHat />
  </div>
</template>

<script>
import LookupHat from "@/components/LookupHat";
import LookupInterest from "@/components/LookupInterest";

export default {
  name: "Interest",
  components: {
    LookupHat,
    LookupInterest
  }
};
</script>
