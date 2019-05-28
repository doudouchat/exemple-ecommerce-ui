const path = require("path");
const webpackMerge = require('webpack-merge');
const commonConfig = require('../webpack.config.js');

module.exports = webpackMerge(commonConfig, {
	devtool : 'inline-source-map',
	module : {
		rules : [
				// .ts
				{
					test : /\.tsx?$/,
					use : [ 'awesome-typescript-loader',
							'angular-router-loader',
							'angular2-template-loader?keepUrl=false' ],
					exclude : [ path.resolve(__dirname, 'node_modules') ]
				},
				// ts
				{
					test : /\.tsx?$/,
					use : 'istanbul-instrumenter-loader',
					exclude : [ /\.spec\.ts$/, /test/ ],
					enforce : 'post'
				} ]
	}
});