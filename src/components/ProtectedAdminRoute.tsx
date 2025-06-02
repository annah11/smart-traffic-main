// src/components/ProtectedAdminRoute.tsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        toast.error("Please log in first.");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : null;

        if (role === "ADMIN") {
          setIsAuthorized(true);
        } else {
          toast.warning("Employee does not have access.");
          navigate("/dashboard");
        }
      } catch (err) {
        toast.error("Failed to verify role.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) return null;
  return <>{isAuthorized && children}</>;
};

export default ProtectedAdminRoute;
