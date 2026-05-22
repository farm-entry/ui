import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FormData {
  [key: string]: any;
  timestamp: number;
  ttlHours: number;
}

interface FormStorageState {
  forms: Record<string, FormData>;
  saveForm: (formType: string, data: any, ttlHours?: number) => void;
  getForm: <T>(formType: string) => T | null;
  removeForm: (formType: string) => void;
  clearExpired: () => void;
  reset: () => void;
}

const initialFormStorageState = {
  forms: {} as Record<string, FormData>,
};

export const useFormStorageStore = create<FormStorageState>()(
  persist(
    (set, get) => ({
      ...initialFormStorageState,
      
      saveForm: (formType: string, data: any, ttlHours: number = 48) => {
        const timestamp = Date.now();
        set((state) => ({
          forms: {
            ...state.forms,
            [formType]: {
              ...data,
              timestamp,
              ttlHours,
            },
          },
        }));
      },
      
      getForm: <T>(formType: string): T | null => {
        const { forms } = get();
        const formData = forms[formType];
        
        if (!formData) return null;
        
        const { timestamp, ttlHours, ...data } = formData;
        const expiresAt = timestamp + (ttlHours * 60 * 60 * 1000);
        
        if (Date.now() > expiresAt) {
          // Form has expired, remove it
          get().removeForm(formType);
          return null;
        }
        
        return data as T;
      },
      
      removeForm: (formType: string) => {
        set((state) => {
          const { [formType]: removed, ...rest } = state.forms;
          return { forms: rest };
        });
      },
      
      clearExpired: () => {
        const { forms } = get();
        const now = Date.now();
        const validForms: Record<string, FormData> = {};

        Object.entries(forms).forEach(([formType, formData]) => {
          const expiresAt = formData.timestamp + (formData.ttlHours * 60 * 60 * 1000);
          if (now <= expiresAt) {
            validForms[formType] = formData;
          }
        });

        set({ forms: validForms });
      },

      reset: () => {
        set(initialFormStorageState);
        useFormStorageStore.persist.clearStorage();
      },
    }),
    {
      name: 'form-storage',
    }
  )
);