import { supabase, withTimeout, TimeoutError } from './supabase';
import { showToast } from '../components/Toaster';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a single photo to Supabase storage
 */
export const uploadPhoto = async (
  file: File,
  userId: string,
  reviewId?: string
): Promise<UploadResult | null> => {
  console.log('uploadPhoto: Started for file:', file.name);
  console.log('uploadPhoto: File details - size:', file.size, 'type:', file.type);
  
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log('uploadPhoto: File type validation failed:', file.type);
      showToast('error', 'Please upload only JPEG, PNG, WebP, or GIF images');
      return null;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('uploadPhoto: File size validation failed:', file.size, 'max:', maxSize);
      showToast('error', 'Image must be smaller than 10MB');
      return null;
    }

    console.log('uploadPhoto: File validation passed');

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    
    // Create file path: userId/reviewId/filename or userId/temp/filename
    const folder = reviewId || 'temp';
    const filePath = `${userId}/${folder}/${fileName}`;
    console.log('uploadPhoto: Generated file path:', filePath);
    console.log('uploadPhoto: About to call supabase.storage.from("review-photos").upload()');

    // Upload file to Supabase storage with timeout
    const uploadStartTime = Date.now();
    
    const uploadPromise = supabase.storage
      .from('review-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // Wrap the upload with a timeout (60 seconds for file uploads)
    const { data, error } = await withTimeout(
      uploadPromise,
      60000, // 60 seconds timeout for file uploads
      'Storage upload'
    );

    const uploadEndTime = Date.now();
    console.log('uploadPhoto: Upload call completed in', uploadEndTime - uploadStartTime, 'ms');

    if (error) {
      console.error('uploadPhoto: Storage upload error:', error);
      console.error('uploadPhoto: Error details - message:', error.message, 'statusCode:', error.statusCode);
      showToast('error', `Upload failed: ${error.message}`);
      return null;
    }

    console.log('uploadPhoto: Upload successful, data:', data);
    console.log('uploadPhoto: Upload data path:', data?.path);

    // Get public URL
    console.log('uploadPhoto: Getting public URL for path:', data.path);
    const { data: urlData } = supabase.storage
      .from('review-photos')
      .getPublicUrl(data.path);
    
    console.log('uploadPhoto: Got public URL:', urlData.publicUrl);

    const result = {
      url: urlData.publicUrl,
      path: data.path,
    };

    console.log('uploadPhoto: Returning result:', result);
    return result;
  } catch (error: any) {
    console.error('uploadPhoto: Caught error during photo upload:', error);
    console.error('uploadPhoto: Error stack:', error.stack);
    console.error('uploadPhoto: Error name:', error.name);
    console.error('uploadPhoto: Error message:', error.message);
    
    // Handle timeout errors specifically
    if (error instanceof TimeoutError) {
      console.error('uploadPhoto: Upload timed out');
      showToast('error', 'Upload timed out. Please check your connection and try again.');
    } else {
      showToast('error', 'Failed to upload photo. Please try again.');
    }
    
    return null;
  }
};

/**
 * Upload multiple photos for a review
 */
export const uploadReviewPhotos = async (
  files: File[],
  userId: string,
  reviewId?: string
): Promise<UploadResult[]> => {
  console.log('uploadReviewPhotos: Starting batch upload for', files.length, 'files');
  const uploadPromises = files.map((file, index) => {
    console.log(`uploadReviewPhotos: Starting upload ${index + 1}/${files.length} for file:`, file.name);
    return uploadPhoto(file, userId, reviewId);
  });
  
  const results = await Promise.all(uploadPromises);
  console.log('uploadReviewPhotos: All uploads completed, results:', results);
  
  // Filter out failed uploads
  const successfulResults = results.filter((result): result is UploadResult => result !== null);
  console.log('uploadReviewPhotos: Successful uploads:', successfulResults.length, 'out of', results.length);
  
  return successfulResults;
};

/**
 * Delete a photo from storage
 */
export const deletePhoto = async (filePath: string): Promise<boolean> => {
  console.log('deletePhoto: Attempting to delete:', filePath);
  try {
    const deletePromise = supabase.storage
      .from('review-photos')
      .remove([filePath]);

    // Wrap delete operation with timeout
    const { error } = await withTimeout(
      deletePromise,
      10000, // 10 seconds timeout for delete operations
      'Storage delete'
    );

    if (error) {
      console.error('deletePhoto: Error deleting photo:', error);
      showToast('error', 'Failed to delete photo');
      return false;
    }

    console.log('deletePhoto: Successfully deleted:', filePath);
    return true;
  } catch (error) {
    console.error('deletePhoto: Caught error:', error);
    
    if (error instanceof TimeoutError) {
      showToast('error', 'Delete operation timed out');
    } else {
      showToast('error', 'Failed to delete photo');
    }
    
    return false;
  }
};

