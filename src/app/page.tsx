"use client";

import { useEffect, useState } from "react";
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
  IconMoon,
  IconRoute,
  IconSearch,
  IconSettings,
  IconSettingsAutomation,
  IconSun,
  IconUsers,
} from "@tabler/icons-react";
import { createDemoData, type DemoData } from "@/lib/demo-data";
import { WorkspaceModule } from "@/components/workspace-module";
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
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
        QT
      </span>
      {open && (
        <div className="min-w-0 whitespace-nowrap">
          <p className="truncate text-xs font-semibold text-slate-800">
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
  const [moduleSearch, setModuleSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
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
    <div className="flex h-dvh overflow-hidden bg-[#f5f7fa] dark:bg-slate-950">
      <Sidebar open={mobileOpen} setOpen={setMobileOpen}>
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
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-700 text-xs font-bold tracking-tight text-white">
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

          <div className="mt-auto shrink-0 border-t border-slate-200 pt-4">
            <WorkspaceMember />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-header sticky top-0 z-20 hidden h-[68px] shrink-0 items-center justify-between gap-6 border-b border-slate-200/80 bg-white/90 px-5 dark:border-slate-800 dark:bg-slate-950/90 md:flex md:px-8">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <IconDatabase aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
            <span className="whitespace-nowrap">Quality Operations</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
              {currentSection.label}
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="relative w-full max-w-[360px]">
              <label className="sr-only" htmlFor="workspace-search">Search modules</label>
              <IconSearch aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                autoComplete="off"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900"
                id="workspace-search"
                onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
                onChange={(event) => setModuleSearch(event.target.value)}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && searchResults[0]) {
                    navigateToSection(searchResults[0].id);
                    setModuleSearch("");
                    setSearchOpen(false);
                  }
                  if (event.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search modules…"
                role="combobox"
                aria-expanded={searchOpen && moduleSearch.trim().length > 0}
                aria-controls="workspace-search-results"
                value={moduleSearch}
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                /
              </kbd>
              {searchOpen && moduleSearch.trim() && (
                <div
                  className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
                  id="workspace-search-results"
                  role="listbox"
                >
                  {searchResults.length ? searchResults.map((section) => (
                    <button
                      className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                      key={section.id}
                      onClick={() => {
                        navigateToSection(section.id);
                        setModuleSearch("");
                        setSearchOpen(false);
                      }}
                      role="option"
                      type="button"
                    >
                      <span className="text-blue-600">{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  )) : (
                    <p className="px-3 py-4 text-center text-xs text-slate-500">No modules found.</p>
                  )}
                </div>
              )}
            </div>
            <span className="hidden whitespace-nowrap rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300 lg:inline-flex">
              DEMO · NO HARDWARE
            </span>
            <button
              aria-label={`${data.events.filter((event) => event.status !== "Resolved").length} open quality events`}
              className="relative grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => navigateToSection("alerts-quality-events")}
              type="button"
            >
              <IconBell aria-hidden="true" className="size-[18px]" />
              {data.events.filter((event) => event.status !== "Resolved").length > 0 && (
                <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
              )}
            </button>
            <button
              aria-label={`Switch to ${data.settings.theme === "light" ? "dark" : "light"} theme`}
              className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
            <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700 lg:flex">
              <span className="grid size-8 place-items-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">QT</span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Quality Team</p>
                <p className="mt-0.5 text-[10px] text-slate-500">Workspace member</p>
              </div>
            </div>
          </div>
        </header>

        <main className="hidden min-h-0 w-full flex-1 overflow-y-auto bg-[#f5f7fa] px-4 py-6 dark:bg-slate-950 md:block md:px-8 md:py-8">
          <WorkspaceModule
            activeSection={activeSection}
            activeForStreaming
            data={data}
            onNavigate={navigateToSection}
            setData={setData}
          />
        </main>

        <section className="flex h-dvh min-h-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950 md:hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 pt-[env(safe-area-inset-top)] dark:border-slate-800 dark:bg-slate-950">
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
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-700 text-xs font-bold text-white">
                G
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {activeSection === "overview" ? "GAP-IT" : currentSection.label}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                Quality operations
              </p>
            </div>
            <button
              aria-label={`Switch to ${data.settings.theme === "light" ? "dark" : "light"} theme`}
              className="grid size-10 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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

          <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-5">
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
  );
}
