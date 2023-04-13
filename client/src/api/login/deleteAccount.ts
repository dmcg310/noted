import { API_URL } from "../config";

const deleteAccount = async (userEmail: string) => {
	const response = await fetch(`${API_URL}/user/delete`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({ email: userEmail }),
	});
	const data = await response.json();
	return data;
};

export default deleteAccount;
