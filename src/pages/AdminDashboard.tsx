import React, { useState, useEffect } from "react";
import { UserPlus, Users, Trash2, Pencil } from "lucide-react";
import { db, firebaseConfig } from "@/firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: User[] = [];
      querySnapshot.forEach((docSnap) => {
        userList.push({ id: docSnap.id, ...(docSnap.data() as User) });
      });
      setUsers(userList);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast.error("Error fetching users: " + errMsg);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role || (!editId && !password)) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const upperRole = role.toUpperCase();
    setLoading(true);

    try {
      if (editId) {
        await updateDoc(doc(db, "users", editId), {
          name,
          email,
          role: upperRole,
        });
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editId ? { ...user, name, email, role: upperRole } : user
          )
        );
        toast.success("User updated.");
        setEditId(null);
      } else {
        const appName = "SecondaryApp" + new Date().getTime();
        const secondaryApp = initializeApp(firebaseConfig, appName);
        const secondaryAuth = getAuth(secondaryApp);
        const userCred = await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          password
        );

        await setDoc(doc(db, "users", userCred.user.uid), {
          uid: userCred.user.uid,
          name,
          email,
          role: upperRole,
          createdAt: new Date().toISOString(),
        });

        await signOut(secondaryAuth);
        toast.success("User successfully registered and can now log in.");
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("EMPLOYEE");
      fetchUsers();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast.error("Error: " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id || null);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("User deleted.");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast.error("Error deleting user: " + errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 py-10 flex flex-col items-center gap-12">
      <div className="flex items-center gap-2">
        <UserPlus className="text-blue-400 w-6 h-6" />
        <h2 className="text-2xl font-bold">
          Admin Dashboard – {editId ? "Edit User" : "Add User"}
        </h2>
      </div>

      <div className="w-full max-w-md bg-[#1E293B] p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full h-12 px-4 bg-[#334155] text-white rounded-md"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-12 px-4 bg-[#334155] text-white rounded-md"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-12 px-4 bg-[#334155] text-white rounded-md"
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {!editId && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-12 px-4 bg-[#334155] text-white rounded-md"
              required
            />
          )}
          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
            disabled={loading}
          >
            {loading ? (editId ? "Updating..." : "Adding...") : editId ? "Update User" : "Add User"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-5xl bg-[#1E293B] p-6 rounded-xl shadow-md overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-green-400 w-5 h-5" />
          <h3 className="text-xl font-semibold">Registered Users</h3>
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md h-10 mb-4 px-4 bg-[#334155] text-white rounded-md"
        />

        <table className="w-full table-auto text-left text-sm text-gray-300">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No users registered yet.
                </td>
              </tr>
            ) : (
              users
                .filter((user) =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user, idx) => (
                  <tr
                    key={user.id || idx}
                    className="border-b border-gray-700 hover:bg-[#334155]"
                  >
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-yellow-400 hover:text-yellow-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
