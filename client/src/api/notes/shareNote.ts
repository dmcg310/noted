import { API_URL } from "../config";

interface NoteShare {
	noteId: string;
	email: string;
}

const shareNote = async ({ noteId, email }: NoteShare) => {
	const response = await fetch(`http://localhost:5000/user/notes/share/${noteId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, noteId }),
	});

	const data = await response.json();
	return data;
};

export default shareNote;
