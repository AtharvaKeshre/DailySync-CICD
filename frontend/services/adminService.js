// services/adminService.js
import { ADMIN_BASE_URL } from "@/lib/api"

export async function fetchAllUsers() {
  const token = localStorage.getItem("token")

  const response = await fetch(`${ADMIN_BASE_URL}/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) throw new Error("Failed to fetch users")

  return response.json()
}

export async function promoteToAdmin(userName) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${ADMIN_BASE_URL}/user-action/upgrade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: userName }), // ✅ correct key
 // Exactly what backend expects
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to promote user: ${errorText}`);
  }

  return response; // no body expected on 200 OK
}

