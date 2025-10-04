"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Landing", href: "/" },
  { label: "Requirements", href: "/requirements" },
  { label: "Content Index", href: "/content-index" },
  { label: "Content Generation", href: "/content-generation" },
  { label: "Final Review", href: "/final-review" },
]

export function StepsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full md:w-56 lg:w-64 flex-shrink-0">
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-sm font-medium text-slate-700">Proposal Steps</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50 hover:text-blue-600",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
