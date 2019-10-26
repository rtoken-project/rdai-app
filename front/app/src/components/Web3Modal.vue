<template>
  <v-dialog v-model="web3modal" persistent max-width="290">
    <v-card class="pa-4">
      <v-card-title class="headline">Enable Web3</v-card-title>
      <v-card-text class="my-4">In order to access our dApp, you will need to enable web3.</v-card-text>
      <v-card-actions>
        <web3-btn block activateButton
          action="activateWeb3" color="primary"
          :loading="load"
        >
          ENABLE WEB3
        </web3-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vuex from 'vuex';
import {mapState, mapActions, mapGetters} from 'vuex';

export default {
  name: 'Web3Modal',
  data: () => ({
      loading: true
  }),
  computed: {
      ...mapState(["web3modal", "loadingWeb3"]),
      load(){
        return this.loading || this.loadingWeb3
      }
  },
  methods: {
      ...mapActions(['activateWeb3']),
  },
  mounted(){
      setTimeout(() => {
          this.loading = false
      }, 3000);
  }
}
</script>
