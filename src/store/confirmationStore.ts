import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ConfirmationState } from "./types/confirmation";

const initialConfirmationState = {
  open: false,
  title: "",
  message: "",
  onConfirm: null as (() => void) | null,
};

export const useConfirmationStore = create<ConfirmationState>()(
  devtools((set, get) => ({
  ...initialConfirmationState,

  showConfirmation: (title: string, message: string, onConfirm: () => void) => {
    set({ open: true, title, message, onConfirm });
  },

  handleConfirm: () => {
    const { onConfirm } = get();
    if (onConfirm) {
      onConfirm();
    }
    set({ open: false, title: "", message: "", onConfirm: null });
  },

  handleCancel: () => {
    set({ open: false, title: "", message: "", onConfirm: null });
  },

  reset: () => set(initialConfirmationState),
}), { name: "ConfirmationStore" })
);
