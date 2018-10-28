const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'script.js'),
    mandelbrot: path.resolve(__dirname, 'src', 'mandelbrot.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
	},
	plugins: [
    new CopyWebpackPlugin([{from: 'public'}])
  ]
}
