import { API_URL } from "./config";

interface Note {
	_id: string;
	title: string;
	content: string;
	user: string;
	folder: string;
	created: string;
	updated: string;
}

export const deleteNote = (selectedNote: { _id: string }) => {
	return fetch(`${API_URL}/notes/delete/${selectedNote?._id}`, {
		method: "DELETE",
	});
};
