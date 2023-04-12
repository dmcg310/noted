import { API_URL } from "../config";

const deleteFolders = async (folderId: string) => {
    const response = await fetch(`${API_URL}/user/folders/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            folderId,
        }),
    });

    const data = await response.json();
    return data;
};

export default deleteFolders;
