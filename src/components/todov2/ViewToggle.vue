<template>
  <div class="view-toggle">
    <button
      class="toggle-btn"
      :class="{ active: currentView === 'kanban' }"
      type="button"
      @click="$emit('change', 'kanban')"
    >
      Kanban
    </button>
    <button
      class="toggle-btn"
      :class="{ active: currentView === 'list' }"
      type="button"
      @click="$emit('change', 'list')"
    >
      List
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import TodoManager from '@/BLL/todoV2/TodoManager'

export default Vue.extend({
  name: 'ViewToggle',
  props: {
    manager: {
      type: Object as PropType<TodoManager>,
      required: true,
    },
    currentView: {
      type: String as PropType<'kanban' | 'list'>,
      required: true,
    },
  },
})
</script>

<style scoped>
.view-toggle {
  display: inline-flex;
  gap: 8px;
  background: #f3f4f8;
  padding: 4px;
  border-radius: 10px;
}

.toggle-btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  font-weight: 600;
  color: #5b5f6d;
  border-radius: 8px;
  cursor: pointer;
}

.toggle-btn.active {
  background: #ffffff;
  color: #1c1f2a;
  box-shadow: 0 2px 6px rgba(16, 24, 40, 0.1);
}
</style>
