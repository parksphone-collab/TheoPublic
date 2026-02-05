# THEO DASHBOARD v2.0 — VISUAL GUIDE

## 🎨 What It Looks Like

Since you can't see a screenshot yet, here's a detailed description of the visual design:

## Header Bar (Fixed at Top)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⏰ 14:32:07 UTC │ 🟢 ONLINE │ MODELS: Kimi 🟢 Grok 🟢 GPT 🟡                │
│ Gmail 🟢 │ Discord 🟢 │ Calendar 🟢 │ SSH 🟢                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Background:** Dark military terminal (#151520)
- **Border:** 2px solid military green (#00ff41) with subtle glow
- **Text:** Military green with VT323 monospace font
- **LEDs:** Pulsing colored dots (green = online, yellow = warning, red = alert)

## Dashboard Grid Layout (Desktop View)

```
┌──────────────────────┬──────────────────────┬──────────────┬──────────────┐
│                      │                      │              │              │
│   ACTIVITY FEED      │   CALENDAR           │   TO-DO      │   GOALS      │
│   (Wide: 2 cols)     │   (Wide: 2 cols)     │   (Square)   │   (Square)   │
│                      │                      │              │              │
├──────────────────────┴──────────────────────┼──────────────┼──────────────┤
│                                             │              │              │
│   CHAT WITH THEO                            │  WEATHER     │  RESOURCES   │
│   (Wide: 2 cols)                            │  (Square)    │  (Tall: 2    │
│                                             │              │   rows)      │
├──────────────────────┬──────────────────────┼──────────────┤              │
│                      │                      │              │              │
│   PERFORMANCE        │   ROADMAP            │ NOTIFICATIONS│──────────────┤
│   (Wide: 2 cols)     │   (Wide: 2 cols)     │  (Square)    │              │
│                      │                      │              │              │
├──────────────────────┴──────────────────────┼──────────────┼──────────────┤
│                                             │              │              │
│   (More widgets as you scroll...)          │              │              │
│                                             │              │              │
└─────────────────────────────────────────────┴──────────────┴──────────────┘
```

## Color Palette in Action

### Primary Colors
- **Background:** Deep black (#0a0a0f) — like a CRT monitor in a dark room
- **Card BG:** Slightly lighter (#151520) — subtle depth
- **Borders:** Military green (#00ff41) — sharp 2px borders, no rounding
- **Text:** Silver-gray (#c0c0c0) — easy to read
- **Dim Text:** Dark gray (#707070) — timestamps, labels

### Accent Colors
- **Success/Active:** Military green (#00ff41) — progress bars, buttons, headers
- **Warning:** Amber (#ffaa00) — warnings, medium priority
- **Alert/Critical:** Red (#ff3333) — errors, high priority
- **Info:** Blue (#00ccff) — informational, calendar events

## Card Anatomy

Each card has this structure:

```
┌─────────────────────────────────────────┐ ← 2px military green border
│ ┌─────────────────────────────────────┐ │
│ │ CARD TITLE              [Badge] 🟢  │ │ ← Header (semi-transparent green bg)
│ └─────────────────────────────────────┘ │
│                                         │
│   • Content item 1                      │
│   • Content item 2                      │ ← Body (scrollable if tall)
│   • Content item 3                      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Button]  [Input field...]          │ │ ← Footer (actions)
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**On hover:** Card glows brighter, lifts up 2px

## Typography

### Display Font (Headers, Metrics, Clock)
**VT323** — Google Fonts monospace
- Headers: 20px, letter-spacing: 2px
- Large metrics: 42-48px
- Clock: 20px, bold

### Body Font (Content, Labels)
**Source Code Pro** — Google Fonts monospace
- Body: 14px, line-height: 1.6
- Small text: 11-12px
- Inputs: 14px

## Special Effects

### 1. CRT Scanline Animation
Subtle horizontal lines moving slowly down the screen, giving that authentic 90s CRT monitor feel. Almost invisible but adds atmosphere.

### 2. LED Pulse Animation
Status indicator dots gently pulse opacity between 100% → 50% → 100% over 2 seconds. Creates a "breathing" effect like real LEDs.

### 3. Glow Effects
- **Cards on hover:** Box-shadow increases, glow intensifies
- **Buttons on hover:** Colored glow around edges
- **Progress bars:** Subtle glow matching their color
- **Headers:** Text-shadow glow on titles

### 4. Button Press
Buttons depress 2px when clicked (transform: translateY(2px)) with reduced glow — tactile feedback.

## Widget-Specific Visuals

### Activity Feed
- Left border (2px) changes color: green (normal), amber (warning)
- Icons at left (emoji or symbols)
- Timestamps at right in dim gray
- Filter buttons at top: All / System / Cron / Errors

### Calendar Events
- Blue left border (info color)
- Time in large VT323 font
- Badge on right (Today / Tomorrow)
- "Synced: X min ago" in header

### To-Do List
- Checkboxes (2px border, square, no rounding)
- Strike-through on completed items (50% opacity)
- Priority badges: HIGH (red), MED (amber), LOW (blue)

### Goals Progress Bars
- Outer container: 2px military green border
- Inner fill: animated width transition
- Percentage at right in VT323 font
- "X days remaining" below in small text

### Weather
- Large temperature (48px VT323) in center
- Huge emoji icon (64px)
- 3-day forecast: day name, icon, temp in row

### Resource Monitor
- Progress bars for Disk, Memory, CPU
- Color changes: green (<70%), amber (70-90%), red (>90%)
- Uptime and load average in bordered boxes

### Notifications (Priority Card)
- **Red border** instead of green (high priority)
- Red glow on hover
- Dismiss buttons (×) at right
- Badge count in header

### Token Metrics
- Large centered cost: "$0.42" (42px VT323)
- Canvas sparkline chart (response times)
- Provider usage bars below

### Chat Interface
- User messages: blue left border, blue-tinted background
- Theo messages: green left border, green-tinted background
- Quick command buttons: /status /weather /backup (amber)
- Typing indicator (animated dots)

### Performance Chart
- Canvas bar chart (30 bars for 30 days)
- Bars with gradient fill (green at top → darker at bottom)
- Subtle grid lines every 25%
- Stats boxes below: "Avg 47 tasks/day", "Peak: Tuesday"

## Responsive Behavior

### Desktop (>1200px)
- Grid: 4 columns
- Wide cards span 2 cols
- Tall cards span 2 rows

### Tablet (768px - 1200px)
- Grid: 2-3 columns
- Wide cards become single cards
- Optimal for iPad

### Mobile (<768px)
- Grid: 1 column (all cards full width)
- Header stacks vertically
- Scrollable content shorter
- Touch-friendly buttons (larger)

## Animations & Transitions

- **Card hover:** 0.3s ease transition
- **Button interactions:** 0.2s ease
- **Progress bar fill:** 0.5s ease (when values change)
- **Scanlines:** 8s linear infinite loop
- **LED pulse:** 2s ease-in-out infinite

## Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation (tab order)
- High contrast text (passes WCAG AA)
- No flashing content (seizure-safe)

## Visual Inspiration

Think:
- **Command & Conquer** (1995) — Green terminal UI
- **XCOM** — Military base interface
- **Fallout** — Pip-Boy terminal aesthetic
- **Pizza.watch** — Modern pixel-art dashboard (primary inspiration)

Mix of:
- 1990s DOS/terminal interfaces
- Military command center displays
- Pixel art retro gaming UI
- Modern dashboard functionality

The result: **Nostalgic but functional. Retro but readable. Military but approachable.**

## Console Easter Egg

Open browser DevTools console to see:

```
╔═══════════════════════════════════════════╗
║   THEO DASHBOARD v2.0 — MISSION CONTROL   ║
║                                           ║
║   Status: OPERATIONAL                     ║
║   Security: ENCRYPTED                     ║
║   Build: 2026.02.05                       ║
║                                           ║
║   "Excellence is not an act, but a habit" ║
╚═══════════════════════════════════════════╝
```

---

## 📸 Taking Screenshots

To capture the dashboard:

1. Start server: `npm start`
2. Open: http://localhost:3000
3. Wait 2 seconds for animations to settle
4. Screenshot tools:
   - **macOS:** Cmd+Shift+4
   - **Windows:** Win+Shift+S
   - **Linux:** Screenshot app
   - **Browser:** DevTools device emulator for mobile views

Recommended shots:
- Full desktop view (1920x1080)
- Individual widget close-ups
- Mobile view (375x812 iPhone)
- Header bar with pulsing LEDs
- Animation of progress bars filling

---

<div align="center">

**The dashboard feels ALIVE — like a real 1998 mission control center, but with 2026 capabilities.**

</div>
