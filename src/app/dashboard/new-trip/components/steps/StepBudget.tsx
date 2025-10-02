"use client";

import { useFormStore } from "@/zustand/useFormStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepBudgetSchema } from "@/lib/validationSchema";
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
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
} from "lucide-react";

type FormValues = z.infer<typeof stepBudgetSchema>;

const quickBudgets = [
  { label: "Budget Travel", min: 1000, max: 5000, color: "border-green-400" },
  { label: "Mid-Range", min: 5000, max: 15000, color: "border-yellow-400" },
  { label: "Luxury", min: 15000, max: 50000, color: "border-purple-400" },
  { label: "Ultra Luxury", min: 50000, max: 100000, color: "border-pink-400" },
];

export default function StepBudget() {
  const { formData, setFormData, setStep } = useFormStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(stepBudgetSchema),
    defaultValues: {
      minBudget: formData.minBudget ?? 1000,
      maxBudget: formData.maxBudget ?? 10000,
    },
  });

  const minBudget = form.watch("minBudget");
  const maxBudget = form.watch("maxBudget");

  const onSubmit = (data: FormValues) => {
    setFormData({
      ...formData,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
    });
    toast.success("Budget updated successfully!");
    setStep(3);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Set Your Budget</h2>
          <p className="text-gray-400 mt-1">
            What&apos;s your travel budget range?
          </p>
        </div>

        {/* Quick Budget Selection */}
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-green-400">
            <DollarSign className="w-4 h-4" /> Quick Budget Selection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickBudgets.map((option) => (
              <div
                key={option.label}
                className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all hover:scale-105 bg-slate-800/50 hover:bg-slate-800 ${option.color}`}
                onClick={() => {
                  form.setValue("minBudget", option.min);
                  form.setValue("maxBudget", option.max);
                }}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="text-sm text-gray-300">
                  ₹{option.min.toLocaleString()} - ₹{option.max.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Min / Max Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="minBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="₹ Min"
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
            name="maxBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="₹ Max"
                    className="bg-slate-800 border-slate-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Budget Summary */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-300">Your budget range</p>
          <p className="text-xl font-bold">
            ₹{minBudget?.toLocaleString() || 0} - ₹
            {maxBudget?.toLocaleString() || 0}
          </p>
          <p className="text-xs text-gray-400">
            Range: ₹{((maxBudget || 0) - (minBudget || 0)).toLocaleString()}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep(1)}
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
