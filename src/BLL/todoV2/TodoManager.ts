import Vue from 'vue'
import mockTodos from './mockData'
import {
  Priority,
  Todo,
  TodoFilter,
  TodoInput,
  TodoStatus,
  ValidationResult,
} from './types'

export class TodoManager {
  private state: { todos: Todo[] }

  constructor() {
    this.state = Vue.observable({ todos: [...mockTodos] })
  }

  getTodos(): Todo[] {
    return this.state.todos
  }

  getByStatus(status: TodoStatus): Todo[] {
    return this.state.todos.filter((todo) => todo.status === status)
  }

  getAssignees(): string[] {
    const names = this.state.todos.map((todo) => todo.assignee)
    return Array.from(new Set(names)).sort()
  }

  createEmptyTodoInput(): TodoInput {
    return {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: this.todayIso(),
      assignee: '',
      status: 'todo',
    }
  }

  addTodo(input: TodoInput): ValidationResult {
    const validation = this.validateTodoInput(input)
    if (!validation.valid) {
      return validation
    }

    const newTodo: Todo = {
      id: this.generateId(),
      createdAt: this.todayIso(),
      ...input,
    }

    this.state.todos = [newTodo, ...this.state.todos]
    return { valid: true, errors: {} }
  }

  updateTodo(id: string, updates: Partial<TodoInput>): ValidationResult {
    const target = this.state.todos.find((todo) => todo.id === id)
    if (!target) {
      return { valid: false, errors: { title: 'Todo not found.' } }
    }

    const nextTodo: Todo = {
      ...target,
      ...updates,
    }

    const validation = this.validateTodoInput({
      title: nextTodo.title,
      description: nextTodo.description,
      priority: nextTodo.priority,
      dueDate: nextTodo.dueDate,
      assignee: nextTodo.assignee,
      status: nextTodo.status,
    })

    if (!validation.valid) {
      return validation
    }

    this.state.todos = this.state.todos.map((todo) =>
      todo.id === id ? nextTodo : todo
    )
    return { valid: true, errors: {} }
  }

  deleteTodo(id: string): void {
    this.state.todos = this.state.todos.filter((todo) => todo.id !== id)
  }

  moveTodo(id: string, status: TodoStatus): void {
    this.state.todos = this.state.todos.map((todo) =>
      todo.id === id ? { ...todo, status } : todo
    )
  }

  filterTodos(filter: TodoFilter): Todo[] {
    return this.state.todos.filter((todo) => {
      if (filter.priority && todo.priority !== filter.priority) {
        return false
      }
      if (filter.assignee && todo.assignee !== filter.assignee) {
        return false
      }
      return true
    })
  }

  sortTodos(list: Todo[], key: 'dueDate' | 'priority'): Todo[] {
    const sorted = [...list]
    if (key === 'dueDate') {
      sorted.sort((a, b) => this.toDateValue(a.dueDate) - this.toDateValue(b.dueDate))
      return sorted
    }

    const order: Record<Priority, number> = {
      high: 0,
      medium: 1,
      low: 2,
    }

    sorted.sort((a, b) => order[a.priority] - order[b.priority])
    return sorted
  }

  isOverdue(todo: Todo): boolean {
    if (todo.status === 'done') {
      return false
    }
    return this.isDateInPast(todo.dueDate)
  }

  getAssigneeInitials(name: string): string {
    const parts = name.trim().split(' ')
    const initials = parts.map((part) => part[0]).join('')
    return initials.toUpperCase().slice(0, 2)
  }

  validateTodoInput(input: TodoInput): ValidationResult {
    const errors: ValidationResult['errors'] = {}

    if (!input.title.trim()) {
      errors.title = 'Title is required.'
    }

    if (this.isDateInPast(input.dueDate)) {
      errors.dueDate = 'Due date cannot be in the past.'
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  getStatusLabel(status: TodoStatus): string {
    if (status === 'todo') {
      return 'Not Started'
    }
    if (status === 'in-progress') {
      return 'On Track'
    }
    return 'Complete'
  }

  getStatusTone(status: TodoStatus): 'purple' | 'orange' | 'green' {
    if (status === 'todo') {
      return 'purple'
    }
    if (status === 'in-progress') {
      return 'orange'
    }
    return 'green'
  }

  getPriorityLabel(priority: Priority): string {
    if (priority === 'high') {
      return 'High'
    }
    if (priority === 'medium') {
      return 'Medium'
    }
    return 'Low'
  }

  getPriorityTone(priority: Priority): 'red' | 'yellow' | 'blue' {
    if (priority === 'high') {
      return 'red'
    }
    if (priority === 'medium') {
      return 'yellow'
    }
    return 'blue'
  }

  getTypeLabel(todo: Todo): 'Feature' | 'Review' | 'Bug' {
    if (todo.priority === 'high') {
      return 'Bug'
    }
    if (todo.priority === 'medium') {
      return 'Review'
    }
    return 'Feature'
  }

  getTypeTone(todo: Todo): 'lavender' | 'mint' | 'peach' {
    if (todo.priority === 'high') {
      return 'peach'
    }
    if (todo.priority === 'medium') {
      return 'lavender'
    }
    return 'mint'
  }

  getTimelineLabel(todo: Todo): string {
    return `${this.formatDate(todo.createdAt)} - ${this.formatDate(todo.dueDate)}`
  }

  getMetaCounts(todo: Todo): { comments: number; links: number; checklist: string } {
    const seed = parseInt(todo.id.replace(/\D/g, ''), 10) || 1
    const comments = (seed % 9) + 3
    const links = (seed % 3) + 1
    const completed = (seed % 3) + 1
    return { comments, links, checklist: `${completed}/3` }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    return formatter.format(date)
  }

  private generateId(): string {
    const random = Math.floor(Math.random() * 10000)
    return `${Date.now()}-${random}`
  }

  private todayIso(): string {
    const now = new Date()
    return now.toISOString().slice(0, 10)
  }

  private toDateValue(dateStr: string): number {
    return new Date(dateStr).setHours(0, 0, 0, 0)
  }

  private isDateInPast(dateStr: string): boolean {
    const todayValue = new Date().setHours(0, 0, 0, 0)
    const dueValue = this.toDateValue(dateStr)
    return dueValue < todayValue
  }
}

export default TodoManager
