"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginUser, signupUser } from "@/services/authService" // 🆕 use your real API service
import { USER_BASE_URL } from "@/lib/api";


const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

//   const signIn = async (email, password) => {
//     try {
//       const token = await loginUser(email, password)
//       localStorage.setItem("token", token)

//       const response = await fetch(`${USER_BASE_URL}/${email}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("User fetch response:", response);

//       if (!response.ok) {
//         throw new Error("Failed to fetch user info");
//       }

//       const userDetails = await response.json();

//     const userObject = {
//       email: userDetails.email || email,
//       roles: userDetails.roles || [],
//       userName: userDetails.userName,
//     };

//     setUser(userObject);
//     localStorage.setItem("user", JSON.stringify(userObject));

//     return { success: true, user: userObject };
//   } catch (err) {
//     return { success: false, message: err.message };
//   }
// };

const signIn = async (email, password) => {
  try {
    const result = await loginUser(email, password); // already returns { success, user, token }

    if (!result.success) {
      throw new Error("Login failed");
    }

    const { token, user } = result;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    return { success: true, user };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

  const signUp = async (email, password) => {
    try {
      await signupUser( email, password)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/signin")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
