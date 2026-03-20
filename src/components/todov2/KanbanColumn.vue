<template>
  <div class="kanban-column" @dragover.prevent @drop="onDrop">
    <div class="column-header">
      <h2>{{ title }}</h2>
      <span class="count">{{ todos.length }}</span>
    </div>
    <div class="column-body">
      <TodoCard
        v-for="todo in todos"
        :key="todo.id"
        :manager="manager"
        :todo="todo"
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
  background: #f8f9fc;
  border-radius: 16px;
  padding: 16px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #eef0f4;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.column-header h2 {
  font-size: 16px;
  margin: 0;
  font-weight: 700;
  color: #1c1f2a;
}

.count {
  background: #ffffff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #5b5f6d;
}

.column-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
