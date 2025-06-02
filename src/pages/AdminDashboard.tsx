import React, { useState, useEffect } from "react";
import { UserPlus, Users, Trash2, Pencil } from "lucide-react";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  password: string;
}

const AdminDashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: User[] = [];
      querySnapshot.forEach((docSnap) => {
        userList.push({ id: docSnap.id, ...docSnap.data() } as User);
      });
      setUsers(userList);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validatePassword = (pw: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(pw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role || !password) {
      toast.warning("Please fill in all fields.");
      return;
    }

    if (!validatePassword(password)) {
      toast.warning(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const upperRole = role.toUpperCase();

      if (editId) {
        await updateDoc(doc(db, "users", editId), {
          name,
          email,
          role: upperRole,
          password,
        });
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editId ? { ...user, name, email, role: upperRole, password } : user
          )
        );
        setEditId(null);
        toast.success("User updated successfully.");
      } else {
        const newDoc = await addDoc(collection(db, "users"), {
          name,
          email,
          role: upperRole,
          password,
        });

        setUsers((prev) => [
          ...prev,
          { id: newDoc.id, name, email, role: upperRole, password },
        ]);
        toast.success("User added successfully.");
      }

      setName("");
      setEmail("");
      setRole("EMPLOYEE");
      setPassword("");
    } catch (error) {
      toast.error("Error: " + (error as Error).message);
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id || null);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword(user.password);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Error deleting user.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 py-10 flex flex-col items-center gap-12">
      <div className="flex items-center gap-2">
        <UserPlus className="text-blue-400 w-6 h-6" />
        <h2 className="text-2xl font-bold">Admin Dashboard – {editId ? "Edit User" : "Add User"}</h2>
      </div>

      <div className="w-full max-w-md bg-[#1E293B] p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Temporary Password"
            className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            {editId ? "Update User" : "Add User"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-5xl bg-[#1E293B] p-6 rounded-xl shadow-md overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-green-400 w-5 h-5" />
          <h3 className="text-xl font-semibold">Registered Users</h3>
        </div>
        <table className="w-full table-auto text-left text-sm text-gray-300">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Password</th>
              <th className="py-2 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No users registered yet.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id || idx} className="border-b border-gray-700 hover:bg-[#334155]">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">{user.password}</td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-yellow-400 hover:text-yellow-600 transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="Delete"
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
