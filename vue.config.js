module.exports = {
    css: {
        loaderOptions: {
          sass: {
            prependData: `@import "@/assets/global.scss";`
          }
        }
      },
      productionSourceMap: false, // Previously it was set as true
}

// https://github.com/vuejs-templates/webpack/blob/develop/template/config/index.js
