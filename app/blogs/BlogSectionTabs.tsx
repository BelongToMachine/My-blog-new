import { Link } from "@/app/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { buttonVariants } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"

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
          className={cn(
            buttonVariants({ variant: tab.isActive ? "default" : "outline" }),
            "rounded-md"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
