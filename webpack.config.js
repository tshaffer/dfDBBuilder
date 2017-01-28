module.exports = {

  entry: './src/index.js',
  target: 'node',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  devtool: "source-map",
  watchOptions: {
    poll: true
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'eslint-loader',
        include: __dirname + '/src',
        exclude: /build\.js$/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.json?$/,
        loader: 'json'
      }
    ]
  },
  // node: {
  //   console: true,
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty'
  // }
}
