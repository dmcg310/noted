import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import fetchSpecificNote from "../../api/notes/fetchSpecificNote";
import removeNote from "../../api/notes/removeNote";
import { Editor, EditorState, convertFromRaw } from "draft-js";

interface Note {
	_id: string;
	title: string;
	content: string;
	user: string;
	folder: string;
	created: string;
	updated: string;
}

const SpecficNote = () => {
	const [note, setNote] = useState<Note>();
	const [editorState, setEditorState] = useState<EditorState>(() =>
		EditorState.createEmpty()
	);

	const location = useLocation();
	const navigate = useNavigate();

	const noteId = location.state?.noteId;
	const userEmail = location.state?.userEmail;
	const folderId = location.state?.folderId;

	const goHome = () => {
		navigate(-1);
	};

	const editNote = () => {
		navigate(`/user/notes/${noteId}/edit`, {
			state: {
				noteId: noteId,
				noteTitle: note?.title,
				noteContent: note?.content,
				userEmail: userEmail,
			},
		});
	};

	const deleteNote = async () => {
		const data = await removeNote(noteId, userEmail, folderId);

		if (data) {
			navigate(-1);
		} else {
			alert("Error deleting note");
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchSpecificNote(noteId);
			const content = convertFromRaw(JSON.parse(data.content));
			const newEditorState = EditorState.createWithContent(content);
			setEditorState(newEditorState);

			setNote({
				...data,
				content: JSON.stringify(content),
			});
		};

		fetchData();
	}, []);

	return (
		<div>
			<h1>{note?.title}</h1>
			<Editor editorState={editorState} readOnly={true} onChange={() => {}} />
			<button name="edit-note" id="edit-note-button" onClick={editNote}>
				Edit Note
			</button>
			<button name="delete-note" id="delete-note-button" onClick={deleteNote}>
				Delete Note
			</button>
			<button name="home-redirect" id="home-redirect-button" onClick={goHome}>
				Back
			</button>
		</div>
	);
};

export default SpecficNote;
