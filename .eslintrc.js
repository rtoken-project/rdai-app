module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: [
    "plugin:vue/recommended",
    "@vue/prettier"
  ],
  globals: {
    web3: true,
    ethereum: true
  },
  rules: {
    "no-console": "off",
    quotes: ["error", "double"]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
