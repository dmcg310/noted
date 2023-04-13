import { API_URL } from "../config";

interface Note {
	title: string;
	content: object;
	userEmail: string;
	folderId: string;
}

const createNote = async ({ title, content, userEmail, folderId }: Note) => {
	const response = await fetch(`${API_URL}/user/notes/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title,
			content,
			userEmail,
			folderId,
		}),
	});

	const data = await response.json();
	return data;
};

export default createNote;
