"use client"

import { useEffect, useRef, type RefObject } from "react"

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable=\"true\"]",
  "[tabindex]:not([tabindex=\"-1\"])",
].join(",")

interface UseFocusTrapOptions {
  active: boolean
  containerRef: RefObject<HTMLElement | null>
  initialFocusRef?: RefObject<HTMLElement | null>
  returnFocusRef?: RefObject<HTMLElement | null>
  onEscape: () => void
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    const style = window.getComputedStyle(element)
    return style.display !== "none" && style.visibility !== "hidden"
  })
}

export function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  returnFocusRef,
  onEscape,
}: UseFocusTrapOptions) {
  const onEscapeRef = useRef(onEscape)
  onEscapeRef.current = onEscape

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const returnFocusElement = returnFocusRef?.current

    const previouslyInert = container.inert
    const previouslyAriaHidden = container.getAttribute("aria-hidden")

    container.inert = !active
    if (active) {
      container.removeAttribute("aria-hidden")
    } else {
      container.setAttribute("aria-hidden", "true")
    }

    if (!active) {
      return () => {
        container.inert = previouslyInert
        if (previouslyAriaHidden === null) {
          container.removeAttribute("aria-hidden")
        } else {
          container.setAttribute("aria-hidden", previouslyAriaHidden)
        }
      }
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const focusInitialElement = () => {
      const initialElement = initialFocusRef?.current
      const isDisabled =
        initialElement &&
        "disabled" in initialElement &&
        Boolean((initialElement as HTMLButtonElement).disabled)
      if (initialElement && !isDisabled) {
        initialElement.focus()
        return
      }

      const firstFocusable = getFocusableElements(container)[0]
      if (firstFocusable) {
        firstFocusable.focus()
      } else {
        container.focus()
      }
    }

    const frameId = window.requestAnimationFrame(focusInitialElement)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onEscapeRef.current()
        return
      }

      if (event.key !== "Tab") return

      const focusableElements = getFocusableElements(container)
      if (focusableElements.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement,
      )

      if (event.shiftKey && (currentIndex <= 0 || currentIndex === -1)) {
        event.preventDefault()
        focusableElements[focusableElements.length - 1].focus()
      } else if (
        !event.shiftKey &&
        (currentIndex === focusableElements.length - 1 || currentIndex === -1)
      ) {
        event.preventDefault()
        focusableElements[0].focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown, true)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("keydown", handleKeyDown, true)
      container.inert = previouslyInert
      if (previouslyAriaHidden === null) {
        container.removeAttribute("aria-hidden")
      } else {
        container.setAttribute("aria-hidden", previouslyAriaHidden)
      }

      const returnTarget = returnFocusElement ?? previouslyFocused
      if (returnTarget && returnTarget.isConnected) {
        window.requestAnimationFrame(() => returnTarget.focus())
      }
    }
  }, [active, containerRef, initialFocusRef, returnFocusRef])
}
