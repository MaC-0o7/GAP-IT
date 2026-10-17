"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  IconActivity,
  IconBell,
  IconChartBar,
  IconChevronLeft,
  IconCpu,
  IconDatabase,
  IconFileReport,
  IconHistory,
  IconLayoutDashboard,
  IconMenu2,
  IconMoon,
  IconRoute,
  IconSearch,
  IconSettings,
  IconSettingsAutomation,
  IconSun,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { createDemoData, type DemoData } from "@/lib/demo-data";
import { WorkspaceModule } from "@/components/workspace-module";
import { GooeyInput } from "@/components/ui/gooey-input";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: <IconLayoutDashboard className="size-5" />,
    description: "A high-level view of your quality operations.",
  },
  {
    id: "live-measurements",
    label: "Live Measurements",
    icon: <IconActivity className="size-5" />,
    description: "Monitor incoming measurements from connected instruments.",
  },
  {
    id: "instrument-management",
    label: "Instruments & Gateways",
    icon: <IconCpu className="size-5" />,
    description: "Manage instruments, gateways, and their connection details.",
  },
  {
    id: "spc-analytics",
    label: "SPC Analysis",
    icon: <IconChartBar className="size-5" />,
    description: "Explore statistical process control charts and analysis.",
  },
  {
    id: "spc-reports",
    label: "SPC Reports",
    icon: <IconFileReport className="size-5" />,
    description: "Review and prepare statistical process control reports.",
  },
  {
    id: "part-inspection-setup",
    label: "Parts & Inspection",
    icon: <IconSettingsAutomation className="size-5" />,
    description: "Configure parts, characteristics, and inspection plans.",
  },
  {
    id: "alerts-quality-events",
    label: "Quality Events",
    icon: <IconBell className="size-5" />,
    description: "Review quality alerts and manage follow-up events.",
  },
  {
    id: "traceability",
    label: "Traceability",
    icon: <IconRoute className="size-5" />,
    description: "Trace measurements across parts, batches, and inspections.",
  },
  {
    id: "history-data-explorer",
    label: "Measurement History",
    icon: <IconHistory className="size-5" />,
    description: "Search and explore historical quality data.",
  },
  {
    id: "users-permissions",
    label: "Users & Roles",
    icon: <IconUsers className="size-5" />,
    description: "Manage workspace users and their access permissions.",
  },
  {
    id: "system-settings",
    label: "System Settings",
    icon: <IconSettings className="size-5" />,
    description: "Configure workspace preferences and system options.",
  },
] as const;

type SectionId = (typeof sections)[number]["id"];

function isSectionId(value: string | undefined): value is SectionId {
  return sections.some((section) => section.id === value);
}

function WorkspaceMember() {
  const { open } = useSidebar();

  return (
    <div
      aria-label="Quality Team, Workspace member"
      className="flex min-h-10 items-center gap-3 px-2.5"
      title="Quality Team · Workspace member"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200">
        QT
      </span>
      {open && (
        <div className="min-w-0 whitespace-nowrap">
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-emerald-50">
            Quality Team
          </p>
          <p className="truncate text-[11px] text-slate-500">
            Workspace member
          </p>
        </div>
      )}
    </div>
  );
}

const navigationGroups = [
  { label: "Workspace", ids: ["overview"] },
  { label: "Monitoring", ids: ["live-measurements", "instrument-management"] },
  {
    label: "Quality management",
    ids: [
      "spc-analytics",
      "spc-reports",
      "part-inspection-setup",
      "alerts-quality-events",
    ],
  },
  { label: "Traceability", ids: ["traceability", "history-data-explorer"] },
  { label: "Administration", ids: ["users-permissions", "system-settings"] },
] as const;

