"use client";

import { useEffect, useState } from "react";
import { useFormStore } from "@/zustand/useFormStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepCitiesSchema } from "@/lib/validationSchema";
import { toast } from "react-hot-toast";
import { getCountries, getStates, getCities } from "@/lib/cityAPI";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MapPin, ArrowLeft, ArrowRight } from "lucide-react";

type FormValues = z.infer<typeof stepCitiesSchema>;

export default function StepCities() {
  const router = useRouter();
  const { formData, setFormData, setStep } = useFormStore();

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(stepCitiesSchema),
    defaultValues: {
      country: formData.country || "",
      state: formData.state || "",
      cities: formData.cities || [],
    },
  });

  const selectedCountry = form.watch("country");
  const selectedState = form.watch("state");

  useEffect(() => {
    getCountries().then((res) => setCountries(res));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      form.setValue("state", "");
      form.setValue("cities", []);
      getStates(selectedCountry).then((res) => setStates(res));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      form.setValue("cities", []);
      getCities(selectedCountry, selectedState).then((res) => setCities(res));
    }
  }, [selectedState]);

  const onSubmit = (data: FormValues) => {
    setFormData({
      ...formData,
      country: data.country,
      state: data.state,
      cities: data.cities,
    });
    toast.success("Cities updated successfully!");
    setStep(2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Choose Your Destination</h2>
          <p className="text-gray-400 mt-1">
            Where would you like to explore?
          </p>
        </div>

        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Country
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                State/Region
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Please select a country first" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cities */}
        <FormField
          control={form.control}
          name="cities"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Cities <span className="text-gray-400 text-xs">(Select multiple)</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => {
                    if (field.value.includes(val)) {
                      field.onChange(field.value.filter((c) => c !== val));
                    } else {
                      field.onChange([...field.value, val]);
                    }
                  }}
                  value="" // reset trigger value to allow multi-select
                  disabled={!selectedState}
                >
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Please select a state first" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />

              {/* Selected tags */}
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((c: string) => (
                    <span
                      key={c}
                      className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
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
