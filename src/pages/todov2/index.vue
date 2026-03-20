<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="profile-card">
        <div class="avatar">DD</div>
        <div>
          <div class="name">Davis Donin</div>
          <div class="email">daviddonin@gmail.com</div>
        </div>
        <button class="icon-btn">⋮</button>
      </div>

      <div class="menu-section">
        <div class="menu-title">Menu</div>
        <ul>
          <li><span class="dot"></span>Dashboard</li>
          <li><span class="dot"></span>Inbox</li>
          <li><span class="dot"></span>Calendar</li>
        </ul>
      </div>

      <div class="menu-section">
        <div class="menu-title">Team spaces</div>
        <ul>
          <li class="active"><span class="dot"></span>Tasks</li>
          <li><span class="dot"></span>Docs</li>
          <li><span class="dot"></span>Meeting</li>
        </ul>
      </div>

      <div class="menu-section">
        <div class="menu-title">Other</div>
        <ul>
          <li><span class="dot"></span>Settings</li>
          <li><span class="dot"></span>Support</li>
        </ul>
      </div>
    </aside>

    <main class="main">
      <div class="topbar">
        <div class="breadcrumb">
          <span class="back">←</span>
          <span>Team spaces</span>
          <span class="sep">›</span>
          <span class="bold">Tasks</span>
        </div>
        <div class="topbar-actions">
          <div class="search">
            <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
              <path
                d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L20 21.5 21.5 20l-6-6zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                fill="currentColor"
              />
            </svg>
            <input type="text" placeholder="Search" />
            <span class="shortcut">⌘ F</span>
          </div>
          <button class="icon-pill">
            <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
              <path
                d="M12 4a4 4 0 0 1 4 4 4.5 4.5 0 0 1-4 4.5A4.5 4.5 0 0 1 7.5 8 4 4 0 0 1 12 4zm0 10c3.31 0 6 1.34 6 3v3H6v-3c0-1.66 2.69-3 6-3z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button class="icon-pill">
            <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
              <path
                d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="content">
        <header class="page-header">
          <div>
            <h1>Tasks</h1>
            <p>Short description will be placed here</p>
          </div>
          <div class="header-actions">
            <div class="avatars">
              <span class="avatar small">AD</span>
              <span class="avatar small">PS</span>
              <span class="avatar small">RK</span>
              <span class="avatar small muted">+2</span>
            </div>
            <button class="action primary">
              <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                <path
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.31 0-6 1.34-6 3v3h12v-3c0-1.66-2.69-3-6-3zm8-7h-3V4h-2v3h-3v2h3v3h2V9h3z"
                  fill="currentColor"
                />
              </svg>
              Invite Member
            </button>
            <button class="action ghost">
              <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                <path
                  d="M18 8a3 3 0 1 0-2.83-4H14v2h1.17A3 3 0 0 0 18 8zM6 14a3 3 0 1 0-2.83-4H2v2h1.17A3 3 0 0 0 6 14zm12 2a3 3 0 1 0 2.83 4H22v-2h-1.17A3 3 0 0 0 18 16z"
                  fill="currentColor"
                />
              </svg>
              Share
            </button>
          </div>
        </header>

        <div class="tabs-row">
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: currentView === 'kanban' }"
              @click="setView('kanban')"
            >
              Board
            </button>
            <button
              class="tab"
              :class="{ active: currentView === 'list' }"
              @click="setView('list')"
            >
              List
            </button>
          </div>
          <div v-if="currentView === 'list'" class="tab-actions">
            <div class="tab-select">
              <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm-2 6h6v2H5v-2z" fill="currentColor"/>
              </svg>
              <DropdownSelect
                v-model="selectedAssignee"
                :options="assigneeOptions"
                placeholder="Assignee"
              />
            </div>
            <div class="tab-select">
              <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                <path d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h14v2H4v-2z" fill="currentColor"/>
              </svg>
              <DropdownSelect
                v-model="selectedPriority"
                :options="priorityOptions"
                placeholder="Priority"
              />
            </div>
            <div class="tab-select">
              <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                <path d="M7 6h10v2H7V6zm-2 5h14v2H5v-2zm2 5h10v2H7v-2z" fill="currentColor"/>
              </svg>
              <DropdownSelect
                v-model="sortKey"
                :options="sortOptions"
                placeholder="Sort by due date"
              />
            </div>
          </div>
        </div>

        <KanbanBoard
          v-if="currentView === 'kanban'"
          :manager="manager"
          @add="openAdd"
          @open="openDetails"
          @edit="openEdit"
          @delete="handleDelete"
        />
        <ListView
          v-else
          :manager="manager"
          :selected-priority="selectedPriority"
          :selected-assignee="selectedAssignee"
          :sort-key="sortKey"
          @add="openAdd"
          @open="openDetails"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </div>

      <TodoModal
        :manager="manager"
        :visible="isModalOpen"
        :mode="modalMode"
        :todo="editingTodo"
        @close="closeModal"
        @saved="handleSaved"
      />
      <TaskDetailDrawer
        :manager="manager"
        :todo="detailTodo"
        :visible="isDetailOpen"
        @close="closeDetails"
      />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { Priority, Todo } from '@/BLL/todoV2/types'
import KanbanBoard from '@/components/todov2/KanbanBoard.vue'
import ListView from '@/components/todov2/ListView.vue'
import TodoModal from '@/components/todov2/TodoModal.vue'
import DropdownSelect from '@/components/todov2/DropdownSelect.vue'
import TaskDetailDrawer from '@/components/todov2/TaskDetailDrawer.vue'

