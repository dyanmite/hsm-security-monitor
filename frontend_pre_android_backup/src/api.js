const BASE_URL = "http://10.129.218.192:3000"; // Hardcoded for Android App Access

// REMOVED: import { auth } from "./firebase";

async function getToken() {
  // Local Auth: Token is stored in localStorage by Login page
  return localStorage.getItem("hsm_token");
}

export async function apiGet(path) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function apiPost(path, body = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  return res.json();
}
