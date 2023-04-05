import { API_URL } from "./config";

export async function fetchNotes() {
	try {
		const response = await fetch(`${API_URL}/notes`);

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			throw new Error("Error fetching notes");
		}
	} catch (error) {
		console.log(error);
	}
}
