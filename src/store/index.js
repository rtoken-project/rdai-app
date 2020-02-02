import Vue from "vue";
import Vuex from "vuex";
import contracts from "./contracts";
import featured from "../featured.js";
import randomColor from "../colors.js";
import Web3 from "web3";
const { toWei } = Web3.utils;
import { fromDecimals } from "@/lib/math-utils";

Vue.use(Vuex);

const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const SELF_HAT_ID = MAX_UINT256;
const HARDCODED_CHAIN = 1;
const TOKENS = {
  1: {
    dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
    cdai: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    rdai: "0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0" // UPDATED to rMCDAI legacy was "0xea8b224eDD3e342DEb514C4176c2E72Bcce6fFF9"
  },
  42: {
    dai: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    cdai: "0xe7bc397dbd069fc7d0109c0636d06888bb50668c",
    rdai: "0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB"
  },
  decimals: {
    dai: 18,
    rdai: 18,
    cdai: 8
  }
};
const fromDec = function(num, symbol = "dai", format = "string") {
  const number = typeof num === "string" ? num : num.toString();
  const fixed = fromDecimals(number, TOKENS.decimals[symbol]);
  if (format === "number") return parseFloat(fixed);
  else return fixed;
};
const fillHat = function(hat, hatID = false) {
  let id;
  // console.log("hat: ", hat);
  if (hatID) id = hatID;
  else if (hat.hatID.toString() === SELF_HAT_ID) id = -666;
  else id = hat.hatID.toNumber();
  // console.log("id after assignment: ", id);
  const { recipients, proportions } = hat;
  const cleanedResult = {
    hatID: id,
    length: recipients.length,
    recipients,
    proportions: proportions.map(i => i.toNumber())
  };
  cleanedResult.totalProportions = cleanedResult.proportions.reduce(
    (a, b) => parseInt(a) + parseInt(b),
    0
  );
  return cleanedResult;
};
export default new Vuex.Store({
  state: {
    snackbar: {
      show: false,
      text: false,
      icon: false
    },
    account: {
      chainId: HARDCODED_CHAIN,
      address: "",
      balances: {
        rdai: undefined,
        cdai: undefined,
        dai: undefined,
        eth: undefined
      },
      allowances: {
        rdai: 1000000000000000000,
        cdai: "",
        dai: ""
      },
      hat: {}
    },
    interfaceHat: {},
    hatInCreation: {
      length: 1,
      proportions: [100],
      recipients: [featured[0].address],
      colors: [featured[0].color],
      totalProportions: 100
    },
    allHats: [],
    exchangeRate: 0,
    finishedLoading: false,
    loadingWeb3: false,
    web3modal: false,
    storedUrlHat: {},
    transactionList: []
  },
  mutations: {
    SHOWSNACKBAR: state => {
      state.snackbar.show = true;
    },
    TOGGLEWEBMODAL: (state, toggle) => {
      state.web3modal = toggle;
    },
    STOREURLHAT: (state, { shortTitle, hatID }) => {
      state.storedUrlHat = { shortTitle, hatID };
    },
    SETUSERADDRESS: (state, address) => {
      state.account.address = address;
    },
    SETCHAINID: (state, chainId) => {
      state.account.chainId = chainId;
    },
    SETBALANCE: (state, { symbol, bal }) => {
      Vue.set(state.account.balances, symbol, bal);
    },
    SETALLOWANCE: (state, { symbol, all }) => {
      Vue.set(state.account.allowances, symbol, fromDec(all, symbol));
    },
    SETUSERHAT: (state, hat) => {
      Vue.set(state.account, "hat", hat);
    },
    SETINTERFACEHAT: (state, newHat) => {
      state.interfaceHat = newHat;
    },
    SETHATINCREATION: (state, newHat) => {
      state.hatInCreation = newHat;
    },
    SETALLHATS: (state, allHats) => {
      state.allHats = allHats;
    },
    SETEXCHANGERATE: (state, rate) => {
      state.exchangeRate = rate;
    },
    INSERTNEWTRANSACTION: (state, tx) => {
      state.transactionList.unshift(tx);
    },
    CONFIRMTRANSACTION: (state, tx) => {
      //first I have to find it, then I have to splice it!
      const index = state.transactionList.findIndex(i => i.txHash === tx.tx);
      //create new element to put in:
      const newValue = state.transactionList[index];
      newValue.confirmed = true;
      state.transactionList.splice(index, 1, newValue);
    },
    ERRORTRANSACTION: (state, errorTxHash) => {
      //first I have to find it, then I have to splice it!
      const index = state.transactionList.findIndex(
        i => i.txHash === errorTxHash
      );
      //create new element to put in:
      const newValue = state.transactionList[index];
      newValue.error = true;
      state.transactionList.splice(index, 1, newValue);
    },
    SETFINISHEDLOADING: state => (state.finishedLoading = true),
    SETLOADINGWEB: (state, bool) => (state.loadingWeb3 = bool),
    HIDEERROR: state => (state.snackbar.show = false),
    ERROR: (state, payload) => {
      const { type, text, icon, timeout } = payload;
      switch (type) {
        case "connection": {
          setError(
            "Connection error. Please make sure you are connected to the internet",
            "fas fa-signal"
          );
          break;
        }
        default:
          setError(
            text || "there was an error",
            icon || "fas fa-exclamation-triangle",
            timeout || 6000
          );
      }

      function setError(t, i, s = 6000) {
        state.snackbar = {
          text: t,
          icon: i,
          timeout: s,
          show: true
        };
      }
    }
  },
  actions: {
    async onPageLoad({ commit, dispatch }) {
      return new Promise(async resolve => {
        await dispatch("getExchangeRate").catch(() =>
          dispatch("getExchangeRate")
        );
        if (window.ethereum && window.ethereum.selectedAddress) {
          await dispatch("activateWeb3");
          commit("SETFINISHEDLOADING");
          return resolve("deposit");
        }
        commit("SETFINISHEDLOADING");
        return resolve(false);
      });
    },
    async activateWeb3({ state, commit, dispatch }) {
      commit("SETLOADINGWEB", true);
      return new Promise(async (resolve, reject) => {
        try {
          if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
              // Request account access if needed
              await ethereum.enable();
            } catch (error) {
              commit("SETLOADINGWEB", false);
              // console.log("error here 1, ", error);
              return reject(false);
              // User denied account access...
            }
          } else if (window.web3) {
            // Legacy dapp browsers...
            window.web3 = new Web3(web3.currentProvider);
          } else {
            commit("SETLOADINGWEB", false);
            commit("ERROR", {
              text: "To use this app, you will need a web3 enabled browser"
            });
            // console.log("error here");
            return reject(false);
          }
          // console.log("web3: ", web3);
          const p = await web3.currentProvider.enable();
          console.log("enabled? ", p);
          const chainId = await web3.eth.net.getId();
          commit("SETCHAINID", chainId);
          try {
            await contracts.init(window.web3, TOKENS, chainId);
          } catch (e) {
            console.log("activateWeb3 contracts.init failed", e);
            commit("SETLOADINGWEB", false);
            // console.log("error is on contract.init", e);
            return reject(false);
          }
          commit(
            "SETUSERADDRESS",
            (await web3.eth.getAccounts())[0].toString().toLowerCase()
          );
          if (state.exchangeRate <= 0) {
            await dispatch("getExchangeRate").catch(() =>
              dispatch("getExchangeRate")
            );
          }
          dispatch("setupWeb3Listeners");
          await dispatch("getBalances");
          await dispatch("getAllowances");
          await dispatch("getAllHats");
          await dispatch("getUserHat");
          const { shortTitle, hatID } = state.storedUrlHat;
          if (typeof shortTitle !== "undefined") {
            await dispatch("setInterfaceHat", { shortTitle });
          } else if (typeof hatID !== "undefined") {
            await dispatch("setInterfaceHat", { hatID });
          } else if (!state.interfaceHat.hasOwnProperty("hatID"))
            await dispatch("setInterfaceHat", { shortTitle: "rDAIdevs" });
          commit("TOGGLEWEBMODAL", false);
          commit("SETLOADINGWEB", false);
          console.debug("activateWeb3 done");
          return resolve(true);
        } catch (err) {
          console.error("activateWeb3 error", err);
          commit("SETLOADINGWEB", false);
          commit("ERROR", {
            text: "Please allow access to our app: " + err.toString()
          });
          return reject(false);
        }
      });
    },
    getBalances({ dispatch, state }) {
      return new Promise(resolve => {
        Object.keys(TOKENS[state.account.chainId]).forEach(async key => {
          await dispatch("getBalance", key);
        });
        return resolve(true);
      });
    },
    getAllowances({ dispatch, state }) {
      return new Promise(resolve => {
        Object.keys(TOKENS[state.account.chainId]).forEach(async key => {
          try {
            await dispatch("getAllowance", key);
          } catch (e) {
            console.log("error in getAllowances, ", e);
          }
        });
        return resolve(true);
      });
    },
    getAllHats({ state, dispatch, commit }) {
      const allHats = [];
      const chainId = state.account.chainId;
      /*
      var maxHat = 1;

            try {
                maxHat = parseInt(
                    await contracts.functions.getMaximumHatID.call()
                );
                // console.debug("maxHat", maxHat.toString());
            } catch (e) {
                // console.log(" error trying to get max hat number", e);
            }*/
      featured.forEach(async v => {
        v.hatID[chainId] > 0 &&
          allHats.push(await dispatch("getFullHat", { hatID: v.hatID[chainId] }));
      });
      commit("SETALLHATS", allHats);
    },
    getFullHat({ state, dispatch }, { hatID }) {
      return new Promise(async (resolve, reject) => {
        var rawHat;
        try {
          rawHat = await dispatch("getHatByID", {
            hatID: parseInt(hatID)
          });
        } catch (e) {
          console.log("error retrieving hat #", hatID, " error: ", e);
          return reject(e);
        }

        /*rawHat.loans = await Promise.all(
                    rawHat.recipients.map(i =>
                        dispatch("receivedLoanOf", {
                            address: i
                        })
                    )
                );
                rawHat.totalLoan = rawHat.loans.reduce(
                    (a, b) => parseFloat(a) + parseFloat(b),
                    0
                );*/
        const fullHat = {
          ...rawHat,
          ...featured.filter(i => i.hatID[state.account.chainId] === hatID)[0]
        };
        fullHat.hatID = hatID;
        if (!fullHat.hasOwnProperty("colors")) {
          fullHat.featured = fullHat.recipients.map(i => {
            const f = featured.filter(
              b => b.address.toLowerCase() === i.toLowerCase()
            );
            return f.length > 0 ? f[0].title : false;
          });
          const colors = [];
          fullHat.colors = fullHat.recipients.map(i => {
            const f = featured.filter(
              b => b.address.toLowerCase() === i.toLowerCase()
            );
            return f.length > 0 ? f[0].color : randomColor(colors);
          });
        }
        return resolve(fullHat);
      });
    },
    setInterfaceHat(
      { commit, dispatch, state },
      { hatID = false, shortTitle = false }
    ) {
      return new Promise(async resolve => {
        if (hatID) {
          try {
            commit("SETINTERFACEHAT", await dispatch("getFullHat", { hatID }));
            return resolve(true);
          } catch (e) {
            console.log("error setting intereface hat.");
            return resolve(false);
          }
        } else if (shortTitle) {
          commit(
            "SETINTERFACEHAT",
            state.allHats.find(i => i.shortTitle === shortTitle)
          );
          resolve(true);
        }
      });
    },
    async getExchangeRate({ commit }) {
      const rate = await (
        await fetch(
          "https://api.compound.finance/api/v2/ctoken?addresses[]=0x5d3a536e4d6dbd6114cc1ead35777bab948e3643" //updated to McDai
        )
      ).json();
      commit("SETEXCHANGERATE", parseFloat(rate.cToken[0].supply_rate.value));
    },
    setupWeb3Listeners({ commit, dispatch, state }) {
      const ethereum = window.ethereum;
      if (typeof ethereum.on === "function") {
        ethereum.on("accountsChanged", () => {
          dispatch("activateWeb3");
        });
        ethereum.on("networkChanged", e => {
          if (parseInt(e) !== state.account.chainId) {
            dispatch("activateWeb3");
          } else {
            commit("SHOWSNACKBAR", false);
          }
        });
      }
    },
    getBalance({ commit, dispatch, state }, symbol) {
      if (symbol === "eth") return;
      const address = state.account.address;
      new Promise(resolve => {
        const getBalance = async () => {
          const myTokens = contracts.tokens;
          const myToken = myTokens[symbol];
          const rawBal = await myToken.balanceOf.call(address);
          var bal = fromDec(rawBal, symbol);
          console.log("bal: ", bal, symbol);
          if (symbol === "rdai") {
            var interest;
            try {
              interest = await dispatch("interestPayableOf", {
                address: state.account.address
              });
            } catch (e) {
              console.log("error: ", e);
              interest = 0;
            }
            bal = parseFloat(bal) + parseFloat(interest);
          }
          commit("SETBALANCE", {
            symbol,
            bal
          });
          return true;
        };
        return resolve(getBalance());
      });
    },
    getAllowance({ commit, state }, symbol) {
      if (symbol === "eth" || symbol === "rdai") return;
      new Promise(resolve => {
        const getAllowance = async () => {
          const myTokens = contracts.tokens;
          setTimeout(async () => {
            const myToken = myTokens[symbol];
            try {
              const all = await myToken.allowance.call(
                state.account.address,
                TOKENS[state.account.chainId].rdai
              );
              commit("SETALLOWANCE", {
                symbol,
                all
              });
              return true;
            } catch (e) {
              console.log(
                "error retrieving allowance for ",
                symbol,
                " error: ",
                e
              );
              return false;
            }
          }, 2000);
        };
        return resolve(getAllowance());
      });
    },
    getUserHat({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        dispatch("getHatByAddress", {
          address: state.account.address
        })
          .then(r => {
            const featuredMatch = {
              ...featured.filter(
                i => i.hatID[state.account.chainId] === r.hatID
              )[0]
            };
            const newHat = {
              ...r,
              ...featuredMatch
            };
            if (featuredMatch.hasOwnProperty("hatID"))
              newHat.hatID = featuredMatch.hatID[state.account.chainId];
            commit("SETUSERHAT", newHat);
            commit("SETINTERFACEHAT", newHat);
            return resolve(true);
          })
          .catch(err => {
            // console.log("error in getUserHat, e:", err);
            return reject(err);
          });
      });
    },
    getHatByAddress(v, { address }) {
      return new Promise(resolve => {
        contracts.functions.getHatByAddress.call(address).then(result => {
          return resolve(fillHat(result));
        });
      });
    },
    getHatByID(v, { hatID }) {
      return new Promise(async (resolve, reject) => {
        contracts.functions
          .getHatByID(hatID)
          .then(result => {
            var filledHat;
            try {
              filledHat = fillHat(result, hatID);
              return resolve(filledHat);
            } catch (e) {
              reject(e);
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    createHat({ commit, dispatch, state }, { switchToThisHat = true }) {
      return new Promise((resolve, reject) => {
        var savedTxHash;
        contracts.functions
          .createHat(
            state.hatInCreation.recipients,
            state.hatInCreation.proportions,
            switchToThisHat,
            {
              from: state.account.address
            }
          )
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "createHat",
              arg: {
                recipients: state.hatInCreation.recipients,
                proportions: state.hatInCreation.proportions,
                switchToThisHat
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            commit("ERROR", {
              type: "transaction"
            });
            console.warn("error in createHat: ", err);
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            if (switchToThisHat) dispatch("getUserHat");
            dispatch("getAllHats");
            return resolve(receipt);
          });
      });
    },
    approve({ commit, state, dispatch }, { symbol }) {
      return new Promise((resolve, reject) => {
        const maximum = MAX_UINT256;
        var savedTxHash;
        contracts.tokens[symbol]
          .approve(TOKENS[state.account.chainId].rdai, maximum, {
            from: state.account.address
          })
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "approve",
              arg: {
                spender: TOKENS[state.account.chainId].rdai,
                maximum,
                symbol
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.warn("token.approve failed", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getAllowance", symbol);
            return resolve(receipt);
          });
      });
    },
    mint({ commit, state, dispatch }, { amount }) {
      return new Promise((resolve, reject) => {
        const params = toWei(amount.toString());
        var savedTxHash;
        contracts.functions
          .mint(params, {
            from: state.account.address,
            gasLimit: 1750000
          })
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "mint",
              arg: {
                amount
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.warn("fail in mint: ", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getBalance", "dai");
            dispatch("getBalance", "rdai");
            return resolve(receipt);
          });
      });
    },
    mintWithNewHat({ commit, state, dispatch }, { amount }) {
      return new Promise((resolve, reject) => {
        var savedTxHash;
        contracts.functions
          .mintWithNewHat(
            toWei(amount.toString()),
            state.hatInCreation.recipients,
            state.hatInCreation.proportions,
            {
              from: state.account.address
            }
          )
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "mintWithNewHat",
              arg: {
                amount,
                recipients: state.hatInCreation.recipients,
                proportion: state.hatInCreation.proportions
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.log("tx error: ", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getBalance", "dai");
            dispatch("getBalance", "rdai");
            dispatch("getUserHat");
            return resolve(receipt);
          });
      });
    },
    mintWithSelectedHat({ commit, state, dispatch }, { amount }) {
      return new Promise((resolve, reject) => {
        var savedTxHash;
        contracts.functions
          .mintWithSelectedHat(
            toWei(amount.toString()),
            state.interfaceHat.hatID.toString(),
            {
              from: state.account.address
            }
          )
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "mintWithSelectedHat",
              arg: {
                amount,
                hatID: state.interfaceHat.hatID
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.warn("error in mintWithSelectedHat: ", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getBalance", "dai");
            dispatch("getBalance", "rdai");
            dispatch("getUserHat");
            return resolve(receipt);
          });
      });
    },
    changeHat({ commit, state, dispatch }, { hatID }) {
      return new Promise((resolve, reject) => {
        var savedTxHash;
        contracts.functions
          .changeHat(hatID.toString(), {
            from: state.account.address
          })
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "changeHat",
              arg: {
                hatID
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.warn("error in changeHat: ", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getUserHat");
            return resolve(receipt);
          });
      });
    },
    redeem({ commit, state, dispatch }, { amount }) {
      return new Promise((resolve, reject) => {
        var savedTxHash;
        contracts.functions
          .redeem(toWei(amount.toString()), {
            from: state.account.address
          })
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "redeem",
              arg: {
                amount
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.warn("error in redeem: ", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getBalance", "dai");
            dispatch("getBalance", "rdai");
            return resolve(receipt);
          });
      });
    },
    interestPayableOf({ state }, { address = state.account.address }) {
      return new Promise(async (resolve, reject) => {
        try {
          const result = await contracts.functions.interestPayableOf.call(
            address
          );
          if (result > 0) return resolve(fromDec(result, "rdai", "number"));
          else return resolve(0);
        } catch (e) {
          console.log("error in interestPayableOf", e);
          reject(false);
        }
      });
    },
    payInterest(
      { state, dispatch, commit },
      { address = state.account.address }
    ) {
      return new Promise((resolve, reject) => {
        var savedTxHash;
        // console.log("paying interest of this account: ", address);
        contracts.functions
          .payInterest(address, {
            from: state.account.address
          })
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "payInterest",
              arg: {
                address
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.warn("error in payInterest: ", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getBalance", "dai");
            dispatch("getBalance", "rdai");
            return resolve(receipt);
          });
      });
    },
    getAccountStats({ state }, { address = state.account.address }) {
      return new Promise(async resolve => {
        const result = await contracts.functions.getAccountStats.call(address);
        return resolve(result);
      });
    },
    receivedSavingsOf({ state }, { address = state.account.address }) {
      return new Promise(async resolve => {
        const result = await contracts.functions.receivedSavingsOf.call(
          address
        );
        return resolve(result);
      });
    },
    receivedLoanOf({ state }, { address = state.account.address }) {
      return new Promise(async resolve => {
        const result = await contracts.functions.receivedLoanOf.call(address);
        return resolve(fromDec(result, "dai", "number"));
      });
    },
    getFaucetDAI(
      { commit, state, dispatch },
      { address = state.account.address }
    ) {
      return new Promise((resolve, reject) => {
        var savedTxHash;
        console.log("contracts: ", contracts);
        contracts.faucet
          .allocateTo(address, toWei("100", "ether"), {
            from: state.account.address
          })
          .on("transactionHash", hash => {
            savedTxHash = hash;
            commit("INSERTNEWTRANSACTION", {
              txHash: hash,
              timestamp: new Date(),
              type: "getFaucetDAI",
              arg: {
                address,
                amount: "100"
              },
              network: state.account.chainId
            });
          })
          .on("error", err => {
            console.log("error in getFaucetDAI: ", err);
            commit("ERROR", {
              type: "transaction"
            });
            return reject({ savedTxHash });
          })
          .then(receipt => {
            // console.log("now what? receipt: ", receipt);
            dispatch("getBalance", "dai");
            return resolve(receipt);
          });
      });
    }
  },
  getters: {
    chainName: state => {
      switch (state.account.chainId) {
        case 1:
          return "Mainnet";
        case 3:
          return "Ropsten";
        case 4:
          return "Rinkeby";
        case 5:
          return "Goerli";
        case 42:
          return "Kovan";
        default:
          return "Private Chain";
      }
    },
    hasWeb3: state => state.account.address.length === 42,
    isNewUser: (state, getters) =>
      typeof state.account.balances.rdai === "undefined" && !getters.userHat,
    userAddress: state => state.account.address,
    userBalances: state => state.account.balances,
    userAllowances: state => state.account.allowances,
    rate: state => Math.round(state.exchangeRate * 10000) / 100 + " %",
    userHat: state =>
      state.account.hat.hasOwnProperty("hatID") && state.account.hat.hatID !== 0
        ? state.account.hat
        : false,
    interfaceHat: state =>
      state.interfaceHat.hasOwnProperty("recipients") &&
      state.interfaceHat.recipients.length > 0
        ? state.interfaceHat
        : false,
    hatInCreation: state =>
      state.hatInCreation.hasOwnProperty("recipients") &&
      state.hatInCreation.recipients.length > 0
        ? state.hatInCreation
        : false,
    txList: state =>
      state.transactionList.length > 0 ? state.transactionList : false,
    rDAIdevs: state =>
      state.allHats.find(i => i.shortTitle === "rDAIdevs") || false
  }
});
