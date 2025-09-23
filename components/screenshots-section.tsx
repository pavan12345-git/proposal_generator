"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ImageUpload, ImageDisplay, UploadedImage } from './image-upload'
import { ImageIcon, Plus, Edit3, Trash2 } from 'lucide-react'

interface ScreenshotsSectionProps {
  sectionId: string
  title: string
  content: string
  status: "Generating" | "Complete" | "Needs Review"
  onUpdateContent: (content: string) => void
  onUpdateStatus: (status: "Generating" | "Complete" | "Needs Review") => void
  className?: string
}

export function ScreenshotsSection({
  sectionId,
  title,
  content,
  status,
  onUpdateContent,
  onUpdateStatus,
  className
}: ScreenshotsSectionProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingContent, setEditingContent] = useState(content)

  // Load images from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`screenshots_${sectionId}`)
      if (stored) {
        const parsedImages = JSON.parse(stored)
        setImages(parsedImages)
      }
    } catch (error) {
      console.error('Error loading screenshots:', error)
    }
  }, [sectionId])

  // Save images to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(`screenshots_${sectionId}`, JSON.stringify(images))
    } catch (error) {
      console.error('Error saving screenshots:', error)
    }
  }, [images, sectionId])

  const handleImagesUploaded = (newImages: UploadedImage[]) => {
    setImages(prev => [...prev, ...newImages])
    onUpdateStatus("Needs Review")
  }

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      // Revoke object URL to free memory
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      return updated
    })
    onUpdateStatus("Needs Review")
  }

  const handleUpdateCaption = (id: string, caption: string) => {
    setImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, caption } : img
      )
    )
    onUpdateStatus("Needs Review")
  }

  const handleSaveContent = () => {
    onUpdateContent(editingContent)
    setIsEditing(false)
    onUpdateStatus("Needs Review")
  }

  const handleCancelEdit = () => {
    setEditingContent(content)
    setIsEditing(false)
  }

  const generateScreenshotsContent = () => {
    if (images.length === 0) {
      return "No screenshots uploaded yet. Please upload images to showcase your solution."
    }

    let content = `This section includes ${images.length} screenshot${images.length === 1 ? '' : 's'} demonstrating key features and functionality:\n\n`
    
    images.forEach((image, index) => {
      content += `${index + 1}. ${image.caption || image.name}\n`
    })

    content += `\nThese visual representations help illustrate the user experience and key features of the proposed solution.`
    
    return content
  }

  const handleGenerateContent = () => {
    const generatedContent = generateScreenshotsContent()
    setEditingContent(generatedContent)
    onUpdateContent(generatedContent)
    onUpdateStatus("Complete")
  }

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white p-4", className)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1",
              status === "Complete" && "bg-green-50 text-green-700 ring-green-200",
              status === "Generating" && "bg-blue-50 text-blue-700 ring-blue-200",
              status === "Needs Review" && "bg-amber-50 text-amber-800 ring-amber-200"
            )}>
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                status === "Complete" && "bg-green-600",
                status === "Generating" && "bg-blue-600",
                status === "Needs Review" && "bg-amber-500"
              )} />
              {status}
            </span>
          </div>
          
          {/* Content Display/Edit */}
          <div className="text-xs text-slate-600">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1 leading-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={4}
                  placeholder="Describe the screenshots and their purpose..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveContent}
                    className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="line-clamp-3 text-pretty">
                <p>{content || "No content yet. Upload images and generate content to describe your screenshots."}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-4">
        <ImageUpload
          onImagesUploaded={handleImagesUploaded}
          maxFileSize={5}
          maxImages={10}
          className="mb-4"
        />
      </div>

      {/* Image Display */}
      {images.length > 0 && (
        <div className="mb-4">
          <ImageDisplay
            images={images}
            onRemoveImage={handleRemoveImage}
            onUpdateCaption={handleUpdateCaption}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit3 className="h-3 w-3" />
            Edit Content
          </button>
        )}
        
        <button
          onClick={handleGenerateContent}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Generate Content
        </button>
        
        {images.length > 0 && (
          <button
            onClick={() => {
              setImages([])
              onUpdateStatus("Needs Review")
            }}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}

