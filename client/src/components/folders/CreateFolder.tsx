import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createFolder from "../../api/folders/createFolder";

const CreateFolder = () => {
    const [name, setFolderName] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state.userEmail;

    const handleSubmit = async () => {
        const folder = await createFolder({
            email,
            name,
        });

        if (folder) {
            navigate(-1);
        } else {
            alert("Error creating folder");
        }
    };

    return (
        <div className="create-folder">
            <h1>Create Folder</h1>
            <form method="POST">
                <label htmlFor="folderName">Folder Name</label>
                <input
                    type="text"
                    name="folderName"
                    id="folderName"
                    value={name}
                    onChange={(e) => setFolderName(e.target.value)}
                />

                <button type="button" onClick={handleSubmit}>
                    Create Folder
                </button>
            </form>
        </div>
    );
};

export default CreateFolder;
