import { useNavigate } from "react-router-dom";
import { createNote } from "../api/createNote";

const CreateNote = () => {
	const navigate = useNavigate();

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const title = document.getElementById("title") as HTMLInputElement;
		const content = document.getElementById("content") as HTMLInputElement;
		const user = document.getElementById("user") as HTMLInputElement;
		const folder = document.getElementById("folder") as HTMLInputElement;

		await createNote({
			title: title.value,
			content: content.value,
			user: user.value,
			folder: folder.value,
		});

		navigate("/notes");
	};

	return (
		<div>
			<h1>Create Note</h1>
			<form method="POST">
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" />

				<label htmlFor="content">Content</label>
				<textarea name="content" id="content" />

				<label htmlFor="user">User</label>
				<input type="text" name="user" id="user" />

				<label htmlFor="folder">Folder</label>
				<input type="text" name="folder" id="folder" />

				<button type="submit" onClick={handleClick}>
					Create!
				</button>
			</form>
		</div>
	);
};

export default CreateNote;
