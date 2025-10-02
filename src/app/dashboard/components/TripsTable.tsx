"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, Eye, Edit, Trash2, MoreHorizontal, Plane } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const statusColors: Record<string, string> = {
    new: "bg-blue-600/80 text-white",
    in_progress: "bg-yellow-600/80 text-white",
    completed: "bg-green-600/80 text-white",
    cancelled: "bg-red-600/80 text-white",
};

const statusMap: Record<string, string> = {
    new: "New",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
};
 
export default function TripsTable() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 4;

    const [tripsData, setTripsData] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTripsTable = async () => {
            try {
                const params = {
                    page: currentPage,
                    limit,
                    status: statusFilter !== "all" ? statusFilter.toLowerCase() : undefined,
                    search: searchTerm.trim() !== "" ? searchTerm : undefined,
                }

                const {data} = await axios.get("/api/dashboard/trips-table", {params});

                setTripsData(data.tableData);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            } catch (error) {
                console.error("Error fetching trips table:", error);
            } 
        }

        fetchTripsTable();
    }, [searchTerm, statusFilter, currentPage])


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };


    return (
        <Card className="bg-slate-900/70 border border-slate-700 text-white rounded-xl shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-200">
            <Plane className="h-5 w-5 text-blue-400" />
            My Trips
            </CardTitle>

            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                placeholder="Search trips or destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-400"
                />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-gray-200">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-gray-200">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </CardHeader>

        <CardContent>
            <div className="rounded-md border border-slate-700 overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow className="bg-slate-800/60">
                    <TableHead className="text-gray-300">Trip Name / Destination</TableHead>
                    <TableHead className="text-gray-300">Start Date</TableHead>
                    <TableHead className="text-gray-300">End Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="w-[100px] text-gray-300">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {tripsData.map((trip) => (
                    <TableRow
                    key={trip.id}
                    className="hover:bg-slate-800/40 transition"
                    >
                    <TableCell>
                        <div>
                        <div className="font-medium text-white">{trip.tripName}</div>
                        <div className="text-sm text-gray-400">
                            {trip.state}, {trip.country}
                        </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                        {formatDate(trip.startDate)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                        {formatDate(trip.endDate)}
                    </TableCell>
                    <TableCell>
                        <Badge className={`${statusColors[trip.status]} px-2 py-1 rounded-full text-xs`}>
                        {statusMap[trip.status]}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-slate-800 border-slate-700 text-gray-200"
                        >
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => router.push(`/trip/${trip.id}`)}>
                            <Eye className="h-4 w-4" />
                            View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-400">
                            <Trash2 className="h-4 w-4" />
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>

            
            {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * limit + 1}{"-"}{Math.min(currentPage * limit, total)} of {total}
                </p>

                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="bg-slate-800 border-slate-700 text-gray-200 hover:bg-slate-700"
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="bg-slate-800 border-slate-700 text-gray-200 hover:bg-slate-700"
                >
                    Next
                </Button>
                </div>
            </div>
            )}
        </CardContent>
        </Card>
    );
}
