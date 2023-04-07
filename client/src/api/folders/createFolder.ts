import { API_URL } from "../config";

interface Folder {
	name: string;
	email: string;
}

const createFolder = async ({ name, email }: Folder) => {
	const response = await fetch(`${API_URL}/user/folders/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			email,
		}),
	});

	const data = await response.json();
	return data;
};

export default createFolder;
