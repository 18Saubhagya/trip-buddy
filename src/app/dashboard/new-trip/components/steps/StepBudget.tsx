"use client";

import { useFormStore } from "@/zustand/useFormStore";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepBudgetSchema } from "@/lib/validationSchema";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormValues = z.infer<typeof stepBudgetSchema>;

export default function StepBudget() {
    const {formData, setFormData, setStep} = useFormStore();

    const form = useForm({
        resolver: zodResolver(stepBudgetSchema),
        defaultValues: {
            minBudget: formData.minBudget ?? 0,
            maxBudget: formData.maxBudget ?? 100,
        }
    });

    const onSubmit = (data: FormValues) => {
        setFormData({
            ...formData,
            minBudget: data.minBudget,
            maxBudget: data.maxBudget
        });
        toast.success("Budget updated successfully!");
        setStep(3);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block mb-1">Minimum Budget</label>
                <Controller
                name="minBudget"
                control={form.control}
                render={({ field }) => (
                    <input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    className="p-2 border w-full rounded"
                    />
                )}
                />
                {form.formState.errors.minBudget && (
                <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.minBudget.message}
                </p>
                )}
            </div>

            <div>
                <label className="block mb-1">Maximum Budget</label>
                <Controller
                name="maxBudget"
                control={form.control}
                render={({ field }) => (
                    <input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    className="p-2 border w-full rounded"
                    />
                )}
                />
                {form.formState.errors.maxBudget && (
                <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.maxBudget.message}
                </p>
                )}
            </div>

            <div className="flex justify-between mt-6">
                <button
                type="button"
                onClick={() => setStep(1)}
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