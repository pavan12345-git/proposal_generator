"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { getCurrentProposal, updateProposalSection, formatProjectOverviewContent, formatBenefitsAndROIContent, parseMarkdownTable } from "@/lib/proposal-utils"
import { ScreenshotsSection } from "@/components/screenshots-section"

type SectionStatus = "Generating" | "Complete" | "Needs Review"
type Section = { id: string; title: string; content: string; status: SectionStatus }
type ImageItem = { id: string; url: string; name: string }

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

// Sample fallback when no prior selection exists
const SAMPLE_SECTIONS: Section[] = [
  {
    id: uid("sec"),
    title: "Executive Summary",
    content:
      "Provide a concise overview of the solution, its value to the client, and anticipated outcomes. Summarize scope, timing, and ROI.",
    status: "Needs Review",
  },
  {
    id: uid("sec"),
    title: "Project Scope",
    content:
      "Describe deliverables, assumptions, dependencies, and what is out of scope. Align expectations to prevent scope creep.",
    status: "Generating",
  },
  {
    id: uid("sec"),
    title: "Timeline & Milestones",
    content:
      "Outline a phased schedule with key milestones, dependencies, and high-level Gantt-style overview for stakeholders.",
    status: "Complete",
  },
]

const STATUS_STYLES: Record<SectionStatus, { bg: string; text: string; dot: string; ring: string }> = {
  Generating: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-600", ring: "ring-blue-200" },
  Complete: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600", ring: "ring-green-200" },
  "Needs Review": { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-500", ring: "ring-amber-200" },
}

function Breadcrumbs() {
  const items = [
    { href: "/", label: "Home" },
    { href: "/requirements", label: "Requirements" },
    { href: "/content-index", label: "Content Index" },
    { href: "/content-generation", label: "Content Generation" },
  ]
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-slate-600">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-slate-400">/</span>}
            {i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-blue-700 text-slate-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-800 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("h-4 w-4", props.className)}>
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0L14.13 4.5l3.75 3.75 2.83-2.84Z"
      />
    </svg>
  )
}

function StatusBadge({ status }: { status: SectionStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        s.bg,
        s.text,
        s.ring,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  )
}

