import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createNote from "../../api/notes/createNote";

const MakeNote = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const location = useLocation();
	const navigate = useNavigate();

	const params = new URLSearchParams(location.search);
	const userEmail = params.get("userEmail") ?? "";

	const handleSubmit = async () => {
		const note = await createNote({
			title,
			content,
			userEmail,
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
			<form method="POST">
				<label htmlFor="title">Title</label>
				<input
					type="text"
					name="title"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<label htmlFor="content">Content</label>
				<textarea
					name="content"
					id="content"
					cols={30}
					rows={10}
					value={content}
					onChange={(e) => setContent(e.target.value)}
				></textarea>

				<button type="button" onClick={handleSubmit}>
					Create Note
				</button>
			</form>
		</div>
	);
};

export default MakeNote;
