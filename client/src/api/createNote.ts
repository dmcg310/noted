import { API_URL } from "./config";

interface NoteData {
	title: string;
	content: string;
	user: string;
	folder: string;
}

export const createNote = async (noteData: NoteData) => {
	const response = await fetch(`${API_URL}/notes/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(noteData),
	});
	return response.json();
};