/**
 * Move photos from temp folder to review folder after review creation
 */
export const movePhotosToReview = async (
  tempPaths: string[],
  userId: string,
  reviewId: string
): Promise<string[]> => {
  console.log('movePhotosToReview: Moving', tempPaths.length, 'photos from temp to review folder');
  const movedPaths: string[] = [];

  for (const tempPath of tempPaths) {
    console.log('movePhotosToReview: Processing path:', tempPath);
    try {
      // Extract filename from temp path
      const fileName = tempPath.split('/').pop();
      if (!fileName) {
        console.log('movePhotosToReview: Could not extract filename from:', tempPath);
        continue;
      }

      const newPath = `${userId}/${reviewId}/${fileName}`;
      console.log('movePhotosToReview: Moving from', tempPath, 'to', newPath);

      // Move file by copying and then deleting original
      const downloadPromise = supabase.storage
        .from('review-photos')
        .download(tempPath);

      const { data: fileData, error: downloadError } = await withTimeout(
        downloadPromise,
        15000, // 15 seconds for download
        'Storage download'
      );

      if (downloadError || !fileData) {
        console.error('movePhotosToReview: Error downloading temp file:', downloadError);
        continue;
      }

      console.log('movePhotosToReview: Downloaded temp file, size:', fileData.size);

      // Upload to new location
      const uploadPromise = supabase.storage
        .from('review-photos')
        .upload(newPath, fileData, {
          cacheControl: '3600',
          upsert: false,
        });

      const { data: uploadData, error: uploadError } = await withTimeout(
        uploadPromise,
        20000, // 20 seconds for upload
        'Storage upload (move)'
      );

      if (uploadError) {
        console.error('movePhotosToReview: Error uploading to new location:', uploadError);
        continue;
      }

      console.log('movePhotosToReview: Uploaded to new location:', uploadData.path);

      // Delete temp file
      const deletePromise = supabase.storage
        .from('review-photos')
        .remove([tempPath]);

      const { error: deleteError } = await withTimeout(
        deletePromise,
        10000, // 10 seconds for delete
        'Storage delete (cleanup)'
      );

      if (deleteError) {
        console.error('movePhotosToReview: Error deleting temp file:', deleteError);
        // Continue anyway since the file was successfully moved
      } else {
        console.log('movePhotosToReview: Deleted temp file:', tempPath);
      }

      movedPaths.push(uploadData.path);
    } catch (error) {
      console.error('movePhotosToReview: Error moving photo:', error);
      
      if (error instanceof TimeoutError) {
        console.error('movePhotosToReview: Move operation timed out for:', tempPath);
      }
    }
  }

  console.log('movePhotosToReview: Successfully moved', movedPaths.length, 'photos');
  return movedPaths;
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string => {
  // For now, return the original URL
  // In the future, you could implement image transformations
  // using Supabase's image transformation features or a service like Cloudinary
  return url;
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  console.log('validateImageFile: Validating file:', file.name, 'type:', file.type, 'size:', file.size);
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    console.log('validateImageFile: Invalid file type:', file.type);
    return {
      valid: false,
      error: 'Please upload only JPEG, PNG, WebP, or GIF images',
    };
  }

  if (file.size > maxSize) {
    console.log('validateImageFile: File too large:', file.size, 'max:', maxSize);
    return {
      valid: false,
      error: 'Image must be smaller than 10MB',
    };
  }

  console.log('validateImageFile: File validation passed');
  return { valid: true };
};

/**
 * Compress image before upload (optional)
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> => {
  console.log('compressImage: Starting compression for:', file.name, 'original size:', file.size);
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      console.log('compressImage: Image loaded, original dimensions:', img.width, 'x', img.height);
      
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      console.log('compressImage: New dimensions:', newWidth, 'x', newHeight, 'ratio:', ratio);

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            console.log('compressImage: Compression complete, new size:', compressedFile.size, 'reduction:', ((file.size - compressedFile.size) / file.size * 100).toFixed(1) + '%');
            resolve(compressedFile);
          } else {
            console.log('compressImage: Compression failed, returning original file');
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      console.error('compressImage: Error loading image for compression');
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
};