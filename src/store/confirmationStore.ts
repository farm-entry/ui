import { create } from "zustand";

interface ConfirmationState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmationStore = create<ConfirmationState>((set, get) => ({
  open: false,
  title: "",
  message: "",
  onConfirm: null,

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
}));
