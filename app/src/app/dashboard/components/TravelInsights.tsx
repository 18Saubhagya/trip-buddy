"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, MapPin, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

type monthlyTrip = {
    month: string;
    tripCount: number;
};


type budgetData = {
    tripName: string;
    budget: number;
};

type stats = {
    totalDays: number;
    statesVisited: number;
    totalBudget: number;
    avgDuration: number;
};

export default function TravelInsights() {
    const [monthlyTripsData, setMonthlyTripsData] = useState<monthlyTrip[]>([]);
    const [budgetDistributionData, setBudgetDistributionData] = useState<budgetData[]>([]);
    const [statsData, setStatsData] = useState<stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const {data} = await axios.get("/api/dashboard/travel-insights");
                console.log("Fetched travel insights:", data);
                setStatsData(data.stats);
                setMonthlyTripsData(data.monthlyTrips);
                setBudgetDistributionData(data.budgetQueryTrip);
            } catch (error) {
                console.error("Error fetching travel insights:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchInsights();

    }, [])

    if (loading) {
        return (
            <Card className="p-6 text-center text-gray-400">
                Loading travel insights...
            </Card>
        );
    }

    const hasData = (!statsData || monthlyTripsData.length === 0 || budgetDistributionData.length === 0) ? false : true; 
    if (!hasData) {
        return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Travel Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-300">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="font-medium mb-2 text-white">No travel data yet</h3>
                <p className="text-sm text-gray-400">
                Your travel stats will appear here once you plan trips
                </p>
            </CardContent>
            </Card>

            <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-300">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="font-medium mb-2 text-white">Start your journey</h3>
                <p className="text-sm text-gray-400">
                Plan your first trip to see detailed analytics
                </p>
            </CardContent>
            </Card>
        </div>
        );
    }

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const tripMap: Record<number, number> = {};
    monthlyTripsData.forEach(m => {
        tripMap[parseInt(m.month)] = m.tripCount; 
    });

    const monthlyTripsCard = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        trips: tripMap[i + 1] ?? 0, 
    }));

    console.log("Monthly Trips Card Data:", monthlyTripsCard);

    const colors = ["#3B82F6", "#10B981", "#EC4899", "#F59E0B", "#8B5CF6", "#06B6D4", "#F97316", "#14B8A6"];
    const budgetDistributionCard = budgetDistributionData.map((t, i) => ({
        destination: t.tripName,
        budget: t.budget,
        color: colors[i % colors.length],
    }));

    const statsCard = [
        {
            title: "Total Days Traveled",
            value: statsData?.totalDays.toString(),
            subtitle: `Across ${monthlyTripsData.length} trips`,
            icon: Calendar,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "States Visited",
            value: statsData?.statesVisited.toString(),
            subtitle: "This year",
            icon: MapPin,
            color: "from-cyan-500 to-cyan-600",
        },
        {
            title: "Total Budget Spent",
            value: `$${statsData?.totalBudget.toLocaleString()}`,
            subtitle: "All time",
            icon: DollarSign,
            color: "from-green-500 to-green-600",
        },
        {
            title: "Average Trip Duration",
            value: statsData?.avgDuration.toFixed(1),
            subtitle: "Days per trip",
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
        },
    ];

    return (
        <div className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCard.map((stat, index) => {
            const Icon = stat.icon;
            return (
                <Card
                key={index}
                className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl hover:shadow-xl hover:shadow-blue-500/20 transition"
                >
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.subtitle}</p>
                    </div>
                    <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md`}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    </div>
                </CardContent>
                </Card>
            );
            })}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Trips per Month
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                config={{ trips: { label: "Trips", color: "var(--chart-1)" } }}
                className="h-64"
                >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTripsCard}>
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="trips" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            </Card>

            
            <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl"> 
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-green-400" />
                Budget by Trip
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                config={{ budget: { label: "Budget" } }}
                className="h-64"
                >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={budgetDistributionCard}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="budget"
                        label={({ destination, percent }) =>
                        `${destination} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                    >
                        {budgetDistributionCard.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <ChartTooltip
                        content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg text-white">
                                <p className="font-medium">{data.destination}</p>
                                <p className="text-sm text-gray-300">
                                Budget: ${data.budget.toLocaleString()}
                                </p>
                            </div>
                            );
                        }
                        return null;
                        }}
                    />
                    </PieChart>
                </ResponsiveContainer>
                </ChartContainer>

                
                <div className="mt-4 grid grid-cols-2 gap-2">
                {budgetDistributionCard.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-400">{item.destination}</span>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}
