import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchAllNotes from "../../api/notes/fetchAllNotes";

interface Note {
	_id: string;
	title: string;
	content: string;
	user: string;
	folder: string;
	created: string;
	updated: string;
}

const UserNotes = () => {
	const [notes, setNotes] = React.useState<Note[]>([]);

	const navigate = useNavigate();
	const location = useLocation();

	const userEmail =
		location.state?.userEmail ?? new URLSearchParams(location.search).get("email");

	const viewSpecificNote = (e: React.MouseEvent<HTMLButtonElement>) => {
		const noteTitle = e.currentTarget.innerText;
		navigate(`/user/notes/${noteTitle}`, { state: { noteTitle } });
	};

	const goBack = () => {
		navigate(-1);
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchAllNotes(userEmail);
			setNotes(data);
		};

		fetchData();

		if (!userEmail) {
			navigate("/sign-in");
		}
	}, []);

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notes.map((note) => (
					<li key={note._id}>
						<button name="note-title" id="note-title" onClick={viewSpecificNote}>
							{note.title}
						</button>
					</li>
				))}
			</ul>
			<button
				name="create-note"
				id="create-note"
				onClick={() => navigate(`/user/notes/create?userEmail=${userEmail}`)}
			>
				Create Note
			</button>
			<p>
				Click <button onClick={goBack}>here</button> to go back
			</p>
		</div>
	);
};

export default UserNotes;
