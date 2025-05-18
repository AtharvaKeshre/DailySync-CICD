import { API_BASE_URL , USER_BASE_URL } from "@/lib/api";

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: email,
        password: password, }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Login failed");
  }

  const token = await response.text();
  const userResponse = await fetch(`${USER_BASE_URL}/${email}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error("Failed to fetch user info");
  }

  const userDetails = await userResponse.json(); // Get roles, etc.

  return {
    success: true,
    user: userDetails,
    token,
  };
}

export async function signupUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({userName: email, // matches backend expected field
        password: password, }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Signup failed");
  }

  return response.status === 200;
}
