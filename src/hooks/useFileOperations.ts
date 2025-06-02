
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface StoredFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type?: string;
  uploaded_by?: string;
  uploaded_at: string;
  storage_path: string;
}

export const useFileOperations = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication required", {
          description: "Please sign in to upload files",
          duration: 3000,
        });
        return;
      }

      const uploadedFiles: StoredFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const storagePath = `docs/${Date.now()}-${fileName}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('docs')
          .upload(storagePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${fileName}`, {
            description: uploadError.message,
            duration: 3000,
          });
          continue;
        }

        // Store file metadata in database
        const { data: dbData, error: dbError } = await supabase
          .from('uploaded_files')
          .insert({
            file_name: fileName,
            file_path: `docs/${fileName}`,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: user.id,
            storage_path: storagePath
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          toast.error(`Failed to save metadata for ${fileName}`, {
            description: dbError.message,
            duration: 3000,
          });
          continue;
        }

        uploadedFiles.push(dbData);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      console.log('Files uploaded successfully:', uploadedFiles);
      
      toast.success("Files uploaded successfully!", {
        description: `${uploadedFiles.length} file(s) uploaded to Supabase Storage`,
        duration: 3000,
      });

      return uploadedFiles;
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

  const deleteFile = async (file: StoredFile) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('docs')
        .remove([file.storage_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        throw dbError;
      }

      toast.success("File deleted successfully", {
        description: `${file.file_name} has been removed`,
        duration: 3000,
      });

      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error("Failed to delete file", {
        description: "Please try again",
        duration: 3000,
      });
      return false;
    }
  };

  const getFileUrl = (storagePath: string) => {
    const { data } = supabase.storage
      .from('docs')
      .getPublicUrl(storagePath);
    
    return data.publicUrl;
  };

  return {
    uploadFiles,
    deleteFile,
    getFileUrl,
    isUploading,
    uploadProgress
  };
};
