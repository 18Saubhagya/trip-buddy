"use client";

import { useFormStore } from "@/zustand/useFormStore";
import StepCities from "./steps/StepCities"
import StepInterests from "./steps/StepInterests";
import StepBudget from "./steps/StepBudget";
import StepDates from "./steps/StepDates";
import StepPreview from "./steps/StepPreview";
import { Toaster } from "react-hot-toast";

const steps = {
    1: StepCities,
    2: StepBudget,
    3: StepDates,
    4: StepInterests,
    5: StepPreview
}

export default function MultiStepForm() {
    const {step} = useFormStore();
    const CurrentStep = steps[step as keyof typeof steps];


    return (
        <div className="p-6">
            <Toaster />
            <CurrentStep />
        </div>
    );
}