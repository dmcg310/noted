import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import editNote from "../../api/notes/editNote";

const EditNote = () => {
	const [noteContent, setNoteContent] = useState<string>("");

	const location = useLocation();
	const navigate = useNavigate();

	const noteTitle = location.state?.noteTitle;

	const handleNoteContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNoteContent(e.target.value);
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		await editNote(noteTitle, noteContent);
		navigate(-2);
	};

	useEffect(() => {
		setNoteContent(location.state?.noteContent || "");
	}, [location.state?.noteTitle, location.state?.noteContent]);

	return (
		<div>
			<h1>Editing {noteTitle}</h1>
			<form>
				<label htmlFor="note-content">Note Content</label>
				<input
					type="text"
					name="note-content"
					id="note-content"
					value={noteContent}
					onChange={handleNoteContentChange}
				/>
				<button type="submit" name="submit" onClick={handleSubmit}>
					Save
				</button>
			</form>
		</div>
	);
};

export default EditNote;
