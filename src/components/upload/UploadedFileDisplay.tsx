
import React from "react";
import { X, FileText } from "lucide-react";

interface UploadedFileDisplayProps {
  file: File;
  uploadProgress: number;
  isUploading: boolean;
  uploadComplete: boolean;
  onRemove: () => void;
}

export const UploadedFileDisplay: React.FC<UploadedFileDisplayProps> = ({
  file,
  uploadProgress,
  isUploading,
  uploadComplete,
  onRemove,
}) => {
  const truncateFileName = (fileName: string, maxLength: number = 40) => {
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 7); // 7 for "[...]."
    
    return `${truncatedName}[...].${extension}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {truncateFileName(file.name)}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          aria-label="Remove file"
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
        <div className="text-xs text-green-600 font-medium">
          Upload complete!
        </div>
      )}
    </div>
  );
};
