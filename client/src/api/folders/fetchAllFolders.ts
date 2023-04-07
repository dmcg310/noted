import { API_URL } from "../config";

const fetchAllFolders = async (userEmail: string) => {
	const response = await fetch(`${API_URL}/user/folders?email=${userEmail}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	});
	const data = await response.json();
	return data;
};

export default fetchAllFolders;
