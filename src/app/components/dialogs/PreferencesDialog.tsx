"use client";

import { useState } from "react";

export type ProjectPreferences = {
  complexity: string;
  timeline: string;
  priority: string;
  deployment: string;
  team: string;
};

type PreferencesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: ProjectPreferences) => void;
};

export default function PreferencesDialog({ isOpen, onClose, onSubmit }: PreferencesDialogProps) {
  const [preferences, setPreferences] = useState<ProjectPreferences>({
    complexity: "",
    timeline: "",
    priority: "",
    deployment: "",
    team: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only submit if all preferences are selected
    if (Object.values(preferences).every(value => value)) {
      onSubmit(preferences);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-light mb-6">Project Preferences</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/60 mb-2">Project Complexity</label>
            <select 
              value={preferences.complexity}
              onChange={(e) => setPreferences(prev => ({ ...prev, complexity: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-white/90"
              required
            >
              <option value="">Select complexity</option>
              <option value="Simple">Simple (MVP)</option>
              <option value="Moderate">Moderate</option>
              <option value="Complex">Complex</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 mb-2">Timeline</label>
            <select 
              value={preferences.timeline}
              onChange={(e) => setPreferences(prev => ({ ...prev, timeline: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-white/90"
              required
            >
              <option value="">Select timeline</option>
              <option value="Quick">Quick (1-2 weeks)</option>
              <option value="Standard">Standard (1-2 months)</option>
              <option value="Extended">Extended (3+ months)</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 mb-2">Main Priority</label>
            <select 
              value={preferences.priority}
              onChange={(e) => setPreferences(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-white/90"
              required
            >
              <option value="">Select priority</option>
              <option value="Speed">Speed to Market</option>
              <option value="Scalability">Scalability</option>
              <option value="User Experience">User Experience</option>
              <option value="Cost Efficiency">Cost Efficiency</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 mb-2">Deployment Preference</label>
            <select 
              value={preferences.deployment}
              onChange={(e) => setPreferences(prev => ({ ...prev, deployment: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-white/90"
              required
            >
              <option value="">Select deployment</option>
              <option value="Serverless">Serverless</option>
              <option value="Traditional">Traditional Hosting</option>
              <option value="Container">Container-based</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 mb-2">Team Size</label>
            <select 
              value={preferences.team}
              onChange={(e) => setPreferences(prev => ({ ...prev, team: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-white/90"
              required
            >
              <option value="">Select team size</option>
              <option value="Solo">Solo Developer</option>
              <option value="Small">Small Team (2-4)</option>
              <option value="Medium">Medium Team (5-10)</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
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
              disabled={!Object.values(preferences).every(value => value)}
              className="flex-1 px-6 py-3 rounded-xl bg-white/[0.1] border border-white/[0.1] 
                text-white hover:bg-white/[0.15] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 