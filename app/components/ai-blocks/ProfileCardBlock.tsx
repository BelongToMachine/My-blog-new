"use client"

interface ProfileCardData {
  name?: string
  role?: string
  location?: string
  experience?: string
  focus?: string[]
  productAreas?: string[]
  contact?: {
    email?: string
    github?: string
    linkedin?: string
  }
}

export default function ProfileCardBlock({
  title,
  data,
}: {
  title?: string
  data: ProfileCardData
}) {
  const {
    name = "Jie Liao",
    role = "Front-End Developer",
    location = "Hangzhou, China",
    experience = "",
    focus = [],
    productAreas = [],
    contact,
  } = data

  return (
    <div className="pixel-card space-y-4">
      {title ? (
        <p className="font-pixel text-xs uppercase tracking-[0.22em] text-primary">
          {title}
        </p>
      ) : null}

      <div className="space-y-1">
        <p className="font-pixel text-lg uppercase tracking-[0.1em] text-foreground">
          {name}
        </p>
        <p className="text-sm text-muted-foreground">{role}</p>
        <p className="text-sm text-muted-foreground">{location}</p>
      </div>

      {experience ? (
        <div>
          <p className="font-pixel mb-1.5 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Experience
          </p>
          <p className="text-sm leading-7 text-foreground/90">{experience}</p>
        </div>
      ) : null}

      {focus.length > 0 ? (
        <div>
          <p className="font-pixel mb-1.5 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Focus
          </p>
          <ul className="space-y-1">
            {focus.map((item, i) => (
              <li key={i} className="text-sm text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {productAreas.length > 0 ? (
        <div>
          <p className="font-pixel mb-1.5 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Product Areas
          </p>
          <ul className="space-y-1">
            {productAreas.map((item, i) => (
              <li key={i} className="text-sm text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {contact ? (
        <div>
          <p className="font-pixel mb-1.5 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Contact
          </p>
          <div className="space-y-1 text-sm text-foreground/90">
            {contact.email ? <p>{contact.email}</p> : null}
            {contact.github ? <p>{contact.github}</p> : null}
            {contact.linkedin ? <p>{contact.linkedin}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
