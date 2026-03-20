<template>
  <div class="todo-card" draggable="true" @dragstart="onDragStart">
    <div class="card-header">
      <span class="priority" :class="priorityClass">{{ todo.priority }}</span>
      <div class="card-actions">
        <button type="button" class="icon-btn" @click="$emit('edit', todo)">
          Edit
        </button>
        <button type="button" class="icon-btn danger" @click="$emit('delete', todo)">
          Delete
        </button>
      </div>
    </div>
    <h3 class="title">{{ todo.title }}</h3>
    <p class="description">{{ todo.description }}</p>
    <div class="card-footer">
      <span class="due" :class="{ overdue: manager.isOverdue(todo) }">
        Due {{ todo.dueDate }}
      </span>
      <span class="assignee">
        {{ manager.getAssigneeInitials(todo.assignee) }}
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
    priorityClass(): string {
      return `priority-${this.todo.priority}`
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
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #eef0f4;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.priority {
  text-transform: capitalize;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.priority-high {
  background: #ffe4e8;
  color: #c1121f;
}

.priority-medium {
  background: #fff5d6;
  color: #b67b00;
}

.priority-low {
  background: #e4f7ec;
  color: #0f7b4a;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  border: none;
  background: transparent;
  color: #5b5f6d;
  font-size: 12px;
  cursor: pointer;
}

.icon-btn.danger {
  color: #c1121f;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #1c1f2a;
  margin: 0;
}

.description {
  font-size: 13px;
  color: #5b5f6d;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.due {
  font-size: 12px;
  color: #5b5f6d;
}

.due.overdue {
  color: #c1121f;
  font-weight: 600;
}

.assignee {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1c1f2a;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
</style>
