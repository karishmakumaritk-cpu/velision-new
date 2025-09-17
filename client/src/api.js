import { API_BASE_URL } from "./config";

const base = API_BASE_URL || "";

export async function getUsers() {
	const res = await fetch(`${base}/api/users`);
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	return res.json();
}

export async function createUser(data) {
	const res = await fetch(`${base}/api/users`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const errText = await res.text();
		throw new Error(errText || `API error: ${res.status}`);
	}
	return res.json();
}