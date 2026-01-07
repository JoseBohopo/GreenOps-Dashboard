# Main Layout - Technical Documentation

> **Last updated**: January 2026
> **Version**: 1.0.0
> Keep this documentation synchronized with code changes

## Table of Contents

1. [Layout Architecture](#layout-architecture)
2. [Main Components](#main-components)
3. [Responsive System](#responsive-system)
4. [State Management](#state-management)
5. [Accessibility](#accessibility)
6. [Usage Guide](#usage-guide)
7. [Technical Considerations](#technical-considerations)

---

## Layout Architecture

### Component Hierarchy

```
[layout.tsx](#app/layout.tsx)(Root Layout)
├─ Metadata & Fonts
└─ MainLayout (#src/shared/ui/layout/MainLayout.tsx)
├─ Header (#src/shared/ui/layout/Header.tsx)
├─ Sidebar (#src/shared/ui/layout/Sidebar.tsx)
└─ Main Content Area
└─ {children} (individual pages)
```

---

## Main Components

### 1. [layout](#app/layout.tsx) (Root Layout)

**Responsibility**: Next.js App Router root layout. Configures fonts, metadata and wraps the entire app in MainLayout.

**Features**:
- Server Component by default
- Loads Google Fonts (Geist Sans, Geist Mono)
- Defines global metadata
- Applies Css font variables

2. ### [MainLayout](#src/shared/ui/layout/MainLayout.tsx)

**Responsibility**: Main layout orchestrator. Manages sidebar state and composes Header + Sidebar + Main.

**Props**:
```tsx
interface MainLayoutProps {
  children: React.ReactNode;
}
```

**Internal State:
```tsx
const [isSideBarOpen, setIsSideBarOpen] = useState(false);
```

**Features**:
- Client Component('use client')
- Vertical flex layout (column)

3. ### [Header](#src/shared/ui/layout/Header.tsx)

**Responsibility**: Top bar with logo, hamburger menu(mobile), and user info.

**Features**:
- Server Component (stateless)
- Hamburger button only visible on mobile
- Logo/title visually centered
- User placeholder (right side)
- Shadow and border for visual separation

4. ### [Sidebar](#src/shared/ui/layout/Sidebar.tsx)

**Responsibility**: Side navigation with responsive behavior.

**Current navigation**:
```tsx
<li>
  <button className="...">Dashboard</button>
</li>
<li>
  <button className="...">Metrics</button>
</li>
<li>
  <button className="...">Settings</button>
</li>
```

