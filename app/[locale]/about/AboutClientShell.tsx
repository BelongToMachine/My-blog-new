"use client"
import DynamicBezierCurve from "@/app/components/navbar/DynamicBezierCurve"

export default function AboutClientShell({
  hero,
  children,
}: {
  hero: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <DynamicBezierCurve>{hero}</DynamicBezierCurve>
      {children}
    </>
  )
}
