import { API_URL } from "../config";

export async function signUp(email: string, password: string) {
	const response = await fetch(`${API_URL}/sign-up`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		throw new Error("Error signing up");
	}
}
