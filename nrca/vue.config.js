module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/nrca/'
    : '/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /.csv$/,
          loader: 'csv-loader'
        }
      ]
    }
  }
}
