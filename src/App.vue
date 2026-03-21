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
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f5f6fa;
  font-family: 'Manrope', sans-serif;
  color: #2b2f3a;
}

.material-icons-outlined {
  font-size: 18px;
  line-height: 1;
  vertical-align: middle;
}

#app {
  min-height: 100vh;
}

:root {
  --ink-900: #1d1f2c;
  --ink-700: #4b4f5c;
  --ink-600: #6a6f7d;
  --ink-500: #8b909f;
  --ink-300: #d9dbe3;
  --surface: #ffffff;
  --surface-muted: #f7f8fb;
  --purple-600: #6f4ef2;
  --purple-100: #f1edff;
  --orange-100: #fff1dc;
  --orange-600: #d9822b;
  --green-100: #e7f7ef;
  --green-600: #2f9c66;
  --red-100: #ffe6e6;
  --red-600: #d64545;
  --yellow-100: #fff4d9;
  --yellow-600: #c5841b;
  --blue-100: #e7efff;
  --blue-600: #3c5ce7;
  --shadow-soft: 0 8px 24px rgba(18, 22, 33, 0.08);
  --shadow-card: 0 6px 16px rgba(18, 22, 33, 0.08);
  --border-soft: 1px solid #eaecf2;
}
</style>
