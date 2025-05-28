import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, ArrowRight } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const clickToUpload = () => {
    fileInputRef.current?.click();
  };

  // Standalone mode (full screen)
  if (standalone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Hello, Terry
            </h1>
            <p className="text-gray-600">
              Let's start by uploading a protocol for the {trialName}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Upload Document
            </h2>

            {!uploadingFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={clickToUpload}
                style={{ cursor: "pointer" }}
              >
                <div className="text-gray-500">
                  <p className="text-sm">Drag and drop or click to</p>
                  <p className="text-sm">upload a new document</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx"
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {uploadingFile.name}
                    </span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Uploading...</span>
                      <span>{Math.round(Math.min(uploadProgress, 100))}%</span>
                    </div>
                  </div>
                )}

                {uploadComplete && (
                  <div className="text-xs text-gray-500">Done!</div>
                )}
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={handleContinue}
                disabled={!uploadComplete}
                className={`w-full ${
                  uploadComplete
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Document Assistant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
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
          Let's start by uploading a protocol for the {trialName}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Upload Document
          </h2>

          {!uploadingFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={clickToUpload}
              style={{ cursor: "pointer" }}
            >
              <div className="text-gray-500">
                <p className="text-sm">Drag and drop or click to</p>
                <p className="text-sm">upload a new document</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
                accept=".pdf,.doc,.docx"
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {uploadingFile.name}
                  </span>
                </div>
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Uploading...</span>
                    <span>{Math.round(Math.min(uploadProgress, 100))}%</span>
                  </div>
                </div>
              )}

              {uploadComplete && (
                <div className="text-xs text-gray-500">Done!</div>
              )}
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={handleContinue}
              disabled={!uploadComplete}
              className={`w-full ${
                uploadComplete
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to Document Assistant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
