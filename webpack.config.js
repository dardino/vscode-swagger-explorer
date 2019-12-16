//@ts-check
// jshint esversion: 6

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**@type {import('webpack').Configuration}*/
const config = {
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
	node: {
		__dirname: false // leave the __dirname-behaviour intact
	},
	target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

	entry: {
		extension: './src/extension.ts'
	}, // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
	output: {
		// the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		devtoolModuleFilenameTemplate: '../[resource-path]'
	},
	externals: {
		vscode: 'vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
	},
	resolve: {
		mainFields: ['module', 'main'],
		// support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'awesome-typescript-loader'
		}]
	},
	// yes, really source maps
	devtool: 'source-map',
	plugins: [
		new CopyWebpackPlugin([{
			from: './out/**/*',
			to: '.',
			ignore: ['*.js', '*.js.map'],
			flatten: true
		}])
	],
};
module.exports = config;
