"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { parseMarkdownTable, formatProjectOverviewContent, formatKeyValuePropositionsContent, extractTechStackContent, formatTechStackContent } from "@/lib/proposal-utils"

type SectionStatus = "approved" | "rejected" | "pending"
type Section = {
  id: string
  title: string
  content: string
  status: SectionStatus
  editing?: boolean
  originalContent?: string
}

type ImageItem = {
  id: string
  url: string
  name: string
}

export default function FinalReviewPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exportFormat, setExportFormat] = useState<"PDF" | "Word" | "PowerPoint">("PDF")
  const [pfdImage, setPfdImage] = useState<{ url: string; name: string } | null>(null)
  const [taImages, setTaImages] = useState<ImageItem[]>([])
  const [screenshots, setScreenshots] = useState<ImageItem[]>([])

  // Load generated sections from localStorage
  useEffect(() => {
    const loadSections = () => {
      try {
        const proposalRaw = localStorage.getItem("currentProposal")
        const selectedSectionsRaw = localStorage.getItem("selectedSections")
        
        if (proposalRaw && selectedSectionsRaw) {
          const proposal = JSON.parse(proposalRaw)
          const selectedSections = JSON.parse(selectedSectionsRaw)
          
          // Create sections array from generated content
          const generatedSections: Section[] = selectedSections.map((section: any, index: number) => {
            const generatedContent = proposal.sections?.[section.id]
            return {
              id: section.id,
              title: section.title || section.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              content: generatedContent?.content || "Content not available",
              status: "pending" as SectionStatus,
              originalContent: generatedContent?.content || "Content not available"
            }
          })
          
          setSections(generatedSections)
        }
      } catch (error) {
        console.error("Error loading sections:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSections()
  }, [])

  // Load images from localStorage
  useEffect(() => {
    try {
      const storedPfd = localStorage.getItem('process_flow_diagram_image')
      if (storedPfd) {
        setPfdImage(JSON.parse(storedPfd))
      }
    } catch {}

    try {
      const storedTa = localStorage.getItem('technical_architecture_images')
      if (storedTa) {
        setTaImages(JSON.parse(storedTa))
      }
    } catch {}

    try {
      const storedScreenshots = localStorage.getItem('screenshots')
      if (storedScreenshots) {
        setScreenshots(JSON.parse(storedScreenshots))
      }
    } catch {}
  }, [])

  const approveSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, status: "approved" } : s))
  }

  const rejectSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" } : s))
  }

  const toggleEdit = (id: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) {
        if (s.editing) {
          // Save changes
          return { ...s, editing: false }
        } else {
          // Start editing
          return { ...s, editing: true, originalContent: s.content }
        }
      }
      return s
    }))
  }

  const saveEdit = (id: string, content: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content, editing: false } : s))
  }

  const cancelEdit = (id: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, editing: false, content: s.originalContent || s.content }
      }
      return s
    }))
  }

  const regenerateSection = async (id: string) => {
    setRegenerating(id)
    try {
      // Get proposal data from localStorage
      const proposalRaw = localStorage.getItem("currentProposal")
      if (!proposalRaw) {
        throw new Error("Proposal data not found")
      }

      // Call API to regenerate specific section
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-proposal-data': proposalRaw
        },
        body: JSON.stringify({ sectionId: id })
      })
      
      if (response.ok) {
        const result = await response.json()
        setSections(prev => prev.map(s => 
          s.id === id ? { ...s, content: result.content, status: "pending" } : s
        ))
      } else {
        // Fallback to simple regeneration message
        setSections(prev => prev.map(s => 
          s.id === id ? { ...s, content: s.content + "\n\n[Content regenerated - please review]", status: "pending" } : s
        ))
      }
    } catch (error) {
      console.error("Error regenerating section:", error)
      // Fallback to simple regeneration message
      setSections(prev => prev.map(s => 
        s.id === id ? { ...s, content: s.content + "\n\n[Content regenerated - please review]", status: "pending" } : s
      ))
    } finally {
      setRegenerating(null)
    }
  }

  const approveAll = () => {
    setSections(prev => prev.map(s => ({ ...s, status: "approved" })))
  }

  const handleSaveDraft = () => {
    setSaved(false)
    setTimeout(() => setSaved(true), 700)
  }

  const handleDownload = () => {
    if (!allApproved) return
    setDownloading(true)
    
    try {
      // Get all approved sections
      const approvedSections = sections.filter(s => s.status === "approved")
      
      // Create document content
      const documentContent = generateDocumentContent(approvedSections)
      
      if (exportFormat === "PDF") {
        downloadAsPDF(documentContent)
      } else if (exportFormat === "Word") {
        downloadAsWord(documentContent)
      } else if (exportFormat === "PowerPoint") {
        downloadAsPowerPoint(documentContent)
      }
      
      setDownloading(false)
    } catch (error) {
      console.error("Error generating document:", error)
      setDownloading(false)
      alert("Error generating document. Please try again.")
    }
  }

  const generateDocumentContent = (approvedSections: Section[]) => {
    const proposalData = JSON.parse(localStorage.getItem("currentProposal") || "{}")
    const requirements = proposalData.requirements || {}
    
    let content = `
# PROJECT PROPOSAL

**Project:** ${requirements.projectDescription || "Custom Project"}
**Timeline:** ${requirements.timeline || "TBD"}
**Budget:** ${requirements.budgetRange || "TBD"}
**Date:** ${new Date().toLocaleDateString()}

---

`

    approvedSections.forEach((section, index) => {
      content += `\n## ${index + 1}. ${section.title}\n\n`
      
      // Handle special sections with images
      if (section.id === 'technical-architecture' && taImages.length > 0) {
        content += `**Technical Architecture Diagrams:**\n`
        taImages.forEach((img, imgIndex) => {
          content += `\n**Diagram ${imgIndex + 1}:** ${img.name}\n`
          content += `![${img.name}](${img.url})\n`
        })
        content += `\n`
      }
      
      if (section.id === 'process-flow-diagram' && pfdImage) {
        content += `**Process Flow Diagram:**\n`
        content += `![${pfdImage.name}](${pfdImage.url})\n\n`
      }
      
      if (section.id === 'screenshots' && screenshots.length > 0) {
        content += `**Screenshots:**\n`
        screenshots.forEach((img, imgIndex) => {
          content += `\n**Screenshot ${imgIndex + 1}:** ${img.name}\n`
          content += `![${img.name}](${img.url})\n`
        })
        content += `\n`
      }
      
      // Add section content
      content += `${section.content}\n\n`
      content += `---\n\n`
    })
    
    return content
  }

  const downloadAsPDF = (content: string) => {
    // Create a new window with the content
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    // Convert markdown tables to HTML tables
    const convertMarkdownToHTML = (text: string) => {
      let html = text
      
      // Convert markdown tables to HTML tables
      html = html.replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
        const headerCells = header.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell)
        const rowLines = rows.trim().split('\n').filter((line: string) => line.trim())
        
        let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 14px;">'
        
        // Add header
        tableHTML += '<thead><tr>'
        headerCells.forEach((cell: string) => {
          tableHTML += `<th style="border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f3f4f6; font-weight: bold;">${cell}</th>`
        })
        tableHTML += '</tr></thead>'
        
        // Add rows
        tableHTML += '<tbody>'
        rowLines.forEach((row: string) => {
          const cells = row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell)
          tableHTML += '<tr>'
          cells.forEach((cell: string) => {
            // Handle bold text in cells
            const formattedCell = cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            tableHTML += `<td style="border: 1px solid #ddd; padding: 12px; text-align: left; vertical-align: top;">${formattedCell}</td>`
          })
          tableHTML += '</tr>'
        })
        tableHTML += '</tbody></table>'
        
        return tableHTML
      })
      
      // Convert other markdown elements
      html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gim, '<h3 style="color: #374151; margin-top: 20px;">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 style="color: #1e40af; margin-top: 30px;">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">$1</h1>')
        // Handle bullet lists
        .replace(/((?:^\- .*\n?)+)/gim, (match) => {
          const items = match.trim().split('\n').filter(line => line.trim())
          return '<ul style="margin: 10px 0; padding-left: 30px;">' + 
                 items.map(item => `<li style="margin: 5px 0;">${item.replace(/^\- /, '')}</li>`).join('') + 
                 '</ul>'
        })
        // Handle numbered lists
        .replace(/((?:^\d+\. .*\n?)+)/gim, (match) => {
          const items = match.trim().split('\n').filter(line => line.trim())
          return '<ol style="margin: 10px 0; padding-left: 30px;">' + 
                 items.map(item => `<li style="margin: 5px 0;">${item.replace(/^\d+\. /, '')}</li>`).join('') + 
                 '</ol>'
        })
        .replace(/\n/g, '<br>')
      
      return html
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Project Proposal</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            h3 { color: #374151; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
            ul, ol { margin: 10px 0; padding-left: 30px; }
            li { margin: 5px 0; }
            img { max-width: 100%; height: auto; margin: 10px 0; }
            .page-break { page-break-before: always; }
            @media print {
              body { margin: 0; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          ${convertMarkdownToHTML(content)}
        </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 1000)
  }

  const downloadAsWord = (content: string) => {
    // Create a simple text file that can be opened in Word
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Project_Proposal_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAsPowerPoint = (content: string) => {
    // For PowerPoint, we'll create a simple text file that can be imported
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Project_Proposal_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const progress = {
    total: sections.length,
    approved: sections.filter(s => s.status === "approved").length,
    rejected: sections.filter(s => s.status === "rejected").length,
    pending: sections.filter(s => s.status === "pending").length
  }

  const allApproved = progress.total > 0 && progress.approved === progress.total

  const renderSectionContent = (section: Section) => {
    if (section.editing) {
      return (
        <div className="space-y-4">
          <Textarea
            value={section.content}
            onChange={(e) => setSections(prev => prev.map(s => 
              s.id === section.id ? { ...s, content: e.target.value } : s
            ))}
            className="min-h-[200px]"
          />
          <div className="flex gap-2">
            <Button 
              onClick={() => saveEdit(section.id, section.content)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
            <Button 
              onClick={() => cancelEdit(section.id)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    // Special handling for different section types
    if (section.id === 'technical-architecture' && taImages.length > 0) {
      return (
        <div className="space-y-4">
          <div className="grid gap-4">
            {taImages.map((img) => (
              <div key={img.id} className="border rounded-lg p-4">
                <img src={img.url} alt={img.name} className="w-full h-auto rounded" />
                <p className="text-sm text-gray-600 mt-2">{img.name}</p>
              </div>
            ))}
          </div>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: parseMarkdownTable(section.content) 
            }}
          />
        </div>
      )
    }

    if (section.id === 'process-flow-diagram' && pfdImage) {
      return (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <img src={pfdImage.url} alt={pfdImage.name} className="w-full h-auto rounded" />
            <p className="text-sm text-gray-600 mt-2">{pfdImage.name}</p>
          </div>
        </div>
      )
    }

    if (section.id === 'screenshots' && screenshots.length > 0) {
      return (
        <div className="space-y-4">
          <div className="grid gap-4">
            {screenshots.map((img) => (
              <div key={img.id} className="border rounded-lg p-4">
                <img src={img.url} alt={img.name} className="w-full h-auto rounded" />
                <p className="text-sm text-gray-600 mt-2">{img.name}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Default content rendering with special formatting
    if (section.id === 'project-overview') {
      return (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatProjectOverviewContent(section.content)
          }}
        />
      )
    }

    if (section.id === 'key-value-propositions') {
      return (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatKeyValuePropositionsContent(section.content)
          }}
        />
      )
    }

    // Default content rendering
    return (
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: parseMarkdownTable(section.content) 
        }}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposal sections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Final Proposal Review</h1>
              <p className="mt-2 text-gray-600">
                Review and approve each section of your generated proposal
              </p>
            </div>
            <Link 
              href="/content-generation"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Content Generation
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Proposal Completion Status</h2>
              <div className="text-sm text-gray-600">
                {progress.approved} of {progress.total} sections approved
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.total > 0 ? (progress.approved / progress.total) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button onClick={approveAll} variant="outline" size="sm">
                Approve All Sections
              </Button>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Approved: {progress.approved}
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Rejected: {progress.rejected}
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pending: {progress.pending}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section.id} className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {index + 1}. {section.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        section.status === "approved" ? "default" : 
                        section.status === "rejected" ? "destructive" : 
                        "secondary"
                      }
                      className={
                        section.status === "approved" ? "bg-green-100 text-green-800" :
                        section.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {section.status === "approved" ? "Approved" :
                       section.status === "rejected" ? "Rejected" :
                       "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Content */}
                  {renderSectionContent(section)}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button
                      onClick={() => approveSection(section.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ✅ Approve
                    </Button>
                    <Button
                      onClick={() => rejectSection(section.id)}
                      size="sm"
                      variant="destructive"
                    >
                      ❌ Reject
                    </Button>
                    <Button
                      onClick={() => toggleEdit(section.id)}
                      size="sm"
                      variant="outline"
                    >
                      ✏️ {section.editing ? "Save" : "Edit"}
                    </Button>
                    <Button
                      onClick={() => regenerateSection(section.id)}
                      size="sm"
                      variant="outline"
                      disabled={regenerating === section.id}
                    >
                      {regenerating === section.id ? "🔄 Regenerating..." : "🔄 Regenerate"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleSaveDraft}
                variant="outline"
                disabled={saved}
              >
                {saved ? "✓ Draft Saved" : "Save Draft"}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Export Format:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {exportFormat}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setExportFormat("PDF")}>
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setExportFormat("Word")}>
                      Word
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setExportFormat("PowerPoint")}>
                      PowerPoint
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={!allApproved || downloading}
              className={cn(
                "bg-blue-600 hover:bg-blue-700",
                (!allApproved || downloading) && "opacity-50 cursor-not-allowed"
              )}
            >
              {downloading ? "Downloading..." : "Download Proposal"}
            </Button>
          </div>
          
          {!allApproved && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ All sections must be approved before downloading the proposal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}