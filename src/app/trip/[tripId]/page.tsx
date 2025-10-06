"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Clock, Calendar, ArrowLeft, Users, Compass, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

type TripDetail = {
    id: number;
    tripName: string;
    startDate: string;
    endDate: string;
    status: string;
    country: string | null;
    state: string | null;
    itinerary: {
        id: number;
        cities: string[];
        interests: string;
        generatedPlan: any;
        generateStatus: string;
    };
};

export default function TripPage() {
    const params = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState<TripDetail | null>(null);
    const [loading, setLoading] = useState(true);
    let toggle = false;

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (!params?.tripId) return;
        const fetchTrip = async () => {
            try {
                const { data } = await axios.get(`/api/trips/${params.tripId}`);
                setTrip(data.trip);

                const itineraryStatus = data.trip?.itinerary?.generateStatus || "unknown";
                console.log("Itinerary generation status:", itineraryStatus);
                console.log("Fetched trip:", data.trip);
                if (itineraryStatus === "completed" || itineraryStatus === "failed") {
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error("Error fetching trip:", error);
                clearInterval(intervalId);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();

        intervalId = setInterval(fetchTrip, 10000);
        return () => clearInterval(intervalId);
    }, [params?.tripId, toggle]);

    const [isRegenerating, setIsRegenerating] = useState(false);

    const handleRegenerate = async () => {
        if (!trip?.itinerary || isRegenerating) return;
        setIsRegenerating(true);
        try {
            const res = await axios.post(`/api/trips/${trip.id}/regenerate`, {
                itineraryId: trip.itinerary.id,
            });
            toast.success(res.data.message);
            toggle = !toggle;
            console.log("Regeneration triggered:", res.data);
        } catch (error) {
            console.error("Failed to regenerate:", error);
        } finally {
            setIsRegenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 text-lg">Loading your trip details...</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                        <Compass className="w-10 h-10 text-slate-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Trip Not Found</h2>
                        <p className="text-slate-400">We couldn't find the trip you're looking for.</p>
                    </div>
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 transition-all"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const addDaysAndFormat = (dateStr: string, days: number) => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            });
    };

    const calculateDuration = () => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return days;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "ongoing":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "upcoming":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            default:
                return "bg-slate-500/20 text-slate-400 border-slate-500/30";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className="mb-8 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Button>

                    <div className="space-y-8">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-20 blur-xl"></div>
                            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent leading-tight">
                                                    {trip.tripName}
                                                </h1>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Badge className={`${getStatusColor(trip.status)} border px-3 py-1 text-sm font-medium`}>
                                                        {trip.status}
                                                    </Badge>
                                                    <span className="text-slate-500">•</span>
                                                    <span className="text-slate-400 text-sm">
                                                        {calculateDuration()} {calculateDuration() === 1 ? "day" : "days"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-800">
                                    <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Location</p>
                                            <p className="text-white font-medium mt-0.5">
                                                {trip.state ? `${trip.state}, ` : ""}
                                                {trip.country}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Duration</p>
                                            <p className="text-white font-medium mt-0.5">
                                                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-800/50 hover:border-slate-700/50 transition-all shadow-xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <CardTitle className="text-white text-lg">Cities to Explore</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {trip.itinerary.cities.map((city, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="bg-emerald-500/5 border-emerald-500/20 text-emerald-300 px-3 py-1.5 hover:bg-emerald-500/10 transition-colors"
                                            >
                                                {city}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-800/50 hover:border-slate-700/50 transition-all shadow-xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-pink-500/10 rounded-lg flex items-center justify-center">
                                            <Users className="h-4 w-4 text-pink-400" />
                                        </div>
                                        <CardTitle className="text-white text-lg">Interests</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {trip.itinerary.interests.split(",").map((interest, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="bg-pink-500/5 border-pink-500/20 text-pink-300 px-3 py-1.5 hover:bg-pink-500/10 transition-colors"
                                            >
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-800/50 shadow-xl">
                            <CardHeader className="pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                        <Compass className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-2xl">Your Itinerary</CardTitle>
                                        <p className="text-slate-400 text-sm mt-1">Day-by-day travel plan</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                {trip.itinerary.generatedPlan?.days?.length ? (
                                    <Accordion type="single" collapsible className="w-full space-y-3">
                                        {trip.itinerary.generatedPlan.days.map((day: any, i: number) => (
                                            <AccordionItem
                                                key={i}
                                                value={`day-${i}`}
                                                className="border border-slate-800/50 rounded-xl overflow-hidden bg-slate-800/20 hover:border-slate-700/50 transition-colors"
                                            >
                                                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                                            <span className="text-blue-400 font-bold text-lg">{day.day}</span>
                                                        </div>
                                                        <div className="text-left">
                                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                                Day {day.day} - {addDaysAndFormat(trip.startDate, day.day - 1)}
                                                            </h3>
                                                            <p className="text-sm text-slate-400">
                                                                {day.places.length} {day.places.length === 1 ? "destination" : "destinations"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-6 pb-6">
                                                    <div className="space-y-4 pt-2">
                                                        {day.places.map((place: any, j: number) => (
                                                            <div
                                                                key={j}
                                                                className="relative group"
                                                            >
                                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/0 via-cyan-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-cyan-600/20 group-hover:to-blue-600/20 rounded-xl transition-all duration-300 blur-sm"></div>
                                                                <div className="relative p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 group-hover:border-slate-600/50 shadow-lg transition-all">
                                                                    <div className="flex items-start gap-3 mb-3">
                                                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                            <span className="text-blue-400 font-bold text-sm">{j + 1}</span>
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <h4 className="font-bold text-white text-lg leading-tight group-hover:text-blue-300 transition-colors">
                                                                                {place.name}
                                                                            </h4>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2.5 ml-11">
                                                                        <div className="flex items-center gap-2.5 text-sm">
                                                                            <div className="w-6 h-6 bg-cyan-500/10 rounded-md flex items-center justify-center">
                                                                                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                                                                            </div>
                                                                            <span className="text-slate-300">{place.timeToSpend}</span>
                                                                        </div>
                                                                        <div className="flex items-start gap-2.5 text-sm">
                                                                            <div className="w-6 h-6 bg-emerald-500/10 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                                                                            </div>
                                                                            <span className="text-slate-300 leading-relaxed">{place.address}</span>
                                                                        </div>
                                                                        <div className="pt-2 mt-3 border-t border-slate-700/50">
                                                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                                                {place.thingsToDo}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Compass className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <p className="text-slate-400">No itinerary generated yet.</p>
                                        <p className="text-slate-500 text-sm mt-1">Your personalized plan will appear here soon.</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2 pt-6 border-t border-slate-700/50">
                                {(trip.itinerary.generateStatus === "completed" || trip.itinerary.generateStatus === "failed") && (
                                    <div className="flex justify-center mt-6">
                                        <Button
                                        onClick={handleRegenerate}
                                        disabled={isRegenerating}
                                        className={`relative overflow-hidden px-6 py-2 text-white font-medium rounded-xl transition-all
                                            ${isRegenerating
                                            ? "bg-slate-700 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25"
                                            }`}
                                        >
                                        {isRegenerating ? (
                                            <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Regenerating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-white" />
                                            Re-Generate Itinerary
                                            </span>
                                        )}
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
