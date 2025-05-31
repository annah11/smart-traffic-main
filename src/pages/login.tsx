import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import lightImage from "@/images/light.jpg";
import backgroundImage from "@/images/background.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // fake login success
    navigate("/dashboard");
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
            Smart Traffic Control
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6 flex-1">
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">
              Email or Username
            </label>
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
                className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-400"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => alert("Redirect to reset flow")}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-500 text-xs mt-8">
          Powered by Ethiopian Traffic Agency
        </p>
      </div>
    </div>
  );
};

export default Login;
