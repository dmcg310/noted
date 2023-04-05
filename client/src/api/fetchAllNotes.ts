import { API_URL } from "./config";

const fetchAllNotes = async (userEmail: string) => {
	const response = await fetch(`${API_URL}/user/notes?email=${userEmail}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	});
	const data = await response.json();
	return data;
};

export default fetchAllNotes;
