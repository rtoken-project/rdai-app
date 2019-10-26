/*
export default {
  name: 'interface',
  computed: {
      myHat(){
        return this.interfaceHat.hasOwnProperty("shortTitle") ? "donate" : "custom" ;
      },
      route(){
        return this.$route.name
      },
      routeURL(){
        return this.$route.params.hasOwnProperty("url") ? this.$route.params.url : false;
      }
  },
  methods: {
      ...mapActions(['activateWeb3']),
      backToHome(){
          this.$router.replace("/");
      },
      routePush(newURL){
          if(newURL === this.$route.name) return;
          if(newURL === 'donate' && this.$route.name === 'deposit') return;
          if(newURL === 'deposit' && this.$route.name === 'donate') return;
          if(newURL === 'deposit'){
              this.interfaceHat.hasOwnProperty("shortTitle")
                  ? this.$router.replace(`/donate/${this.interfaceHat.shortTitle}`)
                  : this.$router.replace(`/deposit/${this.interfaceHat.hatID}`)
          }
          else this.$router.replace(`/${newURL}`);
      }
  },
  watch: {
      routeURL(newV){
          if(newV === 'donate') this.tab = 'deposit';
          else if(newV){
              this.tab = newV;
          }
      }
  },
  mounted(){

  }
}
*/
