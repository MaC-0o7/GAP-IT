"use client";

import { useId, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { IconSearch } from "@tabler/icons-react";
import { GooeyInput } from "@/components/ui/gooey-input";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn("emerald-card rounded-2xl border p-4 md:p-5", className)}
    >
      {children}
    </div>
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  className,
  variant = "secondary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "emerald-button shadow-sm active:translate-y-px",
        variant === "secondary" &&
          "border border-slate-300 bg-white/90 text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        variant === "ghost" &&
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
        className,
      )}
      type={type}
    >
      {children}
    </button>
  );
}

type SearchInputProps = Omit<ComponentProps<typeof GooeyInput>, "startAdornment"> & {
  "aria-label": string;
};

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <GooeyInput
      {...props}
      className={cn("rounded-xl", className)}
      type="search"
      startAdornment={<IconSearch aria-hidden="true" className="size-4" />}
    />
  );
}

type DropdownProps = ComponentProps<"select"> & {
  children: ReactNode;
};

export function Dropdown({ children, className, ...props }: DropdownProps) {
  return (
    <select
      {...props}
      className={cn(
        "emerald-input min-h-10 rounded-xl border px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900",
        className,
      )}
    >
      {children}
    </select>
  );
}

type SwitchProps = Omit<ComponentProps<"button">, "onChange" | "role"> & {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
};

export function Switch({
  checked,
  label,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <button
      {...props}
      aria-checked={checked}
      aria-label={label}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600",
        className,
      )}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          "pointer-events-none size-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

export type SelectionOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectionControlProps = {
  options: readonly SelectionOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  label: string;
};

export function SegmentedControl({
  options,
  value,
  onValueChange,
  className,
  label,
}: SelectionControlProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/90 p-1 dark:border-slate-700 dark:bg-slate-900/70",
        className,
      )}
      role="radiogroup"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            aria-checked={selected}
            className={cn(
              "min-h-8 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
              selected
                ? "bg-[#334e68] text-white shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            )}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs({
  options,
  value,
  onValueChange,
  className,
  label,
}: SelectionControlProps) {
  const id = useId();
  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % options.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
    }
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextOption = options[nextIndex];
    if (nextOption && !nextOption.disabled) {
      onValueChange(nextOption.value);
      document.getElementById(`${id}-${nextOption.value}`)?.focus();
    }
  };

  return (
    <div
      aria-label={label}
      className={cn(
        "flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700",
        className,
      )}
      role="tablist"
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            id={`${id}-${option.value}`}
            aria-selected={selected}
            className={cn(
              "min-h-10 shrink-0 border-b-2 px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
              selected
                ? "border-[#334e68] bg-[#334e68] text-white"
                : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            )}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) => moveTab(event, index)}
            role="tab"
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
