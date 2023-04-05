import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import fetchSpecificNote from "../api/fetchSpecificNote";

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

	const goHome = () => {
		navigate(-1);
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
			<button name="home-redirect" id="home-redirect-button" onClick={goHome}>
				Home
			</button>
		</div>
	);
};

export default SpecficNote;
