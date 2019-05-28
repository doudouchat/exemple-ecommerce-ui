const path = require("path");
const webpackMerge = require('webpack-merge');
const commonConfig = require('../webpack.config.js');

const { DefinePlugin } = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
	devtool : 'source-map',
	module : {
		rules : [
		// .ts
		{
			test : /\.tsx?$/,
			use : [ '@ngtools/webpack' ],
			exclude : [ path.resolve(__dirname, 'node_modules') ]
		} ]
	},
	plugins : [
	// UglyJs
	new UglifyJsPlugin({
		sourceMap : true
	}),
	// angular compiler
	new AngularCompilerPlugin({
	      tsConfigPath: 'tsconfig-aot.json',
	      entryModule: 'src/app/app.module#AppModule',
	      sourceMap: true
	}),
	// NODE_ENV production
	new DefinePlugin({
		'process.env' : {
			'ENV' : JSON.stringify(ENV)
		}
	}), ]
});
