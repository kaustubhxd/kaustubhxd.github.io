module.exports = {
    publicPath: process.env.NODE_ENV === 'production'    ? '/'    : '/',
    css: {
        loaderOptions: {
          sass: {
            prependData: `@import "@/assets/global.scss";`
          }
        }
      },
      productionSourceMap: true, // Previously set as true

}

// https://github.com/vuejs-templates/webpack/blob/develop/template/config/index.js
