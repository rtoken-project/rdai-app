<template>
  <div>
    <FeaturedHat v-if="interfaceHat.hasOwnProperty('shortTitle')"/>
    <CustomHat v-else/>
    <v-divider />
    <Mint :hat="interfaceHat"/>
  </div>
</template>

<script>
import CustomHat from '@/components/CustomHat';
import Mint from '@/components/Mint';
import FeaturedHat from '@/components/FeaturedHat';

export default {
  name: 'Create',
  props: {
      shortTitle: {
          type: String,
          default: null,
          required: false
      },
      hatID: {
          type: String,
          default: null,
          required: false
      }
  },
  components: {
    Mint,
    CustomHat,
    FeaturedHat
  },
  computed:{
    route(){
      return this.$route.name
    },
    interfaceHat(){
      return this.$store.state.interfaceHat
    }
  }
}
</script>
