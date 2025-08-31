import Link from "next/link"

export default function Page() {
  return (
    <main className="font-sans">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-blue-600" aria-hidden="true" />
              <span className="text-base font-semibold text-slate-700">ProposalGen</span>
            </div>
            <nav aria-label="Primary" className="text-sm">
              <ul className="hidden items-center gap-6 text-slate-700 sm:flex">
                <li>
                  <Link className="hover:text-blue-600" href="/requirements">
                    Start
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-blue-600" href="/content-index">
                    Content Index
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <h1 className="text-pretty text-3xl font-semibold leading-tight text-slate-800 md:text-4xl">
              Generate polished proposals faster with a clear, guided workflow
            </h1>
            <p className="text-slate-600 leading-relaxed">
              Collect business requirements, define objectives, and assemble a content outline— all in one professional,
              modern interface.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/requirements"
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Start New Proposal
              </Link>
              <Link
                href="/content-index"
                className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                View Content Index
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-medium text-slate-700">Requirements</h3>
                <p className="mt-1 text-xs text-slate-600">Company, client details, scope</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-medium text-slate-700">Objectives</h3>
                <p className="mt-1 text-xs text-slate-600">Align on outcomes and KPIs</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-medium text-slate-700">Budget & Timeline</h3>
                <p className="mt-1 text-xs text-slate-600">Plan feasibility and scope</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-medium text-slate-700">Content Index</h3>
                <p className="mt-1 text-xs text-slate-600">Auto-structure your proposal</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
