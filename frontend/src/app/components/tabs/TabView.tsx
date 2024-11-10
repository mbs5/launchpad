"use client";

import { useState } from "react";
import ChatInterface from "../chat/ChatInterface";
import { examples } from "../examplesList";
import PreferencesDialog, { ProjectPreferences } from "../dialogs/PreferencesDialog";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";

type TabStatus = "inactive" | "active" | "completed";

interface TabState {
  status: TabStatus;
  preferences?: ProjectPreferences;
  refinedPRD?: string;
}

export default function TabView() {
  const [activeTab, setActiveTab] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tabStates, setTabStates] = useState<TabState[]>(
    examples.map((_, idx) => ({
      status: idx === 0 ? "active" : "inactive"
    }))
  );

  const handleTabClick = (idx: number) => {
    if (idx === 1 && tabStates[0].status !== "completed") {
      setShowConfirmation(true);
      return;
    }
    setActiveTab(idx);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setShowPreferences(true);
  };

  const handlePreferencesSubmit = (preferences: ProjectPreferences) => {
    setTabStates(prev => {
      const newStates = [...prev];
      newStates[1] = {
        ...newStates[1],
        status: "active",
        preferences
      };
      return newStates;
    });
    setShowPreferences(false);
    setActiveTab(1);
  };

  const getStatusColor = (status: TabStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-screen flex">
      {/* Main Container with Fixed Width */}
      <div className="flex-1 flex justify-center">
        <div className="w-[900px] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.05]">
            {examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleTabClick(idx)}
                className={`px-8 py-5 text-sm font-light transition-all duration-200 flex items-center gap-3
                  ${activeTab === idx
                    ? "text-white border-b-2 border-white/50 bg-white/[0.02]"
                    : "text-white/50 hover:text-white/70 hover:bg-white/[0.02]"
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${getStatusColor(tabStates[idx].status)}`} />
                {example.name}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            <ChatInterface 
              example={examples[activeTab]} 
              previousPRD={activeTab === 1 ? tabStates[0].refinedPRD : undefined}
            />
          </div>
        </div>
      </div>

      {/* Permanent Sidebar */}
      <div className="w-[300px] border-l border-white/[0.05] flex flex-col">
        <div className="p-6">
          <h3 className="text-lg font-light text-white/90 mb-4">Additional Info</h3>
          {activeTab === 1 && tabStates[1].preferences ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-white/70 text-sm font-medium mb-2">Project Timeline</h4>
                <p className="text-white/50 text-sm">{tabStates[1].preferences.timeline}</p>
              </div>
              <div>
                <h4 className="text-white/70 text-sm font-medium mb-2">Complexity</h4>
                <p className="text-white/50 text-sm">{tabStates[1].preferences.complexity}</p>
              </div>
              <div>
                <h4 className="text-white/70 text-sm font-medium mb-2">Priority</h4>
                <p className="text-white/50 text-sm">{tabStates[1].preferences.priority}</p>
              </div>
              <div>
                <h4 className="text-white/70 text-sm font-medium mb-2">Deployment</h4>
                <p className="text-white/50 text-sm">{tabStates[1].preferences.deployment}</p>
              </div>
              <div>
                <h4 className="text-white/70 text-sm font-medium mb-2">Team Size</h4>
                <p className="text-white/50 text-sm">{tabStates[1].preferences.team}</p>
              </div>
            </div>
          ) : (
            <p className="text-white/50 text-sm">
              {activeTab === 1 
                ? "Please complete preferences to see additional information" 
                : `Sidebar content for ${examples[activeTab].name}`}
            </p>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        onRefine={() => setShowConfirmation(false)}
      />

      <PreferencesDialog
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSubmit={handlePreferencesSubmit}
      />
    </div>
  );
} 