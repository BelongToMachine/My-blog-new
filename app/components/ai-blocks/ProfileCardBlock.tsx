"use client"

import { useTranslations } from "next-intl"
import type { ProfileCardArtifactData } from "@/app/types/ai-workspace"

export default function ProfileCardBlock({
  title,
  data,
}: {
  title?: string
  data: ProfileCardArtifactData
}) {
  const t = useTranslations("ai")
  const {
    name = "Developer",
    role = "Front-End Developer",
    location = "Hangzhou, China",
    experience = "",
    focus = [],
    productAreas = [],
    contact,
  } = data

  return (
    <div className="space-y-4">
      {title ? (
        <p className="font-pixel text-[11px] uppercase tracking-[0.16em] text-primary">
          {title}
        </p>
      ) : null}

      <div className="space-y-1">
        <p className="font-pixel text-[1rem] tracking-[0.06em] text-foreground">
          {name}
        </p>
        <p className="text-[12px] leading-6 tracking-[0.04em] text-muted-foreground">{role}</p>
        <p className="text-[12px] leading-6 tracking-[0.04em] text-muted-foreground">{location}</p>
      </div>

      {experience ? (
        <div>
          <p className="mb-1.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/76">
            {t("profileExperience")}
          </p>
          <p className="text-[12px] leading-6 tracking-[0.04em] text-foreground/90">{experience}</p>
        </div>
      ) : null}

      {focus.length > 0 ? (
        <div>
          <p className="mb-1.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/76">
            {t("profileFocus")}
          </p>
          <ul className="space-y-1">
            {focus.map((item, index) => (
              <li key={index} className="text-[12px] leading-6 tracking-[0.04em] text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {productAreas.length > 0 ? (
        <div>
          <p className="mb-1.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/76">
            {t("profileProductAreas")}
          </p>
          <ul className="space-y-1">
            {productAreas.map((item, index) => (
              <li key={index} className="text-[12px] leading-6 tracking-[0.04em] text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {contact ? (
        <div>
          <p className="mb-1.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/76">
            {t("profileContact")}
          </p>
          <div className="space-y-1 text-[12px] leading-6 tracking-[0.04em] text-foreground/90">
            {contact.email ? <p>{contact.email}</p> : null}
            {contact.github ? <p>{contact.github}</p> : null}
            {contact.linkedin ? <p>{contact.linkedin}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
