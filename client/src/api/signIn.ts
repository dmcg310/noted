import { API_URL } from "./config";

export async function signIn(email: string, password: string) {
	const response = await fetch(`${API_URL}/sign-in`, {
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
		return null;
	}
}