function SectionListItem({
  section,
  onEditTitle,
  onEditContent,
  onRegenerate,
  onDelete,
  onUpdateStatus,
}: {
  section: Section
  onEditTitle: (id: string, title: string) => void
  onEditContent: (id: string, content: string) => void
  onRegenerate: (id: string) => void
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: SectionStatus) => void
}) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingContent, setEditingContent] = useState(false)
  const [title, setTitle] = useState(section.title)
  const [content, setContent] = useState(section.content)

  useEffect(() => {
    setTitle(section.title)
    setContent(section.content)
  }, [section.title, section.content])

  // Special handling for Screenshots section
  if (section.id === 'screenshots') {
    return (
      <ScreenshotsSection
        sectionId={section.id}
        title={section.title}
        content={section.content}
        status={section.status}
        onUpdateContent={(newContent) => onEditContent(section.id, newContent)}
        onUpdateStatus={(newStatus) => onUpdateStatus(section.id, newStatus)}
      />
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {editingTitle ? (
              <input
                aria-label="Edit section title"
                className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
            )}
            <button
              type="button"
              aria-label={editingTitle ? "Save title" : "Edit title"}
              title={editingTitle ? "Save title" : "Edit title"}
              className="text-slate-500 hover:text-blue-700"
              onClick={() => {
                if (editingTitle) onEditTitle(section.id, title.trim())
                setEditingTitle((v) => !v)
              }}
            >
              <PencilIcon />
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {editingContent ? (
              <textarea
                aria-label="Edit generated content"
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 leading-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <div className="line-clamp-3 text-pretty">
                {section.id === 'project-overview' ? (
                  <div className="whitespace-pre-line text-xs">
                    {formatProjectOverviewContent(section.content) || "No content yet."}
                  </div>
                ) : section.id === 'benefits-and-roi' ? (
                  <div className="whitespace-pre-line text-xs">
                    {formatBenefitsAndROIContent(section.content) || "No content yet."}
                  </div>
                ) : section.id === 'next-steps' ? (
                  <div className="whitespace-pre-line text-xs">
                    {section.content || "No content yet."}
                  </div>
                ) : section.id === 'one-time-development-cost' ? (
                  <div className="whitespace-pre-line text-xs">
                    {section.content || "No content yet."}
                  </div>
                ) : section.id === 'additional-features-recommended' ? (
                  <div 
                    className="text-xs" 
                    dangerouslySetInnerHTML={{ __html: parseMarkdownTable(section.content || "No content yet.") }}
                  />
                ) : section.id === 'operational-costs-monthly' ? (
                  <div 
                    className="text-xs" 
                    dangerouslySetInnerHTML={{ __html: parseMarkdownTable(section.content || "No content yet.") }}
                  />
                ) : section.id === 'monthly-retainer-fee' ? (
                  <div 
                    className="text-xs" 
                    dangerouslySetInnerHTML={{ __html: parseMarkdownTable(section.content || "No content yet.") }}
                  />
                ) : section.id === 'total-investment-from-client' ? (
                  <div 
                    className="text-xs" 
                    dangerouslySetInnerHTML={{ __html: parseMarkdownTable(section.content || "No content yet.") }}
                  />
                ) : section.id === 'implementation-timeline' ? (
                  <div 
                    className="text-xs" 
                    dangerouslySetInnerHTML={{ __html: parseMarkdownTable(section.content || "No content yet.") }}
                  />
                ) : (
                  <p>{section.content || "No content yet."}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={section.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onRegenerate(section.id)}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700"
        >
          Regenerate
        </button>
        <button
          type="button"
          onClick={() => {
            if (editingContent) onEditContent(section.id, content.trim())
            setEditingContent((v) => !v)
          }}
          className={cn(
            "rounded-md border px-2.5 py-1.5 text-xs font-medium",
            editingContent
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700",
          )}
        >
          {editingContent ? "Save" : "Edit"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(section.id)}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function PreviewDocument({
  companyName,
  sections,
  images,
}: { companyName: string; sections: Section[]; images: ImageItem[] }) {
  const toc = sections.map((s, i) => ({ id: s.id, title: s.title || `Section ${i + 1}` }))
  const [pfdImage, setPfdImage] = useState<{ url: string; name: string } | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('process_flow_diagram_image')
      if (stored) {
        setPfdImage(JSON.parse(stored))
      }
    } catch {}
  }, [])

  const handlePfdUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = { url, name: file.name }
    setPfdImage(img)
    try {
      localStorage.setItem('process_flow_diagram_image', JSON.stringify(img))
    } catch {}
    // reset input so same file can be chosen again later
    e.currentTarget.value = ''
  }

  const handlePfdRemove = () => {
    setPfdImage(null)
    try {
      localStorage.removeItem('process_flow_diagram_image')
    } catch {}
  }

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto my-4 w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{companyName || "Your Company"}</h1>
            <p className="text-sm text-slate-600">Proposal Document — Draft Preview</p>
          </div>
          <div
            aria-label="Branding placeholder"
            className="h-10 w-24 rounded-md border border-dashed border-slate-300"
          />
        </header>

        {/* Table of Contents */}
        <section aria-labelledby="toc" className="mb-6">
          <h2 id="toc" className="text-base font-semibold text-slate-900">
            Table of Contents
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="hover:text-blue-700 focus:underline">
                  {t.title}
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* Images/Diagrams */}
        {images.length > 0 && (
          <section aria-labelledby="images" className="mb-6">
            <h2 id="images" className="text-base font-semibold text-slate-900">
              Images & Diagrams
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {images.map((img) => (
                <figure key={img.id} className="rounded-md border border-slate-200 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url || "/placeholder.svg?height=120&width=200&query=uploaded-image"}
                    alt={img.name || "Uploaded image"}
                    className="h-28 w-full rounded object-cover"
                  />
                  <figcaption className="mt-1 truncate text-xs text-slate-600">{img.name}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Sections */}
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {i + 1}. {s.title}
            </h3>
            {s.id === 'project-overview' ? (
              <div className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line project-overview-content proposal-content">
                {formatProjectOverviewContent(s.content) || "Content not available yet."}
              </div>
            ) : s.id === 'key-value-propositions' ? (
              <div className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line key-value-propositions-content proposal-content">
                {s.content || "Content not available yet."}
              </div>
            ) : s.id === 'benefits-and-roi' ? (
              <div className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line benefits-roi-content proposal-content">
                {formatBenefitsAndROIContent(s.content) || "Content not available yet."}
              </div>
            ) : s.id === 'next-steps' ? (
              <div className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line next-steps-content proposal-content">
                {s.content || "Content not available yet."}
              </div>
            ) : s.id === 'one-time-development-cost' ? (
              <div className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line development-cost-content proposal-content">
                {s.content || "Content not available yet."}
              </div>
            ) : s.id === 'additional-features-recommended' ? (
              <div 
                className="mt-2 text-sm leading-6 text-slate-700" 
                dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content || "Content not available yet.") }}
              />
            ) : s.id === 'operational-costs-monthly' ? (
              <div 
                className="mt-2 text-sm leading-6 text-slate-700" 
                dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content || "Content not available yet.") }}
              />
            ) : s.id === 'monthly-retainer-fee' ? (
              <div 
                className="mt-2 text-sm leading-6 text-slate-700" 
                dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content || "Content not available yet.") }}
              />
            ) : s.id === 'total-investment-from-client' ? (
              <div 
                className="mt-2 text-sm leading-6 text-slate-700" 
                dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content || "Content not available yet.") }}
              />
            ) : s.id === 'implementation-timeline' ? (
              <div 
                className="mt-2 text-sm leading-6 text-slate-700" 
                dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content || "Content not available yet.") }}
              />
            ) : s.id === 'process-flow-diagram' ? (
              <div className="mt-2 text-sm leading-6 text-slate-700 process-flow-diagram-content">
                {pfdImage ? (
                  <div className="w-full flex flex-col items-center justify-center">
                    <div className="w-full max-w-2xl border border-slate-200 rounded-lg bg-white p-3 mx-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pfdImage.url} alt={pfdImage.name} className="w-full h-auto object-contain rounded" />
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-slate-600 truncate">{pfdImage.name}</p>
                        <button
                          type="button"
                          onClick={handlePfdRemove}
                          className="text-xs rounded-md border border-slate-300 px-2 py-1 hover:border-blue-600 hover:text-blue-700"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mermaid-code-block">
                      <pre><code>{s.content || "Content not available yet."}</code></pre>
                    </div>
                    <div className="mt-3">
                      <input
                        id={`pfd-upload-input`}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        className="hidden"
                        onChange={handlePfdUpload}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('pfd-upload-input')?.click()}
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700"
                      >
                        Upload Diagram Image
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : s.id === 'screenshots' ? (
              <div className="mt-2 text-sm leading-6 text-slate-700">
                <p className="mb-4">{s.content || "Content not available yet."}</p>
                {/* Show screenshots from localStorage if available */}
                {(() => {
                  try {
                    const stored = localStorage.getItem(`screenshots_${s.id}`)
                    if (stored) {
                      const screenshots = JSON.parse(stored)
                      if (screenshots.length > 0) {
                        return (
                          <div className="space-y-4">
                            {screenshots.map((img: any, idx: number) => (
                              <div key={img.id} className="border border-slate-200 rounded-lg p-4">
                                <img
                                  src={img.url}
                                  alt={img.caption || img.name}
                                  className="w-full max-w-2xl h-auto rounded-md shadow-sm"
                                />
                                {img.caption && (
                                  <p className="mt-2 text-xs text-slate-600 italic">{img.caption}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      }
                    }
                  } catch (error) {
                    console.error('Error loading screenshots for preview:', error)
                  }
                  return null
                })()}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-700">{s.content || "Content not available yet."}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

export default function ContentGenerationPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [images, setImages] = useState<ImageItem[]>([])
  const [companyName, setCompanyName] = useState("Your Company")
  const fileRef = useRef<HTMLInputElement | null>(null)

  // Load and process selected sections in a single useEffect
  useEffect(() => {
    const loadAndProcessSections = async () => {
      console.log('🔄 Content Generation Page: Loading and processing data...')
      try {
        const raw = localStorage.getItem("selectedSections")
        const company = localStorage.getItem("companyName")
        const proposalRaw = localStorage.getItem("currentProposal")
        
        console.log('📋 Raw selectedSections from localStorage:', raw)
        console.log('🏢 Company name:', company)
        console.log('📄 Proposal data exists:', !!proposalRaw)
        
        if (company) setCompanyName(company)
        
        // If we have selected sections and proposal data, process them
        if (raw && proposalRaw) {
          const selectedSections = JSON.parse(raw)
          const proposal = JSON.parse(proposalRaw)
          
          console.log('✅ Parsed selectedSections:', selectedSections)
          console.log('📊 Selected sections count:', selectedSections.length)
          console.log('🔍 Selected section IDs:', selectedSections.map((s: any) => s.id))
          
          // Create initial sections from selected sections
          const initialSections: Section[] = selectedSections.map((section: any) => ({
            id: section.id,
            title: section.title,
            content: section.content || "Initial draft in progress. Use Edit or Regenerate to refine.",
            status: (section.status as SectionStatus) || "Needs Review",
          }))
          
          console.log('📝 Initial sections created:', initialSections.map(s => ({ id: s.id, title: s.title, status: s.status })))
          setSections(initialSections)
          
          // Check if we need to generate content for selected sections
          const needsGeneration = selectedSections.some((section: any) => 
            !proposal?.sections?.[section.id] || 
            proposal.sections[section.id].status !== 'Complete'
          )
          
          console.log('🔄 Needs generation:', needsGeneration)
          console.log('📋 Proposal requirements exist:', !!proposal?.requirements)
          
          if (needsGeneration && proposal?.requirements) {
            // Set all selected sections to "Generating" status
            console.log('🔄 Setting sections to "Generating" status...')
            setSections(prev => prev.map(section => {
              const isSelected = selectedSections.some((s: any) => s.id === section.id)
              if (isSelected) {
                console.log('⚡ Setting to generating:', section.id)
                return { ...section, status: "Generating" }
              }
              return section
            }))
            
            // Call API to generate content for selected sections only
            console.log('🌐 Calling API with selectedSections:', selectedSections)
            const apiPayload = {
              ...proposal.requirements,
              selectedSections: selectedSections
            }
            console.log('📤 API payload:', apiPayload)
            
            const response = await fetch('/api/process-requirements', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(apiPayload),
            })

            console.log('📡 API response status:', response.status)
            console.log('📡 API response ok:', response.ok)
            
            if (response.ok) {
              const result = await response.json()
              console.log('✅ API response:', result)
              
              if (result.success && result.data?.sections) {
                console.log('📝 Generated sections:', Object.keys(result.data.sections))
                console.log('📊 Generated sections data:', result.data.sections)
                
                // Update sections with generated content
                setSections(prev => prev.map(section => {
                  const generatedSection = result.data.sections[section.id]
                  if (generatedSection) {
                    console.log('✅ Updating section with generated content:', section.id)
                    return {
                      ...section,
                      content: generatedSection.content,
                      status: "Complete"
                    }
                  }
                  return section
                }))
                
                // Update the proposal data with generated content
                const updatedProposal = {
                  ...proposal,
                  sections: {
                    ...proposal.sections,
                    ...result.data.sections
                  }
                }
                localStorage.setItem('currentProposal', JSON.stringify(updatedProposal))
                console.log('💾 Updated proposal data in localStorage')
              } else {
                console.log('❌ API response missing success or sections data')
              }
            } else {
              console.log('❌ API call failed with status:', response.status)
              const errorText = await response.text()
              console.log('❌ API error response:', errorText)
              
              // If API call fails, set sections to "Needs Review"
              setSections(prev => prev.map(section => {
                const isSelected = selectedSections.some((s: any) => s.id === section.id)
                if (isSelected) {
                  console.log('⚠️ Setting to needs review:', section.id)
                  return { ...section, status: "Needs Review" }
                }
                return section
              }))
            }
          } else {
            console.log('ℹ️ No generation needed - sections already complete or no requirements')
          }
        } else if (raw) {
          // Fallback to saved sections if no proposal data
          console.log('📋 Loading saved sections without proposal data')
          const parsed = JSON.parse(raw) as Array<Partial<Section> & { title: string }>
          const normalized: Section[] = parsed.map((p) => ({
            id: p.id || uid("sec"),
            title: p.title || "Untitled Section",
            content: (p as any).content || "Initial draft in progress. Use Edit or Regenerate to refine.",
            status: (p.status as SectionStatus) || "Needs Review",
          }))
          setSections(normalized)
        } else {
          console.log('📋 No selected sections found, using sample sections')
          setSections(SAMPLE_SECTIONS)
        }
      } catch (error) {
        console.error('❌ Error loading and processing sections:', error)
        setSections(SAMPLE_SECTIONS)
      }
    }
    
    loadAndProcessSections()
  }, [])

  // Persist updates for continuity
  useEffect(() => {
    try {
      localStorage.setItem("selectedSections", JSON.stringify(sections))
      localStorage.setItem("companyName", companyName)
    } catch {}
  }, [sections, companyName])

  const onEditTitle = (id: string, title: string) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title: title || s.title } : s)))

  const onEditContent = (id: string, content: string) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content, status: "Needs Review" } : s)))

  const onUpdateStatus = (id: string, status: SectionStatus) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))

  // Generate content for generic sections
  const generateGenericSectionContent = async (sectionId: string, requirements: any) => {
    try {
      const sectionTitle = sections.find(s => s.id === sectionId)?.title || 'Section'
      
      const response = await fetch('/api/process-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requirements,
          sectionType: 'generic',
          sectionTitle: sectionTitle
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const result = await response.json()
      return result.data?.content || null
    } catch (error) {
      console.error('Error generating generic section content:', error)
      return null
    }
  }

  // Retry helper for transient API errors (429/529)
  async function postWithRetry(url: string, body: any, maxAttempts = 3): Promise<Response> {
    let attempt = 0
    let lastError: any
    let lastStatus: number | undefined
    let lastStatusText: string | undefined
    
    while (attempt < maxAttempts) {
      attempt++
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        
        lastStatus = res.status
        lastStatusText = res.statusText
        
        if (res.ok) return res
        
        // If rate limit or overload, backoff and retry
        if (res.status === 429 || res.status === 529) {
          console.log(`Attempt ${attempt}: ${res.status} ${res.statusText}, retrying...`)
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
          await new Promise(r => setTimeout(r, backoffMs))
          continue
        }
        
        // For other non-ok statuses, try to get error details
        try {
          const errorData = await res.json()
          console.log(`Attempt ${attempt}: ${res.status} ${res.statusText}`, errorData)
        } catch {}
        
        return res
      } catch (e) {
        lastError = e
        console.log(`Attempt ${attempt}: Network error`, e)
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        await new Promise(r => setTimeout(r, backoffMs))
      }
    }
    
    // Build detailed error message
    let details = ''
    if (lastError instanceof Error) {
      details = `: ${lastError.message}`
    } else if (lastStatus) {
      details = `: ${lastStatus} ${lastStatusText || ''}`
    }
    
    throw new Error(`Request failed after ${maxAttempts} attempts${details}`)
  }

  const onRegenerate = async (id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Generating" } : s)))
    
    try {
      const proposal = getCurrentProposal()
      if (proposal?.requirements) {
        let newContent
        
        // Generate content based on section type
        const response = await postWithRetry('/api/process-requirements', {
          ...proposal.requirements,
          sectionType: id,
          regenerate: true
        })

        if (!response.ok) {
          let errorMessage = 'Failed to generate content: Unknown error'
          try {
            const errorData = await response.json()
            if (errorData?.error) {
              errorMessage = errorData.error.includes('Claude API is currently overloaded')
                ? 'The AI service is temporarily overloaded. Please wait a moment and try again.'
                : errorData.error
            }
          } catch {}
          throw new Error(errorMessage)
        }

        const result = await response.json()
        
        // Extract content based on section type
        if (id === 'executive-summary') {
          newContent = result.data?.sections?.['executive-summary']?.content
        } else if (id === 'project-overview') {
          newContent = result.data?.sections?.['project-overview']?.content
        } else if (id === 'the-problem') {
          newContent = result.data?.sections?.['the-problem']?.content
        } else if (id === 'our-solution') {
          newContent = result.data?.sections?.['our-solution']?.content
        } else if (id === 'key-value-propositions') {
          newContent = result.data?.sections?.['key-value-propositions']?.content
        } else if (id === 'benefits-and-roi') {
          newContent = result.data?.content
        } else if (id === 'next-steps') {
          newContent = result.data?.content
        } else if (id === 'one-time-development-cost') {
          newContent = result.data?.content
        } else if (id === 'additional-features-recommended') {
          newContent = result.data?.content
        } else {
          // For other sections, generate generic content
          newContent = await generateGenericSectionContent(id, proposal.requirements)
        }
        
        if (newContent) {
          setSections((prev) =>
            prev.map((s) =>
              s.id === id
                ? {
                    ...s,
                    content: newContent,
                    status: "Complete",
                  }
                : s,
            ),
          )
          
          // Update proposal data
          updateProposalSection(id, {
            content: newContent,
            status: 'Complete',
            version: (proposal.sections[id]?.version || 0) + 1
          })
        } else {
          setSections((prev) =>
            prev.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: "Needs Review",
                  }
                : s,
            ),
          )
        }
      } else {
        // No proposal data available, set to needs review
        setSections((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: "Needs Review",
                }
              : s,
          ),
        )
      }
    } catch (error) {
      console.error('Error regenerating content:', error)
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating content'
      alert(errorMessage)
      
      setSections((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "Needs Review",
              }
            : s,
        ),
      )
    }
  }

  const onDelete = (id: string) => setSections((prev) => prev.filter((s) => s.id !== id))

  const addCustomSection = () => {
    const title = prompt("Enter a title for the new section:")
    if (!title) return
    setSections((prev) => [
      ...prev,
      {
        id: uid("sec"),
        title: title.trim(),
        content: "Draft content placeholder. Use Edit to customize or Regenerate to refine.",
        status: "Needs Review",
      },
    ])
  }

  const uploadImages = (files: FileList) => {
    const list: ImageItem[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const url = URL.createObjectURL(f)
      list.push({ id: uid("img"), url, name: f.name })
    }
    setImages((prev) => [...prev, ...list])
  }

  const completed = sections.filter((s) => s.status === "Complete").length
  const progress = sections.length ? Math.round((completed / sections.length) * 100) : 0

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6 font-sans">
      {/* Top: breadcrumbs + title */}
      <div className="mb-4">
        <Breadcrumbs />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-pretty text-xl font-semibold text-slate-900 md:text-2xl">Content Generation</h1>
            <p className="text-sm text-slate-600">Refine generated content and preview your proposal in real time.</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="companyName" className="sr-only">
              Company name
            </label>
            <input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-48 rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Company name"
            />
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Left Panel (40%) */}
        <aside className="md:basis-2/5 md:min-w-[320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Selected Sections</h2>
              <span className="text-xs text-slate-600">{sections.length} total</span>
            </div>

            <div className="space-y-3">
              {sections.length === 0 ? (
                <p className="text-sm text-slate-600">No sections yet. Use “Add Custom Section” to get started.</p>
              ) : (
                sections.map((s) => (
                  <SectionListItem
                    key={s.id}
                    section={s}
                    onEditTitle={onEditTitle}
                    onEditContent={onEditContent}
                    onRegenerate={onRegenerate}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right Panel (60%) */}
        <section className="md:basis-3/5">
          <PreviewDocument companyName={companyName} sections={sections} images={images} />
        </section>
      </div>

      {/* Sticky bottom bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
        <div className="pointer-events-auto mx-auto mb-3 w-full max-w-7xl px-4 md:px-6">
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={addCustomSection}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700"
              >
                Add Custom Section
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) uploadImages(e.target.files)
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-600 hover:text-blue-700"
              >
                Upload Images
              </button>

              <Link
                href="/content-index"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Review & Finalize
              </Link>
            </div>

            {/* Progress */}
            <div className="w-full min-w-56 md:w-80">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Completion</span>
                <span>
                  {sections.filter((s) => s.status === "Complete").length}/{sections.length} ({progress}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-200" aria-hidden="true">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
