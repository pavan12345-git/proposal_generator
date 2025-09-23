"use client"

import React, { useCallback, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react'

export interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  caption?: string
}

interface ImageUploadProps {
  onImagesUploaded: (images: UploadedImage[]) => void
  maxFileSize?: number // in MB
  acceptedFormats?: string[]
  maxImages?: number
  className?: string
}

export function ImageUpload({
  onImagesUploaded,
  maxFileSize = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  maxImages = 10,
  className
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `File ${file.name} is not a supported image format. Please use JPG, PNG, GIF, or WebP.`
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`
    }
    
    return null
  }

  const processFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    // Validate files
    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push(file)
      }
    })

    // Show validation errors
    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (validFiles.length === 0) return

    setUploading(true)
    const uploadedImages: UploadedImage[] = []

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      
      try {
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [id]: 0 }))
        
        // Create object URL for preview
        const url = URL.createObjectURL(file)
        
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [id]: progress }))
          await new Promise(resolve => setTimeout(resolve, 50))
        }

        uploadedImages.push({
          id,
          file,
          url,
          name: file.name,
          caption: ''
        })
      } catch (error) {
        console.error('Error processing file:', file.name, error)
      }
    }

    setUploading(false)
    setUploadProgress({})
    onImagesUploaded(uploadedImages)
  }, [acceptedFormats, maxFileSize, onImagesUploaded])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50",
          uploading && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center space-y-3">
          {uploading ? (
            <>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              </div>
              <div className="text-sm text-slate-600">
                Uploading images...
              </div>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-slate-500" />
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-slate-500">
                PNG, JPG, GIF, WebP up to {maxFileSize}MB each
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface ImageDisplayProps {
  images: UploadedImage[]
  onRemoveImage: (id: string) => void
  onUpdateCaption: (id: string, caption: string) => void
  className?: string
}

export function ImageDisplay({ images, onRemoveImage, onUpdateCaption, className }: ImageDisplayProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-medium text-slate-900">Uploaded Images ({images.length})</h3>
      {images.map((image) => (
        <div key={image.id} className="flex gap-4 p-4 border border-slate-200 rounded-lg bg-white">
          {/* Image Preview */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={image.url}
                alt={image.name}
                className="h-24 w-32 object-cover rounded-md border border-slate-200"
              />
              <button
                onClick={() => onRemoveImage(image.id)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          {/* Image Info */}
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-slate-900 truncate">{image.name}</p>
                <p className="text-xs text-slate-500">
                  {(image.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <div>
                <label htmlFor={`caption-${image.id}`} className="block text-xs font-medium text-slate-700 mb-1">
                  Caption (optional)
                </label>
                <input
                  id={`caption-${image.id}`}
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => onUpdateCaption(image.id, e.target.value)}
                  placeholder="Add a caption for this image..."
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

