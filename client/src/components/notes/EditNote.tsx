import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import editNote from "../../api/notes/editNote";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import fetchSpecificNote from "../../api/notes/fetchSpecificNote";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { Toolbar } from "./toolbar";
import removeNote from "../../api/notes/removeNote";

const EditNote = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [autoSaveTime, setAutoSaveTime] = useState<NodeJS.Timeout>();

	const location = useLocation();
	const navigate = useNavigate();

	const noteTitle = location.state?.noteTitle;
	console.log(noteTitle);
	const noteId = location.state?.noteId;
	let folderId = location.state?.folderId;
	const userEmail = location.state?.userEmail;

	const handleAutoSave = async () => {
		const contentState = editorState.getCurrentContent();
		const contentRaw = convertToRaw(contentState);

		const note = await editNote({
			noteId: noteId,
			title: noteTitle,
			content: JSON.stringify(contentRaw),
		});

		if (!note) {
			alert("Error autosaving note");
			return;
		}

		console.log("Auto saved");
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const contentState = editorState.getCurrentContent();
		const contentRaw = convertToRaw(contentState);

		const note = await editNote({
			noteId: noteId,
			title: noteTitle,
			content: JSON.stringify(contentRaw),
		});

		if (!note) {
			alert("Error editing note");
			return;
		}

		navigate("/");
	};

	const handleEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);

		// Auto save every 30 seconds
		if (autoSaveTime) {
			clearTimeout(autoSaveTime);
		}

		setAutoSaveTime(setTimeout(() => handleAutoSave(), 30000));
	};

	const fetchNote = async () => {
		const note = await fetchSpecificNote(noteId);
		const fromRaw = convertFromRaw(JSON.parse(note.content));
		const newEditorState = EditorState.createWithContent(fromRaw);

		setEditorState(newEditorState);
	};

	const deleteNote = async () => {
		console.log("deleting note");
		if (folderId === null || folderId === undefined) {
			// get folderid
			const note = await fetchSpecificNote(noteId);
			const data = await removeNote(noteId, userEmail, note.folder);

			if (data) {
				navigate("/");
			} else {
				alert("Error deleting note");
			}
		} else {
			const data = await removeNote(noteId, userEmail, folderId);

			if (data) {
				navigate("/");
			} else {
				alert("Error deleting note");
			}
		}
	};

	useEffect(() => {
		fetchNote();
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
						<h1 className="pb-3 text-5xl text-slate-600">
							Editing, <span className="text-blue-500">{noteTitle}</span>
						</h1>
						<p className="pl-1 text-1xl text-slate-600">
							Autosave is enabled. Your note will be saved every 30 seconds.
						</p>
						<form className="mt-3">
							<label
								htmlFor="note-content"
								className="pl-1 text-2xl text-slate-600"
							>
								Content
							</label>
							<GrammarlyEditorPlugin clientId="client_SGS7Md7dZHLk5fBGYM2cm2">
								<Editor
									editorState={editorState}
									onEditorStateChange={handleEditorStateChange}
									toolbar={Toolbar}
									toolbarClassName="px-4 py-2 flex fixed mt-3 top-0 z-50 overflow-x-auto border-2 border-slate-200 rounded-md shadow-sm bg-zinc-100 justify-center ml-0"
									editorClassName="px-4 py-2 mt-3 border-2 border-slate-200 rounded-md shadow-sm bg-zinc-100 h-160 overflow-y-auto"
								/>
							</GrammarlyEditorPlugin>
							<button
								type="submit"
								name="submit"
								onClick={handleSubmit}
								className="px-8 py-4 mt-4 text-2xl text-white transition duration-100 ease-in bg-blue-400 rounded-md shadow-lg hover:bg-blue-300 text"
							>
								Save and Exit
							</button>
							<button
								name="delete"
								id="delete"
								className="px-8 py-4 mt-4 ml-4 text-2xl text-white transition duration-100 ease-in bg-red-400 rounded-md shadow-lg hover:bg-red-300 text"
								type="button"
								onClick={deleteNote}
							>
								Delete Note
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditNote;
