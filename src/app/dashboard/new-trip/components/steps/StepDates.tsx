"use client";

import { useFormStore } from "@/zustand/useFormStore";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepDatesSchema } from "@/lib/validationSchema";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormValues = z.infer<typeof stepDatesSchema>;

export default function StepDates() {
    const {formData, setFormData, setStep} = useFormStore();
    const form = useForm({
        resolver: zodResolver(stepDatesSchema),
        defaultValues: {
            startDate: formData.startDate ?? "",
            endDate: formData.endDate ?? "",
        }
    });

    const onSubmit = (data: FormValues) => {
        setFormData({
            ...formData,
            startDate: data.startDate,
            endDate: data.endDate
        });
        toast.success("Dates updated successfully!");
        setStep(4);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block mb-1">Start Date</label>
                <Controller
                name="startDate"
                control={form.control}
                render={({ field }) => (
                    <input
                    type="date"
                    {...field}
                    className="p-2 border w-full rounded"
                    />
                )}
                />
                {form.formState.errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.startDate.message}
                </p>
                )}
            </div>

            <div>
                <label className="block mb-1">End Date</label>
                <Controller
                name="endDate"
                control={form.control}
                render={({ field }) => (
                    <input
                    type="date"
                    {...field}
                    className="p-2 border w-full rounded"
                    />
                )}
                />
                {form.formState.errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.endDate.message}
                </p>
                )}
            </div>

            <div className="flex justify-between mt-6">
                <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                Back
                </button>
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                Next
                </button>
            </div>
        </form>
    );
}