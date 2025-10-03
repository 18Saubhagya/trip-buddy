"use client";

import { useFormStore } from "@/zustand/useFormStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
} from "lucide-react";

export default function StepPreview() {
  const { formData, setStep } = useFormStore();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/trips/new-trip", formData);
      toast.success(response.data.message);
      router.push("/trip/" + response.data.tripId);
    } catch (error: any) {
      console.error("Error submitting trip:", error);
      toast.error(error.response?.data?.error || "Trip submission failed.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white">Review Your Trip</h2>
        <p className="text-gray-400 mt-2">
          Make sure everything looks right before generating your itinerary.
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl overflow-hidden hover:shadow-blue-500/20 transition">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 flex items-center gap-2 text-white font-semibold">
            <MapPin className="w-5 h-5" /> Preferred Location
          </div>
          <CardContent className="p-5 space-y-2 text-gray-200">
            <p>
              <span className="font-semibold text-white">Country:</span>{" "}
              {formData.country}
            </p>
            <p>
              <span className="font-semibold text-white">State:</span>{" "}
              {formData.state}
            </p>
            <p>
              <span className="font-semibold text-white">Cities:</span>{" "}
              {formData.cities?.length > 0
                ? formData.cities.join(", ")
                : "None selected"}
            </p>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl overflow-hidden hover:shadow-green-500/20 transition">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 flex items-center gap-2 text-white font-semibold">
            <DollarSign className="w-5 h-5" /> Budget
          </div>
          <CardContent className="p-5 space-y-2 text-gray-200">
            <p>
              <span className="font-semibold text-white">Min:</span> ₹
              {formData.minBudget}
            </p>
            <p>
              <span className="font-semibold text-white">Max:</span> ₹
              {formData.maxBudget}
            </p>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl overflow-hidden hover:shadow-purple-500/20 transition">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 flex items-center gap-2 text-white font-semibold">
            <Calendar className="w-5 h-5" /> Dates
          </div>
          <CardContent className="p-5 space-y-2 text-gray-200">
            <p>
              <span className="font-semibold text-white">Start Date:</span>{" "}
              {formData.startDate}
            </p>
            <p>
              <span className="font-semibold text-white">End Date:</span>{" "}
              {formData.endDate}
            </p>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="bg-slate-900/70 border border-slate-700 shadow-lg rounded-xl overflow-hidden hover:shadow-pink-500/20 transition">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-2 flex items-center gap-2 text-white font-semibold">
            <Heart className="w-5 h-5" /> Interests
          </div>
          <CardContent className="p-5 space-y-3">
            {formData.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-pink-100/90 text-pink-700 font-medium text-sm px-3 py-1 rounded-full shadow-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">No interests selected</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="secondary"
          onClick={() => setStep(4)}
          className="flex items-center gap-2 px-6 py-2 rounded-lg"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"
        >
          Generate Itinerary <CheckCircle2 size={18} />
        </Button>
      </div>
    </div>
  );
}


