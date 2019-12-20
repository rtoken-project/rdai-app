/*
  remember these are NOT hats. as soon as they are published,
  we should give them a correct HatID,
  but always pull actual data from web3
*/

const featured = [
  {
    image: require("./assets/logo.svg"),
    title: "rDAI DEV fund",
    shortTitle: "rDAIdevs",
    description:
      "The rToken dev fund was created to build and maintain the rToken protocol into the future of DeFi.",
    address: "0x5d7d257d97d8a81f51187a77c6dd226fb8424d90",
    colors: ["#F7997C", "#F7997C"],
    color: "#F7997C",
    hatID: {
      1: 1,

    }
  },
  {
    image: require("./assets/building.jpg"),
    title: "rDAI is for buidlers!",
    shortTitle: "custom",
    description:
      "Set a custom beneficiary and give the interest to anyone you want",
    address: "0x0",
    hatID: -1
  },
  {
    image: require("./assets/charity.svg"),
    title: "Your Cause",
    shortTitle: "YourCause",
    description:
      "Do you know of any social causes or community projects that would accept crypto donations? Get in touch with us",
    address: "0x0",
    hatID: -1
  },
  {
    image: require("./assets/santa.jpeg"),
    title: "Secret SanDAO",
    shortTitle: "SecretSanDAO",
    description:
      "Secret Santa DAO: Mint 50 rDai and send interest to santa.ismoney.eth via @rdai_dao, letting you buy a NFT lottery ticket! Made with love by @meta_cartel",
    address: "0x5d8c77d2123ACD0490Bf779eac2be02d5B0D322C",
    colors: ["#F7997C", "#f13819"],
    color: "#f13819",
    hatID: {
      1: 43
    }
  },
  {
    image: require("./assets/ethhub.png"),
    title: "EthHub.io donation",
    shortTitle: "EthHub",
    description: "EthHub.io is an invaluable resource for all things ethereum",
    address: "0xA19FCDaD77C1F0fd184689aca88BabCF68010347",
    colors: ["#F7997C", "#0a0036"],
    color: "#0a0036",
    hatID: {
      1: 3
    }
  },
  {
    image: require("./assets/giveth.png"),
    title: "Giveth DAC",
    shortTitle: "Giveth",
    description: "Giveth is an open source platform for charitable donations.",
    address: "0x8f951903c9360345b4e1b536c7f5ae8f88a64e79",
    colors: ["#F7997C", "#2f0340"],
    color: "#2f0340",
    hatID: {
      1: 4
    }
  },
  {
    image: require("./assets/BFVI.jpg"),
    title: "Bitcoin For Venezuela Initiative",
    shortTitle: "Bitven",
    description:
      "Bitcoin for Venezuela Initiative is a non profit project bringing food and medicines to Venezuela",
    address: "0x5f48465bb9a29a3904a8d320146e78640df0e96e",
    colors: ["#F7997C", "#f79430"],
    color: "#f79430",
    hatID: {
      1: 5
    }
  },
  {
    image: require("./assets/ethberlinzwei.svg"),
    title: "ETHBerlinZwei Hackers Fund",
    shortTitle: "EthBerlin",
    description:
      "All funds are sent to ETHBerlin to fund Scholarships for the EthBerlinZwei hackathon.",
    address: "0x82338B1b27cfC0C27D79c3738B748f951Ab1a7A0",
    colors: ["#F7997C", "#ffd200"],
    color: "#ffd200",
    hatID: 1: {
      6
    }
  },
  {
    image: require("./assets/marmaj.png"),
    title: "MarmaJ Foundation",
    shortTitle: "MarmaJ",
    description:
      "The Marma J Foundation is an organization that strives to better the lives of people in Antigua, with a focus on youth and women",
    address: "0x71610bC1aCF75d39fCf962076D97bE17cd7105Ac",
    colors: ["#F7997C", "#28689e"],
    color: "#28689e",
    hatID: {
      1: 7
    }
  },
  {
    image: require("./assets/radicalxchange.png"),
    title: "RadicalXchange Foundation",
    shortTitle: "RadicalXchange",
    description:
      "Together, building markets and technologies truer to the richness of our diversely shared lives.",
    address: "0x82ee68fb03ac681fb5a57c8477d712d78d6afd72",
    colors: ["#F7997C", "#ffd200"],
    color: "#ffd200",
    hatID: {
      1: 44
    }
  },
  {
    image: require("./assets/graceaid.png"),
    title: "GRACEaid humanitarian charity/NGO",
    shortTitle: "GRACEaid",
    description:
      "GRACEaid is a charity providing humanitarian aid internationally and supporting people in need locally.",
    address: "0x236dAA98f115caa9991A3894ae387CDc13eaaD1B",
    colors: ["#F7997C", "#623089"],
    color: "#623089",
    hatID: {
      1: 57
    }
  }
];
export default featured;
