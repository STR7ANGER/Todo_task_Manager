# Todo Task Manager (Vue 2 + TypeScript)

A Vue 2 Options API + TypeScript assessment project featuring a Todo Task Manager with Kanban and List views. All business logic lives in a single `TodoManager` class, which is passed directly to each component via props.

## Requirements Covered
- Vue 2 + TypeScript (Options API)
- Kanban and List views
- Drag-and-drop between Kanban columns (HTML5 DnD)
- Sorting by due date and priority
- View persistence via `localStorage`
- Add/Edit modal with validation (title required, due date not in past)
- Overdue flagging (red due date when past due and not done)
- Filtering by priority and assignee
- Strict typing (no `any` in the codebase)

## Project Structure

```
src/
  BLL/todoV2/
    types.ts
    mockData.ts
    TodoManager.ts
  components/todov2/
    KanbanBoard.vue
    KanbanColumn.vue
    TodoCard.vue
    ListView.vue
    TodoModal.vue
    ViewToggle.vue
  pages/todov2/
    index.vue
```

## Setup
```bash
npm install
```

## Run (development)
```bash
npm run serve
```

## Build
```bash
npm run build
```

## Notes / Assumptions
- The official UI design spec was not provided; styles are structured for quick matching once delivered.
- The Kanban drop handler calls `moveTodo(id, status)` to support HTML5 drag-and-drop.
- View mode is persisted under the key `todov2:view`.

