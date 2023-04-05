import { API_URL } from "./config";

export async function fetchNoteById(id: string) {
	try {
		const response = await fetch(`${API_URL}/notes/${id}`);

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			throw new Error("Error fetching note");
		}
	} catch (error) {
		console.log(error);
	}
}
