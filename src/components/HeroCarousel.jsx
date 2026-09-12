"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Film,
} from "lucide-react";

/*
 * BENTO CAROUSEL
 *
 * IMPORTANT:
 * - Images have static fallbacks so the carousel always has media.
 * - Title, description and both button labels are DYNAMIC ONLY.
 * - No static fallback copy is used for those fields.
 */
const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1900&q=85",
  },
  {
    id: "fallback-2",
    type: "image",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1900&q=85",
  },
  {
    id: "fallback-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1900&q=85",
  },
];

export default function HeroCarousel({
  homeData = null,
  locationTitle = "",
  makeLink = (path) => path,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const videoRefs = useRef({});

  const parseMediaList = (data) => {
    if (!data) return [];

    const list = [];

    if (Array.isArray(data.media) && data.media.length > 0) {
      data.media.forEach((item, idx) => {
        const url = typeof item === "string" ? item : item?.url;
        const type =
          item?.type ||
          (url?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)
            ? "video"
            : "image");

        if (url) {
          list.push({
            id: `media-${idx}`,
            type,
            url,
          });
        }
      });
    }

    if (
      list.length === 0 &&
      Array.isArray(data.images) &&
      data.images.length > 0
    ) {
      data.images.forEach((url, idx) => {
        if (url) {
          list.push({
            id: `img-${idx}`,
            type: "image",
            url,
          });
        }
      });
    }

    if (list.length === 0 && (data.imageUrl || data.image)) {
      const singleImg = data.imageUrl || data.image;

      if (singleImg) {
        list.push({
          id: "single-img",
          type: "image",
          url: singleImg,
        });
      }
    }

    if (Array.isArray(data.videos) && data.videos.length > 0) {
      data.videos.forEach((vUrl, idx) => {
        if (vUrl && !list.some((item) => item.url === vUrl)) {
          list.push({
            id: `vid-${idx}`,
            type: "video",
            url: vUrl,
          });
        }
      });
    }

    if (data.videoUrl && !list.some((item) => item.url === data.videoUrl)) {
      list.push({
        id: "single-vid",
        type: "video",
        url: data.videoUrl,
      });
    }

    return list;
  };

  const dbSlides = parseMediaList(homeData);
  const slides = dbSlides.length > 0 ? dbSlides : FALLBACK_SLIDES;

  // DYNAMIC ONLY — no static title/description/button fallbacks.
  const heroTitle = homeData?.title?.trim() || "";
  const heroDescription = homeData?.description?.trim() || "";
  const btn1Text = homeData?.button1Text?.trim() || "";
  const btn2Text = homeData?.button2Text?.trim() || "";

  const btn1Href = makeLink("/items");
  const btn2Href = makeLink("/contact");

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(slides.length - 1);
    }
  }, [slides.length, currentSlide]);

  useEffect(() => {
    const currentMedia = slides[currentSlide];

    if (currentMedia?.type === "video") {
      const vid = videoRefs.current[currentSlide];

      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => { });
      }
    }
  }, [currentSlide, slides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const getRelativeIndex = (offset) => {
    if (!slides.length) return 0;
    return (currentSlide + offset + slides.length) % slides.length;
  };

  const renderMedia = (media, index, className, altText) => {
    if (!media) return null;

    if (media.type === "video") {
      return (
        <video
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          src={media.url}
          className={className}
          autoPlay={index === currentSlide}
          loop
          muted
          playsInline
          preload="auto"
        />
      );
    }

    return (
      <img
        src={media.url}
        alt={altText}
        className={className}
        onError={(e) => {
          if (e.currentTarget.src !== FALLBACK_SLIDES[0].url) {
            e.currentTarget.src = FALLBACK_SLIDES[0].url;
          }
        }}
      />
    );
  };

  const activeMedia = slides[currentSlide] || FALLBACK_SLIDES[0];

  return (
    <section className="relative overflow-hidden bg-[#F5F7EC] text-[#283616]">
      <div
        className="relative w-full min-h-[570px] sm:min-h-[620px] lg:min-h-[680px] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Soft background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F7EC] via-white to-[#EAF0D6]" />

        <div className="container-custom relative z-10 h-full py-6 sm:py-8 lg:py-10">
          {/* =====================================================
              BENTO CAROUSEL
              Large active image + two stacked preview images
          ===================================================== */}
          <div className="grid h-full min-h-[520px] grid-cols-1 gap-4 lg:grid-cols-[1.75fr_0.9fr] lg:min-h-[620px]">
            {/* LEFT — Large active media */}
            <div className="relative min-h-[360px] overflow-hidden rounded-[30px] border border-[#D6DEC0] bg-[#283616] shadow-2xl shadow-[#667A32]/15 sm:min-h-[440px] lg:min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`main-${activeMedia?.id}-${currentSlide}`}
                  initial={{ opacity: 0, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {renderMedia(
                    activeMedia,
                    currentSlide,
                    "h-full w-full object-cover object-center brightness-[0.86] contrast-[1.04]",
                    `Biomedical diagnostic slide ${currentSlide + 1}`
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Readability overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16200D]/95 via-[#283616]/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#16200D]/70 via-transparent to-transparent lg:w-[72%]" />

              {/* Dynamic content */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7 md:p-9 lg:p-10">
                <motion.div
                  key={`copy-${currentSlide}-${heroTitle}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl"
                >
                  {heroTitle && (
                    <h1 className="max-w-3xl text-3xl font-black leading-[1.08] tracking-tight !text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] sm:text-4xl md:text-5xl lg:text-6xl">
                      {heroTitle}
                    </h1>
                  )}

                  {heroDescription && (
                    <p className="mt-4 max-w-2xl text-sm font-medium leading-7 !text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-base md:text-lg">
                      {heroDescription}
                    </p>
                  )}

                  {(btn1Text || btn2Text) && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {btn1Text && (
                        <Link
                          href={btn1Href}
                          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#8DA64A]/50 bg-[#667A32] px-5 py-3 text-sm font-extrabold !text-white shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4F6225] hover:shadow-2xl"
                        >
                          <span className="!text-white">{btn1Text}</span>
                          <ArrowRight
                            size={17}
                            className="!text-white transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      )}

                      {btn2Text && (
                        <Link
                          href={btn2Href}
                          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/35 bg-[#16200D]/65 px-5 py-3 text-sm font-extrabold !text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:!text-[#283616]"
                        >
                          <PhoneCall
                            size={17}
                            className="text-[#B7CC73] transition-colors duration-300 group-hover:text-[#667A32]"
                          />
                          <span>{btn2Text}</span>
                        </Link>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Main slide type badge */}
              <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-[#16200D]/70 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] !text-white backdrop-blur-md sm:left-6 sm:top-6">
                {activeMedia?.type === "video" ? (
                  <Film size={13} className="text-[#B7CC73]" />
                ) : (
                  <ImageIcon size={13} className="text-[#B7CC73]" />
                )}
                <span>
                  {String(currentSlide + 1).padStart(2, "0")} /{" "}
                  {String(slides.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* RIGHT — Bento preview tiles */}
            <div className="grid min-h-[280px] grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2">
              {[1, 2].map((offset) => {
                const previewIndex = getRelativeIndex(offset);
                const preview = slides[previewIndex];

                return (
                  <button
                    key={`${preview?.id || previewIndex}-${offset}`}
                    type="button"
                    onClick={() => setCurrentSlide(previewIndex)}
                    aria-label={`Open slide ${previewIndex + 1}`}
                    className="group relative min-h-[180px] overflow-hidden rounded-[26px] border border-[#D6DEC0] bg-[#283616] text-left shadow-xl shadow-[#667A32]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#667A32]/60 hover:shadow-2xl hover:shadow-[#667A32]/20 lg:min-h-0"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`preview-${preview?.id}-${previewIndex}`}
                        initial={{ opacity: 0.5, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.45 }}
                        className="absolute inset-0"
                      >
                        {renderMedia(
                          preview,
                          previewIndex,
                          "h-full w-full object-cover object-center brightness-[0.78] transition-transform duration-500 group-hover:scale-105",
                          `Biomedical preview slide ${previewIndex + 1}`
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#16200D]/85 via-transparent to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4 sm:p-5">
                      <span className="rounded-full border border-white/20 bg-[#16200D]/65 px-3 py-1 text-[10px] font-bold uppercase tracking-wider !text-white backdrop-blur-md">
                        Slide {String(previewIndex + 1).padStart(2, "0")}
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#667A32] !text-white shadow-lg transition-transform duration-300 group-hover:translate-x-0.5">
                        <ArrowRight size={16} className="!text-white" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              FLOATING CONTROLS
          ===================================================== */}
          {slides.length > 1 && (
            <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-2xl border border-[#D6DEC0] bg-white/90 p-1.5 shadow-2xl backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setIsPlaying((value) => !value)}
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                className="flex h-10 w-10 items-center justify-center rounded-xl !text-[#283616] transition-all hover:bg-[#667A32] hover:!text-white"
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                title="Previous Slide"
                className="flex h-10 w-10 items-center justify-center rounded-xl !text-[#283616] transition-all hover:bg-[#667A32] hover:!text-white"
              >
                <ChevronLeft size={19} />
              </button>

              <div className="flex items-center gap-1 px-2">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                      ? "w-8 bg-[#667A32]"
                      : "w-2 bg-[#A7B68A] hover:bg-[#667A32]"
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                title="Next Slide"
                className="flex h-10 w-10 items-center justify-center rounded-xl !text-[#283616] transition-all hover:bg-[#667A32] hover:!text-white"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
