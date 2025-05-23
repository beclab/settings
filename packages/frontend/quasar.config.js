/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js

/* eslint-disable @typescript-eslint/no-var-requires */

const { configure } = require('quasar/wrappers');
const dotenv = require('dotenv');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

dotenv.config();
// console.log(process.env);

const path = require('path');

module.exports = configure(function (ctx) {
	return {
		// https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
		supportTS: {
			tsCheckerConfig: {
				eslint: {
					enabled: true,
					files: './src/**/*.{ts,tsx,js,jsx,vue}'
				}
			}
		},

		// https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
		preFetch: true,

		// app boot file (/src/boot)
		// --> boot files are part of "main.js"
		// https://v2.quasar.dev/quasar-cli-webpack/boot-files
		boot: ['axios', 'smartEnginEntrance', 'i18n'],

		// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-css
		css: ['app.scss', ctx.dev ? 'font.dev.scss' : 'font.pro.scss'],

		// https://github.com/quasarframework/quasar/tree/dev/extras
		extras: [
			'material-icons',
			'roboto-font' // optional, you are not bound to it
		],

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
		build: {
			vueRouterMode: 'history', // available values: 'hash', 'history'
			// analyze: true,
			// target: {
			//   browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
			//   node: 'node16'
			// },
			// transpile: false,
			// publicPath: '/',
			env: {
				URL: process.env.URL,
				OLARES_SPACE_URL: process.env.OLARES_SPACE_URL,
				ACTION: process.env.ACTION,
				NODE_RPC: 'https://mainnet.optimism.io',
				CONTRACT_DID: '0x5da4fa8e567d86e52ef8da860de1be8f54cae97d',
				CONTRACT_ROOT_RESOLVER:
					'0xe2eaba0979277a90511f8873ae1e8ca26b54e740',
				CONTRACT_REGISTRY: '0x5da4fa8e567d86e52ef8da860de1be8f54cae97d',
				WS_URL: process.env.WS_URL,
				DEMO: process.env.DEMO
			},

			// Add dependencies for transpiling with Babel (Array of string/regex)
			// (from node_modules, which are by default not transpiled).
			// Applies only if "transpile" is set to true.
			// transpileDependencies: [],

			// rtl: true, // https://quasar.dev/options/rtl-support
			// preloadChunks: true,
			// showProgress: false,
			// gzip: true,
			// analyze: true,

			// Options below are automatically set depending on the env, set them if you want to override
			extractCSS: true,

			extendWebpack(cfg) {
				!ctx.dev &&
					cfg.plugins.push(
						new PreloadWebpackPlugin({
							rel: 'preload',
							include: 'allAssets',
							fileWhitelist: [/.+MaterialSymbolsRounded.+/],
							as: 'font'
						})
					);
			},

			// https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			chainWebpack(chain) {
				chain
					.entry('darkDefault.js')
					.add('./build/darkDefault.ts')
					.end();

				const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
				const TerserPlugin = require('terser-webpack-plugin');

				chain
					.plugin('css-minimizer-webpack-plugin')
					.use(CssMinimizerPlugin, [
						{
							parallel: true,
							minimizerOptions: {
								preset: [
									'default',
									{
										mergeLonghand: true,
										cssDeclarationSorter: 'concentric',
										discardComments: { removeAll: true }
									}
								]
							}
						}
					]);

				chain.optimization.minimizer('terser').use(TerserPlugin, [
					{
						terserOptions: {
							parallel: true,
							sourceMap: true,
							extractComments: false,
							compress: {
								drop_console: true,
								drop_debugger: true,
								pure_funcs: ['console.log']
							},
							output: {
								comments: false,
								ascii_only: true
							}
						}
					}
				]);

				chain.optimization.splitChunks({
					chunks: 'all', // The type of chunk that requires code segmentation
					minSize: 20000, // Minimum split file size
					minRemainingSize: 0, // Minimum remaining file size after segmentation
					minChunks: 1, // The number of times it has been referenced before it is split
					maxAsyncRequests: 30, // Maximum number of asynchronous requests
					maxInitialRequests: 30, // Maximum number of initialization requests
					enforceSizeThreshold: 50000,
					cacheGroups: {
						// Cache Group configuration
						defaultVendors: {
							test: /[\\/]node_modules[\\/]/,
							priority: -10,
							reuseExistingChunk: true
						},
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true //	Reuse the chunk that has been split
						}
					}
				});
			}
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
		devServer: {
			port: 9000,
			https: true,
			host: process.env.DEV_DOMAIN || 'localhost',
			open: true, // opens browser window automatically,
			proxy: {
				'/api': {
					target: `https://settings.${process.env.ACCOUNT_DOMAIN}`,
					changeOrigin: true
				},
				'/admin': {
					target: `https://settings.${process.env.ACCOUNT_DOMAIN}`,
					changeOrigin: true
				},
				'/kapis': {
					target: `https://settings.${process.env.ACCOUNT_DOMAIN}`,
					changeOrigin: true
				},
				'/headscale': {
					target: `https://settings.${process.env.ACCOUNT_DOMAIN}`,
					changeOrigin: true
				},
				'/images': {
					target: `https://settings.${process.env.ACCOUNT_DOMAIN}`,
					changeOrigin: true
				}
			}
		},

		// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
		framework: {
			config: {
				dark: false
			},

			// iconSet: 'material-icons', // Quasar icon set
			// lang: 'en-US', // Quasar language pack

			// For special cases outside of where the auto-import strategy can have an impact
			// (like functional components as one of the examples),
			// you can manually specify Quasar components/directives to be available everywhere:
			//
			// components: [],
			// directives: [],

			// Quasar plugins
			plugins: ['Dialog', 'Notify', 'Loading', 'Cookies', 'Meta']
		},

		// animations: 'all', // --- includes all animations
		// https://quasar.dev/options/animations
		animations: [],

		// https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
		ssr: {
			pwa: false,

			// manualStoreHydration: true,
			// manualPostHydrationTrigger: true,

			prodPort: 3000, // The default port that the production server should use
			// (gets superseded if process.env.PORT is specified at runtime)

			maxAge: 1000 * 60 * 60 * 24 * 30,
			// Tell browser when a file from the server should expire from cache (in ms)

			// chainWebpackWebserver (/* chain */) {},

			middlewares: [
				ctx.prod ? 'compression' : '',
				'render' // keep this as last one
			]
		},

		// https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
		pwa: {
			workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
			workboxOptions: {}, // only for GenerateSW

			// for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
			// if using workbox in InjectManifest mode
			// chainWebpackCustomSW (/* chain */) {},

			manifest: {
				name: 'Quasar App',
				short_name: 'Quasar App',
				description: '',
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#ffffff',
				theme_color: '#027be3',
				icons: [
					{
						src: 'icons/icon-128x128.png',
						sizes: '128x128',
						type: 'image/png'
					},
					{
						src: 'icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icons/icon-256x256.png',
						sizes: '256x256',
						type: 'image/png'
					},
					{
						src: 'icons/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png'
					},
					{
						src: 'icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
		cordova: {
			// noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
		capacitor: {
			hideSplashscreen: true
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
		electron: {
			bundler: 'packager', // 'packager' or 'builder'

			packager: {
				// https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
				// OS X / Mac App Store
				// appBundleId: '',
				// appCategoryType: '',
				// osxSign: '',
				// protocol: 'myapp://path',
				// Windows only
				// win32metadata: { ... }
			},

			builder: {
				// https://www.electron.build/configuration/configuration

				appId: 'settings'
			},

			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			chainWebpackMain(/* chain */) {
				// do something with the Electron main process Webpack cfg
				// extendWebpackMain also available besides this chainWebpackMain
			},

			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			chainWebpackPreload(/* chain */) {
				// do something with the Electron main process Webpack cfg
				// extendWebpackPreload also available besides this chainWebpackPreload
			}
		}
	};
});
