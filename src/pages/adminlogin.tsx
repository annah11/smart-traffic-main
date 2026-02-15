// src/pages/AdminLogin.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, enableNetwork } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import lightImage from "@/images/light.jpg";
import backgroundImage from "@/images/background.png";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedAdminEmail");
    const savedPassword = localStorage.getItem("rememberedAdminPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      try {
        await enableNetwork(db);
      } catch {
        // Ignore
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === "ADMIN") {
        if (rememberMe) {
          localStorage.setItem("rememberedAdminEmail", email);
          localStorage.setItem("rememberedAdminPassword", password);
        } else {
          localStorage.removeItem("rememberedAdminEmail");
          localStorage.removeItem("rememberedAdminPassword");
        }

        toast.success("Welcome Admin! Redirecting to dashboard...", {
          autoClose: 2500,
          position: "top-center",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error("Access denied. Not an admin. Use User Login if you're an employee.");
      }
    } catch (error: unknown) {
      const err = error as Error;
      const message = err?.message || String(error);
      if (error instanceof FirebaseError && error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password. Try again or use Forgot password.");
      } else if (message.includes("offline") || message.includes("OFFLINE")) {
        toast.error("No internet connection. Please check your network and try again.");
      } else if (message.includes("permission") || message.includes("PERMISSION_DENIED")) {
        toast.error("Firestore permission denied. See FIREBASE_SETUP.md - deploy Firestore rules.");
      } else {
        console.error("Login Error:", message);
        toast.error("Login failed: " + message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md md:w-96 bg-gray-800/95 dark:bg-card rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col">
        <div className="flex flex-col items-center justify-center mb-8">
          <img src={lightImage} alt="Traffic Light" className="w-20 h-20 object-cover mb-2" />
          <h1 className="text-white text-2xl font-semibold">Admin Control Panel</h1>
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

          <div className="flex justify-between items-center text-sm text-gray-300">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox text-blue-500"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password", { state: { from: "admin" } })}
              className="text-blue-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-400 mb-1">Not an admin?</p>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline"
          >
            Go to User Login
          </button>

          <div className="mt-4">
            <p className="text-gray-400">New Admin?</p>
            <button
              onClick={() => navigate("/adminsignup")}
              className="text-blue-400 hover:underline mt-1"
            >
              Register as Admin
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Admin Panel • Ethiopian Traffic Agency
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
