# Step 4 — Main-scene interaction verification checklist

Use live preview: `http://127.0.0.1:4178/` (or `:5178` with `bun run dev`).  
This list is for **manual / computerUse** verification. No full editable editor in this step.

## Must pass

1. **Intro / door open**
   - [ ] Loading shows `LINA CHEN — PORTFOLIO '26`
   - [ ] Mosaic/reveal plays
   - [ ] Camera settles; locker doors open to hub pose
   - [ ] Pastel blue locker + props visible (badge, turntable, orange crate, typewriter)

2. **Top nav ↔ prop same overlays**
   - [ ] ABOUT nav opens About ID-card overlay (same as clicking door badge)
   - [ ] SKILLS nav ↔ record player / skills hotspot → Skills deck
   - [ ] SELECTED WORK nav ↔ orange crate → Work folders
   - [ ] CONTACT nav ↔ typewriter → Contact corkboard
   - [ ] Note (by design in `store.ts`): **nav** opens overlay without local camera focus; **hotspot/prop** pulses + flies camera then mounts overlay (`source: 'nav' | 'hotspot'`). Overlay *content* should match; camera path may differ.

3. **Door stickers draggable**
   - [ ] Stickers on door faces can be dragged within footprint (`SurfaceDraggable` / `DecalField`)
   - [ ] Drag does not accidentally fire overlay every time (tap vs drag threshold)
   - [ ] ID badge can move on its surface; hook stays put (per `PhysicalProps` comments)

4. **Close overlay → hub**
   - [ ] Overlay close / Escape returns to locker hub
   - [ ] Camera returns / focus clears so props are clickable again
   - [ ] Opening a second section from nav while one is open switches cleanly

5. **Branding smoke**
   - [ ] Door badge texture reads **LINA CHEN** (not KEESU)
   - [ ] Typewriter paper reads **HELLO@LINA.DEMO** (not keesu.design)
   - [ ] Corner credit still shows momo recreation credit

## Code-review notes (no browser run here)

| Area | Observation | Risk |
| --- | --- | --- |
| Nav vs hotspot | Nav calls `openOverlay(id)` default `source='nav'` — skips focus fly. Hotspots call `activateHotspot` → `openOverlay(id, 'hotspot')`. | Expected UX difference; confirm with user if they want nav to also fly-to-prop. |
| Compact nav ≤640px | Menu collapses to MENU toggle (`Nav.tsx`). | Easy to miss CONTACT on phone if toggle not tested. |
| Fallback | `StaticFallback` if no WebGL / Save-Data. | 3D hub skipped; still should open text overlays via fallback UI. |
| Work subviews | DESIGN / VIDEO / PHOTO / WEBSITE exist but polish is out of Step 4 scope. | Broken deep links / empty hrefs on WEBSITES (`href: '#'`) are known placeholders. |
| Contact notes | Corkboard notes are local-only demo (no server). | Fine for Step 4; not a send-mail feature. |
| Asset cache | After badge rebuild, hard-refresh if browser cached old `idcard2.webp`. | Stale KEESU glyph if CDN/browser cache. |

## Out of scope for Step 4

- Tip-2 style text/image editor
- Locker **color panel** (body / accent / prop colors) — deferred; noted in `PREVIEW.md`
- DAYS section
- Skill packaging
