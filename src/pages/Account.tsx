import React, { useEffect, useRef, useState } from "react";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
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

// 🔁 Declare Firestore and Storage outside so ESLint won’t complain
const db = getFirestore();
const storage = getStorage();

export default function AccountPage() {
  const auth = getAuth();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState(auth.currentUser);
  const [role, setRole] = useState("N/A");
  const [createdAt, setCreatedAt] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.photoURL) setPhotoURL(u.photoURL);
    });
    return () => unsubscribe();
  }, []);

  // Load role and join time
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;

      try {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setRole(data.role || "N/A");
          setCreatedAt(
            user.metadata.creationTime
              ? new Date(user.metadata.creationTime).toLocaleString()
              : "Unknown"
          );
        } else {
          toast.warning("User info not found in Firestore.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [user?.email, user?.metadata?.creationTime]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });

      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await updateDoc(snapshot.docs[0].ref, {
          photoURL: downloadURL
        });
      }

      setPhotoURL(downloadURL);
      toast.success("Profile photo updated.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload.");
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
