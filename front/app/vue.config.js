module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: "@import '~@/sass/main.scss'"
      }
    }
  },
  /*
    chainWebpack: config => {
        config.module.rules.delete("svg");
    },*/
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      const terserOptions =
        config.optimization.minimizer[0].options.terserOptions;
      // Since we don't know which symbols should be reserved,
      // let's just disable mangling all together
      // it's around 1M extra than otherwise
      terserOptions.mangle = false;
    }
  }
};
