import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import createNote from "../../api/notes/createNote";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Toolbar } from "./toolbar";

const MakeNote = () => {
	const [title, setTitle] = useState("");
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const location = useLocation();
	const navigate = useNavigate();

	const folderId = location.state?.folderId;
	const params = new URLSearchParams(location.search);
	const userEmail = params.get("userEmail") ?? location.state?.userEmail;

	const handleEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);
	};

	const handleSubmit = async () => {
		const note = await createNote({
			title,
			content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
			userEmail,
			folderId,
		});

		if (note) {
			navigate(-1);
		} else {
			alert("Error creating note");
		}
	};

	return (
		<div className="h-screen">
			<div
				id="user-header"
				className="w-screen flex justify-between p-2.5 pl-3  bg-white sticky top-0"
				style={{ alignItems: "center" }}
			>
				<button
					className="px-4 py-2 text-3xl transition duration-100 ease-in rounded-md shadow-md text-slate-600 bg-slate-100 hover:bg-slate-200 text"
					onClick={() => navigate("/")}
				>
					noted.
				</button>
			</div>
			<div className="flex justify-center align-middle bg-slate-200">
				<div className="w-1/2 h-screen p-5 mt-2 bg-white rounded-md shadow-xl">
					<div className="pb-4 mb-2">
						<h1 className="pb-3 text-5xl text-slate-600">Create Note</h1>
						<p className="pl-1 text-1xl text-slate-600">
							Autosave is disabled when creating a new note, it is only
							available when you are editing the note.
						</p>
						<form className="mt-5">
							<label
								htmlFor="title"
								className="pl-1 pr-2 text-2xl text-slate-600"
							>
								Title
							</label>
							<input
								type="text"
								name="title"
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="p-2 mt-2 mb-4 border-2 rounded-md shadow-sm border-slate-200 focus:outline-none focus:border-blue-500"
							/>

							<label
								htmlFor="content"
								className="pl-2 text-2xl text-slate-600"
							>
								Content
							</label>
							<hr />
							<GrammarlyEditorPlugin clientId="client_SGS7Md7dZHLk5fBGYM2cm2">
								<Editor
									editorState={editorState}
									onEditorStateChange={handleEditorStateChange}
									toolbar={Toolbar}
									toolbarClassName="px-4 py-2 flex fixed mt-3 top-0 z-50 overflow-x-auto border-2 border-slate-200 rounded-md shadow-sm bg-zinc-100 justify-center ml-0"
									editorClassName="px-4 py-2 mt-3 border-2 border-slate-200 rounded-md shadow-sm bg-zinc-100 h-160 overflow-y-auto"
									placeholder="Enter your note here..."
								/>
							</GrammarlyEditorPlugin>
							<button
								type="button"
								onClick={handleSubmit}
								className="w-full px-8 py-4 pl-1 mt-4 mb-4 text-2xl transition duration-100 ease-in rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-400 text-slate-100"
							>
								Create Note
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MakeNote;
