import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role === "admin") navigate("/admin");
      else if (decoded.role === "manager") navigate("/manager");
      else navigate("/pos");

    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white p-2 w-full"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}