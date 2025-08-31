"use client"

import type React from "react"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { StepsSidebar } from "@/components/steps-sidebar"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  FileText,
  AlertTriangle,
  Wrench,
  Package,
  Calendar,
  DollarSign,
  Users,
  Shield,
  FileSignature,
  FolderOpen,
} from "lucide-react"

type SectionKey =
  | "executive-summary"
  | "problem-statement"
  | "proposed-solution"
  | "scope-deliverables"
  | "timeline-milestones"
  | "budget-pricing"
  | "team-qualifications"
  | "risk-assessment"
  | "terms-conditions"
  | "appendices"

type Section = {
  key: SectionKey
  title: string
  description: string
  pages: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const allSections: Section[] = [
  {
    key: "executive-summary",
    title: "Executive Summary",
    description: "High-level overview of the project’s value, goals, and outcomes.",
    pages: "1–2",
    Icon: FileText,
  },
  {
    key: "problem-statement",
    title: "Problem Statement",
    description: "Clearly defines the client’s challenges and business context.",
    pages: "1",
    Icon: AlertTriangle,
  },
  {
    key: "proposed-solution",
    title: "Proposed Solution",
    description: "Your approach, methodology, and rationale.",
    pages: "1–3",
    Icon: Wrench,
  },
  {
    key: "scope-deliverables",
    title: "Project Scope & Deliverables",
    description: "What’s included, phased breakdown, and assumptions.",
    pages: "2–4",
    Icon: Package,
  },
  {
    key: "timeline-milestones",
    title: "Timeline & Milestones",
    description: "Schedule, key phases, and checkpoints.",
    pages: "1–2",
    Icon: Calendar,
  },
  {
    key: "budget-pricing",
    title: "Budget & Pricing",
    description: "Cost breakdown, billing model, and payment terms.",
    pages: "1–2",
    Icon: DollarSign,
  },
  {
    key: "team-qualifications",
    title: "Team & Qualifications",
    description: "Relevant experience, roles, and bios.",
    pages: "1–2",
    Icon: Users,
  },
  {
    key: "risk-assessment",
    title: "Risk Assessment",
    description: "Potential risks, impact, and mitigation strategies.",
    pages: "1",
    Icon: Shield,
  },
  {
    key: "terms-conditions",
    title: "Terms & Conditions",
    description: "Legal terms, confidentiality, and acceptance criteria.",
    pages: "1–2",
    Icon: FileSignature,
  },
  {
    key: "appendices",
    title: "Appendices",
    description: "Supplementary information, references, and resources.",
    pages: "As needed",
    Icon: FolderOpen,
  },
]

export default function ContentIndexPage() {
  const [selected, setSelected] = useState<Set<SectionKey>>(new Set())

  const total = allSections.length
  const count = selected.size

  const isAllSelected = count === total
  const isNoneSelected = count === 0

  const handleToggle = (key: SectionKey) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(allSections.map((s) => s.key)))
  const deselectAll = () => setSelected(new Set())

  const selectedArray = useMemo(() => Array.from(selected), [selected])

  const handlePreview = (section: Section) => {
    // In a future iteration we can open a modal/sheet. For now, simple feedback.
    // eslint-disable-next-line no-alert
    alert(`Preview for: ${section.title}\n\n${section.description}`)
  }

  const handleGenerate = () => {
    // Wire up generation flow here (e.g., route or server action)
    // eslint-disable-next-line no-alert
    alert(`Generating content for ${count} section(s):\n\n- ${selectedArray.join("\n- ")}`)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 font-sans">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Requirements", href: "/requirements" },
            { label: "Content Index", current: true },
          ]}
        />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <StepsSidebar />
        <section className="flex-1">
          <header className="mb-4">
            <h1 className="text-balance text-2xl font-semibold text-slate-800">Select Proposal Sections to Generate</h1>
            <p className="mt-1 text-sm text-slate-600">
              Choose the sections you want to include. You can preview samples before generating.
            </p>
          </header>

          {/* Grid of selectable sections */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allSections.map((section) => {
                const checked = selected.has(section.key)
                const { Icon } = section
                return (
                  <label
                    key={section.key}
                    className={cn(
                      "group relative flex h-full cursor-pointer flex-col rounded-lg border p-4 transition-colors",
                      checked ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                        checked={checked}
                        onChange={() => handleToggle(section.key)}
                        aria-label={`Select ${section.title}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              checked ? "text-blue-700" : "text-slate-500 group-hover:text-blue-600",
                            )}
                            aria-hidden="true"
                          />
                          <h3 className="text-sm font-medium text-slate-800">{section.title}</h3>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{section.description}</p>
                        <div className="mt-2 text-xs text-slate-500">Estimated pages: {section.pages}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePreview(section)
                        }}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Preview Sample
                      </button>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="text-sm text-slate-600">
              {count} of {total} sections selected
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Deselect All
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isNoneSelected}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium text-white",
                  isNoneSelected ? "cursor-not-allowed bg-blue-300" : "bg-blue-600 hover:bg-blue-700",
                )}
                aria-disabled={isNoneSelected}
              >
                Generate Content
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
