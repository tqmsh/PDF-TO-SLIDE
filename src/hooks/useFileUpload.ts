import { useState } from 'react';
import { readFileAsBuffer, isAcceptableFile } from '@/utils/fileHelper';
import { storageService } from '@/services/storage';

interface FileUploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  fileUrl: string | null;
}

export const useFileUpload = (acceptedTypes: string[] = ['application/pdf']) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    error: null,
    fileUrl: null
  });

  const uploadFile = async (file: File): Promise<string> => {
    // Check if file is acceptable
    if (!isAcceptableFile(file, acceptedTypes)) {
      const error = `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
      setUploadState((prev) => ({ ...prev, error }));
      throw new Error(error);
    }

    try {
      // Start upload
      setUploadState({
        uploading: true,
        progress: 0,
        error: null,
        fileUrl: null
      });

      // Read file as buffer
      const fileBuffer = await readFileAsBuffer(file);
      
      // Simulate progress (since Firebase storage doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setUploadState((prev) => {
          const newProgress = Math.min(prev.progress + 10, 90);
          return { ...prev, progress: newProgress };
        });
      }, 500);

      // Upload to Firebase
      const fileUrl = await storageService.uploadFile(fileBuffer, file.name);
      
      // Clear interval and set success state
      clearInterval(progressInterval);
      setUploadState({
        uploading: false,
        progress: 100,
        error: null,
        fileUrl
      });

      return fileUrl;
    } catch (error) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: (error as Error).message,
        fileUrl: null
      });
      throw error;
    }
  };

  const resetUploadState = () => {
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      fileUrl: null
    });
  };

  return {
    uploadFile,
    resetUploadState,
    ...uploadState
  };
}; 