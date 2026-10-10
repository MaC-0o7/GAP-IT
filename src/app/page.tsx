"use client";

import { useState } from "react";
import {
  IconActivity,
  IconBell,
  IconChartBar,
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
        <SidebarBody className="gap-6">
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
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
          <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
            <IconDatabase aria-hidden="true" className="size-4" />
            <span>Quality Operations</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-slate-800">
              {currentSection.label}
            </span>
          </div>
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-800 md:hidden">
            QUALITY OPERATIONS
          </p>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
            GAP-IT
          </span>
        </header>

        <main className="w-full flex-1 px-5 py-8 md:px-8 md:py-10">
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
      </div>
    </div>
  );
}
