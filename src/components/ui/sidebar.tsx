"use client";

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type SidebarContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  animate: boolean;
};

type SidebarLinkData = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: ComponentProps<"a">["onClick"];
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

export function SidebarProvider({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = setOpenProp ?? setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  open,
  setOpen,
  animate,
}: {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}) {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
}

export function SidebarBody({
  children,
  className,
  showMobile = true,
  ...props
}: Omit<ComponentProps<typeof motion.div>, "children"> & {
  children: ReactNode;
  showMobile?: boolean;
}) {
  return (
    <>
      <DesktopSidebar className={className} {...props}>
        {children}
      </DesktopSidebar>
      {showMobile && <MobileSidebar>{children}</MobileSidebar>}
    </>
  );
}

function DesktopSidebar({
  children,
  className,
  ...props
}: ComponentProps<typeof motion.aside>) {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.aside
      aria-label="Main navigation"
      className={cn(
        "hidden h-dvh shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white px-3 py-5 dark:border-slate-800 dark:bg-slate-950 md:flex",
        className,
      )}
      animate={{ width: animate ? (open ? 272 : 76) : 272 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </motion.aside>
  );
}

function MobileSidebar({ children }: { children: ReactNode }) {
  const { open, setOpen } = useSidebar();

  return (
    <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
      <span className="text-sm font-bold tracking-[0.16em] text-slate-900">
        GAP-IT
      </span>
      <button
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className="inline-flex size-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <IconMenu2 aria-hidden="true" className="size-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-0 z-50 flex h-dvh w-full flex-col bg-white p-5"
            exit={{ opacity: 0, x: "-100%" }}
            initial={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="mb-7 flex items-center justify-between">
              <span className="text-sm font-bold tracking-[0.16em] text-slate-900">
                GAP-IT
              </span>
              <button
                aria-label="Close navigation menu"
                className="inline-flex size-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                onClick={() => setOpen(false)}
                type="button"
              >
                <IconX aria-hidden="true" className="size-5" />
              </button>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SidebarLink({
  link,
  className,
  ...props
}: {
  link: SidebarLinkData;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "onClick">) {
  const { open, animate } = useSidebar();

  return (
    <a
      aria-current={link.active ? "page" : undefined}
      aria-label={!open ? link.label : undefined}
      className={cn(
        "group/sidebar flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
        link.active
          ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
        className,
      )}
      href={link.href}
      onClick={link.onClick}
      title={!open ? link.label : undefined}
      {...props}
    >
      <span className="grid size-5 shrink-0 place-items-center">{link.icon}</span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="whitespace-nowrap"
        transition={{ duration: 0.15 }}
      >
        {link.label}
      </motion.span>
    </a>
  );
}
