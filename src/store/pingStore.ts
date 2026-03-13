import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PingDataState {
  ping: string;
  isLoading: boolean;
  error: string | null;
  getPing: () => string;
  setPing: (ping: string) => void;
  clearPing: () => void;
  fetchPing: () => Promise<void>;
}

export const usePingStore = create<PingDataState>()(
  devtools((set, get) => ({
  ping: "", // Initial state
  isLoading: false,
  error: null,

  getPing: () => get().ping,

  setPing: (ping: string) => 
    set((state) => ({ ...state, ping })),

  clearPing: () => 
    set((state) => ({ ...state, ping: "" })),

  fetchPing: async () => {
    try {
      // Set loading state
      set({ isLoading: true, error: null });

      // Make API call
      const response = await fetch('your-api-endpoint/ping');
      if (!response.ok) {
        throw new Error('Failed to fetch ping data');
      }
      
      const data = await response.json();
      
      // Update state with fetched data
      set((state) => ({ 
        ...state, 
        ping: data.ping,
        isLoading: false 
      }));

    } catch (error) {
      // Handle error
      set((state) => ({ 
        ...state, 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      }));
    }
  }
}), { name: "PingStore" })
);
