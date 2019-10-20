<template>
  <v-container
    text-sm-center py-5 mx-xs-auto
    fluid
    fill-height
    pa-0
    >
    <v-sheet
      elevation=3
      class="pa-3 mx-auto"
      max-width="640"
      >
      <v-layout grid-list-sm
        :class="{'wrap': $vuetify.breakpoint.smAndDown, 'nowrap': $vuetify.breakpoint.mdAndUp}"
        >
        <v-flex class="text-sm-center title my-auto pr-1">
          <span v-if="hasPropHat">Pool:</span>
          <span v-else-if="isMyHat">Current Pool:</span>
          <span v-else>Switch to new pool:</span>
        </v-flex>
      </v-layout>
      <v-layout wrap align-center mr-4 subtitle-2>
        <template v-if="displayHat.hatID === -666">
          <v-flex xs12>
            <v-layout class="text-center">
              SELF
            </v-layout>
          </v-flex>
        </template>
        <template v-else-if="displayHat.hatID === 0">
          <v-flex xs12 text-center>
              No pool
          </v-flex>
        </template>
        <template v-else v-for="(item, i) in displayHat.length" md12>
          <v-flex xs12 row>
            <v-layout nowrap>
              <v-flex grow nowrap text-left
                >
                  <template v-if="displayHat.hasOwnProperty('featured') && displayHat.featured[i]">
                    {{ displayHat.featured[i] }}
                  </template>
                  <template v-else-if="$vuetify.breakpoint.smAndDown">
                    {{ displayHat.recipients[i] | formatAddress }}
                  </template>
                  <template v-else>
                    {{ displayHat.recipients[i] }}
                  </template>
              </v-flex>
              <v-flex text-right ml-3>
                {{ (displayHat.proportions[i]/displayHat.totalProportions*100).toFixed(2) }}%
              </v-flex>
            </v-layout>
          </v-flex>
          <v-divider hidden-md-and-up />
        </template>
      </v-layout>
      <bar-chart v-if="displayHat.length>1" :hat="displayHat" />
      <v-flex xs12 my-5 v-if="displayHat.hatID !== userHat.hatID && displayHat.hatID > 0">
        <web3-btn action="changeHat" :params="{hatID: displayHat.hatID}">
          Switch to this pool
        </web3-btn>
      </v-flex>
    </v-sheet>
  </v-container>
</template>

<style lang="css" scoped>
  .pointer{
    cursor: pointer;
  }
  .justify-text{
    text-align: justify;
  }
  .minus-bottom{
    margin-bottom: -1em;
  }
  .minus-top{
    margin-top: -1em;
  }
  .minus-top-8{
    margin-top: -0.8em;
  }
  .row{
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
</style>

<script>
import vuex from "vuex";
import {mapActions, mapGetters, mapState} from "vuex";
import featured from '../featured';
import randomColor from '../colors';

export default {
  name: 'app-custom-hat',
  props: {
    hat: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    ...mapGetters(['userAddress', 'hasWeb3', 'userHat']),
    ...mapState(['allHats', 'interfaceHat']),
    isMyHat(){
      return this.userHat.hatID === this.interfaceHat.hatID
    },
    displayHat(){
      if(this.hasPropHat) return this.hat;
      else return this.interfaceHat;
    },
    hasPropHat(){
      return typeof this.hat !== 'undefined';
    }
  }
}
</script>
