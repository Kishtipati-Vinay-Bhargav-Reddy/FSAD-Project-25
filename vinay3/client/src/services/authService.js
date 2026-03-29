import api from "./api";

// ✅ LOGIN
export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error("LOGIN ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ REGISTER
export const registerUser = async (user) => {
  try {
    const { data } = await api.post("/api/auth/register", user);
    return data;
  } catch (error) {
    console.error("REGISTER ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ PROFILE
export const fetchProfile = async () => {
  try {
    const { data } = await api.get("/api/auth/profile");
    return data;
  } catch (error) {
    console.error("PROFILE ERROR:", error.response?.data || error.message);
    throw error;
  }
};