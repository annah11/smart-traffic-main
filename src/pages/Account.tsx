import React, { useEffect, useRef, useState } from "react";
import { getAuth, updateProfile, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function AccountPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState("N/A");
  const [createdAt, setCreatedAt] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [uploading, setUploading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  // Track auth state and update local states
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setPhotoURL(u.photoURL || "");
        if (u.metadata.creationTime) {
          setCreatedAt(new Date(u.metadata.creationTime).toLocaleString());
        }
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch role using UID from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setRole(data.role || "N/A");
        } else {
          toast.warning("User info not found in Firestore.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [db, user?.uid]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      setPhotoURL(downloadURL);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileRef.current?.click();
  };

  if (!user) return <div className="p-4">Not logged in</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Avatar className="h-20 w-20">
            {photoURL && <AvatarImage src={photoURL} alt="Profile" />}
            <AvatarFallback>
              {user.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : photoURL
              ? "Change Profile Photo"
              : "Set Profile Photo"}
          </Button>

          <div className="text-center mt-2">
            <p className="text-lg font-semibold">{user.email}</p>
            <p className="text-sm text-muted-foreground">Role: {role}</p>
            <p className="text-sm text-muted-foreground">Joined: {createdAt}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
