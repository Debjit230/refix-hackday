# RE:FIX — HACKDAY 1.0

AI-style e-waste repair, reuse and recycling decision platform.

## Run locally

This is a zero-build static prototype. Open `index.html` directly, or use VS Code Live Server.

Recommended:

1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

## Deploy

### Vercel
- Create a GitHub repository and push these files.
- Import the repository into Vercel.
- Framework preset: **Other** / static site.
- Build command: none.
- Output directory: `.`

### GitHub Pages
Push the files to a repository, then enable Pages from Settings → Pages → Deploy from branch → `main` / root.

## What is included

- Responsive modern landing page
- Device diagnosis decision engine
- Repairability score
- Recommended action: repair / reuse / recycle
- E-waste impact calculator
- Recycling center prototype cards
- Map-style demo visualization
- Impact dashboard
- Mobile responsive layout
- Smooth reveal animations
- LocalStorage demo persistence
- No backend required for the hackathon MVP

## Important demo note

The diagnosis is a prototype decision engine, not a medical/safety/engineering diagnostic service. Recycling locations shown are demo profiles and should be replaced with verified local data before public deployment.

## Next upgrade

Connect the diagnosis form to an LLM API or a curated troubleshooting database, add Supabase for users/diagnosis history, and connect a verified recycling-center/map API.
