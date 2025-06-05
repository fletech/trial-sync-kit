import React, { useState } from "react";
import { getUser } from "@/services/userService";
import { FileUploadArea } from "./upload/FileUploadArea";
import { UploadedFileDisplay } from "./upload/UploadedFileDisplay";
import { PathSelectionCards } from "./upload/PathSelectionCards";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  const [selectedPath, setSelectedPath] = useState<string>("/document-assistant");

  // Get user data for dynamic greeting
  const user = getUser();
  const userName = user?.name || "Terry";

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
        selectedPath: selectedPath, // Pass the selected path
      };
      onUploadComplete(document);
    }
  };

  const handlePathSelect = (path: string) => {
    setSelectedPath(path);
  };

  // Standalone mode (full screen) - updated for dashboard flow
  if (standalone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-medium text-gray-800 mb-4">
              Hello, {userName}
            </h1>
            <p className="text-gray-600 text-lg">
              Let's start by uploading a protocol for the {trialName}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
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
                  <PathSelectionCards 
                    onPathSelect={handlePathSelect} 
                    selectedPath={selectedPath}
                  />
                )}
              </>
            )}
          </div>
          
          {uploadComplete && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium"
              >
                Continue <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          )}
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
                <PathSelectionCards 
                  onPathSelect={handlePathSelect} 
                  selectedPath={selectedPath}
                />
              )}
            </>
          )}
        </div>
        
        {uploadComplete && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium"
            >
              Continue <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
