"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { parseMarkdownTable } from "@/lib/proposal-utils"

// Colors used (5 total): Blue (primary), White, Slate gray (neutral), Green (success), Amber (review)

type SectionStatus = "generating" | "complete" | "needs_review"
type Section = {
  id: string
  title: string
  content: string
  status: SectionStatus
  approved: boolean
  editing?: boolean
}

type Diagram = {
  id: string
  title: string
  url: string
  status: "pending" | "approved" | "rejected"
}

const sampleSections: Section[] = [
  {
    id: "s1",
    title: "Executive Summary",
    content:
      "This project aims to deliver a scalable solution that aligns with client objectives while optimizing costs and timelines.",
    status: "generating",
    approved: false,
  },
  {
    id: "s2",
    title: "Project Objectives",
    content:
      "Key goals include improving operational efficiency by 25%, enhancing customer experience metrics, and enabling future extensibility.",
    status: "complete",
    approved: false,
  },
  {
    id: "s3",
    title: "Scope & Deliverables",
    content:
      "Scope includes discovery workshops, design prototypes, implementation, QA, and training. Deliverables will be finalized per milestone.",
    status: "needs_review",
    approved: false,
  },
]

const sampleDiagrams: Diagram[] = [
  {
    id: "d1",
    title: "System Architecture",
    url: "/system-architecture-diagram.png",
    status: "pending",
  },
  {
    id: "d2",
    title: "User Journey",
    url: "/user-journey-map.png",
    status: "pending",
  },
]

function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial)
  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    if (raw) {
      try {
        setState(JSON.parse(raw))
      } catch {
        // ignore parse errors
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(state))
    }
  }, [key, state])
  return [state, setState] as const
}

