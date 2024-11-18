"use client";

import { useState } from "react";
import { examples } from "../examplesList";
import ChatInterface from "../chat/ChatInterface";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import PreferencesDialog, { ProjectPreferences } from "../dialogs/PreferencesDialog";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  const handleNext = () => {
    const next = (currentIndex + 1) % examples.length;
    setNextIndex(next);
    setShowConfirmDialog(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    setShowPreferencesDialog(true);
  };

  const handlePreferencesSubmit = (preferences: ProjectPreferences) => {
    // Here you would typically send these preferences to your AI
    console.log("Selected preferences:", preferences);
    setShowPreferencesDialog(false);
    if (nextIndex !== null) {
      setCurrentIndex(nextIndex);
      setNextIndex(null);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row items-center">
      <div className="w-full overflow-hidden rounded-3xl shadow-2xl">
        <div className="flex flex-col h-[80vh] bg-white/[0.02] backdrop-blur-lg border border-white/[0.05]">
          <div className="flex-1 overflow-hidden">
            <ChatInterface example={examples[currentIndex]} />
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-between w-full">
        <button onClick={handlePrev} className="p-4 rounded-full bg-white/[0.03] text-white/80">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={handleNext} className="p-4 rounded-full bg-white/[0.03] text-white/80">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirm}
        onRefine={() => setShowConfirmDialog(false)}
      />

      <PreferencesDialog
        isOpen={showPreferencesDialog}
        onClose={() => setShowPreferencesDialog(false)}
        onSubmit={handlePreferencesSubmit}
      />
    </div>
  );
} 