import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadZoneProps {
  images: File[];
  imagePreviews: string[];
  onImagesChange: (images: File[], previews: string[]) => void;
  maxFiles?: number;
}

export function ImageUploadZone({
  images,
  imagePreviews,
  onImagesChange,
  maxFiles = 5,
}: ImageUploadZoneProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<File> => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Compression error:', error);
      return file; // Return original if compression fails
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      setIsCompressing(true);
      
      try {
        // Compress all images
        const compressedFiles = await Promise.all(
          acceptedFiles.map(file => compressImage(file))
        );
        
        const newFiles = [...images, ...compressedFiles].slice(0, maxFiles);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        
        onImagesChange(newFiles, newPreviews);
        
        toast({
          title: 'Images uploaded',
          description: `${compressedFiles.length} image(s) compressed and uploaded successfully`,
        });
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: 'Failed to compress images. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsCompressing(false);
      }
    },
    [images, maxFiles, onImagesChange, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: maxFiles - images.length,
    disabled: images.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    const newFiles = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    onImagesChange(newFiles, newPreviews);
  };

  return (
    <div className="space-y-4">
      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-accent bg-accent/10'
              : 'border-border hover:border-primary'
          } ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} disabled={isCompressing} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {isCompressing ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium mb-1">
                {isCompressing 
                  ? 'Compressing images...' 
                  : isDragActive 
                  ? 'Drop your images here' 
                  : 'Drag & drop images'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isCompressing 
                  ? 'Please wait...' 
                  : `or click to browse • ${images.length}/${maxFiles} uploaded`}
              </p>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {imagePreviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {imagePreviews.map((preview, index) => (
              <motion.div
                key={preview}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
              >
                <img
                  src={preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
