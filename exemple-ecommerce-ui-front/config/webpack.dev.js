const path = require("path");
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.test.js');

const { ContextReplacementPlugin } = require('webpack');

module.exports = env => {

	let url = ( env && env.ws_url ) || 'http://localhost:8080/SocleAuthentification';
	
	return webpackMerge(commonConfig, {
		devtool : 'cheap-eval-source-map',
		watch : true,
		watchOptions : {
			aggregateTimeout : 300,
			ignored : /node_modules/,
			poll : 1000
		},
		devServer: {
		  port: 9000,
		  open: true,
		  before(app){
			  app.get('/resources/configuration', function(req, res) {
			    res.json({
			    url: url,
			    version : 'test'
			    });
			  });
		  }
		 },
		 plugins: [
			 new ContextReplacementPlugin(/(.+)?angular(\\|\/)core(.+)?/, path.resolve(__dirname, './src'))
		  ]
	})
}