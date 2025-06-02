import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle, Folder } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface UploadedFile {
  name: string;
  size: number;
  uploadDate: Date;
}

interface DocsFile {
  name: string;
  path: string;
  isDirectory: boolean;
}

const Docs = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [docsFiles, setDocsFiles] = useState<DocsFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // Load files from .docs folder on component mount
  useEffect(() => {
    loadDocsFiles();
  }, []);

  const loadDocsFiles = async () => {
    try {
      setIsLoadingDocs(true);
      // Simulate loading .docs files - in a real implementation this would fetch from your file system
      const mockDocsFiles: DocsFile[] = [
        { name: "README.md", path: ".docs/README.md", isDirectory: false },
        { name: "upload.html", path: ".docs/upload.html", isDirectory: false },
      ];
      
      setDocsFiles(mockDocsFiles);
      console.log('Loaded docs files:', mockDocsFiles);
    } catch (error) {
      console.error('Failed to load docs files:', error);
      toast.error("Failed to load docs files", {
        description: "Could not retrieve files from .docs folder",
        duration: 3000,
      });
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    addFiles(files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i < selectedFiles.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Add uploaded files to the uploaded files list
      const newUploadedFiles = selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        uploadDate: new Date()
      }));
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      
      console.log('Files uploaded successfully:', selectedFiles.map(f => f.name));
      
      // Show success notification
      toast.success("Files uploaded successfully!", {
        description: `${selectedFiles.length} file(s) uploaded`,
        duration: 3000,
      });
      
      clearFiles();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error("Upload failed", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Docs</h1>
          
          {/* .docs Folder Files Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Folder className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">.docs Folder</h2>
            </div>
            
            {isLoadingDocs ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-gray-500">Loading files...</div>
              </div>
            ) : docsFiles.length > 0 ? (
              <div className="space-y-2">
                {docsFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center">
                      {file.isDirectory ? (
                        <Folder className="h-5 w-5 text-blue-600 mr-2" />
                      ) : (
                        <File className="h-5 w-5 text-blue-600 mr-2" />
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <div className="text-xs text-gray-500">{file.path}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No files found in .docs folder
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-6">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Select files to upload
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload files</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        accept=".md,.txt,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    MD, TXT, PDF, DOC, DOCX, PNG, JPG up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mb-6 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={clearFiles}
                disabled={selectedFiles.length === 0}
              >
                Clear All
              </Button>
              <Button 
                onClick={uploadFiles}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>

            {isUploading && (
              <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Uploading... {Math.round(uploadProgress)}%</p>
              </div>
            )}
          </div>

          {/* Uploaded Files Section */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Uploaded Files</h2>
              </div>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {file.uploadDate.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUploadedFile(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <a href="/" className="text-indigo-600 hover:text-indigo-500 font-medium">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
