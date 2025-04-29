import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export class FileRepository {
  /**
   * Store a file in Firebase Storage
   */
  async storeFile(
    fileData: Buffer,
    fileName: string,
    directory: string = 'documents'
  ): Promise<string> {
    try {
      // Create a unique file path with timestamp
      const filePath = `${directory}/${Date.now()}_${fileName}`;
      const fileRef = ref(storage, filePath);
      
      // Upload the file content
      await uploadBytes(fileRef, fileData);
      
      // Retrieve the public URL for accessing the file
      const publicUrl = await getDownloadURL(fileRef);
      
      return publicUrl;
    } catch (error) {
      console.error('Error storing file:', error);
      throw new Error('Failed to store file. Please try again.');
    }
  }
  
  /**
   * Remove a file from Firebase Storage
   */
  async removeFile(fileUrl: string): Promise<void> {
    try {
      // Get reference to the file from its URL
      const fileRef = ref(storage, fileUrl);
      
      // Delete the file from storage
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error removing file:', error);
      throw new Error('Failed to remove file. Please try again.');
    }
  }
}

export const fileRepository = new FileRepository(); 