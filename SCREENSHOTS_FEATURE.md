# Screenshots Section - Image Upload Feature

## Overview

The Screenshots section now supports multiple image uploads with drag & drop functionality, allowing users to showcase their solution with visual representations.

## Features

### 🖼️ **Image Upload**
- **Drag & Drop**: Drag images directly onto the upload area
- **Click to Browse**: Click the upload area to open file browser
- **Multiple Files**: Upload multiple images at once
- **File Validation**: Supports JPG, PNG, GIF, WebP formats
- **Size Limits**: Maximum 5MB per image
- **Progress Indicators**: Visual feedback during upload process

### 📝 **Image Management**
- **Individual Captions**: Add custom captions for each image
- **Delete Functionality**: Remove individual images with delete button
- **Clear All**: Remove all images at once
- **Persistent Storage**: Images are saved in localStorage

### 🎨 **Display Format**
- **Vertical Layout**: Images displayed one below another
- **Professional Styling**: Clean borders and shadows
- **Responsive Design**: Adapts to different screen sizes
- **Aspect Ratio Preservation**: Images maintain their original proportions

### 📄 **Content Generation**
- **Auto-Generated Content**: Automatically creates descriptive text based on uploaded images
- **Manual Editing**: Edit the generated content as needed
- **Status Tracking**: Shows completion status (Complete, Needs Review, Generating)

## How to Use

### 1. **Select Screenshots Section**
- Go to Content Index page
- Check the "Screenshots" section
- Click "Generate Content"

### 2. **Upload Images**
- In the Content Generation page, find the Screenshots section
- Drag and drop images onto the upload area, or click to browse
- Wait for upload progress to complete

### 3. **Manage Images**
- Add captions to describe each image
- Remove individual images using the delete button
- Use "Clear All" to remove all images

### 4. **Generate Content**
- Click "Generate Content" to create descriptive text
- Edit the content manually if needed
- The section status will update to "Complete"

### 5. **Preview**
- View the final result in the document preview
- Images appear in the proposal with captions
- Content describes the visual elements

## Technical Details

### **File Structure**
```
components/
├── image-upload.tsx          # Core upload component
├── screenshots-section.tsx   # Screenshots section wrapper
└── ...

app/content-generation/
└── page.tsx                  # Updated to handle screenshots
```

### **Data Storage**
- Images stored as object URLs in localStorage
- Section data persisted across page refreshes
- Captions and metadata saved with images

### **Integration Points**
- Integrates with existing content generation system
- Works with proposal preview functionality
- Maintains section status tracking

## File Format Support

| Format | Extension | Max Size |
|--------|-----------|----------|
| JPEG   | .jpg, .jpeg | 5MB |
| PNG    | .png      | 5MB |
| GIF    | .gif      | 5MB |
| WebP   | .webp     | 5MB |

## Browser Compatibility

- Modern browsers with File API support
- Drag & drop functionality
- Object URL support for image previews

## Future Enhancements

- Image compression before upload
- Cloud storage integration
- Image editing capabilities
- Batch operations
- Image reordering

