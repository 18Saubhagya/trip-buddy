"use client";

import { useRouter } from "next/navigation"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Plus } from "lucide-react";

export default function NewTripCard() {
  const router = useRouter();

  return (
    <Card className="bg-slate-900/70 border border-slate-700 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition">
      <CardContent className="p-6 flex items-center gap-6">
        
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Plane className="h-7 w-7 text-white" />
        </div>

        
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-bold text-white">
            Plan Your Next Adventure
          </h3>
          <p className="text-sm text-gray-400">
            Click below to start planning a trip
          </p>
        </div>

        
        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => router.push("/dashboard/new-trip")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Trip
        </Button>
      </CardContent>
    </Card>
  );
}
