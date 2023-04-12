import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import createNote from "../../api/notes/createNote";
import { toolbar } from "./toolbar";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const MakeNote = () => {
	const [title, setTitle] = useState("");
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const location = useLocation();
	const navigate = useNavigate();

	const folderId = location.state?.folderId;
	const params = new URLSearchParams(location.search);
	const userEmail = params.get("userEmail") ?? location.state?.userEmail;

	const handleEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);
	};

	const handleSubmit = async () => {
		const note = await createNote({
			title,
			content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
			userEmail,
			folderId,
		});

		if (note) {
			navigate(-1);
		} else {
			alert("Error creating note");
		}
	};

	return (
		<div className="create-note">
			<h1>Create Note</h1>
			<form>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					name="title"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<label htmlFor="content">Content</label>
				<Editor
					editorState={editorState}
					onEditorStateChange={handleEditorStateChange}
					toolbar={toolbar}
					placeholder="Enter your note here..."
				/>

				<button type="button" onClick={handleSubmit}>
					Create Note
				</button>
			</form>
		</div>
	);
};

export default MakeNote;
