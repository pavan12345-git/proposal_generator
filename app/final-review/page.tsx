"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { parseMarkdownTable, parseBulletPoints, formatKeyValuePropositionsContent, extractTechStackContent, formatTechStackContent } from "@/lib/proposal-utils"

// Colors used (5 total): Blue (primary), White, Slate gray (neutral), Green (success), Amber (review)

type Section = {
  id: string
  title: string
  content: string
  approved: boolean
}
type Diagram = {
  id: string
  title: string
  url: string
  status: "pending" | "approved" | "rejected"
}

export default function FinalReviewPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [diagrams, setDiagrams] = useState<Diagram[]>([])
  const [exportFmt, setExportFmt] = useState<"PDF" | "Word" | "PowerPoint">("PDF")
  const [downloading, setDownloading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [shared, setShared] = useState(false)
  const [approvalsComplete, setApprovalsComplete] = useState(false)

  useEffect(() => {
    const secRaw = window.localStorage.getItem("proposal_sections")
    const diaRaw = window.localStorage.getItem("proposal_diagrams")
    const apprRaw = window.localStorage.getItem("proposal_approvals_complete")
    if (secRaw) setSections(JSON.parse(secRaw))
    if (diaRaw) setDiagrams(JSON.parse(diaRaw))
    if (apprRaw) setApprovalsComplete(Boolean(JSON.parse(apprRaw)))
  }, [])

  const includedSections = useMemo(() => sections.filter((s) => s.approved), [sections])
  const approvedDiagrams = useMemo(() => diagrams.filter((d) => d.status === "approved"), [diagrams])
  const canDownload = approvalsComplete && includedSections.length > 0

  function handleSaveDraft() {
    setSaved(false)
    setTimeout(() => setSaved(true), 700)
  }

  async function handleShareLink() {
    setShared(false)
    const link = `${window.location.origin}/final-review?doc=${Date.now()}`
    try {
      await navigator.clipboard.writeText(link)
      setShared(true)
    } catch {
      setShared(false)
    }
  }

  function handleDownload() {
    if (!canDownload) return
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      alert(`Exported as ${exportFmt}. (Placeholder)`)
    }, 1200)
  }

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto font-sans">
      <header className="mb-4">
        <nav aria-label="Breadcrumbs" className="text-sm text-slate-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link className="text-blue-600 hover:underline" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">
              {"/"}
            </li>
            <li>
              <Link className="text-blue-600 hover:underline" href="/approval">
                Approval
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">
              {"/"}
            </li>
            <li aria-current="page" className="text-slate-800">
              Final Review
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900 text-balance">Final Review</h1>
        <p className="text-slate-600 mt-1">
          Preview the complete document, verify the included sections, and export your proposal.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Complete Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <article className="max-w-none">
                <header className="border-b border-slate-200 pb-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Company Name</h2>
                      <p className="text-sm text-slate-600">Proposal Document</p>
                    </div>
                    <div className="w-24 h-10 bg-blue-600 rounded text-white flex items-center justify-center text-sm">
                      Logo
                    </div>
                  </div>
                </header>

                <section className="mb-6">
                  <h3 className="text-base font-semibold text-slate-900">Table of Contents</h3>
                  <ol className="text-sm text-slate-700 list-decimal ml-5 mt-2">
                    {includedSections.map((s, i) => (
                      <li key={s.id} className="mb-1">
                        {i + 1}. {s.title}
                      </li>
                    ))}
                    {approvedDiagrams.length > 0 && <li>Images & Diagrams</li>}
                  </ol>
                </section>

                {includedSections.map((s) => (
                  <section key={s.id} className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                    {s.id === 'one-time-development-cost' ? (
                      <div className="text-slate-700 leading-relaxed mt-1 whitespace-pre-line development-cost-content proposal-content">{s.content}</div>
                    ) : s.id === 'project-overview' ? (
                      <div className="text-slate-700 leading-relaxed mt-1 project-overview-content proposal-content whitespace-pre-line">
                        {formatProjectOverviewContent(s.content)}
                      </div>
                    ) : s.id === 'key-value-propositions' ? (
                      <div className="text-slate-700 leading-relaxed mt-1 key-value-propositions-content proposal-content whitespace-pre-line">
                        {formatKeyValuePropositionsContent(s.content)}
                      </div>
                    ) : s.id === 'benefits-and-roi' ? (
                      <div className="text-slate-700 leading-relaxed mt-1 benefits-roi-content proposal-content whitespace-pre-line">{s.content}</div>
                    ) : s.id === 'next-steps' ? (
                      <div className="text-slate-700 leading-relaxed mt-1 next-steps-content proposal-content whitespace-pre-line">{s.content}</div>
                    ) : s.id === 'process-flow-diagram' ? (
                      <div className="text-slate-700 leading-relaxed mt-1 process-flow-diagram-content">
                        {(() => {
                          try {
                            const stored = localStorage.getItem('process_flow_diagram_image')
                            if (stored) {
                              const img = JSON.parse(stored) as { url: string; name: string }
                              return (
                                <div className="w-full flex flex-col items-center justify-center">
                                  <div className="w-full max-w-2xl border border-slate-200 rounded-lg bg-white p-3 mx-auto">
                                    <img src={img.url} alt={img.name} className="w-full h-auto object-contain rounded" />
                                    <p className="mt-2 text-xs text-slate-600 truncate text-center">{img.name}</p>
                                  </div>
                                </div>
                              )
                            }
                          } catch {}
                          return (
                            <div className="mermaid-code-block">
                              <pre><code>{s.content}</code></pre>
                            </div>
                          )
                        })()}
                      </div>
                    ) : s.id === 'technical-architecture' ? (
                      <div className="text-slate-700 leading-relaxed mt-1 technical-architecture-content">
                        {(() => {
                          try {
                            const stored = localStorage.getItem('technical_architecture_images')
                            if (stored) {
                              const images = JSON.parse(stored) as { url: string; name: string; id?: string }[]
                              if (images.length > 0) {
                                return (
                                  <>
                                    {/* Display uploaded images */}
                                    <div className="w-full flex flex-col items-center justify-center mb-8">
                                      <div className="flex flex-col gap-6 w-full max-w-4xl">
                                        {images.map((img, index) => (
                                          <div key={img.id || index} className="border border-slate-200 rounded-lg bg-white p-4">
                                            <img src={img.url} alt={img.name} className="w-full h-auto object-contain rounded mb-3" />
                                            <p className="text-sm text-slate-600 truncate font-medium text-center">{img.name}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Show tech stack content below the images */}
                                    <div className="tech-stack-content">
                                      <div 
                                        className="text-slate-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: formatTechStackContent(s.content) }}
                                      />
                                    </div>
                                  </>
                                )
                              }
                            }
                          } catch {}
                          return (
                            <div className="mermaid-code-block">
                              <pre><code>{s.content}</code></pre>
                            </div>
                          )
                        })()}
                      </div>
                    ) : s.id === 'additional-features-recommended' ? (
                      <div 
                        className="text-slate-700 leading-relaxed mt-1" 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content) }}
                      />
                    ) : s.id === 'operational-costs-monthly' ? (
                      <div 
                        className="text-slate-700 leading-relaxed mt-1" 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content) }}
                      />
                    ) : s.id === 'monthly-retainer-fee' ? (
                      <div 
                        className="text-slate-700 leading-relaxed mt-1" 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content) }}
                      />
                    ) : s.id === 'total-investment-from-client' ? (
                      <div 
                        className="text-slate-700 leading-relaxed mt-1" 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content) }}
                      />
                    ) : s.id === 'implementation-timeline' ? (
                      <div 
                        className="text-slate-700 leading-relaxed mt-1" 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content) }}
                      />
                    ) : (
                      <p className="text-slate-700 leading-relaxed mt-1 proposal-content">{s.content}</p>
                    )}
                  </section>
                ))}

                {approvedDiagrams.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Images & Diagrams</h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {approvedDiagrams.map((d) => (
                        <figure key={d.id} className="border border-slate-200 rounded p-2 bg-white">
                          <img
                            src={d.url || "/placeholder.svg?height=160&width=240&query=diagram%20placeholder"}
                            alt={d.title}
                            className="w-full h-28 object-contain"
                          />
                          <figcaption className="text-xs text-slate-600 mt-1">{d.title}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                )}
              </article>
            </CardContent>
          </Card>
        </div>

        {/* Checklist + Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Final Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {includedSections.map((s) => (
                  <li key={s.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked
                      readOnly
                      aria-label={`Include ${s.title}`}
                      className="mt-1 accent-blue-600"
                    />
                    <span className="text-sm text-slate-800">{s.title}</span>
                  </li>
                ))}
                {includedSections.length === 0 && <p className="text-sm text-slate-600">No approved sections.</p>}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    {exportFmt}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-40">
                  <DropdownMenuItem onClick={() => setExportFmt("PDF")}>PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setExportFmt("Word")}>Word (.docx)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setExportFmt("PowerPoint")}>PowerPoint (.pptx)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                className={cn(
                  "w-full bg-blue-600 hover:bg-blue-700 text-white",
                  !canDownload && "pointer-events-none opacity-50",
                )}
                onClick={handleDownload}
                aria-disabled={!canDownload}
              >
                {downloading ? (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    Preparing {exportFmt}…
                  </span>
                ) : (
                  "Download Proposal"
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="secondary" className="w-full" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleShareLink}>
                  Share Link
                </Button>
              </div>

              <div className="text-xs text-slate-600">
                {saved && <p className="text-green-700">Draft saved successfully.</p>}
                {shared && <p className="text-green-700">Link copied to clipboard.</p>}
                {!approvalsComplete && (
                  <p className="text-amber-700 mt-1">Complete all approvals to enable downloading.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
