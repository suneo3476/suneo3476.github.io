module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/umalog/'
    : '/',

  transpileDependencies: [
    'vuetify'
  ]
}
