<template>
  <div class="list-view">
    <div class="list-head">
      <div>
        <h2>Daily Back-End Task</h2>
        <div class="head-meta">
          <span><svg viewBox="0 0 24 24" class="icon"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.31 0-6 1.34-6 3v3h12v-3c0-1.66-2.69-3-6-3z" fill="currentColor"/></svg> Developer Team</span>
          <span><svg viewBox="0 0 24 24" class="icon"><path d="M12 2l2.4 6h6.6l-5.3 3.9 2 6.1-5.7-4.1-5.7 4.1 2-6.1L3 8h6.6L12 2z" fill="currentColor"/></svg> Important</span>
          <span><svg viewBox="0 0 24 24" class="icon"><path d="M7 5h10v2H7V5zm0 6h10v2H7v-2zm0 6h6v2H7v-2z" fill="currentColor"/></svg> 11 Task</span>
        </div>
      </div>
      <button type="button" class="add-task" @click="$emit('add')">
        + Add Task
      </button>
    </div>

    <div
      v-for="section in sections"
      :key="section.status"
      class="status-section"
    >
      <div class="section-header">
        <span class="section-pill" :class="section.tone">
          {{ section.label }}
        </span>
        <span class="section-count">{{ section.todos.length }}</span>
      </div>

      <div class="list-table">
        <div class="list-row header">
          <span class="check-col">
            <input
              type="checkbox"
              :checked="isAllSelected(section.todos)"
              @change="toggleSection(section.todos, $event)"
            />
          </span>
          <span>Task Name</span>
          <span>Descriptions</span>
          <span>People</span>
          <span>Type</span>
          <span>Timeline Date</span>
          <span>Priority</span>
          <span></span>
        </div>
        <div v-for="todo in section.todos" :key="todo.id" class="list-row">
          <span class="check-col">
            <input
              type="checkbox"
              :checked="selectedIds.includes(todo.id)"
              @change="toggleRow(todo.id, $event)"
            />
          </span>
          <span class="task-name" @click="$emit('open', todo)">
            {{ todo.title }}
          </span>
          <span class="desc">{{ todo.description }}</span>
          <span class="people">
            <span class="avatar">{{ manager.getAssigneeInitials(todo.assignee) }}</span>
          </span>
          <span class="type" :class="manager.getTypeTone(todo)">{{ manager.getTypeLabel(todo) }}</span>
          <span class="timeline">{{ manager.getTimelineLabel(todo) }}</span>
          <span class="priority" :class="manager.getPriorityTone(todo.priority)">
            {{ manager.getPriorityLabel(todo.priority) }}
          </span>
          <span class="row-actions">
            <div class="menu-wrapper">
              <button type="button" class="ghost-btn">⋯</button>
              <div class="menu">
                <button type="button" class="menu-item" @click="$emit('edit', todo)">Edit</button>
                <button type="button" class="menu-item danger" @click="$emit('delete', todo)">Delete</button>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { Priority, Todo } from '@/BLL/todoV2/types'

type SortKey = 'dueDate' | 'priority'
type PriorityFilter = Priority | 'all'
type AssigneeFilter = string | 'all'

