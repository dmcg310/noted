import { API_URL } from "../config";

const editNote = async (noteId: string, noteTitle: string, noteContent: string) => {
    const response = await fetch(`${API_URL}/user/notes/${noteId}/edit`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            noteId: noteId,
            title: noteTitle,
            content: noteContent,
        }),
    });

    const data = await response.json();
    return data;
};

export default editNote;
