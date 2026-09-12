export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
  className = "",
}) {
  return (
    <div
      className={`max-w-3xl ${center ? "mx-auto text-center" : ""} ${className}`}
    >
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#667A32]/25 bg-gradient-to-r from-[#EAF0D6] to-[#DEE6CC] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4F6225] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#667A32] animate-pulse" />
          {badge}
        </div>
      )}

      {title && (
        <h2 className="text-3xl font-extrabold tracking-tight text-[#283616] sm:text-4xl md:text-5xl leading-tight">
          {title}
        </h2>
      )}

      {description && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#4C5B38]">
          {description}
        </p>
      )}
    </div>
  );
}