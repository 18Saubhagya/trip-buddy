"use client";

import { useFormStore } from "@/zustand/useFormStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepInterestsSchema } from "@/lib/validationSchema";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, ArrowRight, Heart, Mountain, Utensils, Sun, Landmark, Music } from "lucide-react";

type FormValues = z.infer<typeof stepInterestsSchema>;

const interestsList = [
  { label: "Adventure", icon: Mountain },
  { label: "Beaches", icon: Sun },
  { label: "History", icon: Landmark },
  { label: "Food", icon: Utensils },
  { label: "Nightlife", icon: Music },
  { label: "Romantic", icon: Heart },
];

export default function StepInterests() {
  const { formData, setFormData, setStep } = useFormStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(stepInterestsSchema),
    defaultValues: {
      interests: formData.interests || [],
    },
  });

  const selectedInterests = form.watch("interests");

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      form.setValue(
        "interests",
        selectedInterests.filter((i) => i !== interest)
      );
    } else {
      form.setValue("interests", [...selectedInterests, interest]);
    }
  };

  const onSubmit = (data: FormValues) => {
    setFormData({
      ...formData,
      interests: data.interests,
    });
    toast.success("Interests updated successfully!");
    setStep(5);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Pick Your Interests</h2>
          <p className="text-gray-400 mt-1">
            What kind of experiences are you looking for?
          </p>
        </div>

        {/* Interests Grid */}
        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <FormLabel className="sr-only">Interests</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {interestsList.map(({ label, icon: Icon }) => {
                  const isSelected = selectedInterests.includes(label);
                  return (
                    <div
                      key={label}
                      className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all 
                        ${isSelected ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"}
                      `}
                      onClick={() => toggleInterest(label)}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep(3)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Previous
          </Button>

          <Button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Next Step <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
}
