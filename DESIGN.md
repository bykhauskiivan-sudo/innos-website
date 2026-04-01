# Design System: Stanki-Innos (Redesign Strategy & Audience Analysis)
**Project ID:** 12518878331370698954
**Screen Title:** Карточка товара 1 (INNOS H-130)

## 1. Visual Theme & Atmosphere
The aesthetic is "The Machining Monolith"—a fusion of heavy industry and high-tech precision. It adopts a high-end editorial, luxury industrial vibe. The mood is deep, dark, and authoritative, breaking the rigid grid with "Authoritative Asymmetry" and "Tonal Depth". It feels like a premium digital cockpit, utilizing dark charcoals layered with electric blue optical glows to represent plasma and the clean efficiency of machined steel.

## 2. Color Palette & Roles
*   **Primary Canvas** (#131313) - Deep charcoal black used as the main background layer (`surface`, `background`).
*   **Secondary Surface Insets** (#1C1B1B) - Slightly lighter charcoal (`surface_container_low`) used to nest sections and create tonal hierarchy without solid borders.
*   **High-Priority Insets** (#2A2A2A) - Even lighter surface (`surface_container_high`) used for hover states and elevated blocks.
*   **Electric Blue Glow** (#007FFF / #ABC7FF) - Vibrant, high-visibility blue used for primary actions, active state glows, gradients, and prominent branding icons (`primary_container`, `primary`).
*   **Industrial Accent** (#FFB77D) - Muted orange-amber tone (`tertiary`) used for secondary active states or warnings to provide a technical accent against the blues.
*   **Primary Body Text** (#E5E2E1) - High-contrast off-white (`on_surface`) used for maximal readability against the dark industrial backgrounds.
*   **Muted Interface Text** (#C1C6D7 / #414754) - Subdued steel-grey (`on_surface_variant`, `outline_variant`) used for secondary text, metadata, and faint ghost borders to minimize eye strain.
*   **Frosted Glass Tint** (rgba(32, 31, 31, 0.6) / rgba(53, 53, 52, 0.4)) - Dark translucent tint applied with blur filters for modern glassmorphic elements.

## 3. Typography Rules
*   **Headings (Space Grotesk):** Chosen for its "engineered" and solid industrial feel. Used for high-impact messaging, hero statements, and product components. Usually styled with tight letter-spacing (`tracking-tighter`, -0.02em).
*   **Body & Labels (Inter):** A neutral, clean, and highly readable font. The workhorse font used for body copy and data-heavy readouts like technical specifications.
*   **Scale Usage:** Display sizes are massive and aggressive (up to 7xl) for heroes. Labels and table headers often utilize small sizes (`text-xs`) but with uppercase styling and wide tracking (`tracking-widest`) for a technical, blueprint-like appearance.

## 4. Component Stylings
*   **Buttons & Actuators:**
    *   **Primary:** Solid Electric Blue (`bg-[#007FFF]`) with white text. Features a custom "optical glow" on hover (`box-shadow: 0 0 15px rgba(0, 127, 255, 0.4)`). Usually mildly rounded (`rounded-lg`).
    *   **Ghost/Secondary:** Relies on a 15% opacity ghost border (`border-white/10` or `outline_variant`) with a dark translucent background. The border is felt, not explicitly drawn.
*   **Cards/Containers (Glassmorphism):**
    *   Rather than flat opaque backgrounds, cards leverage Glassmorphism (`.glass-card`, `.table-glass`). They use a darkly tinted background (e.g., `bg-white/5` or `rgba(32, 31, 31, 0.6)`) heavily paired with `backdrop-blur(12px)` to `blur(20px)`.
    *   **Corners:** Employs generous radiuses like `rounded-2xl` or `rounded-xl` (12px - 16px), giving the suggestion of a finished, beveled metal edge.
*   **Depth & Elevation:**
    *   Ambient localized drop shadows (`shadow-[0_20px_40px_rgba(0,0,0,0.4)]`) lift interactive components and navbars physically above the canvas.
*   **Images & Media Presentation:**
    *   Industrial imagery starts desaturated (`grayscale`, `opacity-60`) and transitions to full color on hover (`group-hover:grayscale-0`) over a slow duration (700ms-1000ms), often paired with a slow zoom (`scale-105` to `scale-100`) to evoke cinematic reveals.

## 5. Layout Principles
*   **Tonal Nesting over Lines (No-Line Rule):** Sections and blocks are demarcated by shifting the background tone from `surface` to `surface-container-low` rather than relying on explicit 1px dividing lines. Lines, when necessary, are incredibly faint (`border-white/5`).
*   **Whitespace & Clean Room Presentation:** Generous padding and margins (`py-24`, `gap-12`) ensure the UI feels uncluttered, representing high-end machinery in a sterile "clean room".
*   **Integrated Overlapping:** Elements overlap intentionally. The top navigation bar, featuring a frosted blur (`backdrop-blur-xl`), floats seamlessly over background imagery. High-quality isolated PNG machines cast massive drop-shadows onto abstract blurred glowing orbs (`blur-[120px]`), creating intense focal depth.
