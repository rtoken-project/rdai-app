<template>
    <v-btn :block="block" :icon="icon" @click="execute" :outlined="outlined" :color="color" :disabled="mergedDisable" :loading="load">
        <template v-if="!hasWeb3 && !icon">
            Enable Web3
        </template>
        <slot v-else>
        </slot>
        <template v-if="symbolAppend.length>0">&nbsp;
            <token-svg v-if="hasWeb3" :size="24" :symbol="symbolAppend" />
            <v-icon v-else small>fas fa-lock</v-icon>
        </template>
    </v-btn>
</template>

<style lang="css" scoped>

</style>

<script>
import Vue from 'vue';
import vuex from 'vuex';
import {mapActions, mapState, mapGetters} from 'vuex'

export default {
  name: "Web3Btn",
  props: {
      action: String,
      params: {
          type: Object,
          default: undefined
      },
      disabled: Boolean,
      color: String,
      outlined: {
          type: Boolean,
          default: false
      },
      symbolAppend: {
          type: String,
          default: ''
      },
      icon: {
          type: Boolean,
          default: false
      },
      activateButton: {
          type: Boolean,
          default: false
      },
      block: {
          type: Boolean,
          default: false
      },
      loading: {
          type: Boolean,
          default: false
      }
  },
  data: () => {
      return {
          load: false,
      }
  },
  computed: {
      ...mapGetters(['userAddress', 'hasWeb3']),
      ...mapState(['finishedLoading']),
      mergedDisable(){
          if(this.activateButton) return false;
          return this.disabled || !this.hasWeb3
      }
  },
  watch: {
      loading(newVal){
          this.load = newVal;
      },
      finishedLoading(newVal){
          this.load = !newVal;
      }
  },
  methods: {
      execute(){
          this.$emit("btn-clicked");
          this.load = true;
          const cleanedParams = typeof this.params === 'undefined' ? [ this.action ] : [ this.action, this.params ];
          console.log("calling smart contract function: ", ...cleanedParams);
          this.$store.dispatch(...cleanedParams)
              .then(result => {
                  this.$emit("then", result);
                  if(!result.hasOwnProperty("tx")) return;
                  this.$store.commit("CONFIRMTRANSACTION", result);
              })
              .catch(error => {
                  this.$emit("catch", error);
                  if(error.hasOwnProperty("savedTxHash"))
                    this.$store.commit("ERRORTRANSACTION", error.savedTxHash);
              })
              .finally(()=>{
                  setTimeout( () => {
                      this.load = false;
                  }, 1000);
              })
      }
  },
  mounted(){
      this.load = loading;
  }
}
</script>
