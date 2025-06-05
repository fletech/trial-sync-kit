
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
  const truncateFileName = (fileName: string, maxLength: number = 30) => {
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 7);
    
    return `${truncatedName}[...].${extension}`;
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">PDF</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 truncate font-medium">
              {truncateFileName(file.name)}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded ml-4"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isUploading && (
        <div className="mt-3 space-y-2">
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
    </div>
  );
};
