"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function BusinessRequirementsForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    // In a real app, persist form data before navigation
    setTimeout(() => {
      router.push("/content-index")
    }, 300)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 font-sans">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
            Company Name
          </label>
          <input
            id="companyName"
            name="companyName"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Acme Corp"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="projectTitle" className="text-sm font-medium text-slate-700">
            Project Title
          </label>
          <input
            id="projectTitle"
            name="projectTitle"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="New Website Redesign"
          />
        </div>
      </section>

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-medium text-slate-700">Client Information</legend>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="clientName" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="clientName"
              name="clientName"
              required
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Jane Doe"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="clientCompany" className="text-sm font-medium text-slate-700">
              Company
            </label>
            <input
              id="clientCompany"
              name="clientCompany"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Client Co."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="clientEmail" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              required
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="jane@example.com"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="projectDescription" className="text-sm font-medium text-slate-700">
          Project Description
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          required
          rows={5}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Describe the project goals, audience, and scope."
        />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="budgetRange" className="text-sm font-medium text-slate-700">
            Budget Range
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select a budget</option>
            <option value="<10k">Under $10,000</option>
            <option value="10-25k">$10,000 - $25,000</option>
            <option value="25-50k">$25,000 - $50,000</option>
            <option value="50-100k">$50,000 - $100,000</option>
            <option value="100k+">$100,000+</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="timeline" className="text-sm font-medium text-slate-700">
            Timeline
          </label>
          <input
            id="timeline"
            name="timeline"
            type="date"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="industryType" className="text-sm font-medium text-slate-700">
            Industry Type
          </label>
          <select
            id="industryType"
            name="industryType"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select an industry</option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>Retail</option>
            <option>Education</option>
            <option>Other</option>
          </select>
        </div>
      </section>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700">Key Objectives</legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Improve User Experience",
            "Increase Conversion",
            "Reduce Operational Costs",
            "Launch MVP Quickly",
            "Integrate Existing Systems",
            "Enhance Brand Presence",
          ].map((label) => (
            <label
              key={label}
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-blue-600"
            >
              <input type="checkbox" name="objectives" value={label} className="h-4 w-4 accent-blue-600" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => history.back()}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit & Continue"}
        </button>
      </div>
    </form>
  )
}
