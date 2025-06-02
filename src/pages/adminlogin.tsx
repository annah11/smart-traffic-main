// src/pages/adminlogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

import lightImage from "@/images/light.jpg";
import backgroundImage from "@/images/background.png";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === "ADMIN") {

        alert("Welcome Admin!");
        navigate("/dashboard");
      } else {
        alert("Access denied. Not an admin. or Incorrect credential");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Login Error:", err.message);
      alert(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-96 bg-gray-800 bg-opacity-90 rounded-2xl shadow-xl p-8 flex flex-col">
        <div className="flex flex-col items-center justify-center mb-8">
          <img
            src={lightImage}
            alt="Traffic Light"
            className="w-20 h-20 object-cover mb-2"
          />
          <h1 className="text-white text-2xl font-semibold">
            Admin Control Panel
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Admin Email</label>
            <input
              type="email"
              placeholder="admin@smart.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-400">Not registered?</p>
          <button
            onClick={() => navigate("/adminsignup")}
            className="text-blue-400 hover:underline mt-2"
          >
            Sign up
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Admin Panel • Ethiopian Traffic Agency
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
