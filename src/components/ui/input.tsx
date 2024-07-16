import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { InputRequiredHint } from "./input-required-hint";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: keyof typeof Icons;
}
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, required, icon, ...props }, ref) => {
    const Icon = icon ? Icons[icon] : undefined;

    return (
      <InputRequiredHint required={required}>
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="text-muted-foreground h-4 w-4 opacity-50" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "peer bg-transparent focus:border-blue-600 focus:outline-none focus:ring-3 outline-none  dark:bg-zinc-950 flex h-10 w-full rounded-md border-2 border-input peer pl-10 focus:ring-3 appearance-none text-sm placeholder:text-zinc-500 px-3 py-2 ring-offset-background focus:ring-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            Icon ? "pl-10" : "pl-3",
            className
          )}
          ref={ref}
          {...props}
        />
      </InputRequiredHint>
    );
  }
);
Input.displayName = "Input";

export { Input };
