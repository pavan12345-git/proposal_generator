import Link from "next/link"

type Crumb = {
  label: string
  href?: string
  current?: boolean
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm font-sans">
      <ol className="flex items-center gap-2 text-slate-600">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !item.current ? (
                <Link href={item.href} className="hover:text-blue-600 hover:underline transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={item.current ? "page" : undefined}
                  className={item.current ? "text-slate-700 font-medium" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-slate-400" aria-hidden="true">
                  {">"}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
