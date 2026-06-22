"use client"

import { useEffect, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { cn } from "@/lib/utils"

type DeferredFunFactImageProps = {
  src: StaticImageData
  alt: string
  sizes: string
  figureClassName: string
  imageClassName: string
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number
  cancelIdleCallback?: (handle: number) => void
}

const IDLE_IMAGE_TIMEOUT_MS = 1800
const FALLBACK_IMAGE_DELAY_MS = 600

export default function DeferredFunFactImage({
  src,
  alt,
  sizes,
  figureClassName,
  imageClassName,
}: DeferredFunFactImageProps) {
  const [shouldRenderImage, setShouldRenderImage] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const idleWindow = window as IdleWindow
    let idleHandle: number | undefined
    let timeoutHandle: number | undefined

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(
        () => setShouldRenderImage(true),
        { timeout: IDLE_IMAGE_TIMEOUT_MS },
      )
    } else {
      timeoutHandle = window.setTimeout(
        () => setShouldRenderImage(true),
        FALLBACK_IMAGE_DELAY_MS,
      )
    }

    return () => {
      if (idleHandle !== undefined) {
        idleWindow.cancelIdleCallback?.(idleHandle)
      }

      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle)
      }
    }
  }, [])

  return (
    <figure className={figureClassName} aria-busy={!isLoaded}>
      {shouldRenderImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading="lazy"
          fetchPriority="low"
          className={cn(
            imageClassName,
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setIsLoaded(true)}
        />
      ) : null}

      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,hsl(var(--muted))/0.74,hsl(var(--accent))/0.34)] transition-opacity duration-300",
          isLoaded ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,transparent,hsl(var(--background))/0.46,transparent)]" />
      </div>
    </figure>
  )
}
