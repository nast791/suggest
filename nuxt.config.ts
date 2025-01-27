// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
import svgLoader from 'vite-svg-loader';

// @ts-ignore
export default defineNuxtConfig({
  compatibilityDate: '2025-01-26',
  devtools: { enabled: false },
	vite: {
		optimizeDeps: {
			esbuildOptions: {
				define: {
					global:  "window"
				}
			}
		},
		plugins: [
			svgLoader({svgo: false}),
		],
	},
	app: {
		head: {
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width' },
				{ name: 'format-detection', content: 'telephone=no' },
				{ name: 'msapplication-tap-highlight', content: 'no' },
				{ name: 'theme-color', content: '#fff' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
			]
		},
		link: [
			{ rel: 'shortcut icon', type: 'image/x-icon', href: 'favicon.ico' },
		],
		pageTransition: { name: 'page', mode: 'default' }
	},
	css: [
		'@/assets/styles/app.scss'
	],
	components: {
		global: true,
		dirs: ['~/components/atoms']
	},
	typescript: {
		strict: true
	},
})
