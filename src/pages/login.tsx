import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import lightImage from "@/images/light.jpg";
import backgroundImage from "@/images/background.png";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmployeeEmail");
    const savedPassword = localStorage.getItem("rememberedEmployeePassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.warning("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const q = query(collection(db, "users"), where("uid", "==", uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("User not registered by admin.");
        return;
      }

      const userData = snapshot.docs[0].data();
      const role = (userData.role || "").toUpperCase();

      if (role !== "EMPLOYEE") {
        toast.error("Access denied. Not an EMPLOYEE.");
        return;
      }

      if (remember) {
        localStorage.setItem("rememberedEmployeeEmail", email);
        localStorage.setItem("rememberedEmployeePassword", password);
      } else {
        localStorage.removeItem("rememberedEmployeeEmail");
        localStorage.removeItem("rememberedEmployeePassword");
      }

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Login failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    navigate("/adminlogin");
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
          <img src={lightImage} alt="Traffic Light" className="w-20 h-20 object-cover mb-2" />
          <h1 className="text-white text-2xl font-semibold">Smart Traffic Control</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 flex-1">
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleAdminLogin}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Login as Admin
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Powered by Ethiopian Traffic Agency
        </p>
      </div>
    </div>
  );
};

export default Login;
