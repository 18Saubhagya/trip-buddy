"use client";

import {useEffect, useState } from "react";
import Select from "react-select";
import { useFormStore } from "@/zustand/useFormStore";
import {useForm, Controller} from "react-hook-form";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { stepCitiesSchema } from "@/lib/validationSchema";
import { toast } from "react-hot-toast";
import { getCountries, getStates, getCities } from "@/lib/cityAPI";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof stepCitiesSchema>;

interface OptionType {
    value: string;
    label: string;
}

const customStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        color: state.isSelected ? "white" : "black",
        backgroundColor: state.isSelected ? "black" : state.isFocused ? "#f0f0f0" : "white",
        padding: 10,
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: "black",
    }),
};

export default function StepCities() {
    const router = useRouter();

    const {formData, setFormData, setStep} = useFormStore();
    const [countries, setCountries] = useState<OptionType[]>([]);
    const [states, setStates] = useState<OptionType[]>([]);
    const [cities, setCities] = useState<OptionType[]>([]);

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
        //console.log("Fetching countries...");
        
        getCountries().then((res) =>
            setCountries(res.map((c: string) => ({ label: c, value: c })))
        );
    }, []);

    useEffect(() => {
        if(selectedCountry) {
            form.setValue("state", "");
            form.setValue("cities", []);
            getStates(selectedCountry).then((res) => {
                setStates(res.map((s: string) => ({ label: s, value: s })));
            });
        }
    }, [selectedCountry]);

    useEffect(() => {
        if(selectedState) {
            form.setValue("cities", []);
            getCities(selectedCountry, selectedState).then((res) => {
                setCities(res.map((c: string) => ({ label: c, value: c})));
            });
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label>Country</label>
                <Controller
                control={form.control}
                name="country"
                render={({ field }) => (
                    <Select
                    styles={customStyles}
                    {...field}
                    options={countries}
                    onChange={(option) => field.onChange(option?.value)}
                    value={countries.find((c) => c.value === field.value)}
                    placeholder="Select Country"
                    />
                    
                )}
                />
                {form.formState.errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.country.message}
                    </p>
                )}
            </div>

            <div>
                <label>State</label>
                <Controller
                control={form.control}
                name="state"
                render={({ field }) => (
                    <Select
                    {...field}
                    options={states}
                    onChange={(option) => field.onChange(option?.value)}
                    value={states.find((s) => s.value === field.value)}
                    styles={customStyles}
                    isDisabled={!selectedCountry}
                    placeholder="Select State"
                    />
                )}
                />
                {form.formState.errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.state.message}
                    </p>
                )}
            </div>

            <div>
                <label>Cities (multi-select)</label>
                <Controller
                control={form.control}
                name="cities"
                render={({ field }) => (
                    <Select
                    isMulti
                    {...field}
                    styles={customStyles}
                    options={cities}
                    onChange={(selectedOptions) =>
                        field.onChange(selectedOptions.map((opt) => opt.value))
                    }
                    value={cities.filter((c) => field.value.includes(c.value))}
                    isDisabled={!selectedState}
                    placeholder="Select Cities"
                    />
                )}
                />
                {form.formState.errors.cities && (
                    <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.cities.message}
                    </p>
                )}
            </div>

            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                    Back
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
                </button>
            </div>
        </form>
    );
}