export default function ApprovalPage() {
  const [sections, setSections] = usePersistentState<Section[]>("proposal_sections", sampleSections)
  const [diagrams, setDiagrams] = usePersistentState<Diagram[]>("proposal_diagrams", sampleDiagrams)
  const sectionUploadRef = useRef<HTMLInputElement | null>(null)
  const imagesUploadRef = useRef<HTMLInputElement | null>(null)
  const altImageRef = useRef<HTMLInputElement | null>(null)

  // Simulate generation finishing
  useEffect(() => {
    const timers: number[] = []
    sections.forEach((s) => {
      if (s.status === "generating") {
        const t = window.setTimeout(() => {
          setSections((prev) =>
            prev.map((p) =>
              p.id === s.id
                ? {
                    ...p,
                    status: "complete",
                    content:
                      p.content ||
                      "Generated content ready for review. Please verify accuracy, tone, and alignment to objectives.",
                  }
                : p,
            ),
          )
        }, 1000)
        timers.push(t)
      }
    })
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [sections, setSections])

  const totals = useMemo(() => {
    const totalSections = sections.length
    const approvedSections = sections.filter((s) => s.approved).length
    const totalImages = diagrams.length
    const approvedImages = diagrams.filter((d) => d.status === "approved").length
    const total = totalSections + totalImages
    const approved = approvedSections + approvedImages
    const pct = total > 0 ? Math.round((approved / total) * 100) : 0
    const allApproved = total > 0 && approved === total
    return { totalSections, approvedSections, totalImages, approvedImages, total, approved, pct, allApproved }
  }, [sections, diagrams])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("proposal_approvals_complete", JSON.stringify(totals.allApproved))
    }
  }, [totals.allApproved])

  function approveSection(id: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, approved: true, status: "complete" } : s)))
  }

  function rejectSection(id: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, approved: false, status: "needs_review" } : s)))
  }

  function regenerate(id: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status: "generating", approved: false } : s)))
    setTimeout(() => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "complete",
                content: s.content + " Updated draft with refined clarity based on feedback.",
              }
            : s,
        ),
      )
    }, 1000)
  }

  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  function toggleEdit(id: string, on: boolean) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, editing: on } : s)))
  }

  function saveEdit(id: string, content: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content, editing: false, status: "complete" } : s)))
  }

  function addCustomSection() {
    const nid = `custom-${Date.now()}`
    setSections((prev) => [
      ...prev,
      {
        id: nid,
        title: "Custom Section",
        content: "Add your custom content here...",
        status: "needs_review",
        approved: false,
        editing: true,
      },
    ])
  }

  function handleSectionUpload(e: React.ChangeEvent<HTMLInputElement>, sectionId: string | null) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || "")
      if (sectionId) {
        setSections((prev) =>
          prev.map((s) => (s.id === sectionId ? { ...s, content: text, status: "complete", editing: false } : s)),
        )
      } else {
        const nid = `upload-${Date.now()}`
        setSections((prev) => [
          ...prev,
          { id: nid, title: file.name || "Uploaded Content", content: text, status: "needs_review", approved: false },
        ])
      }
    }
    reader.readAsText(file)
    // reset input
    e.currentTarget.value = ""
  }

  function uploadAlternative(diagramId: string, file: File) {
    const url = URL.createObjectURL(file)
    setDiagrams((prev) => prev.map((d) => (d.id === diagramId ? { ...d, url, status: "approved" } : d)))
  }

  function uploadMultipleImages(list: FileList | null) {
    if (!list) return
    const arr = Array.from(list)
    const newOnes: Diagram[] = arr.map((f, i) => ({
      id: `up-${Date.now()}-${i}`,
      title: f.name || "Uploaded Image",
      url: URL.createObjectURL(f),
      status: "approved",
    }))
    setDiagrams((prev) => [...prev, ...newOnes])
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
              <Link className="text-blue-600 hover:underline" href="/content-index">
                Content Index
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">
              {"/"}
            </li>
            <li aria-current="page" className="text-slate-800">
              Approval
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900 text-balance">Approval</h1>
        <p className="text-slate-600 mt-1">
          Approve or revise each generated section and diagram, then proceed to final review.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
        {/* Left Panel */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections ({sections.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map((s) => (
                <div key={s.id} className="border border-slate-200 rounded-md p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900 truncate">{s.title}</h3>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded",
                            s.status === "generating" && "bg-blue-50 text-blue-700",
                            s.status === "complete" && "bg-green-50 text-green-700",
                            s.status === "needs_review" && "bg-amber-50 text-amber-800",
                          )}
                          aria-live="polite"
                        >
                          {s.status === "generating"
                            ? "Generating"
                            : s.status === "complete"
                              ? "Complete"
                              : "Needs Review"}
                        </span>
                        {s.approved && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">Approved</span>
                        )}
                      </div>

                      {!s.editing ? (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-3">{s.content}</p>
                      ) : (
                        <div className="mt-2">
                          <label htmlFor={`edit-${s.id}`} className="sr-only">
                            Edit content
                          </label>
                          <textarea
                            id={`edit-${s.id}`}
                            defaultValue={s.content}
                            className="w-full h-24 text-sm border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              onClick={() => {
                                const el = document.getElementById(`edit-${s.id}`) as HTMLTextAreaElement | null
                                saveEdit(s.id, el?.value || s.content)
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => toggleEdit(s.id, false)}
                              className="text-slate-700"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {!s.editing && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-8 px-2 bg-transparent">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-48">
                          <DropdownMenuItem onClick={() => approveSection(s.id)}>Approve</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => rejectSection(s.id)}>Reject</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => regenerate(s.id)}>
                            {s.status === "generating" ? "Generating…" : "Regenerate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleEdit(s.id, true)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              sectionUploadRef.current?.setAttribute("data-section-id", s.id)
                              sectionUploadRef.current?.click()
                            }}
                          >
                            Upload Custom Content
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteSection(s.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {s.status === "generating" && (
                    <div className="mt-2 inline-flex items-center gap-2 text-xs text-blue-700">
                      <span
                        className="inline-block h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      <span>Creating better draft…</span>
                    </div>
                  )}

                  {!s.editing && (
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => approveSection(s.id)}
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => rejectSection(s.id)}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {sections.length === 0 && (
                <p className="text-sm text-slate-600">No sections yet. Add a custom section below.</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Images & Diagrams ({diagrams.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diagrams.map((d) => (
                <div key={d.id} className="border border-slate-200 rounded-md p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={d.url || "/placeholder.svg?height=120&width=200&query=diagram%20placeholder"}
                      alt={d.title}
                      className="w-28 h-16 object-contain bg-white border border-slate-200 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{d.title}</h4>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded",
                            d.status === "approved" && "bg-green-50 text-green-700",
                            d.status === "rejected" && "bg-amber-50 text-amber-800",
                            d.status === "pending" && "bg-blue-50 text-blue-700",
                          )}
                        >
                          {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() =>
                            setDiagrams((prev) => prev.map((x) => (x.id === d.id ? { ...x, status: "approved" } : x)))
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setDiagrams((prev) => prev.map((x) => (x.id === d.id ? { ...x, status: "rejected" } : x)))
                          }
                        >
                          Reject
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            altImageRef.current?.setAttribute("data-target-id", d.id)
                            altImageRef.current?.click()
                          }}
                        >
                          Upload Alternative
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {diagrams.length === 0 && <p className="text-sm text-slate-600">No images yet. Upload images below.</p>}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Proposal Preview</CardTitle>
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
                    {sections.map((s, i) => (
                      <li key={s.id} className="mb-1">
                        {i + 1}. {s.title}
                      </li>
                    ))}
                    {diagrams.length > 0 && <li>Images & Diagrams</li>}
                  </ol>
                </section>

                {sections.map((s) => (
                  <section key={s.id} className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                    {s.id === 'additional-features-recommended' || s.id === 'operational-costs-monthly' || s.id === 'monthly-retainer-fee' ? (
                      <div 
                        className="text-slate-700 leading-relaxed mt-1" 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownTable(s.content) }}
                      />
                    ) : (
                      <p className="text-slate-700 leading-relaxed mt-1">{s.content}</p>
                    )}
                  </section>
                ))}

                {diagrams.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Images & Diagrams</h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {diagrams.map((d) => (
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
      </section>

      {/* Spacer for sticky bar */}
      <div className="h-16" aria-hidden="true" />
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-2/5">
            <div
              className="h-2 bg-slate-200 rounded"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={totals.pct}
            >
              <div className="h-2 bg-blue-600 rounded transition-all" style={{ width: `${totals.pct}%` }} />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Approval progress: {totals.approved} of {totals.total} approved ({totals.pct}%)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={addCustomSection}>
              Add Custom Section
            </Button>
            <Button variant="outline" onClick={() => imagesUploadRef.current?.click()}>
              Upload Images
            </Button>
            <Link
              href="/final-review"
              aria-disabled={!totals.allApproved}
              className={cn(
                "inline-flex items-center justify-center h-9 px-4 rounded bg-blue-600 text-white",
                !totals.allApproved && "pointer-events-none opacity-50",
              )}
            >
              Review & Finalize
            </Link>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={sectionUploadRef}
        type="file"
        accept=".txt,.md,.docx,.rtf,text/plain"
        className="hidden"
        onChange={(e) => {
          const secId = sectionUploadRef.current?.getAttribute("data-section-id")
          handleSectionUpload(e, secId)
          sectionUploadRef.current?.removeAttribute("data-section-id")
        }}
      />
      <input
        ref={imagesUploadRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => uploadMultipleImages(e.target.files)}
      />
      <input
        ref={altImageRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const id = altImageRef.current?.getAttribute("data-target-id") || ""
          const file = e.target.files?.[0]
          if (id && file) uploadAlternative(id, file)
          altImageRef.current?.removeAttribute("data-target-id")
          if (altImageRef.current) altImageRef.current.value = ""
        }}
      />
    </main>
  )
}
