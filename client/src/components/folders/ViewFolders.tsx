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
		setFolderId(folder._id);
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
		<div className="mt-20 w-11/12  h-screen bg-white rounded-md shadow-xl p-5">
			<div className="flex justify-between">
				<h1 className="text-5xl">Notes</h1>

				<p
					className="text-2xl align-center flex"
					style={{ alignItems: "center" }}
				>
					Click on a folder to view notes.
				</p>
			</div>
			<h3 className="text-4xl">Folders</h3>
			<SelectSearch
				options={searchedNotes}
				search={true}
				placeholder="Search"
				onChange={handleOptionSelect}
				value={searchTerm}
				// external css
			/>
			{folders.length === 0 && <p>No folders created.</p>}
			<ul>
				{/* display all folder names */}
				{folders.map((folder) => (
					<li key={folder._id}>
						<button
							name="folder-name"
							id="folder-name"
							onClick={() => folderDropdown(folder)}
							className="text-1xl bg-blue-400 rounded-md p-2 shadow-lg "
						>
							📁
							<br />
							{folder.name}
						</button>

						{/* display all notes in the selected folder */}
						{folder._id === folderId && notes.length > 0 && (
							<ul>
								{isFetchingNotes && <li>Loading notes...</li>}
								{!isFetchingNotes && notes.length === 0 && (
									<li>No notes in this folder.</li>
								)}
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
												className="ml-8 text-1xl bg-blue-500 rounded-md p-2 shadow-lg"
											>
												{note.title}
											</button>
										</li>
									))}
							</ul>
						)}
					</li>
				))}
			</ul>
			<button
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
			{folderId && (
				<button name="create-note" id="create-note" onClick={createNote}>
					Create Note
				</button>
			)}
			{folderId && (
				<button name="delete-folder" id="delete-folder" onClick={deleteFolders}>
					Delete Folder
				</button>
			)}
		</div>
	);
};

export default ViewFolders;
