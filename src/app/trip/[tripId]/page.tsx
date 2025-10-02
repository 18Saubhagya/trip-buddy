"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

type TripDetail = {
    id: number;
    tripName: string;
    startDate: string;
    endDate: string;
    status: string;
    country: string | null;
    state: string | null;
    itinerary: {
        cities: string[];
        interests: string[];
        generatedPlan: any;
    };
};

export default function TripPage() {
    const params = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState<TripDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.tripId) return;
        const fetchTrip = async () => {
            try {
                const { data } = await axios.get(`/api/trips/${params.tripId}`);
                setTrip(data.trip);
                console.log("Fetched trip:", data.trip);
            } catch (error) {
                console.error("Error fetching trip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [params?.tripId]);

    if (loading) {
        return <p className="text-gray-400 p-6">Loading trip details...</p>;
    }

    if (!trip) {
        return (
        <div className="p-6 text-center text-gray-400">
            <h2 className="text-xl font-semibold text-white mb-2">Trip not found</h2>
            <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            >
            Go Back
            </Button>
        </div>
        );
    }

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
        <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{trip.tripName}</h1>
            <Badge className="bg-blue-600/80 text-white shadow-md px-3 py-1">
                {trip.status}
            </Badge>
            </div>

            
            <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>
                    {trip.state ? `${trip.state}, ` : ""}
                    {trip.country}
                </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="h-5 w-5 text-purple-400" />
                <span>
                    {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </span>
                </div>
            </CardContent>
            </Card>

           
            <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="text-white">Itinerary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <h4 className="text-sm text-gray-400">Cities</h4>
                <p className="text-white">{trip.itinerary.cities.join(", ")}</p>
                </div>
                <div>
                <h4 className="text-sm text-gray-400">Interests</h4>
                <p className="text-white">{trip.itinerary.interests}</p>
                </div>
                <div>
                <h4 className="text-sm text-gray-400">Generated Plan</h4>
                <pre className="bg-slate-800 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                    {JSON.stringify(trip.itinerary.generatedPlan, null, 2)}
                </pre>
                </div>
            </CardContent>
            </Card>

            
            <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 border-slate-600 text-gray-300 hover:bg-slate-800"
            >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
            </Button>
        </div>
        </div>
    );
}
