export type TodoStatus = 'todo' | 'in-progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  assignee: string
  status: TodoStatus
  createdAt: string
}

export type TodoInput = Omit<Todo, 'id' | 'createdAt'>

export interface TodoFilter {
  priority?: Priority
  assignee?: string
}

export interface ValidationErrors {
  title?: string
  dueDate?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationErrors
}
