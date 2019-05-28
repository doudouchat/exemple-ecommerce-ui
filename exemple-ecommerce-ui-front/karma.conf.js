var webpack = require("webpack");
var webpackConfig = require('./config/webpack.test');

module.exports = function(config) {
	config.set({
		basePath : '',
		frameworks : [ 'mocha', 'chai', 'sinon' ],
		port : 9999,
		colors : true,
		logLevel : config.LOG_DEBUG,
		browserNoActivityTimeout : 100000,
		autoWatch : false,
		browsers : [ 'PhantomJS' ],
		// browsers : [ 'PhantomJS', 'Chrome' ],
		singleRun : true,
		concurrency : Infinity,
		preprocessors : {
			'src/test/**/*.ts' : [ 'webpack', 'sourcemap' ]
		},
		files : [
		// test
		'src/test/**/*.ts' ],
		mime : {
			'text/x-typescript' : [ 'ts', 'tsx' ]
		},
		webpack : {
			module : webpackConfig.module,
			resolve : webpackConfig.resolve,
		// plugins : [ new webpack.SourceMapDevToolPlugin({
		// filename : null,
		// test : /\.(ts|js)($|\?)/i
		// }) ]
		},
		client : {
			mocha : {
				timeout : 20000
			}
		},
		webpackMiddleware : {
			// webpack-dev-middleware configuration
			// i.e.
			noInfo : true,
			// and use stats to turn off verbose output
			stats : {
				// options i.e.
				chunks : false
			}
		},
		reporters : [ 'progress', 'mocha', 'coverage-istanbul' ],
		coverageIstanbulReporter : {
			reports : [ 'html', 'text-summary', 'cobertura' ],
			fixWebpackSourcePaths : true,
			dir : 'target/coverage',
			'report-config' : {
				html : {
					subdir : 'html'
				},
				cobertura : {
					file : 'cobertura.xml'
				}
			}
		},
		mochaReporter : {
			showDiff : true,
			colors : {
				success : 'green',
				info : 'grey',
				warning : 'yellow',
				error : 'red'
			}
		}
	})
}