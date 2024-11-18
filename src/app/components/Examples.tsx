"use client";

import { useState } from "react";
import { examples } from "./examplesList";
import { Example } from "./examplesList";

const Examples = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [output, setOutput] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = async (example: Example) => {
    if (example.disabled) return;
    
    setLoading(prev => ({ ...prev, [example.name]: true }));
    setError(null);
    setOutput(prev => ({ ...prev, [example.name]: null }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: example.input.message,
          input: example.input
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setOutput(prev => ({ ...prev, [example.name]: result }));
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to process request. Please try again.");
      setOutput(prev => ({ ...prev, [example.name]: null }));
    } finally {
      setLoading(prev => ({ ...prev, [example.name]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center sm:items-start">
      {error && (
        <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}
      {examples.map((example, index) => (
        <div key={index} className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">{example.name}</h3>
          <p className="text-sm">{example.description}</p>
          <button
            className={`rounded-full border border-solid transition-colors flex items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5
              ${example.disabled ? 'opacity-50 cursor-not-allowed' : 
                loading[example.name] ? 'bg-white/[0.05] border-white/[0.1]' : 
                'border-white/[.08] hover:bg-white/[0.05]'}`}
            onClick={() => handleButtonClick(example)}
            disabled={loading[example.name] || example.disabled}
          >
            {loading[example.name] ? "Processing..." : "Start Chat"}
          </button>
        </div>
      ))}
      {output && (
        <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <h4 className="text-lg font-bold">Output:</h4>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Examples;
