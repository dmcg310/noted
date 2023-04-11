import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchAllFolders from "../../api/folders/fetchAllFolders";
import viewNotesInFolder from "../../api/folders/viewNotesInFolder";

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

    useEffect(() => {
        const fetchData = async () => {
            const foldersData = await fetchAllFolders(userEmail);
            setFolders(foldersData);
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
                const notesData = await viewNotesInFolder(userEmail, folderId);
                setAllNotes({ ...allNotes, [folderId]: notesData });
                setNotes(notesData);
            }
        };

        fetchNotes();
    }, [folderId]);

    return (
        <div>
            <h1>Folders</h1>
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
                        {folder._id === folderId && (
                            <ul>
                                {notes.map((note) => (
                                    <li key={note._id}>
                                        <button
                                            name="note-title"
                                            // TODO: Fix this
                                            onClick={() =>
                                                navigate(`/user/notes/${note.title}`, {
                                                    state: {
                                                        userEmail,
                                                        folderId: folder._id,
                                                        noteTitle: note.title,
                                                    },
                                                })
                                            }
                                        >
                                            {note.title}
                                        </button>
                                    </li>
                                ))}

                                {/* create a new note in the selected folder */}
                                <button
                                    name="folder-name"
                                    id="folder-name"
                                    onClick={() =>
                                        navigate(`/user/notes/create`, {
                                            state: {
                                                userEmail,
                                                folderId: folder._id,
                                            },
                                        })
                                    }
                                >
                                    Add Note
                                </button>
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
                Add Folder
            </button>
            <button onClick={goBack}>Back</button>
        </div>
    );
};

export default ViewFolders;
