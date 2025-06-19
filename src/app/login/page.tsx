'use client';

import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 16 characters"),
});

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      result.error.errors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/users/login", formData);
      toast.success(res.data.message);
      setFormData({ email: "", password: "" });
      // Optionally redirect to dashboard here
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Toaster position="top-right" />
      <div className="text-2xl font-bold mb-4">Trip Buddy</div>
      <div className="flex flex-col items-center bg-white text-black shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h1>Login</h1>
        <label>Email:</label>
        <input onChange={handleChange} value={formData.email} className="p-4 border border-gray-300 rounded mb-4" type="email" name="email" />
        <label>Password:</label>
        <input onChange={handleChange} value={formData.password} className="p-4 border border-gray-300 rounded mb-4" type="password" name="password" />
        <button onClick={handleSubmit} disabled={loading} className="bg-blue-500 text-white rounded px-4 py-2">
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
