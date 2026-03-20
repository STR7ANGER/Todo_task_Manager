<template>
  <div class="todo-page">
    <header class="page-header">
      <div>
        <h1>Todo Task Manager</h1>
        <p>Track your team deliverables with Kanban and List views.</p>
      </div>
      <div class="header-actions">
        <ViewToggle
          :manager="manager"
          :current-view="currentView"
          @change="setView"
        />
        <button class="primary" type="button" @click="openAdd">Add Todo</button>
      </div>
    </header>

    <KanbanBoard
      v-if="currentView === 'kanban'"
      :manager="manager"
      @edit="openEdit"
      @delete="handleDelete"
    />
    <ListView
      v-else
      :manager="manager"
      @edit="openEdit"
      @delete="handleDelete"
    />

    <TodoModal
      :manager="manager"
      :visible="isModalOpen"
      :mode="modalMode"
      :todo="editingTodo"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { Todo } from '@/BLL/todoV2/types'
import KanbanBoard from '@/components/todov2/KanbanBoard.vue'
import ListView from '@/components/todov2/ListView.vue'
import TodoModal from '@/components/todov2/TodoModal.vue'
import ViewToggle from '@/components/todov2/ViewToggle.vue'

type ViewMode = 'kanban' | 'list'

const managerInstance = new TodoManager()

export default Vue.extend({
  name: 'TodoV2Page',
  components: {
    KanbanBoard,
    ListView,
    TodoModal,
    ViewToggle,
  },
  data(): {
    manager: TodoManager
    currentView: ViewMode
    isModalOpen: boolean
    modalMode: 'add' | 'edit'
    editingTodo: Todo | null
  } {
    return {
      manager: managerInstance,
      currentView: 'kanban',
      isModalOpen: false,
      modalMode: 'add',
      editingTodo: null,
    }
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
.todo-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

h1 {
  margin: 0;
  font-size: 28px;
  color: #1c1f2a;
}

p {
  margin: 4px 0 0;
  color: #5b5f6d;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.primary {
  background: #1c1f2a;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>
