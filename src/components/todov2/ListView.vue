<template>
  <div class="list-view">
    <div class="list-controls">
      <div class="filter-group">
        <label>
          Priority
          <select v-model="selectedPriority">
            <option value="all">All</option>
            <option v-for="priority in priorities" :key="priority" :value="priority">
              {{ priority }}
            </option>
          </select>
        </label>
        <label>
          Assignee
          <select v-model="selectedAssignee">
            <option value="all">All</option>
            <option v-for="assignee in assignees" :key="assignee" :value="assignee">
              {{ assignee }}
            </option>
          </select>
        </label>
      </div>
      <div class="filter-group">
        <label>
          Sort By
          <select v-model="sortKey">
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>
    </div>

    <div class="list-table">
      <div class="list-row header">
        <span>Title</span>
        <span>Priority</span>
        <span>Due Date</span>
        <span>Assignee</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <div v-for="todo in sortedTodos" :key="todo.id" class="list-row">
        <span class="title">
          {{ todo.title }}
          <small>{{ todo.description }}</small>
        </span>
        <span class="badge" :class="`priority-${todo.priority}`">
          {{ todo.priority }}
        </span>
        <span :class="{ overdue: manager.isOverdue(todo) }">
          {{ todo.dueDate }}
        </span>
        <span>{{ todo.assignee }}</span>
        <span class="status">{{ todo.status }}</span>
        <span class="actions">
          <button type="button" @click="$emit('edit', todo)">Edit</button>
          <button type="button" class="danger" @click="$emit('delete', todo)">Delete</button>
        </span>
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
  },
  data(): {
    selectedPriority: PriorityFilter
    selectedAssignee: AssigneeFilter
    sortKey: SortKey
  } {
    return {
      selectedPriority: 'all',
      selectedAssignee: 'all',
      sortKey: 'dueDate',
    }
  },
  computed: {
    assignees(): string[] {
      return this.manager.getAssignees()
    },
    priorities(): Priority[] {
      return ['low', 'medium', 'high']
    },
    filteredTodos(): Todo[] {
      const filter = {
        priority: this.selectedPriority === 'all' ? undefined : this.selectedPriority,
        assignee: this.selectedAssignee === 'all' ? undefined : this.selectedAssignee,
      }
      return this.manager.filterTodos(filter)
    },
    sortedTodos(): Todo[] {
      return this.manager.sortTodos(this.filteredTodos, this.sortKey)
    },
  },
})
</script>

<style scoped>
.list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #5b5f6d;
  gap: 6px;
}

select {
  border: 1px solid #e2e5ec;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
}

.list-table {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eef0f4;
  overflow: hidden;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr) 1fr;
  gap: 12px;
  padding: 14px 16px;
  align-items: center;
  border-bottom: 1px solid #eef0f4;
  font-size: 13px;
  color: #2b2f3a;
}

.list-row.header {
  background: #f8f9fc;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  color: #5b5f6d;
}

.list-row:last-child {
  border-bottom: none;
}

.title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 600;
}

.title small {
  font-weight: 400;
  color: #6d7280;
}

.badge {
  text-transform: capitalize;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  display: inline-flex;
  width: fit-content;
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

.overdue {
  color: #c1121f;
  font-weight: 600;
}

.status {
  text-transform: capitalize;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  border: none;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  color: #2b2f3a;
}

.actions button.danger {
  color: #c1121f;
}

@media (max-width: 900px) {
  .list-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .list-row.header {
    display: none;
  }
}
</style>
