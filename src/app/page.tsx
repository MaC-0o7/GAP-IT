"use client";

import { useState } from "react";
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
  IconRoute,
  IconSettings,
  IconSettingsAutomation,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
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
    label: "Instrument & Gateway Management",
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
    label: "Part & Inspection Setup",
    icon: <IconSettingsAutomation className="size-5" />,
    description: "Configure parts, characteristics, and inspection plans.",
  },
  {
    id: "alerts-quality-events",
    label: "Alerts & Quality Events",
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
    label: "Users & Permissions",
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

export default function Home() {
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]["id"]>(
    "overview",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentSection =
    sections.find((section) => section.id === activeSection) ?? sections[0];

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
            onClick: () => {
              setActiveSection(section.id);
              setMobileOpen(false);
            },
          }}
        />
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <Sidebar open={mobileOpen} setOpen={setMobileOpen}>
        <SidebarBody className="gap-6" showMobile={false}>
          <a
            aria-label="GAP-IT home"
            className="flex h-10 shrink-0 items-center gap-3 px-2.5"
            href="#overview"
            onClick={() => setActiveSection("overview")}
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

          <div className="mt-auto border-t border-slate-200 pt-4">
            <div className="flex min-h-10 items-center gap-3 px-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                QT
              </span>
              <div className="min-w-0 whitespace-nowrap">
                <p className="truncate text-xs font-semibold text-slate-800">
                  Quality Team
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  Workspace member
                </p>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 hidden h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:flex md:px-8">
          <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
            <IconDatabase aria-hidden="true" className="size-4" />
            <span>Quality Operations</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-slate-800">
              {currentSection.label}
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
            GAP-IT
          </span>
        </header>

        <main className="hidden w-full flex-1 px-5 py-8 md:block md:px-8 md:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                Quality workspace
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {currentSection.label}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {currentSection.description}
              </p>
            </div>

            <section
              aria-labelledby="section-placeholder-title"
              className={cn(
                "flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm",
              )}
            >
              <span className="mb-4 grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-700">
                {currentSection.icon}
              </span>
              <h2
                className="text-base font-semibold text-slate-900"
                id="section-placeholder-title"
              >
                Section ready for your requirements
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                The {currentSection.label.toLowerCase()} page is set up in the
                navigation. Share what you want this section to do, and its
                components can be added here.
              </p>
            </section>
          </div>
        </main>

        <section className="flex h-dvh min-h-0 flex-1 flex-col bg-slate-50 md:hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 pt-[env(safe-area-inset-top)]">
            {activeSection !== "overview" ? (
              <button
                aria-label="Back to dashboard"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition active:bg-slate-100"
                onClick={() => setActiveSection("overview")}
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
          </header>

          {activeSection === "overview" ? (
            <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                  Quality workspace
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a workspace to get started.
                </p>
              </div>
              <nav
                aria-label="Dashboard sections"
                className="grid grid-cols-2 gap-3"
              >
                {sections.slice(1).map((section) => (
                  <button
                    key={section.id}
                    className="flex min-h-36 flex-col items-start rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition active:scale-[0.98] active:bg-blue-50"
                    onClick={() => setActiveSection(section.id)}
                    type="button"
                  >
                    <span className="mb-3 grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                      {section.icon}
                    </span>
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-semibold leading-5 text-slate-900">
                        {section.label}
                      </span>
                      <IconChevronRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-slate-400"
                      />
                    </span>
                    <span className="mt-1 line-clamp-2 text-xs leading-4 text-slate-500">
                      {section.description}
                    </span>
                  </button>
                ))}
              </nav>
            </main>
          ) : (
            <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="border-b border-slate-200 bg-white px-5 py-6">
                <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  {currentSection.icon}
                </span>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {currentSection.label}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {currentSection.description}
                </p>
              </div>
              <section
                aria-labelledby="mobile-section-placeholder-title"
                className="flex min-h-72 flex-1 flex-col items-center justify-center px-6 py-10 text-center"
              >
                <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
                  {currentSection.icon}
                </span>
                <h2
                  className="text-base font-semibold text-slate-900"
                  id="mobile-section-placeholder-title"
                >
                  Section ready for your requirements
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  The {currentSection.label.toLowerCase()} page is set up in
                  the navigation. Its components can be added here.
                </p>
              </section>
            </main>
          )}
        </section>
      </div>
    </div>
  );
}
