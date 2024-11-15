import { X } from "lucide-react";
import { ChatContext } from "@/app/types/chat";
import { useState } from "react";

type ContextIndicatorProps = {
  context: ChatContext;
  onClear?: () => void;
};

export default function ContextIndicator({ context, onClear }: ContextIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState<'prd' | 'preferences' | null>(null);

  if (!context?.refinedPRD && !context?.preferences) return null;

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="relative px-8 py-4 border-t border-white/[0.03] bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">Using context from:</span>
          <div className="flex gap-2">
            {context.refinedPRD && (
              <div className="relative">
                <span 
                  className="px-2 py-1 rounded-md bg-white/[0.05] text-xs text-white/70 cursor-help"
                  onMouseEnter={() => setShowTooltip('prd')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  Project Overview
                </span>
                {showTooltip === 'prd' && (
                  <div className="absolute bottom-full left-0 mb-2 w-80 p-4 rounded-lg bg-black/90 border border-white/10 shadow-xl z-50">
                    <h4 className="text-sm font-medium text-white/90 mb-2">Project Overview</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {truncateText(context.refinedPRD)}
                    </p>
                  </div>
                )}
              </div>
            )}
            {context.preferences && (
              <div className="relative">
                <span 
                  className="px-2 py-1 rounded-md bg-white/[0.05] text-xs text-white/70 cursor-help"
                  onMouseEnter={() => setShowTooltip('preferences')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  Project Preferences
                </span>
                {showTooltip === 'preferences' && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-4 rounded-lg bg-black/90 border border-white/10 shadow-xl z-50">
                    <h4 className="text-sm font-medium text-white/90 mb-2">Project Preferences</h4>
                    <ul className="text-xs text-white/70 space-y-1">
                      <li>• Complexity: {context.preferences.complexity}</li>
                      <li>• Timeline: {context.preferences.timeline}</li>
                      <li>• Priority: {context.preferences.priority}</li>
                      <li>• Deployment: {context.preferences.deployment}</li>
                      <li>• Team Size: {context.preferences.team}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="p-1 hover:bg-white/[0.05] rounded-full transition-colors"
            title="Clear context"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        )}
      </div>
    </div>
  );
} 