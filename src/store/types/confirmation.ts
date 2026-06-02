export interface ConfirmationState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
  reset: () => void;
}
