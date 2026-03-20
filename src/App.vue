<template>
  <div id="app">
    <TodoV2Page />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TodoV2Page from './pages/todov2/index.vue'

export default Vue.extend({
  name: 'App',
  components: {
    TodoV2Page,
  },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f4f5f9;
  font-family: 'Space Grotesk', sans-serif;
}

#app {
  min-height: 100vh;
  padding: 32px;
  color: #1c1f2a;
}
</style>
