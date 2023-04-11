import { API_URL } from "../config";

const fetchSpecificNote = async (noteTitle: string) => {
    const response = await fetch(`${API_URL}/user/notes/${noteTitle}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
    const data = await response.json();
    return data;
};

export default fetchSpecificNote;