function SectionNavigation({
  activeSection,
  onNavigate,
  onSelect,
}: {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  onSelect: () => void;
}) {
  const { open } = useSidebar();

  return (
    <nav aria-label="Quality workspace sections" className="flex flex-col gap-2">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          {open && (
            <p className="px-3 pb-1 pt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {group.label}
            </p>
          )}
          <div className="flex flex-col gap-1">
            {group.ids.map((id) => {
              const section = sections.find((candidate) => candidate.id === id);
              if (!section) return null;

              return (
                <SidebarLink
                  key={section.id}
                  link={{
                    label: section.label,
                    href: `#${section.id}`,
                    icon: section.icon,
                    active: activeSection === section.id,
                    onClick: (event) => {
                      event.preventDefault();
                      onNavigate(section.id);
                      onSelect();
                    },
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moduleSearch, setModuleSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<DemoData>(createDemoData);
  const [isHydrated, setIsHydrated] = useState(false);
  const currentSection =
    sections.find((section) => section.id === activeSection) ?? sections[0];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("gap-it-demo-data");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          parsed !== null &&
          typeof parsed === "object" &&
          "measurements" in parsed &&
          "parts" in parsed &&
          "instruments" in parsed &&
          "gateways" in parsed &&
          "settings" in parsed
        ) {
          setData(parsed as DemoData);
        }
      }
    } catch (error) {
      console.error("Unable to load saved GAP-IT demo data.", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem("gap-it-demo-data", JSON.stringify(data));
    } catch (error) {
      console.error("Unable to save GAP-IT demo data.", error);
    }
  }, [data, isHydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", data.settings.theme === "dark");
    document.documentElement.style.colorScheme = data.settings.theme;
  }, [data.settings.theme]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  useEffect(() => {
    const initialHash = window.location.hash.slice(1);
    const initialSection = isSectionId(initialHash) ? initialHash : "overview";
    const appUrl = `${window.location.pathname}${window.location.search}`;

    window.history.replaceState(
      { gapIt: true, section: "overview" },
      "",
      appUrl,
    );
    window.history.pushState(
      { gapIt: true, rootGuard: true, section: "overview" },
      "",
      appUrl,
    );

    setActiveSection("overview");
    if (initialSection !== "overview") {
      window.history.pushState(
        { gapIt: true, section: initialSection },
        "",
        appUrl,
      );
      setActiveSection(initialSection);
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as
        | { gapIt?: boolean; rootGuard?: boolean; section?: string }
        | null;

      if (state?.gapIt && isSectionId(state.section)) {
        setActiveSection(state.section);
        if (state.section === "overview" && !state.rootGuard) {
          window.history.pushState(
            { gapIt: true, rootGuard: true, section: "overview" },
            "",
            appUrl,
          );
        }
        return;
      }

      setActiveSection("overview");
      window.history.pushState(
        { gapIt: true, rootGuard: true, section: "overview" },
        "",
        appUrl,
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToSection = (sectionId: SectionId) => {
    if (sectionId === activeSection) return;

    window.history.pushState(
      { gapIt: true, section: sectionId },
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    setActiveSection(sectionId);
  };

  const searchResults = sections.filter((section) =>
    `${section.label} ${section.description}`
      .toLowerCase()
      .includes(moduleSearch.trim().toLowerCase()),
  );

  return (
    <MotionConfig reducedMotion="user">
    <div className="app-shell flex h-dvh overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="h-full gap-6" showMobile={false}>
          <a
            aria-label="GAP-IT home"
            className="flex h-10 shrink-0 items-center gap-3 px-2.5"
            href="#overview"
            onClick={(event) => {
              event.preventDefault();
              navigateToSection("overview");
            }}
          >
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-400 text-xs font-bold tracking-tight text-emerald-950 shadow-[0_0_18px_rgba(16,185,129,0.22)]">
              G
            </span>
            <span className="whitespace-nowrap text-sm font-bold tracking-[0.14em] text-slate-900 dark:text-white">
              GAP-IT
            </span>
          </a>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto">
            <SectionNavigation
              activeSection={activeSection}
              onNavigate={navigateToSection}
              onSelect={() => setMobileOpen(false)}
            />
          </div>

          <div className="mt-auto shrink-0 border-t border-slate-200 pt-4 dark:border-emerald-100/10">
            <WorkspaceMember />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-header sticky top-0 z-20 hidden h-[68px] shrink-0 items-center justify-between gap-6 border-b border-slate-200/80 bg-white/90 px-5 dark:border-emerald-100/10 dark:bg-[#101a19]/85 md:flex md:px-8">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500 dark:text-emerald-100/60">
            <IconDatabase aria-hidden="true" className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="whitespace-nowrap">Quality Operations</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-emerald-100/30">/</span>
            <span className="truncate font-semibold text-slate-800 dark:text-emerald-50">
              {currentSection.label}
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <div
              className="relative flex items-center gap-2"
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  window.setTimeout(() => setSearchOpen(false), 150);
                }
              }}
            >
              <button
                aria-label="Search modules"
                aria-expanded={searchOpen}
                aria-controls="workspace-search"
                className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 dark:text-emerald-100/70 dark:hover:bg-emerald-100/[0.06] dark:hover:text-emerald-300"
                onClick={() => setSearchOpen((open) => !open)}
                title="Search modules ( / )"
                type="button"
              >
                <IconSearch aria-hidden="true" className="size-[18px]" />
              </button>
              {searchOpen && (
                <div
                  className="relative w-[min(18rem,35vw)]"
                >
                  <label className="sr-only" htmlFor="workspace-search">Search modules</label>
                  <GooeyInput
                    autoComplete="off"
                    id="workspace-search"
                    onChange={(event) => setModuleSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && searchResults[0]) {
                        navigateToSection(searchResults[0].id);
                        setModuleSearch("");
                        setSearchOpen(false);
                      }
                    }}
                    placeholder="Search..."
                    ref={searchInputRef}
                    role="combobox"
                    aria-expanded={moduleSearch.trim().length > 0}
                    aria-controls="workspace-search-results"
                    value={moduleSearch}
                  />
                  {moduleSearch.trim() && (
                    <div
                      className="emerald-glass absolute right-0 top-full z-50 mt-2 max-h-72 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-emerald-100/10 dark:bg-[#1c2b28]"
                      id="workspace-search-results"
                      role="listbox"
                    >
                      {searchResults.length ? searchResults.map((section) => (
                        <button
                          className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-50/80 dark:hover:bg-emerald-300/10 dark:hover:text-emerald-200"
                          key={section.id}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            navigateToSection(section.id);
                            setModuleSearch("");
                            setSearchOpen(false);
                          }}
                          role="option"
                          type="button"
                        >
                          <span className="text-emerald-600 dark:text-emerald-400">{section.icon}</span>
                          <span>{section.label}</span>
                        </button>
                      )) : (
                        <p className="px-3 py-4 text-center text-xs text-slate-500">No modules found.</p>
                      )}
                    </div>
                  )}
                  </div>
              )}
            </div>
            <span className="hidden whitespace-nowrap rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300 lg:inline-flex">
              DEMO · NO HARDWARE
            </span>
            <button
              aria-label={`${data.events.filter((event) => event.status !== "Resolved").length} open quality events`}
              className="relative grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-emerald-800 dark:text-emerald-100/70 dark:hover:bg-emerald-100/[0.06] dark:hover:text-emerald-200"
              onClick={() => navigateToSection("alerts-quality-events")}
              type="button"
            >
              <IconBell aria-hidden="true" className="size-[18px]" />
              {data.events.filter((event) => event.status !== "Resolved").length > 0 && (
                <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#101a19]" />
              )}
            </button>
            <button
              aria-label={`Switch to ${data.settings.theme === "light" ? "dark" : "light"} theme`}
              className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-emerald-100/70 dark:hover:bg-emerald-100/[0.06]"
              onClick={() =>
                setData((current) => ({
                  ...current,
                  settings: {
                    ...current.settings,
                    theme: current.settings.theme === "light" ? "dark" : "light",
                  },
                }))
              }
              type="button"
            >
              {data.settings.theme === "light" ? (
                <IconMoon aria-hidden="true" className="size-4" />
              ) : (
                <IconSun aria-hidden="true" className="size-4" />
              )}
            </button>
            <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 dark:border-emerald-100/10 lg:flex">
              <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200">QT</span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-slate-800 dark:text-emerald-50">Quality Team</p>
                <p className="mt-0.5 text-[10px] text-slate-500">Workspace member</p>
              </div>
            </div>
          </div>
        </header>

        <main className="app-main hidden min-h-0 w-full flex-1 overflow-y-auto px-4 py-6 md:block md:px-8 md:py-8">
          <WorkspaceModule
            activeSection={activeSection}
            activeForStreaming
            data={data}
            onNavigate={navigateToSection}
            setData={setData}
          />
        </main>

        <section className="app-main flex h-dvh min-h-0 flex-1 flex-col md:hidden">
          <header className="glass-header flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 pt-[env(safe-area-inset-top)] dark:border-emerald-100/10 dark:bg-[#101a19]/85">
            <button
              aria-expanded={mobileOpen}
              aria-label="Open navigation menu"
              className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-emerald-100/70 dark:hover:bg-emerald-100/[0.06]"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <IconMenu2 aria-hidden="true" className="size-5" />
            </button>
            {activeSection !== "overview" ? (
              <button
                aria-label="Back to dashboard"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition active:bg-slate-100"
                onClick={() => window.history.back()}
                type="button"
              >
                <IconChevronLeft aria-hidden="true" className="size-5" />
              </button>
            ) : (
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 text-xs font-bold text-emerald-950 shadow-[0_0_18px_rgba(16,185,129,0.22)]">
                G
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-emerald-50">
                {activeSection === "overview" ? "GAP-IT" : currentSection.label}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-emerald-100/55">
                Quality operations
              </p>
            </div>
            <button
              aria-label={`Switch to ${data.settings.theme === "light" ? "dark" : "light"} theme`}
              className="grid size-10 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-emerald-100/70 dark:hover:bg-emerald-100/[0.06]"
              onClick={() =>
                setData((current) => ({
                  ...current,
                  settings: {
                    ...current.settings,
                    theme: current.settings.theme === "light" ? "dark" : "light",
                  },
                }))
              }
              type="button"
            >
              {data.settings.theme === "light" ? (
                <IconMoon aria-hidden="true" className="size-4" />
              ) : (
                <IconSun aria-hidden="true" className="size-4" />
              )}
            </button>
          </header>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-emerald-950/50 backdrop-blur-sm md:hidden"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                transition={{ duration: 0.15 }}
              >
                <motion.aside
                  animate={{ x: 0 }}
                  aria-label="Mobile navigation"
                  aria-modal="true"
                  className="emerald-glass flex h-full w-[min(20rem,85vw)] flex-col gap-5 overflow-y-auto border-r border-slate-200 bg-white p-5 shadow-2xl dark:border-emerald-100/10 dark:bg-[#101a19]"
                  exit={{ x: "-100%" }}
                  initial={{ x: "-100%" }}
                  onClick={(event) => event.stopPropagation()}
                  role="dialog"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-400 text-xs font-bold text-emerald-950">G</span>
                      <div><p className="text-sm font-bold tracking-[0.12em] text-slate-900 dark:text-emerald-50">GAP-IT</p><p className="text-[10px] text-slate-500 dark:text-emerald-100/55">Quality workspace</p></div>
                    </div>
                    <button aria-label="Close navigation menu" className="grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-emerald-100/60 dark:hover:bg-emerald-100/[0.06]" onClick={() => setMobileOpen(false)} type="button"><IconX aria-hidden="true" className="size-5" /></button>
                  </div>
                  <Sidebar open={mobileOpen} setOpen={setMobileOpen} animate={false}>
                    <SectionNavigation activeSection={activeSection} onNavigate={navigateToSection} onSelect={() => setMobileOpen(false)} />
                  </Sidebar>
                  <div className="mt-auto flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-emerald-100/10">
                    <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200">QT</span>
                    <div><p className="text-xs font-semibold text-slate-800 dark:text-emerald-50">Quality Team</p><p className="text-[10px] text-slate-500 dark:text-emerald-100/55">Workspace member</p></div>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="app-main min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-5">
            <WorkspaceModule
              activeSection={activeSection}
              activeForStreaming={false}
              data={data}
              onNavigate={navigateToSection}
              setData={setData}
            />
          </main>
        </section>
      </div>
    </div>
    </MotionConfig>
  );
}
