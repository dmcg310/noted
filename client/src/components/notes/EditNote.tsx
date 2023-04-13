import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import editNote from "../../api/notes/editNote";
import { toolbar } from "./toolbar";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import fetchSpecificNote from "../../api/notes/fetchSpecificNote";

const EditNote = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const location = useLocation();
	const navigate = useNavigate();

	const noteTitle = location.state?.noteTitle;
	const noteId = location.state?.noteId;

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const contentState = editorState.getCurrentContent();
		const contentRaw = convertToRaw(contentState);

		const note = await editNote({
			noteId: noteId,
			title: noteTitle,
			content: JSON.stringify(contentRaw),
		});

		if (!note) {
			alert("Error editing note");
			return;
		}

		navigate(-2);
	};

	const handleEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);
	};

	const fetchNote = async () => {
		const note = await fetchSpecificNote(noteId);
		const fromRaw = convertFromRaw(JSON.parse(note.content));
		const newEditorState = EditorState.createWithContent(fromRaw);

		setEditorState(newEditorState);
	};

	useEffect(() => {
		fetchNote();
	}, []);

	return (
		<div>
			<h1>Editing {noteTitle}</h1>
			<form>
				<label htmlFor="note-content">Note Content</label>
				<Editor
					editorState={editorState}
					onEditorStateChange={handleEditorStateChange}
					toolbar={toolbar}
				/>
				<button type="submit" name="submit" onClick={handleSubmit}>
					Save
				</button>
			</form>
		</div>
	);
};

export default EditNote;
