export default {
	// https://router.vuejs.org/api/interfaces/routeroptions.html#routes
	routes: (_routes) => [
		{
			path: '/',
			children: [
				{
					path: '',
					name: 'index',
					component: () => import('@/pages/index.vue'),
				},
			],
		}
	],
}
