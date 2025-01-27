import useApiFetch from "@/composable/useApiFetch";

export const searchItem = async (string) => {
	return await useApiFetch(`https://habr.com/kek/v2/publication/suggest-mention?q=${string}`);
};
