import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, deleteUser, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

import lightImage from "@/images/light.jpg";
import backgroundImage from "@/images/background.png";

const UserSignup: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
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
      toast.error("Passwords do not match");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Password does not meet the required criteria.");
      return;
    }

    try {
      setLoading(true);
      try {
        await signOut(auth);
      } catch {
        // No user signed in, ignore
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: fullName,
          email: user.email,
          role: "EMPLOYEE",
          createdAt: new Date(),
        });
      } catch (firestoreError) {
        await deleteUser(user);
        throw firestoreError;
      }

      toast.success("Account created successfully! Redirecting to sign in...", {
        autoClose: 2500,
        position: "top-center",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: unknown) {
      const err = error as Error;
      const msg = err.message || String(error);
      console.error("Signup Error:", msg);
      if (msg.includes("auth/email-already-in-use") || msg.includes("EMAIL_EXISTS")) {
        setEmailExists(true);
        toast.error("This email is already registered. Sign in below.");
      } else if (msg.includes("permission-denied") || msg.includes("PERMISSION_DENIED")) {
        toast.error("Firestore permission denied. Check Firebase Console > Firestore > Rules.");
      } else {
        toast.error("Signup failed: " + msg);
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
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition self-start p-0 h-auto min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex flex-col items-center justify-center mb-8">
          <img
            src={lightImage}
            alt="Traffic Light"
            className="w-20 h-20 object-cover mb-2"
          />
          <h1 className="text-white text-2xl font-semibold">User Registration</h1>
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
            <label className="text-gray-300 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailExists(false);
              }}
              placeholder="you@example.com"
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
            <Button
              type="button"
              variant="link"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-yellow-300 hover:text-yellow-400 p-0 h-auto font-normal"
            >
              {showPassword ? "Hide Passwords" : "Show Passwords"}
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 min-h-[44px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        {emailExists && (
          <div className="mt-4 p-3 bg-amber-900/50 rounded-lg border border-amber-600/50">
            <p className="text-amber-200 text-sm mb-2">This email is already registered.</p>
            <Button
              type="button"
              onClick={() => navigate("/login", { state: { email } })}
              className="w-full h-11 min-h-[44px] bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium"
            >
              Go to Sign in
            </Button>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 hover:underline p-0 h-auto font-normal inline"
          >
            Sign in
          </Button>
        </p>

        <p className="text-center text-gray-500 text-xs mt-4">
          Powered by Ethiopian Traffic Agency
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
