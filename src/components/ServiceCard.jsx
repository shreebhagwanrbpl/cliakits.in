import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServiceCard({
  icon,
  title,
  description,
  badge,
  turnaround,
  highlights = [],
  loading = false,
  makeLink = (p) => p,
}) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-[#D6DEC0] bg-white p-8 shadow-md">
        <div className="mb-6 h-14 w-14 rounded-2xl bg-[#DEE6CC]" />

        <div className="mb-4 h-7 w-3/4 rounded bg-[#D4DBC2]" />

        <div className="space-y-3">
          <div className="h-4 rounded bg-[#DEE6CC]" />
          <div className="h-4 w-11/12 rounded bg-[#DEE6CC]" />
          <div className="h-4 w-8/12 rounded bg-[#DEE6CC]" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-[#D6DEC0] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#667A32]/50 hover:shadow-2xl hover:shadow-[#667A32]/15">
      <div>
        {/* Top bar with Icon & Badge */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div
            className="
              flex h-14 w-14 items-center justify-center rounded-2xl
              bg-gradient-to-br from-[#DEE6CC] to-[#EAF0D6]
              text-[#667A32]
              shadow-sm
              transition-all duration-300
              group-hover:!bg-none
              group-hover:!bg-[#667A32]
              group-hover:!from-transparent
              group-hover:!to-transparent
              group-hover:!text-white
              group-hover:scale-105
            "
          >
            {icon}
          </div>

          {badge && (
            <span className="rounded-full border border-[#667A32]/20 bg-[#EAF0D6] px-3 py-1 text-xs font-bold text-[#4F6225]">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 text-2xl font-bold text-[#283616] transition-colors duration-300 group-hover:text-[#667A32]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[#4C5B38] sm:text-base">
          {description}
        </p>

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <ul className="mt-6 space-y-2.5 border-t border-[#D6DEC0]/60 pt-5 text-sm text-[#4C5B38]">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="shrink-0 text-[#667A32]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-[#D6DEC0]/40 pt-4">
        {turnaround ? (
          <span className="text-xs font-semibold text-[#4F6225]">
            SLA:{" "}
            <strong className="text-[#667A32]">
              {turnaround}
            </strong>
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#4C5B38]">
            Certified Quality
          </span>
        )}

        <Link
          href={makeLink("/contact")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#667A32] transition-all group-hover:translate-x-1 group-hover:text-[#4F6225]"
        >
          <span>Book Service</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}