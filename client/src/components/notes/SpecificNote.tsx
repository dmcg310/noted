import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import fetchSpecificNote from "../../api/notes/fetchSpecificNote";
import removeNote from "../../api/notes/removeNote";

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

	const location = useLocation();
	const navigate = useNavigate();

	const noteTitle = location.state?.noteTitle;
	const userEmail = location.state?.userEmail;

	const goHome = () => {
		navigate(-1);
	};

	const editNote = () => {
		navigate(`/user/notes/${noteTitle}/edit`, {
			state: { noteTitle: note?.title, noteContent: note?.content, userEmail: userEmail },
		});
	};

	const deleteNote = async () => {
		const data = await removeNote(noteTitle);

		if (data) {
			navigate(-1);
		} else {
			alert("Error deleting note");
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchSpecificNote(noteTitle);
			setNote(data);
		};

		fetchData();
	}, []);

	return (
		<div>
			<h1>{note?.title}</h1>
			<h3>{note?.content}</h3>
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
