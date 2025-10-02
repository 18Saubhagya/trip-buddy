"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation"; 

interface Trip {
	tripId: number;
	tripName: string;
	country: string;
	state: string;
	startDate: string;
	endDate: string;
	status: string;
	itinerary: {
		cities: string[];
		interests: string;
	};
	image?: string;
}

function calculateDaysUntil(date: Date): number {
	const today = new Date();
	const diffTime = date.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

export default function NextTripCard() {
    const router = useRouter();
	const [nextTrip, setNextTrip] = useState<Trip | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchNextTrip = async () => {
			try {
				const {data} = await axios.get("/api/dashboard/next-trip");
                setNextTrip(data.nextTrip);
                console.log("Fetched next trip:", data.nextTrip);
			} catch (error) {
				console.error("Error fetching next trip:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchNextTrip();
	}, []);

    if (loading) {
        return (
            <Card className="p-6 text-center text-gray-400">Loading next trip...</Card>
        );
    }

    if (!nextTrip) {
        return (
            <Card className="p-6 text-center text-gray-400">
                No upcoming trips found.
            </Card>
        );
    }

    const start = new Date(nextTrip.startDate);
    const end = new Date(nextTrip.endDate);

	const daysUntil = calculateDaysUntil(start);
	const formatDate = (date: Date) =>
		date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});

    const destination = `${nextTrip.itinerary.cities}${
        nextTrip.state ? `, ${nextTrip.state}` : ""
    }${nextTrip.country ? `, ${nextTrip.country}` : ""}`;

	return (
		<Card className="overflow-hidden bg-slate-900/70 border border-slate-700 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition">
			
			<div className="relative h-32 overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop"
					alt={destination}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

				{/* Status Badge */}
				<Badge className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md px-3 py-1 text-xs rounded-full flex items-center gap-1">
					<Clock className="h-3 w-3" />
					{daysUntil > 0
						? `In ${daysUntil} days`
						: daysUntil === 0
							? "Today!"
							: "Ongoing"}
				</Badge>
			</div>

			
			<CardContent className="p-5 space-y-3">
				<div>
					<p className="text-xs uppercase tracking-wide text-gray-400">
						Your Next Trip
					</p>
					<h3 className="font-bold text-lg text-white">{nextTrip.tripName}</h3>
				</div>

				<div className="flex items-center gap-2 text-sm text-gray-300">
					<MapPin className="h-4 w-4 text-blue-400" />
					<span>{destination}</span>
				</div>

				<div className="flex items-center gap-2 text-sm text-gray-300">
					<Calendar className="h-4 w-4 text-purple-400" />
					<span>
						{formatDate(start)} –{" "}
						{formatDate(end)}, {start.getFullYear()}
					</span>
				</div>

				
				<Button
					className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md"
					onClick={() => router.push(`/trip/${nextTrip.tripId}`)}
				>
					View Trip
					<ArrowRight className="h-4 w-4 ml-2" />
				</Button>
			</CardContent>
		</Card>
	);
}