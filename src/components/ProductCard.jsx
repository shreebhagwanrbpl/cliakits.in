"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Microscope } from "lucide-react";
import { makeSlug } from "@/data/productsData";

export default function ProductCard({
  product,
  makeLink = (p) => p,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Prevent the whole page from crashing if an invalid/undefined
  // product reaches this component.
  if (!product || typeof product !== "object") {
    return null;
  }

  const {
    id,
    title,
    category,
    subCategory,
    description,
    desc,
    specs = {},
    badge,
    status,
    availability,
    image,
    slug,
    brand,
    model,
    throughput,
    capacity,
    instrument,
    automation,
    usage,
    price,
  } = product;

  // A product without an ID/title is not a valid dynamic product.
  if (!id || !title) {
    return null;
  }

  const productSlug = slug || makeSlug(title);
  const pdpLink = makeLink(`/items/${productSlug}`);
  const displayDesc = desc || description || "";

  const hasValidImage =
    image &&
    typeof image === "string" &&
    image.trim() !== "" &&
    image !== "/logo.png" &&
    !imgError;

  // Extract genuine dynamic specs from Admin/Firebase
  const dynamicSpecs = [];

  if (
    brand &&
    String(brand).trim() &&
    String(brand).trim() !== "N/A"
  ) {
    dynamicSpecs.push(["Brand", String(brand).trim()]);
  }

  if (
    model &&
    String(model).trim() &&
    String(model).trim() !== "N/A"
  ) {
    dynamicSpecs.push(["Model", String(model).trim()]);
  }

  if (
    throughput &&
    String(throughput).trim() &&
    String(throughput).trim() !== "N/A"
  ) {
    dynamicSpecs.push([
      "Throughput",
      String(throughput).trim(),
    ]);
  } else if (
    capacity &&
    String(capacity).trim() &&
    String(capacity).trim() !== "N/A"
  ) {
    dynamicSpecs.push([
      "Capacity",
      String(capacity).trim(),
    ]);
  } else if (
    instrument &&
    String(instrument).trim() &&
    String(instrument).trim() !== "N/A"
  ) {
    dynamicSpecs.push([
      "Instrument",
      String(instrument).trim(),
    ]);
  } else if (
    automation &&
    String(automation).trim() &&
    String(automation).trim() !== "N/A"
  ) {
    dynamicSpecs.push([
      "Automation",
      String(automation).trim(),
    ]);
  } else if (
    usage &&
    String(usage).trim() &&
    String(usage).trim() !== "N/A"
  ) {
    dynamicSpecs.push([
      "Usage",
      String(usage).trim(),
    ]);
  }

  // Pull additional genuine specs if required
  if (
    dynamicSpecs.length < 2 &&
    specs &&
    typeof specs === "object"
  ) {
    Object.entries(specs).forEach(([key, value]) => {
      if (
        dynamicSpecs.length < 3 &&
        value &&
        String(value).trim() &&
        String(value).trim() !== "N/A" &&
        !dynamicSpecs.some(
          ([existingKey]) =>
            existingKey.toLowerCase() === key.toLowerCase()
        )
      ) {
        dynamicSpecs.push([
          key,
          String(value).trim(),
        ]);
      }
    });
  }

  const displayStatus =
    status || availability || "In Stock";

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D6DEC0]/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#667A32]/50 hover:shadow-2xl hover:shadow-[#667A32]/15">

      <div>

        {/* Image Container */}
        <Link
          href={pdpLink}
          className="relative block h-60 w-full overflow-hidden bg-gradient-to-b from-[#F5F7EC] to-white p-4 border-b border-[#D6DEC0]/40"
        >
          {hasValidImage ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#EAF0D6]/70 via-[#F5F7EC] to-[#DEE6CC]/70 animate-pulse">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-sm border border-[#D6DEC0]/60 text-[#667A32]">
                    <Microscope
                      size={26}
                      className="animate-bounce text-[#667A32]"
                    />
                  </div>

                  <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[#4F6225]/70">
                    Loading Image...
                  </span>
                </div>
              )}

              <Image
                src={image}
                alt={title || "Biomedical Equipment"}
                fill
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`object-contain p-2 transition-all duration-500 group-hover:scale-105 ${imgLoaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
                  }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F7EC] via-[#EAF0D6] to-[#DEE6CC] p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-md border border-[#D6DEC0] text-[#667A32] transition-transform duration-300 group-hover:scale-110">
                <Microscope size={32} />
              </div>

              <span className="mt-3 text-xs font-extrabold uppercase tracking-wider text-[#283616]">
                {category || "Diagnostic Equipment"}
              </span>

              <span className="mt-0.5 text-[10px] font-semibold text-[#4F6225]/80">
                Certified Specification
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">

            {badge ? (
              <span className="rounded-full border border-[#667A32]/30 bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-extrabold text-[#667A32] shadow-sm">
                {badge}
              </span>
            ) : (
              <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#283616] shadow-sm truncate max-w-[150px]">
                {subCategory || category}
              </span>
            )}

            <span className="inline-flex items-center gap-1 rounded-full bg-[#667A32] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm shrink-0">
              <ShieldCheck size={12} />
              {displayStatus}
            </span>

          </div>
        </Link>

        {/* Details */}
        <div className="p-6">

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#667A32] truncate">
              {subCategory &&
                subCategory !== category
                ? `${category} • ${subCategory}`
                : category}
            </span>
          </div>

          <Link
            href={pdpLink}
            className="block mt-1.5"
          >
            <h3 className="text-xl font-bold text-[#283616] leading-tight group-hover:text-[#667A32] transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {displayDesc && (
            <p className="mt-2.5 text-sm text-[#4C5B38] line-clamp-2 leading-relaxed">
              {displayDesc}
            </p>
          )}

          {/* Dynamic Specs */}
          {dynamicSpecs.length > 0 && (
            <div className="mt-4 rounded-2xl border border-[#D6DEC0]/60 bg-[#F5F7EC]/80 p-3 space-y-1.5 text-xs text-[#4C5B38]">

              {dynamicSpecs
                .slice(0, 3)
                .map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center gap-2"
                  >
                    <span className="font-bold text-[#283616]">
                      {key}:
                    </span>

                    <span className="text-[#667A32] font-semibold truncate max-w-[170px]">
                      {val}
                    </span>
                  </div>
                ))}

            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0 mt-2 flex items-center gap-3">

        <Link
          href={pdpLink}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#667A32] py-3 text-center text-sm font-bold !text-white shadow-md transition-all hover:bg-[#4F6225] hover:shadow-lg group/btn"
        >
          <span className="!text-white text-white font-bold text-sm tracking-wide">
            Inquire Price & Specs
          </span>

          <ArrowRight
            size={16}
            className="!text-white text-white shrink-0 transition-transform group-hover/btn:translate-x-1"
          />
        </Link>

      </div>
    </div>
  );
}