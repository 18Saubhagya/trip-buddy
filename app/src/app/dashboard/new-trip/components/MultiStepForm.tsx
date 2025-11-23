"use client";

import { useFormStore } from "@/zustand/useFormStore";
import StepCities from "./steps/StepCities";
import StepInterests from "./steps/StepInterests";
import StepBudget from "./steps/StepBudget";
import StepDates from "./steps/StepDates";
import StepPreview from "./steps/StepPreview";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = {
  1: { component: StepCities, label: "Destination" },
  2: { component: StepBudget, label: "Budget" },
  3: { component: StepDates, label: "Dates" },
  4: { component: StepInterests, label: "Interests" },
  5: { component: StepPreview, label: "Preview" },
};

export default function MultiStepForm() {
  const { step } = useFormStore();
  const CurrentStep = steps[step as keyof typeof steps].component;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-slate-900 to-slate-950 text-white px-4 py-10 overflow-hidden">
      <Toaster />

      {/* Background glowing blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Title + Subtitle */}
      <div className="relative z-10 text-center mb-10">
        <h1 className="text-4xl font-extrabold">Travel Buddy</h1>
        <p className="text-gray-300 mt-2">
          Plan your perfect adventure with our intelligent travel itinerary planner
        </p>
      </div>

      {/* Stepper */}
      <div className="relative z-10 flex items-center justify-center space-x-12 mb-12">
        {Object.entries(steps).map(([key, { label }]) => {
          const stepNum = Number(key);
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;

          return (
            <div key={key} className="flex flex-col items-center space-y-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-500 text-gray-400"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
              </div>
              <span
                className={`text-sm ${
                  isActive ? "text-blue-400 font-semibold" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="relative z-10 w-full max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/80 backdrop-blur-lg border border-slate-700 shadow-xl rounded-2xl p-8"
          >
            <CurrentStep />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
