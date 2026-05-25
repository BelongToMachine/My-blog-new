"use client"
import DynamicBezierCurve from "@/app/components/navbar/DynamicBezierCurve"

export default function AboutClientShell({
  hero,
  children,
  mirrorCurve = false,
}: {
  hero: React.ReactNode
  children: React.ReactNode
  mirrorCurve?: boolean
}) {
  return (
    <>
      <DynamicBezierCurve mirrorCurve={mirrorCurve}>{hero}</DynamicBezierCurve>
      {children}
    </>
  )
}
