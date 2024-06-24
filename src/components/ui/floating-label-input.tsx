import React, { useState, useRef, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <Input className={cn("peer", className)} ref={ref} {...props} />
  }
)
FloatingInput.displayName = "FloatingInput"

const FloatingLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<"label"> & { isFocused: boolean; hasValue: boolean }
>(({ className, isFocused, hasValue, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "bg-background dark:bg-background absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 px-2 text-sm text-gray-500 duration-300 peer-focus:top-1/2 peer-focus:-translate-y-1/2 peer-focus:scale-100",
        !isFocused || hasValue ? "top-1/2 -translate-y-1/2 scale-100" : "", // Floating state for focus or value
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
FloatingLabel.displayName = "FloatingLabel"

type FloatingLabelInputProps = InputProps & { label?: string }

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (inputRef.current?.value.trim()) {
      setHasValue(true)
    } else {
      setHasValue(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!event.target.value.trim()) // Check for non-empty/non-whitespace value
  }

  // Handle initial state based on input value (optional)
  useEffect(() => {
    if (inputRef.current?.value.trim()) {
      setHasValue(true)
    }
  }, [inputRef]) // Run only on initial render

  return (
    <div className="relative">
      <FloatingInput
        ref={ref || inputRef}
        id={id}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      <FloatingLabel isFocused={isFocused} hasValue={hasValue} htmlFor={id}>
        {label}
      </FloatingLabel>
    </div>
  )
})
FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingInput, FloatingLabel, FloatingLabelInput }
