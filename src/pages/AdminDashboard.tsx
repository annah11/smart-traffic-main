import React, { useState } from "react";
import { UserPlus, Users, Trash2 } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  password: string;
}

const AdminDashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const newUser: User = { name, email, role, password };
    setUsers((prev) => [...prev, newUser]);

    setName("");
    setEmail("");
    setRole("Employee");
    setPassword("");
  };

  const handleDelete = (index: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setUsers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 py-10 flex flex-col items-center gap-12">
      {/* Header */}
      <div className="flex items-center gap-2">
        <UserPlus className="text-blue-400 w-6 h-6" />
        <h2 className="text-2xl font-bold">Admin Dashboard – Add User</h2>
      </div>

      {/* Form */}
      <div className="w-full max-w-md bg-[#1E293B] p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Temporary Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. pass123"
              className="w-full h-12 px-4 bg-[#334155] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users Table */}
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
                <tr key={idx} className="border-b border-gray-700 hover:bg-[#334155]">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">{user.password}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleDelete(idx)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="Delete user"
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
