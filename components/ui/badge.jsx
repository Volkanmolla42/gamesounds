import * as React from "react"

import { cn } from "../../lib/utils"

function Badge({
  className,
  variant = "default",
  ...props
}) {
  const variants = {
    default: "bg-gray-700 text-gray-200 hover:bg-gray-600",
    secondary: "bg-gray-600 text-gray-200 hover:bg-gray-500",
    destructive: "bg-red-500 text-gray-50 hover:bg-red-600",
    outline: "border border-gray-600 text-gray-200 hover:bg-gray-700",
    premium: "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
