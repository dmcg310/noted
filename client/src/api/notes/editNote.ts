import { API_URL } from "../config";

const editNote = async (noteTitle: string, noteContent: string) => {
	const response = await fetch(`${API_URL}/user/${noteTitle}/edit`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: noteTitle,
			content: noteContent,
		}),
	});

	const data = await response.json();
	return data;
};

export default editNote;
