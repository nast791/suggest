export default async function useApiFetch(url, options, version = 1) {
	const config = useRuntimeConfig();

	let headers = {
		version,
		accept: "application/json",
	}

	let data;

	try {
		data = await $fetch(url, {
			credentials: process.server ? "include" : "same-origin",
			watch: false,
			...options,
			headers: {
				...headers,
				...options?.headers
			}
		});
	}
	catch (e) {
		console.log(e.statusCode)
		e.statusCode ? errorHandler(e.statusCode) : errorHandler(500);
	}
	return data;
}

const errorHandler = (code) => {
	showError({ statusCode: code, message: 'Error' })
	throw createError({
		statusCode: code,
		message: 'Error',
		fatal: true
	});
}
