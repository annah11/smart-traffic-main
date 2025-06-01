import React, { useState } from "react";
import { UserPlus } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Added employee:\nEmail: ${email}\nRole: ${role}`);
    // Firebase logic goes here later
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-6">
          <UserPlus className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white text-center">
            Add New Employee
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Employee Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@smart.gov"
              required
              className="w-full h-12 px-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-12 px-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Employee</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Temporary Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Generate password..."
              required
              className="w-full h-12 px-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
