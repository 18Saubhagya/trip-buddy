"use client";

import { useRouter } from "next/navigation"; 
import TravelInsights from "./components/TravelInsights";
import NewTripCard from "./components/NewTripCard";
import TripCalendar from "./components/TripCalendar";
import NextTripCard from "./components/NextTripCard";
import TripsTable from "./components/TripsTable";
import Navbar from "@/components/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<{id: String; username: string; email: string} | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {data} = await axios.get("/api/users/auth");
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                router.push("/login");
            }
        }

        fetchUser();
    }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
      <Navbar 
        userName={user?.username}
        userEmail={user?.email}
        // userAvatar="/path-to-avatar.jpg" // Optional
      />
      {/* Background glowing blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto p-6 space-y-10">
        {/* Insights */}
        <TravelInsights />

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: New Trip + Next Trip */}
          <div className="space-y-6">
            <NewTripCard />
            <NextTripCard />
          </div>

          {/* Right column: Calendar */}
          <div>
            <TripCalendar />
          </div>
        </div>

        {/* Trips Table */}
        <TripsTable />
      </div>
    </div>
  );
}
