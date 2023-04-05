import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteNote } from "../api/deleteNote";
import { fetchNoteById } from "../api/fetchNoteById";
import { fetchNotes } from "../api/fetchNotes";

interface Note {
	_id: string;
	title: string;
	content: string;
	user: string;
	folder: string;
	created: string;
	updated: string;
}

const Notes = () => {
	const navigate = useNavigate();
	const { noteId } = useParams();
	const [notes, setNotes] = useState<Note[]>([]);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	// Fetch notes
	useEffect(() => {
		fetchNotes().then((data) => setNotes(data));
	}, []);

	// Fetch selected note
	useEffect(() => {
		if (noteId) {
			fetchNoteById(noteId).then((data) => setSelectedNote(data));
		} else {
			setSelectedNote(null);
		}
	}, [noteId]);

	// view note
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const noteId = e.currentTarget.id;
		navigate(`/notes/${noteId}`);
	};

	const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		deleteNote(selectedNote!)
			.then((res) => res.json())
			.then((data) => {
				setNotes(notes.filter((note) => note._id !== data._id));
				navigate("/notes");
			});
	};

	return (
		<div>
			<h1>Notes</h1>
			<button id="create-note" onClick={() => navigate("/notes/create")}>
				Create Note
			</button>
			<ul>
				{notes.map((note) => (
					<li key={note._id}>
						<button id={note._id} onClick={handleClick}>
							{note.title}
						</button>
					</li>
				))}
			</ul>
			{selectedNote && (
				<div>
					<h2>{selectedNote.title}</h2>
					<p>{selectedNote.content}</p>
					<p>{selectedNote.user}</p>
					<p>{selectedNote.folder}</p>
					<p>{selectedNote.created}</p>
					<p>{selectedNote.updated}</p>
					<button id="delete-note" onClick={handleDelete}>
						Delete
					</button>
				</div>
			)}
		</div>
	);
};

export default Notes;
