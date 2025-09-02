"use client"

import type React from "react"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { StepsSidebar } from "@/components/steps-sidebar"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  FileText,
  AlertTriangle,
  Calendar,
  DollarSign,
  FolderOpen,
  Lightbulb,
  ImageIcon,
  Star,
  GitBranch,
  CircuitBoard,
  PlusCircle,
  Wallet,
  CreditCard,
  Banknote,
  TrendingUp,
  ListChecks,
} from "lucide-react"

type SectionKey =
  | "executive-summary"
  | "project-overview"
  | "the-problem"
  | "our-solution"
  | "screenshots"
  | "key-value-propositions"
  | "process-flow-diagram"
  | "technical-architecture"
  | "one-time-development-cost"
  | "additional-features-recommended"
  | "operational-costs-monthly"
  | "monthly-retainer-fee"
  | "total-investment-from-client"
  | "implementation-timeline"
  | "benefits-and-roi"
  | "next-steps"

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
    description: "High-level value statement, objectives, and expected outcomes tailored to the client.",
    pages: "1–2",
    Icon: FileText,
  },
  {
    key: "project-overview",
    title: "Project Overview",
    description: "Context, scope, and goals of the engagement with an outline of major components.",
    pages: "1–2",
    Icon: FolderOpen,
  },
  {
    key: "the-problem",
    title: "The Problem",
    description: "Current challenges, pain points, and business impact motivating the initiative.",
    pages: "1",
    Icon: AlertTriangle,
  },
  {
    key: "our-solution",
    title: "Our Solution",
    description: "Proposed approach, methodology, and technology stack to address the problem.",
    pages: "1–3",
    Icon: Lightbulb,
  },
  {
    key: "screenshots",
    title: "Screenshots",
    description: "Representative UI screens, mockups, or examples illustrating the experience.",
    pages: "1–3",
    Icon: ImageIcon,
  },
  {
    key: "key-value-propositions",
    title: "Key Value Propositions",
    description: "Clear differentiators and business outcomes the client can expect.",
    pages: "1",
    Icon: Star,
  },
  {
    key: "process-flow-diagram",
    title: "Process Flow Diagram",
    description: "End-to-end workflow showing user interactions, systems, and decision points.",
    pages: "1",
    Icon: GitBranch,
  },
  {
    key: "technical-architecture",
    title: "Technical Architecture",
    description: "High-level architecture including services, integrations, and data flows.",
    pages: "1–2",
    Icon: CircuitBoard,
  },
  {
    key: "one-time-development-cost",
    title: "One Time Development Cost",
    description: "Build effort, assumptions, and fixed investment to deliver the scope.",
    pages: "1",
    Icon: DollarSign,
  },
  {
    key: "additional-features-recommended",
    title: "Additional Features Recommended",
    description: "Optional enhancements suggested for future phases and roadmap.",
    pages: "1",
    Icon: PlusCircle,
  },
  {
    key: "operational-costs-monthly",
    title: "Operational Costs (Monthly)",
    description: "Hosting, third‑party services, APIs, and monitoring costs.",
    pages: "1",
    Icon: Wallet,
  },
  {
    key: "monthly-retainer-fee",
    title: "Monthly Retainer Fee",
    description: "Ongoing support, maintenance, and optimization retainer.",
    pages: "1",
    Icon: CreditCard,
  },
  {
    key: "total-investment-from-client",
    title: "Total Investment from Client",
    description: "Combined view of one‑time and recurring costs for decision makers.",
    pages: "1",
    Icon: Banknote,
  },
  {
    key: "implementation-timeline",
    title: "Implementation Timeline",
    description: "Phases, milestones, and estimated delivery windows.",
    pages: "1–2",
    Icon: Calendar,
  },
  {
    key: "benefits-and-roi",
    title: "Benefits & ROI",
    description: "Anticipated gains, cost savings, KPIs, and payback period.",
    pages: "1–2",
    Icon: TrendingUp,
  },
  {
    key: "next-steps",
    title: "Next Steps",
    description: "Approval, kickoff plan, and onboarding requirements.",
    pages: "1",
    Icon: ListChecks,
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
            <div className="text-sm text-slate-600">{count} of 16 sections selected</div>
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
