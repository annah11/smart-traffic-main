import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { toast } from "react-toastify";
import backgroundImage from "@/images/background.png";
import { FirebaseError } from "firebase/app";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning("Please enter your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent. Please check your inbox.");
      setEmail("");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
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
          You will receive a password reset link if the email exists.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
