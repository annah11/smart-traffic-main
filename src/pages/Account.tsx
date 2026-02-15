import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth, db, storage } from "@/firebase/config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Camera, Pencil, ArrowLeft } from "lucide-react";

interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  role: string;
  country: string;
  city: string;
  postalCode: string;
}

const defaultProfile: UserProfile = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phoneNumber: "",
  role: "N/A",
  country: "",
  city: "",
  postalCode: "",
};

export default function AccountPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [photoURL, setPhotoURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setPhotoURL(u.photoURL || "");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const nameParts = (data.name || "").trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          setProfile({
            firstName,
            lastName,
            dateOfBirth: data.dateOfBirth || "",
            email: data.email || user.email || "",
            phoneNumber: data.phoneNumber || "",
            role: data.role || "N/A",
            country: data.country || "",
            city: data.city || "",
            postalCode: data.postalCode || "",
          });
        } else {
          setProfile((prev) => ({
            ...prev,
            email: user.email || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [user?.uid, user?.email]);

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
      e.target.value = "";
    }
  };

  const triggerFileInput = () => {
    if (!uploading) fileRef.current?.click();
  };

  const handleSavePersonal = async () => {
    if (!user?.uid) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        dateOfBirth: profile.dateOfBirth,
        phoneNumber: profile.phoneNumber,
      });
      toast.success("Personal information updated!");
      setEditingPersonal(false);
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  const handleSaveAddress = async () => {
    if (!user?.uid) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        country: profile.country,
        city: profile.city,
        postalCode: profile.postalCode,
      });
      toast.success("Address updated!");
      setEditingAddress(false);
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  if (!user) return <div className="p-4 bg-background text-foreground">Not logged in</div>;

  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || user.email?.split("@")[0] || "User";
  const location = [profile.city, profile.country].filter(Boolean).join(", ") || "—";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4 sm:space-y-6 bg-slate-100 dark:bg-background min-h-screen text-foreground">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
      </div>

      {/* Profile Header Card */}
      <Card className="rounded-xl shadow-sm bg-card text-card-foreground overflow-hidden">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            className="relative cursor-pointer group"
            onClick={triggerFileInput}
          >
            <div className="h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-semibold text-muted-foreground">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center border-2 border-card shadow-md group-hover:bg-accent transition">
              <Camera className="h-4 w-4 text-secondary-foreground" />
            </div>
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs">Uploading...</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
            <p className="text-muted-foreground mt-1">{profile.role}</p>
            <p className="text-muted-foreground text-sm">{location}</p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card className="rounded-xl shadow-sm bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          {editingPersonal ? (
            <Button
              size="sm"
              onClick={handleSavePersonal}
              className="bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              Save
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingPersonal(true)}
              className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950/50"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">First Name</label>
              {editingPersonal ? (
                <input
                  value={profile.firstName}
                  onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-lg font-medium bg-background text-foreground"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.firstName || "—"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Last Name</label>
              {editingPersonal ? (
                <input
                  value={profile.lastName}
                  onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-lg font-medium bg-background text-foreground"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.lastName || "—"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Date of Birth</label>
              {editingPersonal ? (
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-lg font-medium bg-background text-foreground"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.dateOfBirth || "—"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email Address</label>
              <p className="font-semibold text-foreground">{profile.email || "—"}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Phone Number</label>
              {editingPersonal ? (
                <input
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile((p) => ({ ...p, phoneNumber: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-lg font-medium bg-background text-foreground"
                  placeholder="(+1) 123 456-7890"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.phoneNumber || "—"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">User Role</label>
              <p className="font-semibold text-foreground">{profile.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card className="rounded-xl shadow-sm bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-lg font-semibold text-foreground">Address</h3>
          {editingAddress ? (
            <Button
              size="sm"
              onClick={handleSaveAddress}
              className="bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              Save
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingAddress(true)}
              className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950/50"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Country</label>
              {editingAddress ? (
                <input
                  value={profile.country}
                  onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-lg font-medium bg-background text-foreground"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.country || "—"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">City</label>
              {editingAddress ? (
                <input
                  value={profile.city}
                  onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-lg font-medium bg-background text-foreground"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.city || "—"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Postal Code</label>
              {editingAddress ? (
                <input
                  value={profile.postalCode}
                  onChange={(e) => setProfile((p) => ({ ...p, postalCode: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-lg font-medium bg-background text-foreground"
                />
              ) : (
                <p className="font-semibold text-foreground">{profile.postalCode || "—"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
