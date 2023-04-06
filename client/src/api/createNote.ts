import { API_URL } from "./config";

interface Note {
	title: string;
	content: string;
	userEmail: string;
}

const createNote = async ({ title, content, userEmail }: Note) => {
	const noted = {
		title: title,
		content: content,
		folder: "",
	};

	const response = await fetch(`http://localhost:5000/user/notes/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userEmail: userEmail,
			title: noted.title,
			content: noted.content,
			folder: noted.folder,
		}),
	});

	const data = await response.json();
	return data;
};

export default createNote;
