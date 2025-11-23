"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import axios from "axios";

const statusColors: Record<string, string> = {
    new: "bg-blue-600/80 text-white",
    in_progress: "bg-yellow-600/80 text-white",
    completed: "bg-green-600/80 text-white",
    cancelled: "bg-red-600/80 text-white",
};

type Trip = {
    id: number;
    tripName: string;
    startDate: string;
    endDate: string;
    status: string;
    country: string | null;
    state: string | null;
};

export default function TripCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const {data} = await axios.get("/api/dashboard/trip-calendar");
                setTrips(data.trips);
                console.log("Fetched trips for calendar:", data.trips);
                
            } catch (error) {
                console.error("Error fetching trips for calendar:", error);
            }
        }

        fetchTrips();
    }, [])

    // Generate all trip dates
    const tripDates = trips.flatMap((trip) => {
        const dates = [];
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const current = new Date(start);

        while (current <= end) {
            dates.push({ date: new Date(current), trip });
            current.setDate(current.getDate() + 1);
        }
        return dates;
    });

    const dateColors: Record<string, string> = {};
    tripDates.forEach(({ date, trip }) => {
        dateColors[date.toDateString()] = statusColors[trip.status] ?? "bg-slate-600";
    });

    const modifiers = { tripDates: tripDates.map((td) => td.date) };

    const modifiersStyles = {
        tripDates: {
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            color: "white",
            borderRadius: "6px",
            fontWeight: "bold",
        },
    };

    if (trips.length === 0) {
        return (
        <Card className="bg-slate-900/70 border border-slate-700 rounded-xl shadow-lg text-white">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <CalendarDays className="h-5 w-5 text-blue-400" />
                Trip Calendar
            </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center shadow-inner">
                <CalendarDays className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="font-medium text-white">No trips planned yet</h3>
            <p className="text-sm text-gray-400">
                Your trip dates will appear here once you plan a trip
            </p>
            <button className="text-blue-400 hover:underline text-sm">
                Plan a Trip
            </button>
            </CardContent>
        </Card>
        );
    }

    return (
        <Card className="bg-slate-900/70 border border-slate-700 rounded-xl shadow-lg text-white">
        
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-200">
            <CalendarDays className="h-5 w-5 text-blue-400" />
            Trip Calendar
            </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-5 space-y-4">
            
            <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="scale-90 origin-top rounded-lg border border-slate-700 bg-slate-800 text-gray-200 shadow-inner"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
            />
            </div>

            
            <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">
                Upcoming {trips.length} Trip(s)
            </h4>
            <div className="flex flex-wrap gap-2">
                {trips.map((trip) => (
                <div
                key={trip.id}
                className={`${statusColors[trip.status]} text-white shadow-md px-3 py-2 rounded-lg text-xs leading-snug`}
                >
                    <div className="font-semibold">{trip.tripName}</div>
                    <div className="text-[10px]">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </div>
                </div>
                ))}
            </div>
            </div>
        </CardContent>
        </Card>
    );
}
