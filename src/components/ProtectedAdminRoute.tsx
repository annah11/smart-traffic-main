// src/components/ProtectedAdminRoute.tsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ProtectedAdminRouteProps {
  children: JSX.Element;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Please log in first.");
        setAuthorized(false);
        setChecked(true);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          toast.error("User not found in Firestore.");
          setAuthorized(false);
        } else {
          const role = (userDoc.data().role || "").toUpperCase();
          if (role === "ADMIN") {
            setAuthorized(true);
          } else {
            toast.warning("Employee does not have access.");
            setAuthorized(false);
          }
        }
      } catch (err) {
        console.error("Error verifying role:", err);
        toast.error("Error checking user role.");
        setAuthorized(false);
      } finally {
        setChecked(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!checked) return null;

  if (!authorized) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedAdminRoute;
