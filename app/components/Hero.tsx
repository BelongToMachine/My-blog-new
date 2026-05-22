"use client"
import React, { useContext, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import selfie from "@/public/images/selfie-no-background.png"
import { TypeAnimation } from "react-type-animation"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { ThemeContext } from "../context/DarkModeContext"
import { CodeBlocker } from "../packages/index"
import { useLocale, useTranslations } from "next-intl"
import { FloatingPixelAssistant } from "./PixelAssistantPreview"
import { Link } from "@/app/i18n/navigation"
import localFont from "next/font/local"

const bebasNeue = localFont({
  src: "../../public/fonts/bebas-neue/BebasNeue-Regular.woff2",
  display: "swap",
})

const SHOW_FLOATING_ASSISTANT = false

interface Props {
  showBackLink?: boolean
  variant?: "default" | "spotlight"
}

const Hero = ({ showBackLink = true, variant = "default" }: Props) => {
  const t = useTranslations("hero")
  const locale = useLocale()
  const themeContext = useContext(ThemeContext)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  if (!themeContext) {
    throw new Error("ThemeToggle must be used within a ThemeProvider")
  }

  const { colorMode } = themeContext
  const heroPortrait = selfie
  const portraitImageClass =
    "h-full w-full object-contain object-bottom scale-[1.08]"

  const typeSequence = t.raw("typeSequence") as string[]
  const code = t.raw("code") as string
  const [typingIndex, setTypingIndex] = useState(0)
  const isEnLongText = locale === "en" && typingIndex === 1
  const { scrollYProgress } = useScroll({
    target: spotlightRef,
    offset: ["start end", "end start"],
  })
  const welcomeScrollLift = useTransform(scrollYProgress, [0, 1], [0, -38])
  const titleScrollLift = useTransform(scrollYProgress, [0, 1], [0, -26])
  const welcomeLift = useSpring(welcomeScrollLift, {
    stiffness: 118,
    damping: 19,
    mass: 1.02,
  })
  const titleLift = useSpring(titleScrollLift, {
    stiffness: 128,
    damping: 20,
    mass: 0.98,
  })

  if (variant === "spotlight") {
    return (
      <div
        ref={spotlightRef}
        className="relative min-h-[35rem] overflow-hidden px-5 pb-8 pt-10 min-[390px]:min-h-[38rem] min-[480px]:min-h-[40rem] sm:px-8 sm:pb-10 sm:pt-12 md:min-h-0 md:px-6 md:pb-16 md:pt-20 lg:px-14 lg:pb-20 lg:pt-24"
        id="about-me-section"
        data-home-landing-target-anchor
      >
        {showBackLink ? (
          <Link
            href="/"
            className="absolute -left-1 top-3 z-30 inline-flex items-center gap-1.5 border-2 border-primary/30 bg-background/80 px-2.5 py-1.5 font-pixel text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-all duration-200 hover:border-primary/60 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:-left-1 md:top-5"
          >
            <span>←</span>
            <span>{t("backToNav")}</span>
          </Link>
        ) : null}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-16 z-0 flex justify-center min-[480px]:top-20 sm:top-24 md:top-24 lg:top-36"
          style={
            shouldReduceMotion
              ? undefined
              : { y: welcomeLift, willChange: "transform" }
          }
        >
          <span
            className={cn(
              bebasNeue.className,
              "inline-block text-[clamp(4.8rem,44vw,9rem)] font-black uppercase leading-none tracking-[0.06em] text-foreground/[0.08] dark:text-foreground/[0.1] [transform:scaleY(1.5) scaleX(1.12)] md:text-[clamp(6.5rem,28vw,12rem)] lg:text-[clamp(6.5rem,26vw,17rem)]",
            )}
          >
            Welcome
          </span>
        </motion.div>
        <div className="relative z-10 grid grid-cols-12 gap-y-8 md:items-start md:gap-x-0 lg:gap-x-4 xl:gap-x-6">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-30 col-span-7 pt-40 min-[480px]:col-span-6 min-[480px]:pt-44 md:z-20 md:col-span-4 md:pt-24 lg:col-span-3 lg:pt-44 lg:pl-24 xl:pt-48 xl:pl-28"
          >
            <div className="max-w-[11.5rem] space-y-4 min-[390px]:max-w-[12.25rem] min-[480px]:max-w-[14rem] sm:max-w-[15rem] md:w-[18rem] md:max-w-none md:translate-x-12 md:space-y-6 lg:w-[22rem] lg:translate-x-0 xl:w-[24rem]">
              <motion.h1
                className={cn(
                  bebasNeue.className,
                  "whitespace-nowrap text-[clamp(3.2rem,15vw,4.8rem)] font-black uppercase leading-[0.92] tracking-[0.03em] text-foreground min-[480px]:text-[clamp(3.7rem,13vw,5.4rem)] md:text-[clamp(5rem,13vw,7.1rem)] lg:text-[clamp(4.9rem,10vw,8.8rem)] lg:translate-y-5 xl:translate-y-6",
                )}
                style={
                  shouldReduceMotion
                    ? undefined
                    : { y: titleLift, willChange: "transform" }
                }
              >
                I&apos;M JIE
              </motion.h1>
              <div className="space-y-4 md:max-w-[19rem] lg:-translate-y-8 lg:max-w-none lg:space-y-6 xl:-translate-y-10">
                <p className="max-w-[18ch] font-pixel text-[11px] leading-[1.75] tracking-[0.05em] text-muted-foreground [text-wrap:pretty] min-[390px]:text-[12px] min-[480px]:max-w-[20ch] min-[480px]:text-[13px] sm:max-w-[21ch] md:max-w-[24ch] md:text-base md:tracking-[0.06em] lg:-ml-8 lg:max-w-[34ch] lg:text-base lg:leading-[1.8] lg:tracking-[0.08em] xl:-ml-10">
                  {t("shortIntro")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/ai"
                    className="ai-cta-shimmer group inline-flex min-h-10 items-center gap-2 border-2 border-primary/35 bg-primary/[0.04] px-3 py-2.5 font-pixel text-[9px] uppercase tracking-[0.2em] text-primary transition-all duration-200 hover:border-primary/70 hover:bg-primary/[0.09] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-[390px]:text-[10px] min-[480px]:min-h-11 min-[480px]:px-4 min-[480px]:py-3 min-[480px]:text-[11px] md:px-4 md:py-2.5 lg:min-h-0 lg:px-3.5 lg:py-2"
                  >
                    <span>{t("aiCtaLabel")}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-1/2 top-[6.25rem] z-10 md:pointer-events-auto md:relative md:left-auto md:top-auto md:col-span-4 md:self-start lg:col-span-6 lg:-mx-4 xl:-mx-6"
          >
            <div
              className="relative w-[12.5rem] max-w-none -translate-x-1/2 min-[390px]:w-[14rem] min-[480px]:w-[16rem] md:mx-auto md:w-[25rem] md:-translate-x-14 md:translate-y-10 lg:w-full lg:translate-x-0 lg:-translate-y-36 lg:max-w-[1100px]"
              data-mobile-hero-avatar
            >
              <div className="relative aspect-[4/4.7] sm:aspect-[4/5]">
                <Image
                  src={heroPortrait}
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1280px) 960px, (min-width: 1024px) 50vw, (min-width: 768px) 40vw, 72vw"
                  className="h-full w-full object-contain object-bottom"
                  priority
                />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[14.25rem] z-30 flex w-[8.75rem] justify-end min-[390px]:top-[15rem] min-[390px]:w-[9.75rem] min-[480px]:top-[15.75rem] min-[480px]:w-[11.5rem] md:relative md:right-auto md:top-auto md:col-span-4 md:mt-0 md:w-auto md:pt-24 lg:col-span-3 lg:justify-end lg:pt-0 lg:pb-6"
          >
            <div className="w-full max-w-none md:w-[21rem] md:-translate-x-16 lg:w-[26rem] lg:translate-x-0 lg:translate-y-36 xl:w-[29rem] xl:translate-y-40">
              <div className="mb-2 flex items-center justify-between border-b border-border/50 pb-1.5 font-pixel text-[5px] uppercase tracking-[0.18em] text-muted-foreground min-[390px]:text-[6px] min-[480px]:text-[7px] md:mb-3 md:pb-2 md:text-[9px] md:tracking-[0.22em]">
                <span>Profile Snapshot</span>
                <span>coder.ts</span>
              </div>
              <CodeBlocker
                code={code}
                colorMode={colorMode}
                compact
                className="shadow-[var(--shadow-elevated)] [&_.codeblock-pre]:max-h-[10.5rem] [&_.codeblock-pre]:overflow-hidden [&_.codeblock-pre]:p-2 [&_.codeblock-pre]:text-[5.5px] [&_.codeblock-pre]:leading-[1.55] [&_.codeblock-pre]:tracking-[0.01em] min-[390px]:[&_.codeblock-pre]:text-[6px] min-[480px]:[&_.codeblock-pre]:max-h-[12rem] min-[480px]:[&_.codeblock-pre]:text-[7px] md:[&_.codeblock-pre]:max-h-none md:[&_.codeblock-pre]:text-[10px] md:[&_.codeblock-pre]:leading-5 lg:[&_.codeblock-pre]:text-[12px] lg:[&_.codeblock-pre]:leading-6"
              />
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative px-5 pb-12 pt-10 md:px-10 md:pt-12 lg:px-14 lg:pb-10 lg:pt-10"
      id="about-me-section"
    >
      {/* Back to Index */}
      {showBackLink ? (
        <Link
          href="/"
          className="absolute -left-1 top-3 z-30 inline-flex items-center gap-1.5 border-2 border-primary/30 bg-background/80 px-2.5 py-1.5 font-pixel text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-all duration-200 hover:border-primary/60 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:-left-1 md:top-5"
        >
          <span>←</span>
          <span>{t("backToNav")}</span>
        </Link>
      ) : null}
      <div className="grid grid-cols-1 items-start gap-8 lg:-translate-y-4 lg:grid-cols-12 lg:items-start lg:gap-x-4 xl:-translate-y-6 xl:gap-x-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full items-start justify-center lg:col-start-2 lg:col-end-8 lg:justify-start"
        >
          <div className="relative w-full min-w-0 max-w-[800px] lg:max-w-[680px] xl:max-w-[760px]">
            <h1 className="mb-3 min-h-[5rem] text-left text-[1.75rem] min-[375px]:text-[2rem] md:text-[2.5rem] font-extrabold leading-[1.05] lg:min-h-[7rem] lg:text-5xl xl:min-h-[8rem] xl:text-6xl">
              <span className="font-pixel uppercase tracking-[0.04em] text-primary">
                {`${t("greeting")} `}
              </span>
              <TypeAnimation
                sequence={typeSequence.flatMap((value, index) => [
                  () => setTypingIndex(index),
                  value,
                  1500,
                ])}
                wrapper="div"
                speed={50}
                repeat={Infinity}
                className={cn(
                  "font-pixel mt-1 block whitespace-nowrap min-h-[1.1em] text-left uppercase tracking-[0.04em] text-foreground transition-all duration-300",
                  isEnLongText && "lg:text-[0.55em]",
                )}
              />
            </h1>
            <p className="font-pixel mb-4 mt-2 max-w-xl text-sm leading-relaxed tracking-wide text-muted-foreground md:text-base">
              {t("shortIntro")}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="mb-5"
            >
              <Link
                href="/ai"
                className="ai-cta-shimmer group inline-flex items-center gap-2 border-2 border-primary/35 bg-primary/[0.04] px-3.5 py-2 font-pixel text-[11px] uppercase tracking-[0.22em] text-primary transition-all duration-200 hover:border-primary/70 hover:bg-primary/[0.09] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <span>{t("aiCtaLabel")}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </motion.div>
            {SHOW_FLOATING_ASSISTANT ? <FloatingPixelAssistant /> : null}
            <div className="relative mt-5 min-h-[280px] md:min-h-[360px] lg:hidden">
              <div className="relative z-10 w-full max-w-[500px] min-w-0 pt-6">
                <CodeBlocker
                  code={code}
                  colorMode={colorMode}
                  compact
                  className="hero-codeblock-mobile h-full"
                />
              </div>
            </div>
            <div className="mt-6 hidden w-full min-w-0 max-w-[640px] lg:block xl:max-w-[720px]">
              <CodeBlocker code={code} colorMode={colorMode} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative z-20 hidden lg:col-start-8 lg:col-end-12 lg:flex lg:items-start lg:justify-start"
        >
          <div className="relative ml-2 mt-32 w-full max-w-[340px] lg:mt-36 lg:-translate-x-6 xl:ml-0 xl:mt-32 xl:max-w-[380px] xl:-translate-x-2">
            <div className="relative aspect-square w-[276px] lg:w-[304px] xl:w-[344px]">
                <Image
                  src={heroPortrait}
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1280px) 308px, 272px"
                  className={portraitImageClass}
                  priority
                />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
