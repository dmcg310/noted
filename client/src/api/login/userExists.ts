import { API_URL } from "../config";

const userExists = async (email: string) => {
	const response = await fetch(`${API_URL}/user/exists/${email}?email=${email}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	return data;
};

export default userExists;
