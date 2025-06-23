"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepInterestsSchema } from "@/lib/validationSchema";
import { z } from "zod";
import { useFormStore } from "@/zustand/useFormStore";
import { toast } from "react-hot-toast";

type FormValues = z.infer<typeof stepInterestsSchema>;

const allInterests = [
  "Adventure",
  "Nature",
  "Offbeat",
  "Historical Places",
  "Hills",
  "Lakes",
  "Beaches",
];

export default function StepInterests() {
    const { formData, setFormData, setStep } = useFormStore();
    const form = useForm<FormValues>({
        resolver: zodResolver(stepInterestsSchema),
        defaultValues: {
            interests: formData.interests || [],
        },
    });

    const onSubmit = (data: FormValues) => {
        setFormData({
            ...formData,
            interests: data.interests,
        });
        toast.success("Interests updated successfully!");
        setStep(5);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <label className="text-lg font-semibold">Select your interests:</label>

      <Controller
        control={form.control}
        name="interests"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2">
            {allInterests.map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={interest}
                  checked={field.value?.includes(interest)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    if (checked) {
                      field.onChange([...field.value, value]);
                    } else {
                      field.onChange(field.value.filter((v) => v !== value));
                    }
                  }}
                  className="accent-blue-600"
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
        )}
      />

      {form.formState.errors.interests && (
        <p className="text-red-500 text-sm mt-2">
          {form.formState.errors.interests.message}
        </p>
      )}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep(3)}
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