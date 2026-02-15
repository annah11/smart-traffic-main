import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, enableNetwork } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import lightImage from "@/images/light.jpg";
import backgroundImage from "@/images/background.png";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fromState = location.state as { email?: string } | null;
    if (fromState?.email) {
      setEmail(fromState.email);
    }
    const savedEmail = localStorage.getItem("rememberedEmployeeEmail");
    const savedPassword = localStorage.getItem("rememberedEmployeePassword");
    if (savedEmail && savedPassword && !fromState?.email) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.warning("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      try {
        await enableNetwork(db);
      } catch {
        // Ignore - will retry with operations
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userDocRef = doc(db, "users", uid);
      let userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        try {
          await setDoc(userDocRef, {
            uid,
            name: userCredential.user.displayName || email.split("@")[0],
            email: userCredential.user.email,
            role: "EMPLOYEE",
            createdAt: new Date(),
          });
          userDoc = await getDoc(userDocRef);
        } catch {
          toast.error("Account exists but profile missing. Try Create Account or contact support.");
          return;
        }
      }

      const userData = userDoc.exists() ? userDoc.data() : null;
      if (!userData) {
        toast.error("User not found. Please register first.");
        return;
      }

      const role = (userData.role || "").toUpperCase();

      if (role !== "EMPLOYEE") {
        toast.error("Access denied. Not an EMPLOYEE. Use Admin Login if you are an admin.");
        return;
      }

      if (remember) {
        localStorage.setItem("rememberedEmployeeEmail", email);
        localStorage.setItem("rememberedEmployeePassword", password);
      } else {
        localStorage.removeItem("rememberedEmployeeEmail");
        localStorage.removeItem("rememberedEmployeePassword");
      }

      toast.success("Login successful! Redirecting to dashboard...", {
        autoClose: 2500,
        position: "top-center",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (error instanceof FirebaseError && error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password. Try again or use Forgot password.");
      } else if (message.includes("offline") || message.includes("OFFLINE")) {
        toast.error("No internet connection. Please check your network and try again.");
      } else if (message.includes("permission") || message.includes("PERMISSION_DENIED")) {
        toast.error("Firestore permission denied. See FIREBASE_SETUP.md - deploy Firestore rules.");
      } else {
        toast.error("Login failed: " + message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    navigate("/adminlogin");
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 h-8 min-w-0 px-2"
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
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
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/forgot-password", { state: { from: "user" } })}
              className="text-blue-400 hover:text-blue-300 hover:underline p-0 h-auto font-normal"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 min-h-[44px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/signup")}
            className="w-full h-12 min-h-[44px] bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition"
          >
            Create Account
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleAdminLogin}
            className="w-full h-12 min-h-[44px] border-gray-500 bg-transparent hover:bg-gray-700/50 text-white font-semibold rounded-lg transition"
          >
            Login as Admin
          </Button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Powered by Ethiopian Traffic Agency
        </p>
      </div>
    </div>
  );
};

export default Login;
