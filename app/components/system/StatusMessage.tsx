import FormMessage from "./FormMessage"

interface StatusMessageProps {
  tone?: "info" | "success" | "error" | "warning"
  title?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const StatusMessage = ({
  tone = "info",
  title,
  children,
  className,
}: StatusMessageProps) => {
  return (
    <FormMessage tone={tone} className={className}>
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="leading-6">{children}</div>
      </div>
    </FormMessage>
  )
}

export default StatusMessage
