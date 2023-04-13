import { API_URL } from "../config";

interface Note {
	noteId: string;
	title: string;
	content: string;
}

const editNote = async (note: Note) => {
	const response = await fetch(`${API_URL}/user/notes/${note.noteId}/edit`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			noteId: note.noteId,
			title: note.title,
			content: note.content,
		}),
	});

	const data = await response.json();
	return data;
};

export default editNote;
