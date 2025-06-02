import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

import lightImage from "@/images/light.jpg";
import backgroundImage from "@/images/background.png";

const AdminSignup: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidPassword = (pwd: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;"'<>,.?/~`\\|-]).{8,}$/;
    return regex.test(pwd);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!isValidPassword(value)) {
      setPasswordError(
        "Password must be 8+ characters and include uppercase, lowercase, number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!isValidPassword(password)) {
      alert("Password does not meet the required criteria.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: fullName,
        email: user.email,
        role: "admin",
        createdAt: new Date(),
      });

      alert("✅ Admin account created successfully!");
      navigate("/adminlogin");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("❌ Signup Error:", err.message);
      alert(`Signup failed: ${err.message}`);
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
          <h1 className="text-white text-2xl font-semibold">Admin Registration</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full h-12 px-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smart.gov"
              required
              className="w-full h-12 px-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-12 px-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordError && (
              <p className="text-red-400 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={!isValidPassword(password)}
              className={`w-full h-12 px-4 rounded-lg focus:outline-none ${
                isValidPassword(password)
                  ? "bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-600 opacity-50 text-gray-300 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-yellow-300 underline hover:text-yellow-400 transition"
            >
              {showPassword ? "🙈 Hide Passwords" : "👁️ Show Passwords"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-400">Already registered?</p>
          <button
            onClick={() => navigate("/adminlogin")}
            className="text-blue-400 hover:underline"
          >
            Go to Login
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Ethiopian Traffic Agency
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
