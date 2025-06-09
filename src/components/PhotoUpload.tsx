import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadPhoto, validateImageFile, compressImage, type UploadResult } from '../lib/storage';
import { showToast } from './Toaster';

interface PhotoUploadProps {
  photos: UploadResult[];
  onPhotosChange: (photos: UploadResult[]) => void;
  userId: string;
  maxPhotos?: number;
  reviewId?: string;
  disabled?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onPhotosChange,
  userId,
  maxPhotos = 5,
  reviewId,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileSelect: Started'); // Add this
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      showToast('error', `You can only upload up to ${maxPhotos} photos`);
      return;
    }

    // Process each file
    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`;
      console.log(`handleFileSelect: Processing file ${file.name} with ID ${fileId}`); // Add this
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        showToast('error', validation.error || 'Invalid file');
        console.log(`handleFileSelect: Validation failed for ${file.name}`); // Add this
        continue;
      }

      setUploading(prev => new Set(prev).add(fileId));
      console.log(`handleFileSelect: Set uploading state for ${fileId}`); // Add this

      try {
        console.log(`handleFileSelect: Starting compression for ${file.name}`); // Add this
        // Compress image if it's large
        const processedFile = file.size > 2 * 1024 * 1024 
          ? await compressImage(file, 1920, 0.8)
          : file;
        console.log(`handleFileSelect: Compression finished for ${file.name}`); // Add this

        console.log(`handleFileSelect: Calling uploadPhoto for ${file.name}`); // Add this
        // Upload to Supabase storage
        const result = await uploadPhoto(processedFile, userId, reviewId);
        console.log(`handleFileSelect: uploadPhoto returned for ${file.name}, result:`, result); // Add this
        
        if (result) {
          onPhotosChange([...photos, result]);
          showToast('success', 'Photo uploaded successfully');
        } else {
          console.log(`handleFileSelect: uploadPhoto returned null for ${file.name}`); // Add this
        }
      } catch (error) {
        console.error('handleFileSelect: Error during upload process:', error); // Modify this
        showToast('error', 'Failed to upload photo');
      } finally {
        console.log(`handleFileSelect: Finally block for ${fileId}`); // Add this
        setUploading(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log('handleFileSelect: Finished'); // Add this
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const isUploading = uploading.size > 0;
  const canUploadMore = photos.length < maxPhotos && !disabled;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              disabled || isUploading
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              {isUploading ? (
                <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
              
              <div>
                <p className="text-gray-600 font-medium">
                  {isUploading ? 'Uploading photos...' : 'Click to upload photos'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Up to {maxPhotos} photos, max 10MB each
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, WebP, or GIF formats
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Camera className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Uploaded Photos ({photos.length}/{maxPhotos})
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={photo.path} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                
                {/* Photo overlay with info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo {index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Loader className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-700">
              Uploading {uploading.size} photo{uploading.size !== 1 ? 's' : ''}...
            </span>
          </div>
        </div>
      )}

      {/* Help Text */}
      {photos.length === 0 && !isUploading && (
        <div className="text-center py-4">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            Add photos to help others understand the accessibility features
          </p>
        </div>
      )}
    </div>
  );
};