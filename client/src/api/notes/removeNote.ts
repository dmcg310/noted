import { API_URL } from "../config";

const removeNote = async (noteTitle: string) => {
	const response = await fetch(`${API_URL}/user/${noteTitle}/delete`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ noteTitle }),
	});
	const data = await response.json();
	return data;
};

export default removeNote;
