"use client";

import { useState } from "react";
import ChatInterface from "../chat/ChatInterface";
import { examples } from "../examplesList";
import PreferencesDialog, { ProjectPreferences } from "../dialogs/PreferencesDialog";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { Message, ChatExample, TabStatus, TabState } from "../types/chat";
import { FileText, ChevronDown, ChevronUp, Copy, Download } from "lucide-react";

type SidebarSection = {
  title: string;
  content: string;
  isExpanded: boolean;
};

type ResourcesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (topics: string[]) => void;
};

function ResourcesDialog({ isOpen, onClose, onSubmit }: ResourcesDialogProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const commonTopics = ["Frontend", "Backend", "Database", "DevOps", "Testing", "Security"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedTopics);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-light mb-4">What would you like to learn?</h3>
        <p className="text-white/60 mb-6 font-light">
          Select topics you'd like to get resources for:
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {commonTopics.map((topic) => (
            <label
              key={topic}
              className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${selectedTopics.includes(topic)
                  ? "bg-white/[0.1] border-white/[0.2]"
                  : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.05]"
                }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedTopics.includes(topic)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTopics([...selectedTopics, topic]);
                  } else {
                    setSelectedTopics(selectedTopics.filter(t => t !== topic));
                  }
                }}
              />
              <span className="text-white/90 font-light">{topic}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] 
              text-white/90 hover:bg-white/[0.08] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 rounded-xl bg-white/[0.1] border border-white/[0.1] 
              text-white hover:bg-white/[0.15] transition-all duration-200"
          >
            Get Resources
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TabView() {
  const [activeTab, setActiveTab] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tabStates, setTabStates] = useState<TabState[]>(
    examples.map((_, idx) => ({
      status: idx === 0 ? "active" : "inactive",
      messages: []
    }))
  );
  const [sidebarSections, setSidebarSections] = useState<SidebarSection[]>([
    { title: "Project Overview", content: "", isExpanded: false },
    { title: "Tech Stack", content: "", isExpanded: false },
    { title: "Project Preferences", content: "", isExpanded: false }
  ]);

  const handleTabClick = async (idx: number) => {
    if (examples[idx].disabled) {
      return; // Early return for disabled tabs
    }

    if (idx === 1) {
      setShowConfirmation(true);
      return;
    }
    setActiveTab(idx);
  };

  const handleMessagesUpdate = (messages: Message[]) => {
    setTabStates(prev => {
      const newStates = [...prev];
      newStates[activeTab] = {
        ...newStates[activeTab],
        messages
      };
      return newStates;
    });
  };

  const handleConfirm = () => {
    const currentMessages = tabStates[0].messages || [];
    const lastAIMessage = currentMessages
      .filter(msg => msg.role === "assistant")
      .pop()?.content;
    
    if (!lastAIMessage) return;
    
    setTabStates(prev => {
      const newStates = [...prev];
      newStates[0] = {
        ...newStates[0],
        status: "completed",
        refinedPRD: lastAIMessage
      };
      return newStates;
    });
    
    setShowConfirmation(false);
    setShowPreferences(true);
  };

  const handlePreferencesSubmit = (preferences: ProjectPreferences) => {
    const preferencesContent = `Project Preferences:
• Complexity Level: ${preferences.complexity}
• Timeline: ${preferences.timeline}
• Main Priority: ${preferences.priority}
• Deployment: ${preferences.deployment}
• Team Size: ${preferences.team}`;

    setSidebarSections(prev => prev.map((section, idx) => 
      section.title === "Project Preferences" 
        ? { ...section, content: preferencesContent }
        : section
    ));
    
    setTabStates(prev => {
      const newStates = [...prev];
      newStates[1] = {
        ...newStates[1],
        status: "active",
        preferences,
        messages: [],
        initialMessage: `Please share your technical skillset so I can recommend a tech stack tailored to your project needs and expertise.

I'll use this information along with your preferences (${preferences.complexity} complexity, ${preferences.timeline} timeline) to suggest the most suitable technologies.

Specifically, tell me about:
1. Programming languages you're proficient in
2. Frameworks or libraries you've worked with
3. Your experience level with different areas (frontend, backend, DevOps, etc.)`
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

  const getTabInitialMessage = (tabIndex: number) => {
    switch (tabIndex) {
      case 3:
        const techStack = tabStates[1].messages?.find(
          msg => msg.role === "assistant"
        )?.content || "";
        
        const refinedIdea = tabStates[0].messages?.find(
          msg => msg.role === "assistant"
        )?.content || "";

        return `I'll help you find targeted learning resources for your project. Here's what I know so far:

${refinedIdea ? `Project Overview: ${refinedIdea}\n` : ''}
${techStack ? `Recommended Tech Stack: ${techStack}\n` : ''}

What specific technologies or concepts would you like to learn more about?`;
      default:
        return undefined;
    }
  };

  const toggleSection = (index: number) => {
    setSidebarSections(prev => prev.map((section, idx) => 
      idx === index ? { ...section, isExpanded: !section.isExpanded } : section
    ));
  };

  const updateSectionContent = (content: string) => {
    setSidebarSections(prev => prev.map((section, idx) => {
      if (idx === activeTab) {
        return { ...section, content };
      }
      return section;
    }));
  };

  const handleExportPDF = () => {
    // Combine all section content
    const prdContent = sidebarSections
      .map(section => `# ${section.title}\n\n${section.content || 'No content yet'}\n\n`)
      .join('\n');

    // Create a Blob with the content
    const blob = new Blob([prdContent], { type: 'text/plain' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'project-requirements-document.txt');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex">
      {/* Main Container */}
      <div className="flex-1 flex justify-center">
        <div className="w-[900px] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.05]">
            {examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => !example.disabled && handleTabClick(idx)}
                className={`px-8 py-5 text-sm font-light transition-all duration-200 flex items-center gap-3
                  ${example.disabled 
                    ? "text-white/30 cursor-not-allowed" 
                    : activeTab === idx
                      ? "text-white border-b-2 border-white/50 bg-white/[0.02]"
                      : "text-white/50 hover:text-white/70 hover:bg-white/[0.02]"
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${example.disabled ? "bg-gray-500" : getStatusColor(tabStates[idx].status)}`} />
                {example.name}
                {example.disabled && (
                  <span className="ml-2 text-xs text-gray-500">Coming Soon</span>
                )}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            <ChatInterface 
              example={examples[activeTab]} 
              previousPRD={activeTab === 1 ? tabStates[0].refinedPRD : undefined}
              initialMessage={getTabInitialMessage(activeTab)}
              onMessagesUpdate={handleMessagesUpdate}
              context={{
                refinedPRD: tabStates[0].refinedPRD,
                techStack: tabStates[1]?.messages?.find(msg => msg.role === "assistant")?.content,
              }}
              onCopyToSidebar={(content) => updateSectionContent(content)}
            />
          </div>
        </div>
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-[300px] border-l border-white/[0.05] flex flex-col bg-black/40 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white/90 mb-6">Project Requirements Document</h3>
            
            {sidebarSections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <div 
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() => toggleSection(idx)}
                >
                  <h4 className="text-white/70 font-bold">{section.title}</h4>
                  {section.isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white/50" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  )}
                </div>
                
                <div className={`text-white/50 text-sm whitespace-pre-line ${section.isExpanded ? '' : 'line-clamp-4'}`}>
                  {section.content || 'No content yet'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="p-4 border-t border-white/[0.05]">
          <button
            onClick={handleExportPDF}
            className="w-full py-3 px-4 rounded-xl bg-white/[0.05] border border-white/[0.05] 
              text-white/90 hover:bg-white/[0.08] transition-all duration-200 
              flex items-center justify-center gap-2 group"
          >
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Export PRD</span>
          </button>
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