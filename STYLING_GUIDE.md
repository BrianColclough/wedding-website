# Wedding Website Design System & Styling Guide

This guide defines the "fun, cutting-edge" design language established in the `need-to-know` page. All new pages and components should adhere to these principles to maintain a cohesive, immersive experience.

## 1. Core Philosophy: "Dark Glassmorphism & Cosmic Romance"

The aesthetic is built on a deep, dark background illuminated by soft, colorful ambient light. It combines modern "Bento Grid" layouts with frosted glass textures (Glassmorphism) to create depth and sophistication.

*   **Background**: Deep Black (`bg-black`) with ambient "orbs" of color.
*   **Surface**: Frosted glass cards (`bg-white/5`, `backdrop-blur-md`).
*   **Accent**: Periwinkle (primary) and Indigo (secondary).
*   **Vibe**: Elegant, mysterious, modern, yet playful and romantic.

---

## 2. Color Palette

Use these specific Tailwind classes to maintain consistency.

### Backgrounds
*   **Base**: `bg-black` (The canvas for everything)
*   **Glass Card**: `bg-white/5` (5% opacity white)
*   **Glass Card Hover**: `hover:bg-white/10`
*   **Ambient Glow**:
    *   Primary: `bg-periwinkle-900/20`
    *   Secondary: `bg-indigo-900/20`
    *   Use `blur-[100px]` and `opacity-40` for background orbs.

### Typography Colors
*   **Headings (Gradient)**: `bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300`
*   **Primary Text**: `text-white`
*   **Secondary Text**: `text-gray-200` or `text-gray-300`
*   **Accent Text**: `text-periwinkle-200` or `text-periwinkle-300`
*   **Muted Text**: `text-gray-400` or `text-periwinkle-300/70`

### Borders & Dividers
*   **Subtle Border**: `border-white/10`
*   **Hover Border**: `hover:border-periwinkle-500/30`
*   **Separators**: `bg-gradient-to-r from-transparent via-periwinkle-500 to-transparent` (for horizontal lines)

---

## 3. Layout Patterns

### Bento Grid
For content-heavy sections, use a CSS Grid layout that resembles a "Bento Box" (varied sized rectangular cards).
*   **Grid Wrapper**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min`
*   **Card Spanning**: Use `col-span-2` or `row-span-2` to create visual interest and hierarchy.

### Ambient Background
Every page should have this structure at the top level:
```tsx
<div className="min-h-screen bg-black text-white p-4 md:p-8 relative selection:bg-periwinkle-500/30">
  {/* Background Ambience */}
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-periwinkle-900/20 rounded-full blur-[100px] opacity-40"></div>
    <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] opacity-40"></div>
  </div>
  
  <div className="max-w-7xl mx-auto relative z-10">
     {/* Page Content */}
  </div>
</div>
```

---

## 4. Component Styling

### Glass Cards (The Standard Container)
All distinct content blocks should use this "Glass Card" styling:
```tsx
<div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all hover:border-periwinkle-500/30">
  {/* Content */}
</div>
```
*   **Radius**: `rounded-3xl` (Large, friendly corners)
*   **Border**: Thin, barely visible white border `border border-white/10`
*   **Interactive**: If clickable or just for effect, add hover states: `hover:bg-white/10`, `hover:shadow-2xl`, `hover:scale-[1.02]`.

### Headings
*   **Page Title**: Large, centered, gradient text.
    ```tsx
    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 pb-2 tracking-tight">
      Title Here
    </h1>
    ```
*   **Section Title**: White with emoji or accent.
    ```tsx
    <h3 className="text-2xl font-bold text-white mb-4">
      Section Title 🚀
    </h3>
    ```

### Buttons & Links
*   **Primary Action**: Periwinkle background with hover effect.
    ```tsx
    <button className="px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-500 text-white rounded-lg transition-colors">
      Action
    </button>
    ```
*   **External Links**: Simple flex row with arrow icon.

---

## 5. Animations & Effects

*   **Entry Animation**: Use `animate-fade-in-down` for headers to give a smooth entrance.
*   **Hover Micro-interactions**:
    *   Cards should subtly glow or lift up: `hover:-translate-y-1`.
    *   Icons can scale: `group-hover:scale-110`.
*   **Glow Effects**: Use `drop-shadow-lg` or `shadow-[color]` for depth.

## 6. Iconography
*   Use standard emojis for a "fun" vibe (e.g., 🚗, 🏨, ⏳) alongside SVG icons.
*   Keep icons consistent in stroke width and style if using SVGs (e.g., Heroicons).
