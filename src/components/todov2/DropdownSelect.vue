<template>
  <div class="dropdown" ref="root">
    <button type="button" class="trigger" @click="toggle">
      <span class="label">{{ displayLabel }}</span>
      <span class="caret">▾</span>
    </button>
    <div v-if="open" class="menu">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="option"
        :class="{ active: option.value === value }"
        @click="select(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type Option = {
  label: string
  value: string
}

export default Vue.extend({
  name: 'DropdownSelect',
  props: {
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  data(): { open: boolean } {
    return { open: false }
  },
  computed: {
    displayLabel(): string {
      const match = this.options.find((option) => option.value === this.value)
      return match ? match.label : this.placeholder
    },
  },
  mounted(): void {
    document.addEventListener('click', this.onClickOutside)
  },
  beforeDestroy(): void {
    document.removeEventListener('click', this.onClickOutside)
  },
  methods: {
    toggle(): void {
      this.open = !this.open
    },
    select(value: string): void {
      this.$emit('input', value)
      this.open = false
    },
    onClickOutside(event: MouseEvent): void {
      const root = this.$refs.root as HTMLElement | undefined
      if (!root) {
        return
      }
      if (!root.contains(event.target as Node)) {
        this.open = false
      }
    },
  },
})
</script>

<style scoped>
.dropdown {
  position: relative;
  min-width: 140px;
}

.trigger {
  width: 100%;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: var(--ink-600);
  cursor: pointer;
  padding: 2px 0;
}

.label {
  white-space: nowrap;
}

.caret {
  color: var(--ink-500);
}

.menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--surface);
  border: var(--border-soft);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 6px;
  z-index: 20;
}

.option {
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--ink-700);
  cursor: pointer;
}

.option:hover {
  background: var(--surface-muted);
}

.option.active {
  background: var(--purple-100);
  color: var(--purple-600);
  font-weight: 600;
}
</style>
