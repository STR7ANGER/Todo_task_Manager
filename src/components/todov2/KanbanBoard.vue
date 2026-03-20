<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="column in columns"
      :key="column.status"
      :manager="manager"
      :status="column.status"
      :title="column.title"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { TodoStatus } from '@/BLL/todoV2/types'
import KanbanColumn from './KanbanColumn.vue'

interface KanbanColumnDef {
  title: string
  status: TodoStatus
}

export default Vue.extend({
  name: 'KanbanBoard',
  components: { KanbanColumn },
  props: {
    manager: {
      type: Object as PropType<TodoManager>,
      required: true,
    },
  },
  data(): { columns: KanbanColumnDef[] } {
    return {
      columns: [
        { title: 'Todo', status: 'todo' },
        { title: 'In Progress', status: 'in-progress' },
        { title: 'Done', status: 'done' },
      ],
    }
  },
})
</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
  padding: 8px 0;
}
</style>
