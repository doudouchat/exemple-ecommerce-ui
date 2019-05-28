const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { CommonsChunkPlugin } = require('webpack').optimize;

const entryPoints =  ['inline', 'vendor', 'polyfills', 'theme', 'primeng.min', 'site', 'app'];
module.exports = {
	context : __dirname,
	entry : {
		'polyfills' : './src/polyfills.ts',
		'app' : './src/main.ts',
		'theme' : './node_modules/primeng/resources/themes/redmond/theme.css',
		'primeng.min' : './node_modules/primeng/resources/primeng.min.css',
		'site' : './src/assets/css/site.css',
	},
	output : {
		path : 'target',
		filename : '[name].bundle.js',
		chunkFilename: '[name].chunk.js'
	},
	resolve : {
		extensions : [ '.ts', '.tsx', '.js', '.jsx', '.css' ]
	},
	module : {
		rules : [
				// ts
				{
					test : /\.ts$/,
					use : [ 'source-map-loader' ],
					enforce : 'pre'
				},
				// .png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico
				{
					test : /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
					use : 'file-loader?name=assets/[name].[hash].[ext]'
				},
				// .css
				{
					test : /\.css$/,
					use : ExtractTextPlugin.extract({
						fallback : 'style-loader',
						use : 'css-loader?sourceMap'
					}),
					exclude : [ path.resolve(__dirname, 'src/app') ],
					include : [ path.resolve(__dirname, 'node_modules'),
							path.resolve(__dirname, 'src/asset') ]

				},
				// .html, .css
				{
					test : /\.(html|css)$/,
					use : [ 'raw-loader' ],
					exclude : [ path.resolve(__dirname, 'node_modules') ],
					include : [ path.resolve(__dirname, 'src/app') ],
				} ]
	},
	plugins : [
	// commons chunck
	new CommonsChunkPlugin({
		name: [ 'inline' ],
		minChunks: null,
	}),
	new CommonsChunkPlugin({
		name: [ 'vendor' ],
		minChunks: (module, count) => {
			// this assumes your vendor imports exist in the node_modules directory
		    return module.context && module.context.indexOf("node_modules") !== -1;
		},
		chunks: [ 'app' ]
	}),
	// ExtractTextPlugin
	new ExtractTextPlugin("css/[name].css"),
	// generate index.html
	new HtmlWebpackPlugin({
		template : 'src/index.html',
		title : 'Socle Authentification',
		inject : 'body',
		chunksSortMode: function(a, b) {
			return (entryPoints.indexOf(a.names[0]) > entryPoints.indexOf(b.names[0]))? 1 : -1;
		}
	}),
	new CopyWebpackPlugin([ {
			from : 'src/favicon.ico'
	} ]) ]
};