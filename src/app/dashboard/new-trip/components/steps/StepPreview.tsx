"use client";

import { useFormStore } from '@/zustand/useFormStore';

export default function StepPreview() {
    const { formData, setStep } = useFormStore();
    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-black text-2xl font-bold mb-6 text-center">Review Your Trip</h1>

            <section className="mb-4 text-black">
                <h2 className="text-xl font-semibold mb-2">Preferred Location</h2>
                <p>
                <strong>Country:</strong> {formData.country}
                </p>
                <p>
                <strong>State:</strong> {formData.state}
                </p>
                <p>
                <strong>Cities:</strong>{' '}
                {formData.cities && formData.cities.length > 0
                    ? formData.cities.join(', ')
                    : 'None selected'}
                </p>
            </section>

            <section className="mb-4 text-black">
                <h2 className="text-xl font-semibold mb-2">Budget</h2>
                <p>
                <strong>Min:</strong> ₹{formData.minBudget}
                </p>
                <p>
                <strong>Max:</strong> ₹{formData.maxBudget}
                </p>
            </section>
            
            <section className="mb-4 text-black">
                <h2 className="text-xl font-semibold mb-2">Dates</h2>
                <p>
                <strong>Start Date:</strong> {formData.startDate}
                </p>
                <p>
                <strong>End Date:</strong> {formData.endDate}
                </p>
            </section>

            <section className="mb-6 text-black">
                <h2 className="text-xl font-semibold mb-2">Interests</h2>
                {formData.interests && formData.interests.length > 0 ? (
                <ul className="list-disc list-inside">
                    {formData.interests.map((interest) => (
                    <li key={interest}>{interest}</li>
                    ))}
                </ul>
                ) : (
                <p>No interests selected</p>
                )}
            </section>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setStep(4)}
                >
                Back
                </button>
                <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                    // handle submission or redirect
                    console.log("Final submission data:", formData);
                }}
                >
                Submit
                </button>
            </div>
        </div>
    );
}