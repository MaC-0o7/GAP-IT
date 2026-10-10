"use client";

import { useEffect, useState } from "react";
import {
  IconActivity,
  IconBell,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconCpu,
  IconDatabase,
  IconFileReport,
  IconHistory,
  IconLayoutDashboard,
  IconMoon,
  IconRoute,
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
    label: "Overview Dashboard",
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
    label: "Instrument and Gateway Management",
    icon: <IconCpu className="size-5" />,
    description: "Manage instruments, gateways, and their connection details.",
  },
  {
    id: "spc-analytics",
    label: "SPC Analytics",
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
    label: "Part and Inspection Setup",
    icon: <IconSettingsAutomation className="size-5" />,
    description: "Configure parts, characteristics, and inspection plans.",
  },
  {
    id: "alerts-quality-events",
    label: "Alerts and Quality Events",
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
    label: "History & Data Explorer",
    icon: <IconHistory className="size-5" />,
    description: "Search and explore historical quality data.",
  },
  {
    id: "users-permissions",
    label: "Users and Permissions",
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

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const navigation = (
    <nav aria-label="Quality workspace sections" className="flex flex-col gap-1">
      {sections.map((section) => (
        <SidebarLink
          key={section.id}
          link={{
            label: section.label,
            href: `#${section.id}`,
            icon: section.icon,
            active: activeSection === section.id,
            onClick: (event) => {
              event.preventDefault();
              navigateToSection(section.id);
              setMobileOpen(false);
            },
          }}
        />
      ))}
    </nav>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f6f8fc]">
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
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-700 text-xs font-bold tracking-tight text-white">
              G
            </span>
            <span className="whitespace-nowrap text-sm font-bold tracking-[0.14em] text-slate-900">
              GAP-IT
            </span>
          </a>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto">
            <p className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>
            {navigation}
          </div>

          <div className="mt-auto shrink-0 border-t border-slate-200 pt-4">
            <WorkspaceMember />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 hidden h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:flex md:px-8">
          <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
            <IconDatabase aria-hidden="true" className="size-4" />
            <span>Quality Operations</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {currentSection.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              DEMO · NO HARDWARE
            </span>
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
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              GAP-IT
            </span>
          </div>
        </header>

        <main className="hidden min-h-0 w-full flex-1 overflow-y-auto bg-slate-50 px-4 py-6 dark:bg-slate-950 md:block md:px-8 md:py-8">
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
