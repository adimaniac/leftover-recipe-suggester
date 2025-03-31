'use client'

import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      showPreview(file);
    }
  };

  const showPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      showPreview(file);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("API request timed out after 15 seconds");
        onUpload(fileInputRef.current?.files?.[0] as File).catch(err => {
          console.error("Upload failed after timeout:", err);
        });
      }
    }, 15000);
    
    try {
      await onUpload(fileInputRef.current.files[0]);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="w-full">
          <label 
            className="upload-label"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center space-y-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
            </div>
            <input 
              ref={fileInputRef}
              id="vegetableImage" 
              name="vegetableImage" 
              type="file" 
              accept="image/*" 
              className="input-upload" 
              required
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      
      {previewUrl && (
        <div className="mt-4">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full rounded-lg max-h-64 object-contain" 
            />
            <button 
              type="button" 
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              onClick={removePreview}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary"
        disabled={isLoading || !previewUrl}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Get Recipe Suggestions
          </>
        )}
      </button>
    </form>
  );
};

export default FileUpload;