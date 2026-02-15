import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { toast } from "react-toastify";
import backgroundImage from "@/images/background.png";
import { FirebaseError } from "firebase/app";
import { ArrowLeft } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getBackPath = () => {
    const from = (location.state as { from?: string })?.from;
    if (from === "admin") return "/adminlogin";
    return "/login";
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning("Please enter your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const continueUrl = `${window.location.origin}/login`;
      const actionCodeSettings = {
        url: continueUrl,
        handleCodeInApp: false,
      };

      try {
        await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      } catch (settingsError: unknown) {
        if (
          settingsError instanceof FirebaseError &&
          settingsError.code === "auth/unauthorized-domain"
        ) {
          await sendPasswordResetEmail(auth, email.trim());
        } else {
          throw settingsError;
        }
      }

      toast.success(
        "Reset email sent! Check your inbox and spam folder. The link expires in 1 hour."
      );
      setEmail("");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            toast.error("Please enter a valid email address.");
            break;
          case "auth/user-not-found":
            toast.error("No account found with this email.");
            break;
          case "auth/too-many-requests":
            toast.error("Too many attempts. Please try again later.");
            break;
          default:
            toast.error(error.message || "Failed to send reset email.");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
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
        <button
          type="button"
          onClick={() => navigate(getBackPath())}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleReset} className="space-y-6">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
          >
            {isSubmitting ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-4">
          Check your inbox and spam folder. Link expires in 1 hour.
        </p>
        <button
          type="button"
          onClick={() => navigate(getBackPath())}
          className="mt-4 text-center text-blue-400 hover:underline text-sm"
        >
          Return to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