export default Vue.extend({
  name: 'ListView',
  props: {
    manager: {
      type: Object as PropType<TodoManager>,
      required: true,
    },
    selectedPriority: {
      type: String as PropType<PriorityFilter>,
      required: true,
    },
    selectedAssignee: {
      type: String as PropType<AssigneeFilter>,
      required: true,
    },
    sortKey: {
      type: String as PropType<SortKey>,
      required: true,
    },
  },
  data(): { selectedIds: string[] } {
    return { selectedIds: [] }
  },
  computed: {
    filteredTodos(): Todo[] {
      const filter = {
        priority: this.selectedPriority === 'all' ? undefined : this.selectedPriority,
        assignee: this.selectedAssignee === 'all' ? undefined : this.selectedAssignee,
      }
      return this.manager.filterTodos(filter)
    },
    sections(): Array<{
      status: 'todo' | 'in-progress' | 'done'
      label: string
      tone: string
      todos: Todo[]
    }> {
      const base = [
        { status: 'todo', label: 'Not Started' },
        { status: 'in-progress', label: 'In Progress' },
        { status: 'done', label: 'Done' },
      ] as const

      return base.map((section) => {
        const todos = this.filteredTodos.filter((todo) => todo.status === section.status)
        const sorted = this.manager.sortTodos(todos, this.sortKey)
        return {
          status: section.status,
          label: section.label,
          tone: `tone-${this.manager.getStatusTone(section.status)}`,
          todos: sorted,
        }
      })
    },
  },
  methods: {
    toggleRow(id: string, event: Event): void {
      const checked = (event.target as HTMLInputElement).checked
      if (checked) {
        if (!this.selectedIds.includes(id)) {
          this.selectedIds = [...this.selectedIds, id]
        }
      } else {
        this.selectedIds = this.selectedIds.filter((item) => item !== id)
      }
    },
    toggleSection(todos: Todo[], event: Event): void {
      const checked = (event.target as HTMLInputElement).checked
      const ids = todos.map((todo) => todo.id)
      if (checked) {
        const merged = new Set([...this.selectedIds, ...ids])
        this.selectedIds = Array.from(merged)
      } else {
        this.selectedIds = this.selectedIds.filter((id) => !ids.includes(id))
      }
    },
    isAllSelected(todos: Todo[]): boolean {
      if (todos.length === 0) {
        return false
      }
      return todos.every((todo) => this.selectedIds.includes(todo.id))
    },
  },
})
</script>

<style scoped>
.list-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.list-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.list-head h2 {
  margin: 0;
  font-size: 18px;
  color: var(--ink-900);
}

.head-meta {
  display: flex;
  gap: 16px;
  color: var(--ink-500);
  font-size: 12px;
  margin-top: 6px;
}

.head-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.add-task {
  border: none;
  background: var(--purple-600);
  color: #ffffff;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}


.status-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-pill {
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 12px;
}

.tone-purple {
  background: var(--purple-100);
  color: var(--purple-600);
}

.tone-orange {
  background: var(--orange-100);
  color: var(--orange-600);
}

.tone-green {
  background: var(--green-100);
  color: var(--green-600);
}

.section-count {
  background: var(--surface);
  border: var(--border-soft);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  color: var(--ink-600);
}

.list-table {
  background: var(--surface);
  border-radius: 16px;
  border: var(--border-soft);
  overflow: hidden;
}

.list-row {
  display: grid;
  grid-template-columns: 32px 1.3fr 2fr 0.8fr 0.9fr 1.2fr 0.9fr 0.8fr;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  border-bottom: var(--border-soft);
  font-size: 12px;
  color: var(--ink-700);
}

.list-row.header {
  background: var(--surface-muted);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--ink-500);
}

.list-row:last-child {
  border-bottom: none;
}

.task-name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
}

.task-name:hover {
  text-decoration: underline;
}

.check-col {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.desc {
  color: var(--ink-500);
}

.people .avatar {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #ececff;
  color: #4b3bd0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.type,
.priority {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 10px;
  display: inline-flex;
  width: fit-content;
}

.type.lavender {
  background: #efeaff;
  color: #6a55e8;
}

.type.mint {
  background: #e8f6f0;
  color: #2f9c66;
}

.type.peach {
  background: #fff1dc;
  color: #d9822b;
}

.priority.red {
  background: var(--red-100);
  color: var(--red-600);
}

.priority.yellow {
  background: var(--yellow-100);
  color: var(--yellow-600);
}

.priority.blue {
  background: var(--blue-100);
  color: var(--blue-600);
}

.row-actions {
  display: flex;
  justify-content: flex-end;
}

.ghost-btn {
  border: none;
  background: transparent;
  color: var(--ink-500);
  font-size: 16px;
  cursor: pointer;
}

.menu-wrapper {
  position: relative;
}

.menu {
  position: absolute;
  right: 0;
  top: 22px;
  background: var(--surface);
  border: var(--border-soft);
  border-radius: 10px;
  padding: 6px;
  box-shadow: var(--shadow-soft);
  display: none;
  z-index: 10;
}

.menu-wrapper:hover .menu {
  display: block;
}

.menu-item {
  border: none;
  background: transparent;
  text-align: left;
  width: 100%;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--ink-700);
  cursor: pointer;
  border-radius: 6px;
}

.menu-item:hover {
  background: var(--surface-muted);
}

.menu-item.danger {
  color: var(--red-600);
}

.timeline {
  color: var(--ink-500);
  font-size: 11px;
}

.icon {
  width: 14px;
  height: 14px;
}
</style>
