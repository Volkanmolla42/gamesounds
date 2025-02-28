'use client'

import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-white hover:bg-gray-700",
        primary: "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600",
        outline: "border border-input bg-transparent hover:bg-gray-800 text-gray-300",
        secondary: "bg-gray-700 text-white hover:bg-gray-600",
        ghost: "hover:bg-gray-800 text-gray-300 hover:text-gray-100",
        link: "underline-offset-4 hover:underline text-blue-400 hover:text-blue-300",
        danger: "bg-red-500 hover:bg-red-600 text-white",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
      isLoading: {
        true: "relative text-transparent transition-none hover:text-transparent",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isLoading: false
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  isLoading = false,
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, isLoading, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
