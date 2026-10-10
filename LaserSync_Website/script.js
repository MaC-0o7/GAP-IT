const sections = [
  {
    id: "overview-dashboard",
    title: "Overview Dashboard",
    description: "A high-level view of your quality operations.",
  },
  {
    id: "live-measurements",
    title: "Live Measurements",
    description: "Monitor incoming measurements from connected instruments.",
  },
  {
    id: "instrument-gateway-management",
    title: "Instrument & Gateway Management",
    description: "Manage instruments, gateways, and their connection details.",
  },
  {
    id: "spc-analytics",
    title: "SPC Analytics",
    description: "Explore statistical process control charts and analysis.",
  },
  {
    id: "spc-reports",
    title: "SPC Reports",
    description: "Review and prepare statistical process control reports.",
  },
  {
    id: "part-inspection-setup",
    title: "Part & Inspection Setup",
    description: "Configure parts, characteristics, and inspection plans.",
  },
  {
    id: "alerts-quality-events",
    title: "Alerts & Quality Events",
    description: "Review quality alerts and manage follow-up events.",
  },
  {
    id: "traceability",
    title: "Traceability",
    description: "Trace measurements across parts, batches, and inspections.",
  },
  {
    id: "history-data-explorer",
    title: "History & Data Explorer",
    description: "Search and explore historical quality data.",
  },
  {
    id: "users-permissions",
    title: "Users & Permissions",
    description: "Manage workspace users and their access permissions.",
  },
  {
    id: "system-settings",
    title: "System Settings",
    description: "Configure workspace preferences and system options.",
  },
];

const sidebar = document.querySelector("#workspaceSidebar");
const sidebarToggle = document.querySelector("#sidebarToggle");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
const sectionLinks = [...document.querySelectorAll(".workspace-link")];
const sectionTitle = document.querySelector("#sectionTitle");
const sectionDescription = document.querySelector("#sectionDescription");
const breadcrumbTitle = document.querySelector("#breadcrumbTitle");
const sectionNumber = document.querySelector("#sectionNumber");

function closeMobileSidebar() {
  sidebar.classList.remove("sidebar-open");
  sidebarBackdrop.classList.remove("backdrop-visible");
  sidebarToggle.setAttribute("aria-expanded", "false");
  sidebarToggle.setAttribute("aria-label", "Open navigation");
}

function showSection(sectionId) {
  const section = sections.find((item) => item.id === sectionId) ?? sections[5];
  const index = sections.indexOf(section);

  sectionTitle.textContent = section.title;
  sectionDescription.textContent = section.description;
  breadcrumbTitle.textContent = section.title;
  sectionNumber.textContent = String(index + 1).padStart(2, "0");

  sectionLinks.forEach((link) => {
    const active = link.dataset.section === section.id;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  document.querySelector("#placeholderTitle").textContent = section.title;
  document.querySelector(".placeholder-kicker").innerHTML =
    `<span></span>SECTION ${String(index + 1).padStart(2, "0")} / 11`;
  closeMobileSidebar();
}

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => showSection(link.dataset.section));
});

window.addEventListener("hashchange", () => {
  showSection(window.location.hash.slice(1));
});

sidebarToggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("sidebar-open");
  sidebarBackdrop.classList.toggle("backdrop-visible", open);
  sidebarToggle.setAttribute("aria-expanded", String(open));
  sidebarToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});

sidebarBackdrop.addEventListener("click", closeMobileSidebar);

const requestedSection = window.location.hash.slice(1);
showSection(sections.some((section) => section.id === requestedSection)
  ? requestedSection
  : "part-inspection-setup");

const desktopSidebar = window.matchMedia("(min-width: 701px)");

function setDesktopSidebarExpanded(expanded) {
  sidebar.classList.toggle("sidebar-expanded", desktopSidebar.matches && expanded);
}

setDesktopSidebarExpanded(false);

sidebar.addEventListener("pointerenter", () => {
  if (desktopSidebar.matches) setDesktopSidebarExpanded(true);
});

sidebar.addEventListener("pointerleave", () => {
  if (desktopSidebar.matches && !sidebar.contains(document.activeElement)) {
    setDesktopSidebarExpanded(false);
  }
});

sidebar.addEventListener("focusin", () => {
  if (desktopSidebar.matches) setDesktopSidebarExpanded(true);
});

sidebar.addEventListener("focusout", (event) => {
  if (desktopSidebar.matches && !sidebar.contains(event.relatedTarget)) {
    setDesktopSidebarExpanded(false);
  }
});

desktopSidebar.addEventListener("change", () => {
  setDesktopSidebarExpanded(false);
});
