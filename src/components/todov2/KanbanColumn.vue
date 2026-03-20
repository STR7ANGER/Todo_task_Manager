<template>
  <div class="kanban-column" @dragover.prevent @drop="onDrop">
    <div class="column-header">
      <div class="title-wrap">
        <span class="status-dot" :class="statusTone"></span>
        <h2>{{ title }}</h2>
        <span class="count">{{ todos.length }}</span>
      </div>
      <div class="column-actions">
        <button
          v-if="status === 'todo'"
          class="icon-btn"
          @click="$emit('add')"
        >
          +
        </button>
      </div>
    </div>
    <div class="column-body">
      <TodoCard
        v-for="todo in todos"
        :key="todo.id"
        :manager="manager"
        :todo="todo"
        @open="$emit('open', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { Todo, TodoStatus } from '@/BLL/todoV2/types'
import TodoCard from './TodoCard.vue'

export default Vue.extend({
  name: 'KanbanColumn',
  components: { TodoCard },
  props: {
    manager: {
      type: Object as PropType<TodoManager>,
      required: true,
    },
    status: {
      type: String as PropType<TodoStatus>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    todos(): Todo[] {
      return this.manager.getByStatus(this.status)
    },
    statusTone(): string {
      return `tone-${this.manager.getStatusTone(this.status)}`
    },
  },
  methods: {
    onDrop(event: DragEvent): void {
      if (!event.dataTransfer) {
        return
      }
      const id = event.dataTransfer.getData('text/plain')
      if (id) {
        this.manager.moveTodo(id, this.status)
      }
    },
  },
})
</script>

<style scoped>
.kanban-column {
  background: var(--surface-muted);
  border-radius: 18px;
  padding: 16px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: var(--border-soft);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tone-purple {
  background: var(--purple-600);
}

.tone-orange {
  background: var(--orange-600);
}

.tone-green {
  background: var(--green-600);
}

.column-header h2 {
  font-size: 16px;
  margin: 0;
  font-weight: 700;
  color: var(--ink-900);
}

.count {
  background: var(--surface);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-600);
  border: var(--border-soft);
}

.column-actions {
  display: flex;
  gap: 6px;
}

.icon-btn {
  border: var(--border-soft);
  background: var(--surface);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--ink-600);
}

.column-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
