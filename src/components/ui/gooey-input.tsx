"use client";

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GooeyInputProps = ComponentPropsWithoutRef<"input"> & {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  wrapperClassName?: string;
};

export const GooeyInput = forwardRef<HTMLInputElement, GooeyInputProps>(
  function GooeyInput(
    { className, endAdornment, startAdornment, wrapperClassName, ...props },
    ref,
  ) {
    const filterId = useId().replaceAll(":", "");

    return (
      <div className={cn("gooey-input group/gooey relative isolate", wrapperClassName)}>
        <svg aria-hidden="true" className="absolute size-0" focusable="false">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </svg>
        <span
          aria-hidden="true"
          className="gooey-input__glow pointer-events-none absolute -inset-1 z-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-200 group-focus-within/gooey:opacity-100"
          style={{ filter: `url(#${filterId})` }}
        >
          <span className="gooey-input__blob gooey-input__blob--one" />
          <span className="gooey-input__blob gooey-input__blob--two" />
        </span>
        {startAdornment && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-20 grid -translate-y-1/2 place-items-center text-slate-400">
            {startAdornment}
          </span>
        )}
        <input
          {...props}
          className={cn(
            "relative z-10 h-10 w-full rounded-xl border border-slate-200 bg-slate-50/90 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900",
            startAdornment ? "pl-9" : "pl-3",
            endAdornment ? "pr-14" : "pr-3",
            className,
          )}
          ref={ref}
        />
        {endAdornment && (
          <span className="pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2">
            {endAdornment}
          </span>
        )}
      </div>
    );
  },
);
