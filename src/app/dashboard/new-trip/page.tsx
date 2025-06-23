"use client";
import MultiStepForm from "./components/MultiStepForm";

export default function NewTripPage() {
    return (
        <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Create a New Trip</h1>
        <MultiStepForm />
    </div>
    );
}