type ViewMode = 'kanban' | 'list'
type SortKey = 'dueDate' | 'priority'
type PriorityFilter = Priority | 'all'
type AssigneeFilter = string | 'all'

const managerInstance = new TodoManager()

export default Vue.extend({
  name: 'TodoV2Page',
  components: {
    KanbanBoard,
    ListView,
    TodoModal,
    DropdownSelect,
    TaskDetailDrawer,
  },
  data(): {
    manager: TodoManager
    currentView: ViewMode
    isModalOpen: boolean
    modalMode: 'add' | 'edit'
    editingTodo: Todo | null
    selectedPriority: PriorityFilter
    selectedAssignee: AssigneeFilter
    sortKey: SortKey
    detailTodo: Todo | null
    isDetailOpen: boolean
  } {
    return {
      manager: managerInstance,
      currentView: 'kanban',
      isModalOpen: false,
      modalMode: 'add',
      editingTodo: null,
      selectedPriority: 'all',
      selectedAssignee: 'all',
      sortKey: 'dueDate',
      detailTodo: null,
      isDetailOpen: false,
    }
  },
  computed: {
    assignees(): string[] {
      return this.manager.getAssignees()
    },
    priorities(): Priority[] {
      return ['low', 'medium', 'high']
    },
    assigneeOptions(): Array<{ label: string; value: string }> {
      return [{ label: 'Assignee', value: 'all' }].concat(
        this.assignees.map((assignee) => ({ label: assignee, value: assignee }))
      )
    },
    priorityOptions(): Array<{ label: string; value: string }> {
      return [{ label: 'Priority', value: 'all' }].concat(
        this.priorities.map((priority) => ({
          label: priority[0].toUpperCase() + priority.slice(1),
          value: priority,
        }))
      )
    },
    sortOptions(): Array<{ label: string; value: string }> {
      return [
        { label: 'Sort by due date', value: 'dueDate' },
        { label: 'Sort by priority', value: 'priority' },
      ]
    },
  },
  created(): void {
    const saved = window.localStorage.getItem('todov2:view')
    if (saved === 'kanban' || saved === 'list') {
      this.currentView = saved
    }
  },
  methods: {
    setView(view: ViewMode): void {
      this.currentView = view
      window.localStorage.setItem('todov2:view', view)
    },
    openAdd(): void {
      this.modalMode = 'add'
      this.editingTodo = null
      this.isModalOpen = true
    },
    openEdit(todo: Todo): void {
      this.modalMode = 'edit'
      this.editingTodo = todo
      this.isModalOpen = true
    },
    openDetails(todo: Todo): void {
      this.detailTodo = todo
      this.isDetailOpen = true
    },
    closeDetails(): void {
      this.isDetailOpen = false
      this.detailTodo = null
    },
    closeModal(): void {
      this.isModalOpen = false
    },
    handleSaved(): void {
      // Vue reactivity is handled by TodoManager's observable state.
    },
    handleDelete(todo: Todo): void {
      this.manager.deleteTodo(todo.id)
    },
  },
})
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #f5f6fa;
}

.sidebar {
  background: #f7f8fb;
  border-right: 1px solid #eef0f5;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #edf0f6;
  box-shadow: none;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #edeaff;
  color: #5a3fe2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.avatar.small {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  font-size: 12px;
}

.avatar.muted {
  background: #f1f2f7;
  color: var(--ink-600);
}

.name {
  font-weight: 700;
  font-size: 13px;
}

.email {
  font-size: 11px;
  color: var(--ink-500);
}

.icon-btn {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--ink-500);
  font-size: 16px;
  cursor: pointer;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-title {
  font-size: 11px;
  color: var(--ink-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.menu-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--ink-700);
  font-weight: 600;
  font-size: 13px;
}

.menu-section li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  border-radius: 8px;
}

.menu-section li.active {
  background: #ffffff;
  border: 1px solid #edf0f6;
  color: var(--purple-600);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ink-300);
}

.main {
  display: flex;
  flex-direction: column;
  background: var(--surface);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: var(--border-soft);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-600);
  font-size: 14px;
}

.breadcrumb .bold {
  color: var(--ink-900);
  font-weight: 700;
}

.breadcrumb .back {
  font-weight: 700;
}

.sep {
  color: var(--ink-300);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #f7f8fb;
  border: var(--border-soft);
}

.search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: var(--ink-700);
}

.shortcut {
  font-size: 12px;
  color: var(--ink-500);
}

.icon-pill {
  border: var(--border-soft);
  background: #f7f8fb;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
}

.icon {
  width: 16px;
  height: 16px;
}

.content {
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

h1 {
  margin: 0;
  font-size: 28px;
  color: var(--ink-900);
}

p {
  margin: 6px 0 0;
  color: var(--ink-500);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.action.primary {
  background: var(--purple-600);
  color: #ffffff;
}

.action.ghost {
  background: #f4f5fa;
  color: var(--ink-700);
}

.tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: var(--border-soft);
  padding-bottom: 8px;
}

.tabs {
  display: flex;
  gap: 18px;
}

.tab {
  border: none;
  background: transparent;
  padding: 8px 0;
  font-weight: 600;
  color: var(--ink-500);
  cursor: pointer;
}

.tab.active {
  color: var(--purple-600);
  border-bottom: 2px solid var(--purple-600);
}

.tab-actions {
  display: flex;
  gap: 12px;
}

.tab-select {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: var(--border-soft);
  background: var(--surface);
  border-radius: 10px;
  color: var(--ink-600);
  font-size: 12px;
}

.tab-action {
  border: none;
  background: transparent;
  color: var(--ink-600);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}
</style>
