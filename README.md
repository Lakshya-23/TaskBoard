# TaskBoard

A Kanban board built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Shadcn/UI**, **Zustand**, **Framer Motion**, and **@dnd-kit**.  
All data is persisted client-side via `localStorage`.

---

## Features

- **Kanban Board** — Three columns (To Do · In Progress · Done) with drag-and-drop.
- **Task Management** — create, edit, delete tasks with title, description, priority, due date, and tags
- **Drag & Drop** — Reorder tasks within a column or move them across columns.
- **Activity Log** — Automatic tracking of every task (created, moved, edited, deleted) with timestamps
- **Authentication** — Login with "Remember Me" support persisted to localStorage
---

## Tech Stack

Next.js
| React
| Tailwind CSS
| Shadcn/UI
| Zustand
| Zod
| react-hook-form
| @dnd-kit
| Framer Motion
| date-fns

---

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Login Credentials

| Field | Value |
|---|---|
| **Email** | `intern@demo.com` |
| **Password** | `intern123` |

---

## Architecture Overview

### Routing

| Route | Access | Description |
|---|---|---|
| `/` | Public | Auto-redirects to `/board` or `/login` based on auth state |
| `/login` | Public | Login form; redirects to `/board` if already authenticated |
| `/board` | Protected | Kanban board wrapped in `<AuthGuard>` |

### State Management

A single **Zustand** store (`lib/store.ts`) manages the entire app state:

- **Auth state** — `isAuthenticated`, `rememberMe`, `login()`, `logout()`
- **Tasks** — `tasks[]`, `addTask()`, `updateTask()`, `deleteTask()`, `moveTask()`, `reorderTask()`
- **Activity Log** — `activityLog[]`, `clearLog()`
- **Filters** — `searchQuery`, `priorityFilter`, `sortDirection` 

**Persistence**: The store uses Zustand's `persist` middleware with `localStorage` (key: `"taskboard-storage"`). Tasks and activity logs are always persisted; auth state is persisted only when "Remember Me" is checked.

### Drag & Drop

Built with `@dnd-kit`:
- `<DndContext>` in `board-view.tsx` manages the drag session
- Each column uses `useDroppable` with `<SortableContext>`
- Moving between columns logs a "moved" activity entry

---

## localStorage

All app data is stored under the `"taskboard-storage"` key in your browser's localStorage. You can inspect it in DevTools:

To **reset all data**, use the "Reset" button in the app header
