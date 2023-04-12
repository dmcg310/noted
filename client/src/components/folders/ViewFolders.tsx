import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchAllFolders from "../../api/folders/fetchAllFolders";
import viewNotesInFolder from "../../api/folders/viewNotesInFolder";
import deleteFolder from "../../api/folders/deleteFolder";

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetchingNotes, setIsFetchingNotes] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const userEmail =
        location.state?.userEmail ?? new URLSearchParams(location.search).get("email");

    const goBack = () => {
        navigate(-1);
    };

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

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>Notes</h1>
            <h3>Folders</h3>
            {folders.length === 0 && <p>No folders created.</p>}
            <ul>
                {/* display all folder names */}
                {folders.map((folder) => (
                    <li key={folder._id}>
                        <button
                            name="folder-name"
                            id="folder-name"
                            onClick={() => folderDropdown(folder)}
                        >
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

            <button onClick={goBack}>Home</button>
        </div>
    );
};

export default ViewFolders;
