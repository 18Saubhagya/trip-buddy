"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import axios from "axios"; 
import clsx from "clsx";

type RatingSectionProps = {
    itineraryId: number;
    interests: string[];
};

export default function ItineraryRatingSection({ itineraryId, interests }: RatingSectionProps) {
    const [overallRating, setOverallRating] = useState(0);
    const [interestRatings, setInterestRatings] = useState<Record<string, number>>({});
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (overallRating < 1 || overallRating > 5) {
            toast.error("Please select an overall rating between 1 and 5.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post("/api/ratings", {
                itineraryId,
                overall: overallRating,
                interestScores: interestRatings,
                comments: comment.trim() || null,
            });

            toast.success("Thanks for your feedback!");
            setHasSubmitted(true);
        } catch (error) {
            console.error("Rating submit error:", error);
            toast.error("Failed to submit rating. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInterestRatingChange = (interest: string, rating: number) => {
        setInterestRatings((prevRatings) => {
            return {
                ...prevRatings,
                [interest]: rating,
            };
        })
    }

    const getStarColor = (value: number) => {
        if (value <= 2) 
            return "text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]";
        if (value === 3) 
            return "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]";
        return "text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]";
    };

    return (
        <Card className="bg-slate-900/70 border border-slate-800/50 rounded-2xl shadow-xl w-full max-w-3xl p-6">
            <CardContent className="space-y-8">

                <div className="text-center">
                <h3 className="text-white text-lg font-semibold mb-3">Overall Experience</h3>
                <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        onClick={() => { if (!hasSubmitted) setOverallRating(star) }}
                        className={clsx(
                        "w-8 h-8 cursor-pointer transition-all duration-200 hover:scale-110",
                        star <= overallRating ? getStarColor(overallRating) : "text-slate-600 hover:text-slate-400",
                            hasSubmitted && "cursor-default opacity-70 hover:scale-100"
                        )}
                        fill={star <= overallRating ? "currentColor" : "none"}
                    />
                    ))}
                </div>
                <p className="text-slate-500 text-xs mt-2">
                    {overallRating === 0
                    ? "Select your rating"
                    : overallRating <= 2
                    ? "Not satisfied"
                    : overallRating === 3
                    ? "Average experience"
                    : "Loved it!"}
                </p>
                </div>

                <div>
                <h4 className="text-white text-sm font-semibold mb-4 text-center uppercase tracking-wide">
                    Ratings by Interest
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                    {interests.map((interest) => (
                    <div
                        key={interest}
                        className="flex items-center justify-between bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-700/50 hover:border-slate-600/40 transition-all"
                    >
                        <span className="text-slate-300 text-sm font-medium">{interest}</span>
                        <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                            key={star}
                            onClick={() => { if (!hasSubmitted) handleInterestRatingChange(interest, star) }}
                            className={clsx(
                                "w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110",
                                star <= (interestRatings[interest] || 0)
                                ? getStarColor(interestRatings[interest] || 0)
                                : "text-slate-600 hover:text-slate-400",
                                    hasSubmitted && "cursor-default opacity-70 hover:scale-100"
                            )}
                            fill={star <= (interestRatings[interest] || 0) ? "currentColor" : "none"}
                            />
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                <div>
                <h4 className="text-white text-sm font-semibold mb-2 text-center">Additional Feedback</h4>
                <Textarea
                    value={comment}
                    disabled={hasSubmitted}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or what could be improved..."
                    className="bg-slate-800/60 border border-slate-700 text-slate-200 w-full min-h-[100px] resize-none focus-visible:ring-1 focus-visible:ring-blue-500/40"
                />
                </div>

                <div className="flex justify-center pt-4">
                <Button
                    disabled={isSubmitting || overallRating === 0}
                    onClick={handleSubmit}
                    className={clsx(
                        "px-8 py-2 rounded-xl font-medium transition-all text-white",
                        isSubmitting || hasSubmitted
                            ? "bg-slate-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25"
                        )}
                >
                    {hasSubmitted
                        ? "Feedback Submitted"
                        : isSubmitting
                        ? "Submitting..."
                        : "Submit Feedback"}
                </Button>
                </div>
            </CardContent>
        </Card>
    );
}