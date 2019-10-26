<template>
  <div class="">
    <CreateHat  />
    <v-divider />
    <Mint :hat="hatInCreation"/>
  </div>
</template>

<script>
import Vue from 'vue';
import vuex from 'vuex';
import CreateHat from '@/components/CreateHat.vue';
import Mint from '@/components/Mint.vue';

export default {
  name: 'create',
  components: {
    CreateHat,
    Mint
  },
  computed: {
    hatInCreation(){
      return this.$store.state.hatInCreation;
    }
  }
}
</script>
