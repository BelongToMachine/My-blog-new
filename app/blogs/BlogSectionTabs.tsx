import { Link } from "@/app/i18n/navigation"
import { getTranslations } from "next-intl/server"

interface Props {
  active: "database" | "mdx"
}

export default async function BlogSectionTabs({ active }: Props) {
  const t = await getTranslations("blogs")

  const tabs = [
    { href: "/blogs", label: t("dbTab"), isActive: active === "database" },
    { href: "/articles", label: t("mdxTab"), isActive: active === "mdx" },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-[0.45rem] border px-4 py-2 text-sm transition-colors ${
            tab.isActive
              ? "border-primary bg-primary text-white"
              : "border-border bg-background/70 text-foreground/80 hover:border-primary hover:text-primary"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
