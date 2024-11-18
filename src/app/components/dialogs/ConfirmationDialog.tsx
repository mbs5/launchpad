"use client";

type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onRefine: () => void;
};

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  onRefine,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-light mb-4">Ready to Move Forward?</h3>
        <p className="text-white/60 mb-8 font-light">
          Are you satisfied with the current idea and its features, or would you like to refine it further?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onRefine}
            className="flex-1 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] 
              text-white/90 hover:bg-white/[0.08] transition-all duration-200"
          >
            Refine More
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-white/[0.1] border border-white/[0.1] 
              text-white hover:bg-white/[0.15] transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 