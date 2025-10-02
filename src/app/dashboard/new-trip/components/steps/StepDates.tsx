"use client";

import { useFormStore } from "@/zustand/useFormStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepDatesSchema } from "@/lib/validationSchema";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

type FormValues = z.infer<typeof stepDatesSchema>;

const quickDurations = [
  { label: "Weekend Getaway", days: 3 },
  { label: "Week Long", days: 7 },
  { label: "Two Weeks", days: 14 },
  { label: "Month Long", days: 30 },
];

export default function StepDates() {
  const { formData, setFormData, setStep } = useFormStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(stepDatesSchema),
    defaultValues: {
      startDate: formData.startDate ?? "",
      endDate: formData.endDate ?? "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setFormData({
      ...formData,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    toast.success("Dates updated successfully!");
    setStep(4);
  };

  const handleQuickDuration = (days: number) => {
    const today = new Date();
    const start = today.toISOString().split("T")[0];
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);
    const end = endDate.toISOString().split("T")[0];
    form.setValue("startDate", start);
    form.setValue("endDate", end);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Choose Your Dates</h2>
          <p className="text-gray-400 mt-1">
            When would you like to travel?
          </p>
        </div>

        {/* Quick Trip Duration */}
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-blue-400">
            <Clock className="w-4 h-4" /> Quick Trip Duration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickDurations.map((option) => (
              <div
                key={option.label}
                className="cursor-pointer border border-slate-700 rounded-lg p-4 text-center transition-all hover:scale-105 bg-slate-800/50 hover:bg-slate-800"
                onClick={() => handleQuickDuration(option.days)}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-gray-300">{option.days} days</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start / End Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-400" /> Start Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-400" /> End Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep(2)}
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
