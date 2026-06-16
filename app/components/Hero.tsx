import React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import selfieOutlined from "@/public/images/selfie-no-background-outlined-wide-padded-focus-orange-1080.webp"
import { getTranslations } from "next-intl/server"
import { Link } from "@/app/i18n/navigation"
import HeroDeferredMotion from "./HeroDeferredMotion"

interface Props {
  showBackLink?: boolean
}

export default async function Hero({ showBackLink = true }: Props) {
  const t = await getTranslations("hero")
  const heroPortrait = selfieOutlined
  const portraitImageClass =
    "h-full w-full object-contain object-bottom scale-[1.08]"
  const code = t.raw("code") as string

  return (
    <div
      className="relative overflow-hidden min-h-[35rem] min-[390px]:min-h-[38rem] min-[480px]:min-h-[40rem] md:min-h-0 px-5 sm:px-8 md:px-6 lg:px-14 md:pt-16 lg:pt-12 pb-8 sm:pb-10 md:pb-16 lg:pb-20"
      id="about-me-section"
      data-hero-root
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
      <div
        data-hero-scroll="welcome"
        className="pointer-events-none absolute inset-x-0 z-0 flex justify-center top-24 min-[480px]:top-20 md:top-12"
      >
        <span
          className={cn(
            "font-display-face hero-welcome-mobile-drift inline-block origin-top text-[clamp(10.5rem,40vw,13rem)] font-normal uppercase leading-[0.8] tracking-[0.04em] text-foreground/[0.12] [font-synthesis-weight:none] subpixel-antialiased dark:text-foreground/[0.14] md:text-[clamp(6.5rem,28vw,17rem)] md:font-normal md:leading-none md:tracking-[0.06em] md:text-foreground/[0.08] md:[font-synthesis-weight:none] md:subpixel-antialiased md:dark:text-foreground/[0.1] md:scale-x-[1.12] md:scale-y-[1.5] lg:text-[clamp(6.5rem,26vw,18rem)]",
          )}
        >
          Welcome
        </span>
      </div>
      <div className="relative z-10 grid grid-cols-12 gap-y-8 md:items-start md:gap-x-0 lg:gap-x-4 xl:gap-x-6">
        <div
          data-hero-enter="left"
          data-hero-scroll="content"
          className="relative z-30 col-span-6 pt-44 min-[550px]:pt-36 min-[580px]:pl-16 md:z-20 md:col-span-4 md:pl-12 md:pt-24 lg:col-span-3 lg:pt-44 lg:pl-24 xl:pt-48 xl:pl-28"
        >
          <div className="max-w-[11.5rem] space-y-4 min-[390px]:max-w-[12.25rem] min-[480px]:max-w-[14rem] sm:max-w-[15rem] md:w-[18rem] md:max-w-none md:space-y-6 lg:w-[24rem] xl:w-[26rem]">
            <h1
              className={cn(
                "font-display-face relative top-14 lg:top-2 md:left-0 lg:-left-14 lg:ml-10 whitespace-nowrap text-[clamp(4.8rem,15vw,6rem)] font-black uppercase leading-[0.92] tracking-[0.03em] text-foreground md:text-[clamp(5rem,13vw,7.1rem)] lg:text-[clamp(8.0rem,10vw,8.8rem)]",
              )}
            >
              I&apos;M JIE
            </h1>
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
        </div>
        <div
          className="pointer-events-none col-span-6 z-10 md:pointer-events-auto md:col-span-4 md:self-start lg:col-span-5 lg:-mx-2 xl:-mx-4"
          data-hero-enter="image"
        >
          <div
            className="relative w-[28rem] -translate-x-32 sm:-translate-y-20 md:mx-auto md:w-[25rem] md:-translate-x-14 md:-translate-y-16 lg:w-full lg:translate-x-8 lg:-translate-y-16 lg:max-w-[980px] xl:max-w-[1040px]"
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
        </div>
        <div
          data-hero-enter="code"
          data-hero-scroll="content"
          className="max-[767px]:hidden absolute right-0 top-[14.25rem] z-30 flex w-[8.75rem] justify-end min-[390px]:top-[15rem] min-[390px]:w-[9.75rem] min-[480px]:top-[15.75rem] min-[480px]:w-[11.5rem] md:relative md:right-auto md:top-auto md:col-span-4 md:mt-0 md:w-auto md:pt-24 lg:col-span-4 lg:justify-start lg:pt-0 lg:pb-6"
        >
          <div className="w-full md:w-[316px] md:translate-x-2 lg:w-[364px] lg:-translate-x-8 lg:translate-y-32 xl:w-[500px] xl:-translate-x-10 xl:translate-y-36 2xl:w-[508px]">
            <div className="mb-2 flex items-center justify-between border-b border-border/50 pb-1.5 text-[8px] font-medium tracking-[0.08em] text-muted-foreground min-[390px]:text-[8px] min-[480px]:text-[9px] md:mb-3 md:pb-2 md:text-[10px] md:tracking-[0.12em]">
              <span>Profile Snapshot</span>
              <span>coder.ts</span>
            </div>
            <HeroCodeBlock
              code={code}
              className="shadow-[var(--shadow-elevated)] [&_.codeblock-pre]:max-h-[11.25rem] [&_.codeblock-pre]:overflow-hidden [&_.codeblock-pre]:p-2.5 [&_.codeblock-pre]:text-[7px] [&_.codeblock-pre]:leading-[1.62] [&_.codeblock-pre]:tracking-[0.01em] min-[390px]:[&_.codeblock-pre]:text-[7.5px] min-[480px]:[&_.codeblock-pre]:max-h-[13rem] min-[480px]:[&_.codeblock-pre]:text-[9px] md:[&_.codeblock-pre]:max-h-none md:[&_.codeblock-pre]:text-[12px] md:[&_.codeblock-pre]:leading-[1.68] lg:[&_.codeblock-pre]:text-[14px] lg:[&_.codeblock-pre]:leading-[1.72] xl:[&_.codeblock-pre]:text-[15px]"
            />
          </div>
        </div>
      </div>
      <HeroDeferredMotion />
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
        style={{ background: "var(--codeblock-taskbar-bg, #232937)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="block h-3.5 w-3.5" style={{ background: "#ff5f57" }} />
          <span className="block h-3.5 w-3.5" style={{ background: "#ffbd2e" }} />
          <span className="block h-3.5 w-3.5" style={{ background: "#28c840" }} />
        </div>
      </div>
      <div style={{ background: "var(--codeblock-body-bg, #0d1118)" }}>
        <pre className="codeblock-pre m-0 w-full overflow-auto p-4 font-mono text-[12px] leading-6 text-[#d8e1f0]">
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
      return (
        <React.Fragment key={`${tokenIndex}-${token}`}>{token}</React.Fragment>
      )
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
    return "text-[#f38ba8]"
  }

  if (token === "=>" || /^[{}()[\],.:;]$/.test(token)) {
    return "text-[#89b4fa]"
  }

  if (/^"(?:[^"\\]|\\.)*"$/.test(token)) {
    return "text-[#94e2d5]"
  }

  if (/^[A-Za-z_$][\w$]*$/.test(token)) {
    return "text-[#f9c97c]"
  }

  return null
}
