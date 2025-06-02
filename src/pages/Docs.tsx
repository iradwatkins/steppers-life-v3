import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, File, X, Folder, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { User } from '@supabase/supabase-js';
import SimpleAuth from '@/components/SimpleAuth';
import UploadedFilesList from '@/components/UploadedFilesList';
import { useFileOperations } from '@/hooks/useFileOperations';

interface DocsFile {
  name: string;
  path: string;
  isDirectory: boolean;
  url?: string;
}

const Docs = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [docsFiles, setDocsFiles] = useState<DocsFile[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { uploadFiles, isUploading, uploadProgress } = useFileOperations();

  // Load files from .docs folder on component mount
  useEffect(() => {
    loadDocsFiles();
  }, [refreshTrigger]);

  const loadDocsFiles = async () => {
    try {
      setIsLoadingDocs(true);
      
      // Note: Web browsers cannot directly access local file system
      // This shows the conceptual .docs folder structure
      const docsFiles: DocsFile[] = [
        { name: "README.md", path: ".docs/README.md", isDirectory: false },
        { name: "upload.html", path: ".docs/upload.html", isDirectory: false },
      ];
      
      setDocsFiles(docsFiles);
      console.log('Loaded docs files:', docsFiles);
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

  const handleRefreshFolders = () => {
    console.log('Refreshing folders...');
    setRefreshTrigger(prev => prev + 1);
    toast.success("Refreshing folders", {
      description: "Reloading files from both local .docs and Supabase Storage",
      duration: 2000,
    });
  };

  const uploadToDocsFolder = async (files: File[]) => {
    // Note: This is a conceptual implementation
    // Web browsers cannot write directly to local file system
    toast.error("Cannot upload to local .docs folder", {
      description: "Web browsers cannot write to local file system for security reasons. Files will be uploaded to Supabase Storage instead.",
      duration: 5000,
    });
    
    // Fallback to Supabase upload
    await handleUploadFiles();
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

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    const result = await uploadFiles(selectedFiles);
    if (result) {
      clearFiles();
      setRefreshTrigger(prev => prev + 1); // Trigger refresh of uploaded files list
    }
  };

  const handleUploadToDocsFolder = async () => {
    if (selectedFiles.length === 0) return;
    await uploadToDocsFolder(selectedFiles);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Docs</h1>
            <Button
              onClick={handleRefreshFolders}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Folders
            </Button>
          </div>
          
          {/* Authentication Section */}
          <SimpleAuth onAuthChange={setUser} />
          
          {/* Local .docs Folder Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Folder className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Local .docs Folder</h2>
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Local Files
              </span>
            </div>
            
            {isLoadingDocs ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-gray-500">Loading files...</div>
              </div>
            ) : docsFiles.length > 0 ? (
              <div className="space-y-2">
                {docsFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      {file.isDirectory ? (
                        <Folder className="h-5 w-5 text-gray-600 mr-2" />
                      ) : (
                        <File className="h-5 w-5 text-gray-600 mr-2" />
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
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Web browsers cannot write files directly to the local file system for security reasons. 
                To add files to the .docs folder, you need to add them manually in your code editor.
              </p>
            </div>
          </div>

          {/* Uploaded Files from Supabase Storage */}
          <UploadedFilesList user={user} refreshTrigger={refreshTrigger} />

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Sign in above to upload files to Supabase Storage
                </p>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Select files to upload
              </label>
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
                  !user ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={user ? handleDrop : undefined}
                onDragOver={user ? handleDragOver : undefined}
              >
                <div className="space-y-1 text-center">
                  <Upload className={`mx-auto h-12 w-12 ${!user ? 'text-gray-300' : 'text-gray-400'}`} />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium ${
                      !user ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-500'
                    }`}>
                      <span>Upload files</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        accept=".md,.txt,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileSelect}
                        disabled={!user}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    MD, TXT, PDF, DOC, DOCX, PNG, JPG up to 10MB each
                  </p>
                  {!user && (
                    <p className="text-xs text-yellow-600 font-medium">
                      Authentication required
                    </p>
                  )}
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

            <div className="flex justify-between items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={clearFiles}
                disabled={selectedFiles.length === 0}
              >
                Clear All
              </Button>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleUploadToDocsFolder}
                  disabled={selectedFiles.length === 0}
                  variant="outline"
                >
                  Upload to .docs (Local)
                </Button>
                <Button 
                  onClick={handleUploadFiles}
                  disabled={selectedFiles.length === 0 || isUploading || !user}
                >
                  {isUploading ? 'Uploading...' : 'Upload to Supabase Storage'}
                </Button>
              </div>
            </div>

            {isUploading && (
              <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Uploading to Supabase Storage... {Math.round(uploadProgress)}%</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <a href="/" className="text-indigo-600 hover:text-indigo-500 font-medium">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
