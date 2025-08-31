import { Breadcrumbs } from "@/components/breadcrumbs"
import { StepsSidebar } from "@/components/steps-sidebar"
import { BusinessRequirementsForm } from "@/components/forms/business-requirements-form"

export default function RequirementsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 font-sans">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Requirements", current: true },
          ]}
        />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <StepsSidebar />
        <section className="flex-1">
          <header className="mb-4">
            <h1 className="text-balance text-2xl font-semibold text-slate-800">Business Requirements</h1>
            <p className="mt-1 text-sm text-slate-600">
              Provide project details and objectives to kickstart your proposal.
            </p>
          </header>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <BusinessRequirementsForm />
          </div>
        </section>
      </div>
    </main>
  )
}
