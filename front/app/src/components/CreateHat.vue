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
        <v-flex class="text-sm-center title my-auto pr-1 py-3 pb-5">Select Beneficiaries</v-flex>
      </v-layout>
      <v-layout wrap align-center mr-4 subtitle-2>
        <template v-for="(item, i) in hatInCreation.proportions" md12 v-if="hatInCreation.recipients[i].toLowerCase() !== commissionAddress">
          <v-flex xs12 row>
            <v-layout nowrap>
              <v-flex sm1 xs1 d-inline mr-2 class="minus-top-8"
                >
                <v-btn icon color="red" small fab dark @click="removeRecipient(i)">
                  <v-icon>fa fa-minus</v-icon>
                </v-btn>
              </v-flex>
              <v-flex grow nowrap
                >
                <div class="text-center">
                  {{hatInCreation.recipients[i] | formatAddress }}
                </div>
              </v-flex>
              <v-flex sm7 xs12
                :class="{'grow': $vuetify.breakpoint.smAndUp}"
                >
                <v-slider
                v-model="localProportions[i]"
                :thumb-size="18"
                :max="1900"
                :step="19"
                :min="19"
                :color="hatInCreation.colors[i]"
                />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex mb-3 xs12 row text-center class="caption error--text" v-if="localAlerts[i] === true">
            <v-layout nowrap class="minus-top-8" mb-4>
              <v-flex xs1 d-inline mr-2>
                <v-icon color="error">fas fa-exclamation</v-icon>
              </v-flex>
              <v-flex grow nowrap>
                This account is a contract. Make sure it can handle arbitrary ERC20 tokens
              </v-flex>
              <v-flex xs1>
                <v-icon small @click="alertToFalse(i)">far fa-times-circle</v-icon>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-divider hidden-md-and-up />
        </template>
        <v-flex sm1 xs1 nowrap mr-auto class="minus-top">
          <v-btn icon color="green" small fab dark @click="addRecipient()"><v-icon>fa fa-plus</v-icon></v-btn>
        </v-flex>
        <v-flex sm11 xs11 pl-2 nowrap class="justify-text">
          <v-text-field
            v-model="newAddress"
            label="Beneficiary address"
            :counter="42"
            class="d-inline"
            :disabled="!hasWeb3"
            >
            <template slot="append">
              <div v-if="newAddress.length===0 && hasWeb3"
                @click="newAddress=userAddress"
                class="pointer align-center mt-1 mr-3 grey--text"
                >
                {{userAddress | formatAddress}}
              </div>
            </template>
          </v-text-field>
        </v-flex>
      </v-layout>
      <bar-chart :hat="hatInCreation" :showCommission="addCommission" v-if="hatStarted" />
      <v-flex xs12 mx-auto my-0 v-if="hatStarted">
        <v-switch
          @click.stop="addCommissionClicked"
          v-model="addCommission"
          color="primary"
          :label="commissionLabel"
        />
      </v-flex>
      <v-flex xs12 mx-auto text-center my-0 v-if="allowCreatingOtherHats">
        <v-switch v-model="switchToThisHat" class="justify-center my-0" :label="label" :disabled="hasWeb3 === false" />
      </v-flex>
      <v-flex xs12 py-3 >
        <web3-btn action="createHat" :disabled="addCommission? hatInCreation.length < 1 : hatInCreation < 2" :params="{switchToThisHat}" @then="goToCustom">Create new Pool</web3-btn>
      </v-flex>
    </v-sheet>
    <v-dialog v-model="commissionModal" persistent max-width="340">
      <v-card class="pa-4">
        <v-card-title class="headline">Remove rDai DAO donation?</v-card-title>
        <v-card-text class="mt-4">
          <p>
            The 5% donation to rDai DAO is equal to only {{ rate / 20 | formatNumber(2) }}% a year.
          </p>
          <p>
            While this might be a small change for you, it is the only way we can fund continued development of rDAI.
          </p>
          <p>
            If you still want to remove it, please consider donating to our DAO directly.
          </p>
          <p>
            Check out how we use funds and make a donation through our <a href="https://mainnet.aragon.org/#/rdao/0xc281d4fe88701bf30326b3bcb2c3eb73669d3b91" target="_blank">Aragon DAO.</a>
          </p>
        </v-card-text>
        <v-card-actions
          @click="commissionModal = false"
          class="row px-8"
          >
          <v-btn color="primary" block>Keep donation</v-btn>
          <v-btn @click="addCommission=false" block class="ml-0 mt-2">Remove Donation</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import {isAddress} from "web3-utils";

