import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import viewNotesInFolder from "../../api/folders/viewNotesInFolder";

interface Folder {
	_id: string;
	name: string;
	user: string;
	created: string;
	notes: string[];
}

interface Note {
	_id: string;
	title: string;
	content: string;
	user: string;
	folder: string;
	created: string;
	updated: string;
}

const ViewFolderContents = () => {
	const [notes, setNotes] = useState<Note[]>([]);

	const location = useLocation();
	const navigate = useNavigate();

	const folderId = location.state?.folderId;
	const userEmail = location.state?.userEmail;

	const goBack = () => {
		navigate(-1);
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await viewNotesInFolder(userEmail, folderId);
			setNotes(data);
		};

		fetchData();

		if (!userEmail) {
			navigate("/sign-in");
		}
	}, []);
	if (notes === undefined || notes.length === 0) {
		return (
			<div>
				<h1>Notes</h1>
				<p>No notes in this folder.</p>
				<button
					name="create-note-button"
					id="create-note-button"
					onClick={() =>
						navigate(`/user/notes/create`, {
							state: { folderId: folderId, userEmail: userEmail },
						})
					}
				>
					Create Note
				</button>
				<button name="back-button" id="back-button" onClick={goBack}>
					Back
				</button>
			</div>
		);
	}
	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notes.map((note) => (
					<li key={note._id}>
						<button
							name="note-title"
							id="note-title"
							onClick={() =>
								navigate(`/user/notes/${note.title}`, {
									state: { noteTitle: note.title, userEmail: userEmail },
								})
							}
						>
							{note.title}
						</button>
					</li>
				))}
			</ul>
			<button name="back-button" id="back-button" onClick={goBack}>
				Back
			</button>
		</div>
	);
};

export default ViewFolderContents;
