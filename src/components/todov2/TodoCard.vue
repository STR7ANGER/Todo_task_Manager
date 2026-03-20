<template>
  <div class="todo-card" draggable="true" @dragstart="onDragStart">
    <div class="card-header">
      <span class="status-pill" :class="statusTone">
        <span class="dot"></span>
        {{ statusLabel }}
      </span>
      <div class="menu-wrapper">
        <button type="button" class="ghost-btn">⋯</button>
        <div class="menu">
          <button type="button" class="menu-item" @click="$emit('edit', todo)">Edit</button>
          <button type="button" class="menu-item danger" @click="$emit('delete', todo)">Delete</button>
        </div>
      </div>
    </div>
    <h3 class="title">{{ todo.title }}</h3>
    <p class="description">{{ todo.description }}</p>
    <div class="assignees">
      <span class="label">Assignees :</span>
      <span class="avatar small">{{ manager.getAssigneeInitials(todo.assignee) }}</span>
    </div>
    <div class="meta-row">
      <div class="date" :class="{ overdue: manager.isOverdue(todo) }">
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
          <path
            d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm12 6H5v12h14V8z"
            fill="currentColor"
          />
        </svg>
        {{ manager.formatDate(todo.dueDate) }}
      </div>
      <span class="priority" :class="priorityTone">{{ priorityLabel }}</span>
    </div>
    <div class="footer">
      <span class="footer-item">
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
          <path
            d="M4 4h16v12H7l-3 3V4zm2 4h12v2H6V8zm0 4h8v2H6v-2z"
            fill="currentColor"
          />
        </svg>
        {{ metaCounts.comments }} Comments
      </span>
      <span class="footer-item">
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
          <path
            d="M10.6 13.4a1 1 0 0 1 0-1.4l3-3a1 1 0 1 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0zm-2.2 2.2a3 3 0 0 1 0-4.2l3-3a3 3 0 0 1 4.2 4.2l-1 1a1 1 0 0 1-1.4-1.4l1-1a1 1 0 0 0-1.4-1.4l-3 3a1 1 0 0 0 0 1.4 1 1 0 0 1-1.4 1.4z"
            fill="currentColor"
          />
        </svg>
        {{ metaCounts.links }} Links
      </span>
      <span class="footer-item">
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
          <path d="M5 5h14v2H5V5zm0 6h14v2H5v-2zm0 6h8v2H5v-2z" fill="currentColor"/>
        </svg>
        {{ metaCounts.checklist }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { Todo } from '@/BLL/todoV2/types'

export default Vue.extend({
  name: 'TodoCard',
  props: {
    manager: {
      type: Object as PropType<TodoManager>,
      required: true,
    },
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  computed: {
    statusLabel(): string {
      return this.manager.getStatusLabel(this.todo.status)
    },
    statusTone(): string {
      return `tone-${this.manager.getStatusTone(this.todo.status)}`
    },
    priorityLabel(): string {
      return this.manager.getPriorityLabel(this.todo.priority)
    },
    priorityTone(): string {
      return `priority-${this.manager.getPriorityTone(this.todo.priority)}`
    },
    metaCounts(): { comments: number; links: number; checklist: string } {
      return this.manager.getMetaCounts(this.todo)
    },
  },
  methods: {
    onDragStart(event: DragEvent): void {
      if (!event.dataTransfer) {
        return
      }
      event.dataTransfer.setData('text/plain', this.todo.id)
      event.dataTransfer.effectAllowed = 'move'
    },
  },
})
</script>

<style scoped>
.todo-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: var(--border-soft);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 10px;
}

.status-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.tone-purple {
  color: var(--purple-600);
  background: var(--purple-100);
}

.tone-orange {
  color: var(--orange-600);
  background: var(--orange-100);
}

.tone-green {
  color: var(--green-600);
  background: var(--green-100);
}

.ghost-btn {
  border: none;
  background: transparent;
  color: var(--ink-500);
  font-size: 18px;
  cursor: pointer;
}

.menu-wrapper {
  position: relative;
}

.menu {
  position: absolute;
  right: 0;
  top: 24px;
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

.assignees {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-600);
  font-size: 12px;
}

.assignees .label {
  font-weight: 600;
}

.avatar.small {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #ececff;
  color: #4b3bd0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ink-600);
  border-top: var(--border-soft);
  padding-top: 8px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink-900);
  margin: 0;
}

.description {
  font-size: 13px;
  color: var(--ink-600);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.date.overdue {
  color: var(--red-600);
  font-weight: 600;
}

.priority {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

.priority-red {
  color: var(--red-600);
  background: var(--red-100);
}

.priority-yellow {
  color: var(--yellow-600);
  background: var(--yellow-100);
}

.priority-blue {
  color: var(--blue-600);
  background: var(--blue-100);
}

.footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: var(--ink-500);
}

.footer-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 14px;
  height: 14px;
}
</style>
