import {create} from 'zustand';

interface FormState {
    startDate: string,
    endDate: string,
    maxBudget: number,
    minBudget: number,
    country: string,
    state: string,
    cities: string[],
    interests: string[],
}

interface FormStore {
    step: number,
    formData: FormState,
    setStep: (step : number) => void,
    setFormData: (formData: Partial<FormState>) => void,
}

export const useFormStore = create<FormStore>((set) => ({
    step: 1,
    formData: {
        startDate: '',
        endDate: '',
        maxBudget: 0,
        minBudget: 0,
        country: '',
        state: '',
        cities: [],
        interests: [],
    },
    setStep: (step) => set({ step }),
    setFormData: (formData) => set((state) => ({
        formData: { ...state.formData, ...formData }
    })),
}));