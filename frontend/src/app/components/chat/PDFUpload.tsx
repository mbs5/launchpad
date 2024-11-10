"use client";

import { useState } from "react";
import { FileText, X } from "lucide-react";

type PDFUploadProps = {
  onUpload: (file: File) => void;
  onRemove: () => void;
  currentFile?: { name: string; size: number } | null;
};

export default function PDFUpload({ onUpload, onRemove, currentFile }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");
    if (pdfFile) {
      onUpload(pdfFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onUpload(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {currentFile ? (
        <div className="flex items-center gap-2 p-2 bg-white/[0.03] rounded-lg">
          <FileText className="w-5 h-5 text-white/60" />
          <span className="text-sm text-white/80 flex-1">
            {currentFile.name} ({formatFileSize(currentFile.size)})
          </span>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-white/[0.05] rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors
            ${isDragging 
              ? "border-white/30 bg-white/[0.05]" 
              : "border-white/10 hover:border-white/20"}`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            Drop PDF resume here or click to upload
          </label>
        </div>
      )}
    </div>
  );
} 