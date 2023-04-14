import { API_URL } from "../config";

const removeNote = async (noteId: string, user: string, folderId: string) => {
	const response = await fetch(`${API_URL}/user/${noteId}/delete`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ noteId, user, folderId }),
	});
	const data = await response.json();
	return data;
};

export default removeNote;
