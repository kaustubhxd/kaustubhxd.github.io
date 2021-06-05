module.exports = {
    publicPath: process.env.NODE_ENV === 'production'    ? '/personal_website/'    : '/',
    css: {
        loaderOptions: {
          sass: {
            prependData: `@import "@/assets/global.scss";`
          }
        }
      },
      productionSourceMap: false, // Previously set as true
}

// https://github.com/vuejs-templates/webpack/blob/develop/template/config/index.js
