import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchAllFolders from "../../api/folders/fetchAllFolders";
import viewNotesInFolder from "../../api/folders/viewNotesInFolder";
import deleteFolder from "../../api/folders/deleteFolder";
import fetchAllNotes from "../../api/notes/fetchAllNotes";
import SelectSearch, {
	SelectSearchOption,
	SelectedOptionValue,
} from "react-select-search";
import { Icon } from "@iconify/react";

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

const ViewFolders = () => {
	const [folders, setFolders] = useState<Folder[]>([]);
	const [folderId, setFolderId] = useState<string>("");

	const [notes, setNotes] = useState<Note[]>([]);
	const [allNotes, setAllNotes] = useState<{ [folderId: string]: Note[] }>({});

	const [searchedNotes, setSearchedNotes] = useState<SelectSearchOption[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isFetchingNotes, setIsFetchingNotes] = useState<boolean>(false);

	const navigate = useNavigate();
	const location = useLocation();

	const userEmail =
		location.state?.userEmail ?? new URLSearchParams(location.search).get("email");

	const folderDropdown = async (folder: Folder) => {
		if (folderId === folder._id) {
			setFolderId("");
		} else {
			setFolderId(folder._id);
		}
	};

	const createNote = () => {
		navigate(`/user/notes/create`, {
			state: {
				userEmail,
				folderId,
			},
		});
	};

	const deleteFolders = async () => {
		const data = await deleteFolder(folderId);
		if (data) {
			setFolders(folders.filter((folder) => folder._id !== folderId));
			setFolderId("");
		} else {
			alert("Error deleting folder.");
		}
	};

	const handleOptionSelect = (
		selectedValue: SelectedOptionValue | SelectedOptionValue[]
	) => {
		navigate(`/user/notes/${selectedValue}`, {
			state: {
				noteId: selectedValue,
				userEmail,
			},
		});
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const foldersData = await fetchAllFolders(userEmail);
			setFolders(foldersData);
			setIsLoading(false);
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchNotes = async () => {
			if (allNotes[folderId]) {
				// check if notes for the selected folder is already fetched
				setNotes(allNotes[folderId]);
			} else {
				// if not, fetch notes for the selected folder
				setIsFetchingNotes(true);
				const notesData = await viewNotesInFolder(userEmail, folderId);
				setAllNotes({ ...allNotes, [folderId]: notesData });
				setNotes(notesData);
				setIsFetchingNotes(false);
			}
		};

		fetchNotes();
	}, [folderId]);

	useEffect(() => {
		const searchNotes = async () => {
			const notesData = await fetchAllNotes(userEmail);
			const filteredNotes = notesData.filter((note: { title: string }) => {
				return note.title.toLowerCase().includes(searchTerm.toLowerCase());
			});

			// take the filtered notes and map them to the SelectSearchOption type
			setSearchedNotes(
				filteredNotes.map((note: { title: string; _id: string }) => {
					return {
						name: note.title,
						value: note._id,
					};
				})
			);
		};

		searchNotes();
	}, [searchTerm, userEmail]);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return (
		<div className="w-1/2 h-screen p-5 mt-20 bg-white rounded-md shadow-xl">
			<div className="flex items-center justify-between pb-4 mb-2">
				<h1 className="text-5xl text-slate-600">Notes</h1>
				<SelectSearch
					options={searchedNotes}
					search={true}
					placeholder="Search notes..."
					onChange={handleOptionSelect}
					value={searchTerm}
					// external css
				/>
			</div>
			{folders.length === 0 && (
				<p className="pb-4 text-3xl text-slate-600">No folders created.</p>
			)}
			<button
				className="w-3/5 p-2 mb-4 text-3xl rounded-md shadow-lg bg-emerald-400 hover:bg-emerald-300 text-slate-100"
				onClick={() =>
					navigate(`/user/folders/create`, {
						state: {
							userEmail,
						},
					})
				}
			>
				Create Folder
			</button>
			<ul>
				{/* display all folder names */}
				{folders.map((folder) => (
					<li key={folder._id}>
						<button
							name="folder-name"
							id="folder-name"
							onClick={() => folderDropdown(folder)}
							className="w-3/5 p-2 mb-4 text-3xl transition duration-100 ease-in bg-blue-400 rounded-md shadow-lg hover:bg-blue-300 text-slate-100"
						>
							<div className="flex items-center gap-4 align-middle">
								<Icon icon="material-symbols:folder" color="white" />
								{folder.name}
							</div>
						</button>
						{/* display create note button if no notes in the selected folder */}
						{!isFetchingNotes && notes.length === 0 && (
							<button
								name="create-note"
								id="create-note"
								onClick={createNote}
								className="w-2/5 px-8 py-4 mb-4 ml-8 text-2xl transition duration-100 ease-in rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-400 text-slate-100"
							>
								<div className="flex justify-center text-center">
									<Icon icon="material-symbols:add" />
								</div>
							</button>
						)}
						{/* display all notes in the selected folder */}
						{folder._id === folderId && notes.length > 0 && (
							<ul>
								{!isFetchingNotes &&
									notes.map((note) => (
										<li key={note._id}>
											<button
												name="note-title"
												onClick={() =>
													navigate(`/user/notes/${note._id}`, {
														state: {
															userEmail,
															folderId: folder._id,
															noteId: note._id,
														},
													})
												}
												className="w-2/5 p-2 mb-4 ml-8 text-3xl transition duration-100 ease-in bg-blue-500 rounded-md shadow-lg hover:bg-blue-400 text-slate-100"
											>
												<div className="flex gap-4">
													<Icon
														icon="ic:outline-event-note"
														color="white"
													/>
													{note.title}
												</div>
											</button>
										</li>
									))}
								<li>
									{folderId && (
										<button
											name="create-note"
											id="create-note"
											onClick={createNote}
											className="w-2/5 px-8 py-4 mb-4 ml-8 text-2xl transition duration-100 ease-in rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-400 text-slate-100"
										>
											<div className="flex justify-center text-center">
												<Icon icon="material-symbols:add" />
											</div>
										</button>
									)}
								</li>
							</ul>
						)}
					</li>
				))}
			</ul>
			{folderId && (
				<button
					name="delete-folder"
					id="delete-folder"
					onClick={deleteFolders}
					className="w-2/5 px-8 py-4 mb-4 ml-8 text-2xl transition duration-100 ease-in bg-red-500 rounded-md shadow-lg hover:bg-red-400 text-slate-100"
				>
					Delete Folder
				</button>
			)}
		</div>
	);
};

export default ViewFolders;
