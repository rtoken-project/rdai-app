module.exports = {
    root: true,
    env: {
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2017,
    },
    extends: [
      "plugin:vue/essential",
      "@vue/prettier"
    ],
    globals: {
        "web3": true,
        "ethereum": true
    },
    rules: {
        "parser": "babel-eslint",
        "no-console": "off",
        "quotes": [
            "error",
            "double"
        ],
    }
};
