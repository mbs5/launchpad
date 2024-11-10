"use client";

import { useState } from "react";

export type ProjectPreferences = {
  timeline: "quick" | "moderate" | "extended";
  complexity: "simple" | "moderate" | "complex";
  priority: "speed" | "scalability" | "maintainability";
  deployment: "serverless" | "container" | "traditional";
  team: "solo" | "small" | "large";
};

type PreferencesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: ProjectPreferences) => void;
};

export default function PreferencesDialog({
  isOpen,
  onClose,
  onSubmit,
}: PreferencesDialogProps) {
  const [preferences, setPreferences] = useState<ProjectPreferences>({
    timeline: "moderate",
    complexity: "moderate",
    priority: "maintainability",
    deployment: "serverless",
    team: "small",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const RadioGroup = ({ 
    label, 
    name, 
    options 
  }: { 
    label: string; 
    name: keyof ProjectPreferences; 
    options: { value: string; label: string }[] 
  }) => (
    <div className="mb-8">
      <label className="text-white/80 font-light mb-4 block text-lg">{label}</label>
      <div className="grid grid-cols-3 gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200
              ${preferences[name] === option.value
                ? "bg-white/[0.1] border-white/[0.2]"
                : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.05]"
              }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={preferences[name] === option.value}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
              className="sr-only"
            />
            <span className="text-white/90 font-light">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-8">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-light mb-2">Project Preferences</h3>
        <p className="text-white/60 mb-8 font-light">
          Select your preferences to receive a personalized tech stack recommendation.
        </p>
        
        <form onSubmit={handleSubmit}>
          <RadioGroup
            label="Development Timeline"
            name="timeline"
            options={[
              { value: "quick", label: "Quick" },
              { value: "moderate", label: "Moderate" },
              { value: "extended", label: "Extended" },
            ]}
          />

          <RadioGroup
            label="Project Complexity"
            name="complexity"
            options={[
              { value: "simple", label: "Simple" },
              { value: "moderate", label: "Moderate" },
              { value: "complex", label: "Complex" },
            ]}
          />

          <RadioGroup
            label="Main Priority"
            name="priority"
            options={[
              { value: "speed", label: "Speed" },
              { value: "scalability", label: "Scalability" },
              { value: "maintainability", label: "Maintainability" },
            ]}
          />

          <RadioGroup
            label="Deployment Preference"
            name="deployment"
            options={[
              { value: "serverless", label: "Serverless" },
              { value: "container", label: "Container" },
              { value: "traditional", label: "Traditional" },
            ]}
          />

          <RadioGroup
            label="Team Size"
            name="team"
            options={[
              { value: "solo", label: "Solo" },
              { value: "small", label: "Small Team" },
              { value: "large", label: "Large Team" },
            ]}
          />

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] 
                text-white/90 hover:bg-white/[0.08] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-white/[0.1] border border-white/[0.1] 
                text-white hover:bg-white/[0.15] transition-all duration-200"
            >
              Get Recommendations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 