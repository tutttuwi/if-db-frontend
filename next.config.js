const path = require('path')
// const withTM = require('next-transpile-modules')(['@arcgis/core', '@stencil/core', '@esri/calcite-components'])

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false
    // jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  reactStrictMode: true
}
// module.exports = withTM({
//   reactStrictMode: true
// })
