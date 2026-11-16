# Branding fix — scene labels (post Step 3)

Old remake placeholders still lived in **generated / canvas** scene labels, not only in `content.ts`.

## Where labels lived

| Visible label | Location | Fix |
| --- | --- | --- |
| Door ID badge `KEESU` / `DESIGNER` / `2026` | Baked into `public/assets/obj/idcard2.webp` via `scripts/assets/build-badge.mjs` (`ROWS`) | Regenerated with `LINA CHEN` / `Digital Media` / `'26`; then `bun run assets:bleed` |
| Typewriter paper `HELLO@KEESU.DESIGN` | Runtime `CanvasTexture` in `src/scene/PhysicalProps.tsx` (`usePaperTexture`, contact branch `fillText`) | Replaced with `HELLO@LINA.DEMO` (matches `ABOUT.email` → `hello@lina.demo`) |

## Already correct before this pass

- `src/data/content.ts` — SITE / ABOUT / skills / email
- `index.html` title, About overlay DOM copy
- Top nav has no DAYS
- Corner Credit still credits **momo** (design) + upstream GitHub (code)

## Re-run if you change persona again

```bash
# edit ROWS in scripts/assets/build-badge.mjs (or wire to content.ts later)
bun run scripts/assets/build-badge.mjs
bun run assets:bleed
# typewriter line is source-only — edit PhysicalProps.tsx then rebuild
bun run build
```

## Verification

```bash
rg -i 'keesu|AVA LI' --glob '!node_modules/**' --glob '!.git/**' --glob '!bun.lock'
# expect: no matches in src / scripts / public text sources
```

Note: binary `.webp` cannot be grepped for old glyphs; regenerating `idcard2.webp` from the script is the source of truth.
