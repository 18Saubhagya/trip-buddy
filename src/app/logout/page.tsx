"use client";

import axios from "axios";
import { useEffect } from "react";
import {toast} from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();
    useEffect(() => {
        const logout = async () => {
            try {
                const res = await axios.post("/api/users/logout");
                if (res.status === 200) {
                    toast.success("Logout successful.");
                    router.push("/login");
                }
            } catch (error) {
                toast.error("Logout failed.");
                console.error("Logout error:", error);
            }
        };
        logout();
    }, [router]);
    return (
        <div></div>
    );
}