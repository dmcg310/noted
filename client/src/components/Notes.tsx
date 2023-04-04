import React, { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Notes = () => {
	const navigate = useNavigate();
	const { noteId } = useParams();

	interface Note {
		_id: string;
		title: string;
		content: string;
		user: string;
		folder: string;
		created: string;
		updated: string;
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const noteId = e.currentTarget.id;
		navigate(`/notes/${noteId}`);
	};

	const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		fetch(`http://localhost:5000/notes/delete/${selectedNote?._id}`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then((data) => {
				setNotes(notes.filter((note) => note._id !== data._id));
				navigate("/notes");
			});
	};

	const [notes, setNotes] = useState<Note[]>([]);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	useEffect(() => {
		fetch("http://localhost:5000/notes")
			.then((res) => res.json())
			.then((data) => setNotes(data));
	}, []);

	useEffect(() => {
		if (noteId) {
			fetch(`http://localhost:5000/notes/${noteId}`)
				.then((res) => res.json())
				.then((data) => setSelectedNote(data));
		} else {
			setSelectedNote(null);
		}
	}, [noteId]);

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
						Delete Note
					</button>
				</div>
			)}
		</div>
	);
};

export default Notes;
