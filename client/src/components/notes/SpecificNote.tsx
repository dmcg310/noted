import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import fetchSpecificNote from "../../api/notes/fetchSpecificNote";
import removeNote from "../../api/notes/removeNote";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { Icon } from "@iconify/react";

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
	const [editorState, setEditorState] = useState<EditorState>(() =>
		EditorState.createEmpty()
	);

	const location = useLocation();
	const navigate = useNavigate();

	const noteId = location.state?.noteId;
	const userEmail = location.state?.userEmail;
	let folderId = location.state?.folderId;

	const goHome = () => {
		navigate(-1);
	};

	const editNote = () => {
		navigate(`/user/notes/${noteId}/edit`, {
			state: {
				noteId: noteId,
				noteTitle: note?.title,
				noteContent: note?.content,
				userEmail: userEmail,
			},
		});
	};

	const deleteNote = async () => {
		if (folderId === null || folderId === undefined) {
			// get folderid
			const note = await fetchSpecificNote(noteId);
			const data = await removeNote(noteId, userEmail, note.folder);

			if (data) {
				navigate(-1);
			} else {
				alert("Error deleting note");
			}
		} else {
			const data = await removeNote(noteId, userEmail, folderId);

			if (data) {
				navigate(-1);
			} else {
				alert("Error deleting note");
			}
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchSpecificNote(noteId);
			const content = convertFromRaw(JSON.parse(data.content));
			const newEditorState = EditorState.createWithContent(content);
			setEditorState(newEditorState);

			setNote({
				...data,
				content: JSON.stringify(content),
			});
		};

		fetchData();
	}, []);

	return (
		<div>
			<div
				id="user-header"
				className="w-screen flex justify-between p-2.5 pl-3 fixed bg-white"
				style={{ alignItems: "center" }}
			>
				<button
					className="px-4 py-2 text-3xl transition duration-100 ease-in rounded-md shadow-md text-slate-600 bg-slate-100 hover:bg-slate-200 text"
					onClick={() => navigate("/")}
				>
					noted.
				</button>
			</div>
			<div>
				<div className="flex justify-center align-middle bg-slate-200">
					<div className="w-1/2 h-screen p-5 mt-20 bg-white rounded-md shadow-xl">
						<h1 className="pb-3 text-5xl text-slate-600">{note?.title}</h1>
						<div className="px-4 py-2 mt-3 mb-4 overflow-y-auto border-2 rounded-md shadow-sm border-slate-200 bg-zinc-100 h-160">
							<Editor
								editorState={editorState}
								readOnly={true}
								onChange={() => {}}
							/>
						</div>
						<div className="flex justify-between">
							<div className="flex items-center gap-4">
								<button
									name="edit-note"
									id="edit-note-button"
									onClick={editNote}
									className="px-8 py-4 text-2xl text-white transition duration-100 ease-in bg-blue-400 rounded-md shadow-lg hover:bg-blue-300 text"
								>
									Edit Note
								</button>
								<button
									name="delete-note"
									id="delete-note-button"
									onClick={deleteNote}
									className="px-8 py-4 ml-3 text-2xl text-white transition duration-100 ease-in bg-red-500 rounded-md shadow-lg hover:bg-red-400 text"
								>
									Delete Note
								</button>
							</div>
							<button
								name="home-redirect"
								id="home-redirect-button"
								onClick={goHome}
							>
								<div className="flex items-center gap-4 px-8 py-4 ml-3 text-2xl text-white align-middle transition duration-100 ease-in bg-gray-400 rounded-md shadow-lg hover:bg-gray-300 text">
									<Icon
										icon="material-symbols:arrow-back"
										color="white"
									/>
									Back
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SpecficNote;
