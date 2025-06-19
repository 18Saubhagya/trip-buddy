'use client';

import { useState } from "react";
import axios from "axios";
import {z} from "zod";
import {toast, Toaster} from "react-hot-toast";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 16 characters long"),
});



export default function SignupPage() {
    const router = useRouter(); 
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
            result.error.errors.forEach((error) => {
                toast.error(error.message);
            });
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post("/api/users/signup", formData);
            toast.success(res.data.message);
            setFormData({ email: "", username: "", password: "" });
            router.push("/login"); // Redirect to login page after successful signup
            
        } catch (error) {
            toast.error("Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Toaster position="top-right" />
        <div className="text-2xl font-bold mb-4">Trip Buddy</div>
        <div className="flex flex-col items-center bg-white text-black shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
            <h1>Signup</h1>
                <label>
                    Username:
                </label>
                <input onChange={handleChange} className="p-4 border border-gray-300 rounded mb-4" id="username" type="text" name="username" />
                <br />
                <label>
                    Email:
                </label>
                <input onChange={handleChange} className="p-4 border border-gray-300 rounded mb-4" id="email" type="email" name="email" />
                <br />
                <label>
                    Password:
                </label>
                <input onChange={handleChange} className="p-4 border border-gray-300 rounded mb-4" id="password" type="password" name="password" />
                <br />
                <button onClick={handleSubmit} className="bg-blue-500 text-white rounded px-4 py-2" type="submit">Signup</button>
            </div>
        </div>
    );
}