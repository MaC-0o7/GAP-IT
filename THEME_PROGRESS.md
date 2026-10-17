## Checklist

- [x] 1. Design tokens: Tailwind config + global CSS (colours, gradients, shadows, background layers, pattern)
- [ ] 2. Shared primitives: Card, Button, Input/Search, Dropdown, Switch, Segmented control, Tabs
- [ ] 3. App shell: frosted sidebar + top nav + active tab states + responsive behaviour
- [ ] 4. Overview
- [ ] 5. Live Measurements
- [ ] 6. Instruments & Gateways
- [ ] 7. SPC Analysis (spec limits and control limits visually distinct)
- [ ] 8. SPC Reports
- [ ] 9. Parts & Inspection
- [ ] 10. Quality Events
- [ ] 11. Traceability
- [ ] 12. Measurement History
- [ ] 13. User Accounts
- [ ] 14. System Settings
- [ ] 15. Final pass: contrast check, responsive check, full build + tsc, final report

## Step record

- Step completed: 1
- Files modified: `src/app/globals.css`, `THEME_PROGRESS.md`
- Check: `tsc --noEmit` passed
- Next: Step 2 — shared primitives.

## Repo notes

- Layout: `src/app/layout.tsx`
- Nav: `src/components/ui/sidebar.tsx`
- Shared components: `src/components/ui/gooey-input.tsx`, `src/components/ui/stateful-button.tsx`, `src/components/workspace-module.tsx`
- Tailwind config: `src/app/globals.css` (Tailwind v4 CSS-first; no `tailwind.config.*`)
- Global CSS: `src/app/globals.css`