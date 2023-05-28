import { fetchFromAPI } from "./API";
export async function fetchAndSetModels() {
	const response = await fetchFromAPI(
		`${process.env.REACT_APP_API_URL}/models`,
		"GET"
	);
	if (response.ok) {
		const { models } = await response.json();
		localStorage.setItem("models", JSON.stringify(models));
	} else {
		console.error("Failed to fetch models");
	}
}
