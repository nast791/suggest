export default async function useApiFetch(url, options, version = 1) {
	const config = useRuntimeConfig();

	let headers = {
		version,
		accept: "application/json",
	}

	const data = {};

	try {
		const response = await $fetch(url, {
			credentials: process.server ? "include" : "same-origin",
			watch: false,
			...options,
			headers: {
				...headers,
				...options?.headers
			}
		});
		data.data = response?.data || response;
	}
	catch (e) {
		// e.statusCode ? errorHandler(e.statusCode) : errorHandler(500);
		data.error = e.statusCode;
	}
	return data;
}

// const errorHandler = (code) => {
// 	showError({ statusCode: code, message: 'Error' })
// 	throw createError({
// 		statusCode: code,
// 		message: 'Error',
// 		fatal: true
// 	});
// }
