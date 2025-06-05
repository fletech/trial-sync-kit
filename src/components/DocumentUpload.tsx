
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getUser } from "@/services/userService";
import { FileUploadArea } from "./upload/FileUploadArea";
import { UploadedFileDisplay } from "./upload/UploadedFileDisplay";
import { PathSelectionCards } from "./upload/PathSelectionCards";

interface DocumentUploadProps {
  onUploadComplete: (document: any) => void;
  trialName: string;
  standalone?: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadComplete,
  trialName,
  standalone = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Get user data for dynamic greeting
  const user = getUser();
  const userName = user?.name || "User";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadingFile(file);
    startUpload(file);
  };

  const startUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random increment between 5-20%
      });
    }, 200);
  };

  const removeFile = () => {
    setUploadingFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
  };

  const handleContinue = () => {
    if (uploadingFile && uploadComplete) {
      const document = {
        name: uploadingFile.name,
        size: uploadingFile.size,
        type: uploadingFile.type,
        lastModified: uploadingFile.lastModified,
      };
      onUploadComplete(document);
    }
  };

  const handlePathSelect = (path: string) => {
    handleContinue();
  };

  // Standalone mode (full screen) - updated for dashboard flow
  if (standalone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Hello, {userName}
            </h1>
            <p className="text-gray-600">
              Let's start by uploading a protocol for {trialName}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Upload Document
            </h2>

            {!uploadingFile ? (
              <FileUploadArea
                isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
              />
            ) : (
              <>
                <UploadedFileDisplay
                  file={uploadingFile}
                  uploadProgress={uploadProgress}
                  isUploading={isUploading}
                  uploadComplete={uploadComplete}
                  onRemove={removeFile}
                />

                {uploadComplete && (
                  <PathSelectionCards onPathSelect={handlePathSelect} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Integrated mode (within existing layout)
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Document Assistant
        </h1>
        <p className="text-gray-600">
          Let's start by uploading a protocol for {trialName}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Upload Document
          </h2>

          {!uploadingFile ? (
            <FileUploadArea
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
            />
          ) : (
            <>
              <UploadedFileDisplay
                file={uploadingFile}
                uploadProgress={uploadProgress}
                isUploading={isUploading}
                uploadComplete={uploadComplete}
                onRemove={removeFile}
              />

              {uploadComplete && (
                <PathSelectionCards onPathSelect={handlePathSelect} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
