'use client';

import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Mail, Lock, User, Eye, EyeOff, CircleCheck as CheckCircle } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 16 characters long"),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" };
        if (password.length < 10) return { strength: 50, label: "Fair", color: "bg-yellow-500" };
        if (password.length < 12) return { strength: 75, label: "Good", color: "bg-blue-500" };
        return { strength: 100, label: "Strong", color: "bg-green-500" };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
            <Toaster 
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#f1f5f9',
                        border: '1px solid #334155',
                    },
                }}
            />
            
            <div className="w-full max-w-md space-y-8">
                
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Trip Buddy</h1>
                    </div>
                    <p className="text-slate-400">Start your journey today</p>
                </div>

                
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                        <CardDescription className="text-slate-400">
                            Join thousands of travelers planning amazing adventures
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-200 font-medium">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pl-10 h-12 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200 font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pl-10 h-12 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pl-10 pr-10 h-12 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                
                                
                                {formData.password && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400">Password strength</span>
                                            <span className={`text-xs font-medium ${
                                                passwordStrength.color === 'bg-red-500' ? 'text-red-400' :
                                                passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-400' :
                                                passwordStrength.color === 'bg-blue-500' ? 'text-blue-400' :
                                                'text-green-400'
                                            }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                           
                            <div className="flex items-start space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-slate-400">
                                    By creating an account, you agree to our{" "}
                                    <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-400">
                                Already have an account?{" "}
                                <Link 
                                    href="/login" 
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-slate-400">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-400 text-sm">🗺️</span>
                        </div>
                        <p className="text-xs">Smart Planning</p>
                    </div>
                    <div className="text-slate-400">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-400 text-sm">💳</span>
                        </div>
                        <p className="text-xs">Budget Tracking</p>
                    </div>
                    <div className="text-slate-400">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-400 text-sm">👥</span>
                        </div>
                        <p className="text-xs">Share Trips</p>
                    </div>
                </div>
            </div>
        </div>
    );
}