export default {
  name: 'app-create-hat',
  data: () => ({
    newAddress: '',
    switchToThisHat: true,
    localProportions: [],
    localAlerts: [],
    addCommission: true,
    commissionAddress: featured[0].address.toLowerCase(),
    commissionModal: false,
    allowCreatingOtherHats: false
  }),
  computed: {
    ...mapGetters(['userAddress', 'hasWeb3', 'userHat']),
    ...mapState(['hatInCreation', 'loadingWeb3']),
    hatStarted(){
      return this.localProportions.length > (this.addCommission ?  1 : 0)
    },
    label(){
      return this.switchToThisHat ? 'Switch to new pool' : 'Keep current pool'
    },
    commissionLabel(){
      return this.addCommission ? 'Donating 5% of the interest to the rDAI dev DAO' : 'Keeping all of the interest';
    },
    rate(){
      return Math.round(this.$store.state.exchangeRate * 10000) / 100;
    }
  },
  watch: {
    newAddress(newVal, oldVal){
      if(newVal.length === 42 && oldVal < newVal){
        this.addRecipient(newVal);
      }
    },
    hatInCreation:{
      handler: function( newVal ){
        if(this.addCommission){
          if(newVal.proportions[0] === newVal.totalProportions / 20) return;
          const hat = newVal;
          hat.proportions[0] = (newVal.totalProportions - newVal.proportions[0])/ 19;
          hat.totalProportions = hat.proportions.reduce((a,b)=>a+b,0);
          this.setHat(hat);
        }
      },
      deep: true
    },
    localProportions: {
      handler: function( newVal ){
        if(this.addCommission){
          const hat = this.hatInCreation;
          hat.proportions = newVal;
          hat.proportions[0] = (newVal.reduce((a,b)=>a+b,0) - newVal[0])/ 19;
          hat.totalProportions = hat.proportions.reduce((a,b)=>a+b,0);
          this.$store.commit("SETHATINCREATION", hat);
        }
      },
      deep: true
    },
    addCommission(newVal, oldVal){
      if(!newVal){
        if(this.hatInCreation.recipients[0].toLowerCase() === featured[0].address.toLowerCase() ) this.removeRecipient(0);
      }
      else{
        this.addCommissionBeneficiary();
      }
    }
  },
  methods: {
    setHat(hat){
      this.localProportions = hat.proportions;
      hat.length = hat.proportions.length;
      hat.totalProportions = hat.proportions.reduce((a,b)=>a+b, 0);
      this.$store.commit("SETHATINCREATION",hat);
    },
    addCommissionClicked(e){
      if(this.addCommission){
        this.commissionModal = true;
      }
      else{
        this.addCommission = true;
      }
    },
    alertToFalse(index){
      const newArray = [];
      for(var i=0; i<this.localAlerts.length;i++){
        if(i===index) newArray.push(false);
        else newArray.push(this.localAlerts[i]);
      }
      this.localAlerts = newArray;
    },
    async addRecipient(){
      if(this.newAddress.length !== 42 || !isAddress(this.newAddress)) return;
      const hat = this.hatInCreation;
      hat.proportions.push(1900);
      hat.recipients.push(this.newAddress);
      if((await web3.eth.getCode(this.newAddress))==='0x') this.localAlerts.push(false);
      else this.localAlerts.push(true);
      const hasColor = featured.filter(i=> i.address === this.newAddress)[0];
      if(typeof hasColor !== 'undefined') hat.colors.push(hasColor.color);
      else hat.colors.push(randomColor(hat.colors));
      this.newAddress = '';
      this.setHat(hat);
    },
    removeRecipient(index){
      const hat = this.hatInCreation;
      hat.proportions.splice(index, 1);
      hat.recipients.splice(index, 1);
      hat.colors.splice(index, 1);
      this.localAlerts.splice(index, 1);
      this.setHat(hat);
    },
    goToCustom(ok){
      this.$router.replace("/deposit");
    },
    addCommissionBeneficiary(){
      const hat = this.hatInCreation;
      if(this.hatInCreation.length === 0){
        return this.setHat( {
          proportions: [100],
          recipients: [featured[0].address],
          colors: [featured[0].color],
        });
      }
      hat.proportions.unshift(100);
      hat.recipients.unshift(featured[0].address);
      hat.colors.unshift(featured[0].color);
      this.localAlerts.unshift(false);
      this.setHat(hat);
    }
  },
  mounted(){
    this.setHat( {
      proportions: [ 100 ],
      recipients: [featured[0].address],
      colors: [featured[0].color],
    });
    this.localAlerts = [false];
  }
}
</script>
