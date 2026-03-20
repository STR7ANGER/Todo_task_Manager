<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <header>
        <h2>{{ title }}</h2>
        <button type="button" class="icon-btn" @click="$emit('close')">×</button>
      </header>
      <form @submit.prevent="onSave">
        <label>
          Title
          <input v-model="form.title" type="text" placeholder="Enter a task title" />
          <span v-if="errors.title" class="error">{{ errors.title }}</span>
        </label>
        <label>
          Description
          <textarea v-model="form.description" rows="3" placeholder="Add details"></textarea>
        </label>
        <div class="row">
          <label>
            Priority
            <select v-model="form.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Status
            <select v-model="form.status">
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>
        <div class="row">
          <label>
            Due Date
            <input v-model="form.dueDate" type="date" />
            <span v-if="errors.dueDate" class="error">{{ errors.dueDate }}</span>
          </label>
          <label>
            Assignee
            <input v-model="form.assignee" type="text" placeholder="Name" />
          </label>
        </div>
        <footer>
          <button type="button" class="ghost" @click="$emit('close')">Cancel</button>
          <button type="submit" class="primary">Save</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'
import { Todo, TodoInput, ValidationErrors } from '@/BLL/todoV2/types'

type ModalMode = 'add' | 'edit'

export default Vue.extend({
  name: 'TodoModal',
  props: {
    manager: {
      type: Object as PropType<TodoManager>,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String as PropType<ModalMode>,
      required: true,
    },
    todo: {
      type: Object as PropType<Todo | null>,
      required: false,
      default: null,
    },
  },
  data(): { form: TodoInput; errors: ValidationErrors } {
    return {
      form: this.manager.createEmptyTodoInput(),
      errors: {},
    }
  },
  computed: {
    title(): string {
      return this.mode === 'add' ? 'Add Todo' : 'Edit Todo'
    },
  },
  watch: {
    visible(isVisible: boolean): void {
      if (isVisible) {
        this.resetForm()
      }
    },
  },
  methods: {
    resetForm(): void {
      if (this.mode === 'edit' && this.todo) {
        this.form = {
          title: this.todo.title,
          description: this.todo.description,
          priority: this.todo.priority,
          dueDate: this.todo.dueDate,
          assignee: this.todo.assignee,
          status: this.todo.status,
        }
      } else {
        this.form = this.manager.createEmptyTodoInput()
      }
      this.errors = {}
    },
    onSave(): void {
      const result =
        this.mode === 'add'
          ? this.manager.addTodo(this.form)
          : this.todo
          ? this.manager.updateTodo(this.todo.id, this.form)
          : { valid: false, errors: { title: 'Todo not found.' } }

      this.errors = result.errors

      if (result.valid) {
        this.$emit('saved')
        this.$emit('close')
      }
    },
  },
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 22, 33, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  width: min(520px, 100%);
  box-shadow: 0 20px 40px rgba(16, 24, 40, 0.18);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-size: 20px;
  color: #1c1f2a;
}

.icon-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #5b5f6d;
}

input,
textarea,
select {
  border: 1px solid #e2e5ec;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.error {
  color: #c1121f;
  font-size: 11px;
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.ghost {
  background: #f3f4f8;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
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
