import { API_URL } from "../config";

const viewNotesInFolder = async (userEmail: string, folderId: string) => {
    const response = await fetch(
        `${API_URL}/user/folders/${folderId}?email=${userEmail}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
    const data = await response.json();
    return data;
};

export default viewNotesInFolder;
