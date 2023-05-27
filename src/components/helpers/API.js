export async function fetchFromAPI(url, method, body) {
	try {
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error(`Error fetching ${url}`);
		}

		return response;
	} catch (error) {
		console.error(`Error fetching ${url}:`, error);
		throw error;
	}
}
