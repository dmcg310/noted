import { API_URL } from "./config";

export const deleteNote = (selectedNote: { _id: string }) => {
	return fetch(`${API_URL}/notes/delete/${selectedNote?._id}`, {
		method: "DELETE",
	});
};
