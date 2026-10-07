"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "@/lib/client-api";
import { db } from "@/lib/client-api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
  Award,
  Zap,
  CheckCircle2,
  FileCheck,
  Cpu,
} from "lucide-react";
import { WEBSITE_ID } from "@/lib/catalog-utils";

const workflowSteps = [
  {
    step: "01",
    title: "Diagnostic Audit & Consultation",
    desc: "We analyze your hospital sample load, space constraints, and technical requirements to select the exact analyzer configuration.",
    icon: FileCheck,
  },
  {
    step: "02",
    title: "Precision Solution Engineering",
    desc: "Custom lab layout designs, power backup specifications, and reagent supply schedule formulation.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Installation & NABL Calibration",
    desc: "Certified engineers perform physical installation, IQ/OQ/PQ protocols, and NABL-traceable reference calibration.",
    icon: Award,
  },
  {
    step: "04",
    title: "24/7 SLA Field Maintenance",
    desc: "Round-the-clock technical emergency support, scheduled preventive maintenance visits, and automated reagent restocking.",
    icon: Zap,
  },
];

export default function ServicesPage() {


  // IMPORTANT:
  // Services are loaded ONLY from Admin/Firebase.
  // There is NO fallbackServices state and NO static service fallback.
  const [services, setServices] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  const icons = [
    <Microscope size={28} key="microscope" />,
    <FlaskConical size={28} key="flask" />,
    <ShieldCheck size={28} key="shield" />,
    <Stethoscope size={28} key="stethoscope" />,
    <Wrench size={28} key="wrench" />,
    <Activity size={28} key="activity" />,
  ];

  useEffect(() => {
    let cancelled = false;

    const fetchServicesAndContact = async () => {
      setLoading(true);

      try {
        const websiteId = WEBSITE_ID;

        const [servicesSnap, contactSnap] = await Promise.all([
          getDoc(
            doc(
              db,
              "websites",
              websiteId,
              "pages",
              "services"
            )
          ),

          getDoc(
            doc(
              db,
              "websites",
              websiteId,
              "pages",
              "contact"
            )
          ),
        ]);

        if (cancelled) return;

        // =====================================================
        // SERVICES - ADMIN/FIREBASE ONLY
        // =====================================================
        if (servicesSnap.exists()) {
          const savedServices = servicesSnap.data()?.services;

          // Admin code saves an array of:
          // { title: "...", desc: "..." }
          //
          // Do not merge with any static fallback.
          // Do not create static services when Firebase is empty.
          const dynamicServices = Array.isArray(savedServices)
            ? savedServices.filter(
              (service) =>
                service &&
                typeof service === "object" &&
                (
                  String(service.title || "").trim() ||
                  String(service.desc || "").trim()
                )
            )
            : [];

          setServices(dynamicServices);
        } else {
          setServices([]);
        }

        // =====================================================
        // CONTACT - KEEPING EXISTING DYNAMIC CONTACT LOGIC
        // =====================================================
        if (contactSnap.exists()) {
          setContactInfo(
            contactSnap.data()?.contactInfo || []
          );
        } else {
          setContactInfo([]);
        }
      } catch (error) {
        console.error(
          "Error loading services/contact data:",
          error
        );

        if (!cancelled) {
          // If Firebase fails, do NOT show static services.
          setServices([]);
          setContactInfo([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchServicesAndContact();

    return () => {
      cancelled = true;
    };
  }, []);

  // Dynamically extract emergency helpline phone number
  const emergencyPhone = (() => {
    const item = contactInfo.find((c) => {
      const label = String(c?.label || "").toLowerCase();

      return (
        label.includes("phone") ||
        label.includes("mobile") ||
        label.includes("helpline") ||
        label.includes("emergency") ||
        label.includes("tel") ||
        label.includes("contact")
      );
    });

    if (!item) return "";

    if (Array.isArray(item.value)) {
      return item.value[0] || "";
    }

    return typeof item.value === "string"
      ? item.value.trim()
      : "";
  })();

  return (
    <div className="bg-[#F5F7EC]/40 text-[#283616]">

      {/* =====================================================
          BANNER - STATIC
      ===================================================== */}
      <PageBanner
        badge="Technical Services"
        title="Biomedical Support From Setup to Service"
        subtitle="NABL-certified calibration, 2-hour emergency repair SLAs, cold-chain reagent distribution, and turnkey pathology setup."
      />

      {/* =====================================================
          SERVICES - ADMIN DATA ONLY
      ===================================================== */}
      <section className="section-padding bg-gradient-to-b from-white via-[#F5F7EC] to-[#EAF0D6]">
        <div className="container-custom">

          <SectionTitle
            badge="Full Service Catalog"
            title="Designed Around Reliable Operations"
            description="Explore our specialized services designed to keep clinical laboratories and hospital departments operating at peak accuracy."
            center
          />

          <div className="mt-16">

            {/* LOADING */}
            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ServiceCard
                    key={`service-loading-${index}`}
                    loading
                  />
                ))}
              </div>
            ) : services.length === 0 ? (

              /* NO SERVICES */
              <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-[#D6DEC0] bg-white px-6 py-12 text-center shadow-sm">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F7EC] text-[#667A32]">
                    <Wrench size={30} />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-[#283616]">
                    Services Not Found
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#4C5B38]">
                    No services are currently available.
                  </p>
                </div>
              </div>

            ) : (

              /* DYNAMIC ADMIN SERVICES */
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => (
                  <ServiceCard
                    key={service.id || `service-${index}`}
                    icon={icons[index % icons.length]}
                    title={service.title || "Service"}
                    description={service.desc || ""}
                    makeLink={makeLink}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW - STATIC
      ===================================================== */}
      <section className="section-padding bg-white border-y border-[#D6DEC0]/60">
        <div className="container-custom">

          <SectionTitle
            badge="Execution Framework"
            title="Our 4-Step Engineering Workflow"
            description="A systematic process ensuring seamless integration, rapid compliance, and long-term instrument reliability."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D6DEC0] bg-[#F5F7EC] p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#667A32] hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-black text-[#667A32]/40 group-hover:text-[#667A32] transition-colors">
                        {step.step}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#667A32] shadow-sm">
                        <Icon size={24} />
                      </div>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-[#283616] group-hover:text-[#667A32] transition-colors">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#4C5B38]">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D6DEC0]/40">
                    <span className="text-xs font-bold text-[#4F6225]">
                      Phase {index + 1} Milestone
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          EMERGENCY SLA - STATIC EXCEPT PHONE FROM ADMIN
      ===================================================== */}
      <section className="section-padding bg-gradient-to-b from-[#EAF0D6] via-white to-[#F5F7EC]">
        <div className="container-custom">

          <div className="rounded-3xl border border-[#D6DEC0] bg-gradient-to-r from-[#283616] to-[#4C5B38] p-8 sm:p-12 text-white shadow-xl">

            <div className="grid lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-8">

                <span className="inline-flex items-center gap-2 rounded-full bg-[#667A32] px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <Zap size={14} />
                  Emergency Breakdown Helpline
                </span>

                <h3 className="mt-4 text-3xl font-black !text-white sm:text-4xl">
                  Facing an Equipment Emergency in ICU or Lab?
                </h3>

                <p className="mt-3 text-base !text-[#D6DEC0] leading-relaxed">
                  Our certified field engineers are equipped with OEM diagnostic kits and genuine spare parts for instant on-site restoration.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-semibold text-white">

                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#667A32]" />
                    <span>2-Hour On-Site SLA</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#667A32]" />
                    <span>Loaner Analyzer Option</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#667A32]" />
                    <span>NABL Re-calibration Included</span>
                  </div>

                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center border-t lg:border-t-0 lg:border-l border-[#D6DEC0]/20 pt-6 lg:pt-0 lg:pl-8">

                <p className="text-xs font-bold uppercase tracking-wider !text-[#D6DEC0]">
                  Emergency Dispatch
                </p>

                {emergencyPhone ? (
                  <a
                    href={`tel:${emergencyPhone.replace(/\s+/g, "")}`}
                    className="mt-2 text-2xl font-black text-white hover:text-[#8DA64A] transition-colors inline-block"
                  >
                    {emergencyPhone}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-[#D6DEC0]">
                    24/7 Field Dispatch Active
                  </p>
                )}

                <Link
                  href={makeLink("/contact")}
                  className="mt-5 w-full rounded-2xl bg-[#667A32] py-3.5 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-[#4F6225]"
                >
                  Book Priority Repair
                </Link>

              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
