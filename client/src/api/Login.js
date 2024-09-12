import axios from "axios";

async function login(userName, password) {
  try {
    const response = await axios.post(
      "http://localhost:3001/accounts/login", // Đảm bảo port này đúng với port server của bạn
      {
        userName,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Login response:", response);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export default login;
