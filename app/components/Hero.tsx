"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import selfieOutlined from "@/public/images/selfie-no-background-outlined-wide-padded-focus-orange-1080.webp"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"
import localFont from "next/font/local"

const bebasNeue = localFont({
  src: "../../public/fonts/bebas-neue/BebasNeue-Regular.woff2",
  display: "swap",
})

interface Props {
  showBackLink?: boolean
}

const Hero = ({ showBackLink = true }: Props) => {
  const t = useTranslations("hero")
  const spotlightRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const heroPortrait = selfieOutlined
  const portraitImageClass =
    "h-full w-full object-contain object-bottom scale-[1.08]"

  const code = t.raw("code") as string
  const [hasResolvedViewport, setHasResolvedViewport] = useState(false)

  useEffect(() => {
    const updateViewportWidth = () => {
      setHasResolvedViewport(true)
    }

    updateViewportWidth()
    window.addEventListener("resize", updateViewportWidth)

    return () => {
      window.removeEventListener("resize", updateViewportWidth)
    }
  }, [])

  const shouldDisableScrollLift = !hasResolvedViewport || shouldReduceMotion
  const welcomeLiftDistance = -120
  const contentLiftDistance = -80
  const { scrollYProgress } = useScroll({
    target: spotlightRef,
    offset: ["start start", "end start"],
  })
  const welcomeScrollLift = useTransform(
    scrollYProgress,
    [0, 1],
    [0, welcomeLiftDistance],
  )
  const contentScrollLift = useTransform(
    scrollYProgress,
    [0, 1],
    [0, contentLiftDistance],
  )
  const welcomeLift = useSpring(welcomeScrollLift, {
    stiffness: 118,
    damping: 19,
    mass: 1.02,
  })
  const contentLift = useSpring(contentScrollLift, {
    stiffness: 132,
    damping: 22,
    mass: 0.96,
  })

  return (
    <div
      ref={spotlightRef}
      className="relative overflow-hidden min-h-[35rem] min-[390px]:min-h-[38rem] min-[480px]:min-h-[40rem] md:min-h-0 px-5 sm:px-8 md:px-6 lg:px-14 md:pt-16 lg:pt-12 pb-8 sm:pb-10 md:pb-16 lg:pb-20"
      id="about-me-section"
    >
      {showBackLink ? (
        <Link
          href="/"
          className="absolute -left-1 top-3 z-30 inline-flex items-center gap-1.5 border-2 border-primary/30 bg-background/80 px-2.5 py-1.5 text-sm font-medium tracking-[0.02em] text-primary backdrop-blur-sm transition-all duration-200 hover:border-primary/60 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:-left-1 md:top-5"
        >
          <span>←</span>
          <span>{t("backToNav")}</span>
        </Link>
      ) : null}
      <motion.div
        className="pointer-events-none absolute inset-x-0 z-0 flex justify-center top-24 min-[480px]:top-20 md:top-12"
        style={
          shouldDisableScrollLift
            ? undefined
            : { y: welcomeLift, willChange: "transform" }
        }
      >
        <span
          className={cn(
            bebasNeue.className,
            "hero-welcome-mobile-drift inline-block origin-top text-[clamp(10.5rem,40vw,13rem)] font-normal uppercase leading-[0.8] tracking-[0.04em] text-foreground/[0.12] [font-synthesis-weight:none] subpixel-antialiased dark:text-foreground/[0.14] md:text-[clamp(6.5rem,28vw,17rem)] md:font-normal md:leading-none md:tracking-[0.06em] md:text-foreground/[0.08] md:[font-synthesis-weight:none] md:subpixel-antialiased md:dark:text-foreground/[0.1] md:scale-x-[1.12] md:scale-y-[1.5] lg:text-[clamp(6.5rem,26vw,18rem)]",
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
          style={
            shouldDisableScrollLift
              ? undefined
              : { y: contentLift, willChange: "transform" }
          }
          className="relative z-30 col-span-6 pt-44 min-[550px]:pt-36 min-[580px]:pl-16 md:z-20 md:col-span-4 md:pl-12 md:pt-24 lg:col-span-3 lg:pt-44 lg:pl-24 xl:pt-48 xl:pl-28"
        >
          <div className="max-w-[11.5rem] space-y-4 min-[390px]:max-w-[12.25rem] min-[480px]:max-w-[14rem] sm:max-w-[15rem] md:w-[18rem] md:max-w-none md:space-y-6 lg:w-[24rem] xl:w-[26rem]">
            <motion.h1
              className={cn(
                bebasNeue.className,
                "relative top-14 lg:top-2 md:left-0 lg:-left-14 lg:ml-10 whitespace-nowrap text-[clamp(4.8rem,15vw,6rem)] font-black uppercase leading-[0.92] tracking-[0.03em] text-foreground md:text-[clamp(5rem,13vw,7.1rem)] lg:text-[clamp(8.0rem,10vw,8.8rem)]",
              )}
            >
              I&apos;M JIE
            </motion.h1>
            <div className="space-y-4 md:max-w-[19rem] lg:-translate-x-2 translate-y-4 lg:-translate-y-8 lg:max-w-none lg:space-y-6 xl:-translate-x-3 xl:-translate-y-10">
              <p className="text-[15px] min-[480px]:text-base md:text-[1.05rem] lg:text-[1.05rem] leading-[1.75] tracking-[0.01em] min-[480px]:max-w-[24ch] sm:max-w-[28ch] md:max-w-[40ch] lg:max-w-[42ch] min-[1101px]:max-w-[48ch] xl:max-w-[42ch] ml-2 lg:-ml-24 mt-10 text-muted-foreground [text-wrap:pretty]">
                {t("shortIntro")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/ai"
                  className="ai-cta-shimmer group inline-flex min-h-10 items-center gap-2 border-2 border-primary/35 bg-primary/[0.04] px-3 py-2.5 text-sm font-medium tracking-[0.02em] text-primary transition-all duration-200 hover:border-primary/70 hover:bg-primary/[0.09] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-[480px]:min-h-11 min-[480px]:px-4 min-[480px]:py-3 md:px-4 md:py-2.5 lg:min-h-0 lg:px-3.5 lg:py-2"
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
          transition={{
            duration: 0.65,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none col-span-6 z-10 md:pointer-events-auto md:col-span-4 md:self-start lg:col-span-5 lg:-mx-2 xl:-mx-4"
        >
          <div
            className="relative w-[28rem] md:w-[25rem] lg:w-full lg:max-w-[980px] xl:max-w-[1040px] md:mx-auto -translate-x-32 md:-translate-x-14 lg:translate-x-8 sm:-translate-y-10 md:-translate-y-16 lg:-translate-y-12"
            data-mobile-hero-avatar
          >
            <div className="relative aspect-[4/4.7] sm:aspect-[4/5]">
              <Image
                src={heroPortrait}
                alt={t("imageAlt")}
                fill
                sizes="(min-width: 1280px) 880px, (min-width: 1024px) 46vw, (min-width: 768px) 40vw, 72vw"
                className={portraitImageClass}
                priority
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={
            shouldDisableScrollLift
              ? undefined
              : { y: contentLift, willChange: "transform" }
          }
          className="max-[767px]:hidden absolute right-0 top-[14.25rem] z-30 flex w-[8.75rem] justify-end min-[390px]:top-[15rem] min-[390px]:w-[9.75rem] min-[480px]:top-[15.75rem] min-[480px]:w-[11.5rem] md:relative md:right-auto md:top-auto md:col-span-4 md:mt-0 md:w-auto md:pt-24 lg:col-span-4 lg:justify-start lg:pt-0 lg:pb-6"
        >
          <div className="w-full md:w-[316px] md:translate-x-2 lg:w-[364px] lg:-translate-x-8 lg:translate-y-32 xl:w-[500px] xl:-translate-x-10 xl:translate-y-36 2xl:w-[508px]">
            <div className="mb-2 flex items-center justify-between border-b border-border/50 pb-1.5 text-[8px] font-medium tracking-[0.08em] text-muted-foreground min-[390px]:text-[8px] min-[480px]:text-[9px] md:mb-3 md:pb-2 md:text-[10px] md:tracking-[0.12em]">
              <span>Profile Snapshot</span>
              <span>coder.ts</span>
            </div>
            <HeroCodeBlock
              code={code}
              className="shadow-[var(--shadow-elevated)] [&_.codeblock-pre]:max-h-[11.25rem] [&_.codeblock-pre]:overflow-hidden [&_.codeblock-pre]:p-2 [&_.codeblock-pre]:text-[6px] [&_.codeblock-pre]:leading-[1.6] [&_.codeblock-pre]:tracking-[0.01em] min-[390px]:[&_.codeblock-pre]:text-[6.5px] min-[480px]:[&_.codeblock-pre]:max-h-[13rem] min-[480px]:[&_.codeblock-pre]:text-[8px] md:[&_.codeblock-pre]:max-h-none md:[&_.codeblock-pre]:text-[11px] md:[&_.codeblock-pre]:leading-[1.65] lg:[&_.codeblock-pre]:text-[13px] lg:[&_.codeblock-pre]:leading-[1.7] xl:[&_.codeblock-pre]:text-[14px]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function HeroCodeBlock({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  const lines = code.split("\n")

  return (
    <div className={cn("overflow-hidden border-2 border-border", className)}>
      <div
        className="flex h-9 items-center border-b-2 border-border px-3"
        style={{ background: "var(--codeblock-taskbar-bg, #f0f0f0)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="block h-3 w-3 bg-[#ff5f57]" />
          <span className="block h-3 w-3 bg-[#ffbd2e]" />
          <span className="block h-3 w-3 bg-[#28c840]" />
        </div>
      </div>
      <div style={{ background: "var(--codeblock-body-bg, #ffffff)" }}>
        <pre className="codeblock-pre m-0 w-full overflow-auto p-4 font-mono text-[12px] leading-6 text-[#e7eef5]">
          <code>
            {lines.map((line, lineIndex) => (
              <React.Fragment key={`${lineIndex}-${line}`}>
                {renderHighlightedLine(line)}
                {lineIndex < lines.length - 1 ? "\n" : null}
              </React.Fragment>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

function renderHighlightedLine(line: string) {
  const tokens = line.match(
    /(\s+|const|return|"(?:[^"\\]|\\.)*"|[A-Za-z_$][\w$]*|=>|=|[{}()[\],.:;])/g,
  )

  if (!tokens) {
    return line
  }

  return tokens.map((token, tokenIndex) => {
    const className = getTokenClassName(token)

    if (!className) {
      return <React.Fragment key={`${tokenIndex}-${token}`}>{token}</React.Fragment>
    }

    return (
      <span key={`${tokenIndex}-${token}`} className={className}>
        {token}
      </span>
    )
  })
}

function getTokenClassName(token: string) {
  if (/^\s+$/.test(token)) {
    return null
  }

  if (token === "const" || token === "return") {
    return "text-[#ff7ab6]"
  }

  if (token === "=>" || /^[{}()[\],.:;]$/.test(token)) {
    return "text-[#7aa2f7]"
  }

  if (/^"(?:[^"\\]|\\.)*"$/.test(token)) {
    return "text-[#a5d6ff]"
  }

  if (/^[A-Za-z_$][\w$]*$/.test(token)) {
    return "text-[#e6b673]"
  }

  return null
}

export default Hero
