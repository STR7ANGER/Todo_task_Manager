<template>
  <div class="app-shell">
    <Sidebar />

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
            <span class="material-icons-outlined icon" aria-hidden="true">search</span>
            <input type="text" placeholder="Search" />
            <span class="shortcut">⌘ F</span>
          </div>
          <button class="icon-pill">
            <span class="material-icons-outlined icon" aria-hidden="true">person</span>
          </button>
          <button class="icon-pill">
            <span class="material-icons-outlined icon" aria-hidden="true">notifications</span>
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
            <button class="action primary">
              <span class="material-icons-outlined icon" aria-hidden="true">person_add</span>
              Invite Member
            </button>
            <button class="action ghost">
              <span class="material-icons-outlined icon" aria-hidden="true">share</span>
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
              <span class="material-icons-outlined icon" aria-hidden="true">filter_list</span>
              <DropdownSelect
                v-model="selectedAssignee"
                :options="assigneeOptions"
                placeholder="Assignee"
              />
            </div>
            <div class="tab-select">
              <span class="material-icons-outlined icon" aria-hidden="true">layers</span>
              <DropdownSelect
                v-model="selectedPriority"
                :options="priorityOptions"
                placeholder="Priority"
              />
            </div>
            <div class="tab-select">
              <span class="material-icons-outlined icon" aria-hidden="true">sort</span>
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
import Sidebar from '@/components/todov2/Sidebar.vue'

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
    Sidebar,
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
