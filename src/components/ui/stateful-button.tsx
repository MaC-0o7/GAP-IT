"use client";

import { useState, type ComponentProps, type ReactNode } from "react";

type StatefulButtonProps = Omit<ComponentProps<"button">, "children" | "onClick"> & {
  children: ReactNode;
  onClick: () => void | Promise<void>;
  successLabel?: string;
};

export function StatefulButton({
  children,
  onClick,
  successLabel = "Sent",
  disabled,
  type = "button",
  ...props
}: StatefulButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleClick = async () => {
    if (state === "loading" || disabled) return;

    setState("loading");
    try {
      await onClick();
      setState("success");
      window.setTimeout(() => setState("idle"), 1800);
    } catch (error) {
      console.error("Stateful button action failed.", error);
      setState("error");
    }
  };

  return (
    <button
      {...props}
      aria-busy={state === "loading"}
      disabled={disabled || state === "loading"}
      onClick={() => void handleClick()}
      type={type}
    >
      {state === "loading"
        ? "Sending…"
        : state === "success"
          ? successLabel
          : state === "error"
            ? "Failed — retry"
            : children}
    </button>
  );
}
