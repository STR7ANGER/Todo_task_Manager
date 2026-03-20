<template>
  <div v-if="visible && todo" class="drawer-wrap">
    <div class="overlay" @click="$emit('close')"></div>
    <aside class="drawer">
      <div class="drawer-top">
        <button type="button" class="icon-btn" @click="$emit('close')">×</button>
        <div class="actions">
          <button type="button" class="icon-btn">☆</button>
          <button type="button" class="icon-btn">⋯</button>
        </div>
      </div>

      <h2 class="title">{{ todo.title }}</h2>

      <div class="meta-grid">
        <div class="meta-row">
          <span class="label">Created time</span>
          <span class="value">{{ manager.formatDate(todo.createdAt) }}</span>
        </div>
        <div class="meta-row">
          <span class="label">Status</span>
          <span class="pill" :class="statusTone">{{ statusLabel }}</span>
        </div>
        <div class="meta-row">
          <span class="label">Priority</span>
          <span class="pill" :class="priorityTone">{{ priorityLabel }}</span>
        </div>
        <div class="meta-row">
          <span class="label">Due Date</span>
          <span class="value">{{ manager.formatDate(todo.dueDate) }}</span>
        </div>
        <div class="meta-row">
          <span class="label">Assignee</span>
          <span class="assignee">{{ todo.assignee }}</span>
        </div>
      </div>

      <div class="desc">
        <div class="label">Project Description</div>
        <p>{{ todo.description }}</p>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { Todo } from '@/BLL/todoV2/types'

export default Vue.extend({
  name: 'TaskDetailDrawer',
  props: {
    manager: {
      type: Object as PropType<TodoManager>,
      required: true,
    },
    todo: {
      type: Object as PropType<Todo | null>,
      required: false,
      default: null,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    statusLabel(): string {
      return this.todo ? this.manager.getStatusLabel(this.todo.status) : ''
    },
    statusTone(): string {
      return this.todo ? `tone-${this.manager.getStatusTone(this.todo.status)}` : ''
    },
    priorityLabel(): string {
      return this.todo ? this.manager.getPriorityLabel(this.todo.priority) : ''
    },
    priorityTone(): string {
      return this.todo ? `priority-${this.manager.getPriorityTone(this.todo.priority)}` : ''
    },
  },
})
</script>

<style scoped>
.drawer-wrap {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 18, 30, 0.35);
}

.drawer {
  position: absolute;
  top: 24px;
  right: 24px;
  bottom: 24px;
  width: min(460px, 92vw);
  background: var(--surface);
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
  padding: 20px 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.drawer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  color: var(--ink-600);
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 8px;
}

.title {
  margin: 0;
  font-size: 22px;
  color: var(--ink-900);
}

.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.label {
  color: var(--ink-500);
  font-weight: 600;
}

.value {
  color: var(--ink-700);
}

.pill {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
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

.assignee {
  font-weight: 600;
  color: var(--ink-700);
}

.desc {
  background: var(--surface-muted);
  border-radius: 14px;
  padding: 16px;
}

.desc p {
  margin: 8px 0 0;
  color: var(--ink-600);
  font-size: 13px;
  line-height: 1.5;
}
</style>
