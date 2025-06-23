"use client";

import { useRouter } from "next/navigation"; 

export default function DashboardPage() {
    const router = useRouter();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
            <button
                onClick={() => router.push('/dashboard/new-trip')}
                className="bg-blue-600 text-white px-6 py-3 rounded shadow"
            >
                + New Trip
            </button>
        </div>
    );
}