import { API_URL } from "../config";

interface Note {
	title: string;
	content: string;
	userEmail: string;
}

const createNote = async ({ title, content, userEmail }: Note) => {
	const response = await fetch(`${API_URL}/user/notes/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title,
			content,
			userEmail,
		}),
	});

	const data = await response.json();
	return data;
};

export default createNote;
