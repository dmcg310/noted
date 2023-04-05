import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchAllNotes from "../api/fetchAllNotes";

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

	const userEmail = location.state?.userEmail;

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
	}, []);

	return (
		<div>
			<h1>Notes</h1>
			<ul>
				{notes.map((note) => (
					<li>
						<button name="note-title" id="note-title" onClick={viewSpecificNote}>
							{note.title}
						</button>
					</li>
				))}
			</ul>
			<p>
				Click <button onClick={goBack}>here</button> to go back
			</p>
		</div>
	);
};

export default UserNotes;
