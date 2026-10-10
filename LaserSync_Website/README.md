# GAP-IT Quality Operations Workspace

A responsive workspace layout for the GAP-IT quality operations app.

## Workspace sections

1. Overview Dashboard
2. Live Measurements
3. Instrument & Gateway Management
4. SPC Analytics
5. SPC Reports
6. Part & Inspection Setup
7. Alerts & Quality Events
8. Traceability
9. History & Data Explorer
10. Users & Permissions
11. System Settings

The workspace opens on **Part & Inspection Setup**. Each section currently
provides the shared page structure and a placeholder for requirements. Selecting
a section in the sidebar updates the page title, description, and active
navigation item. On desktop, the sidebar expands on hover or keyboard focus and
collapses to an icon rail when inactive. On mobile, open it with the menu button.

## Run locally

Open `index.html` with VS Code Live Server, or run a local static-file server
from this folder and visit its displayed local URL.

## Files

- `index.html` — workspace layout and navigation
- `styles.css` — shared GAP-IT visual styles
- `workspace.css` — workspace sidebar, header, responsive layout, and placeholder
- `script.js` — section navigation and mobile sidebar interactions
