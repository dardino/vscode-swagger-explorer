const path = require('path');
const webpack = require('webpack');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const CopyWebpackPlugin = require('copy-webpack-plugin');

// const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
	mode: 'production',
	node: {
		__dirname: false, // leave the __dirname-behaviour intact
		__filename: false
	},

	entry: {
		extension: './src/extension.ts'
	},

	target: "node",

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'out'),
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: '../[resource-path]'

	},

	plugins: [
		new webpack.ProgressPlugin(),
		new CopyWebpackPlugin([{
			from: './out/**/*',
			to: '.',
			ignore: ['*.js', '*.js.map']

		}])
	],

	module: {
		rules: [{
			test: /.(ts|tsx)?$/,
			loader: 'ts-loader',
			include: [path.resolve(__dirname, 'src')],
			exclude: [/node_modules/]
		}]
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},

	devServer: {
		open: true
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			http: "http"
		}
	},
	externals: {
		vscode: "commonjs vscode",
		"http2-client": "http2-client",

	},

};
