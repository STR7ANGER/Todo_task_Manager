<template>
  <aside class="sidebar">
    <div class="profile-card">
      <div class="avatar">DD</div>
      <div>
        <div class="name">Davis Donin</div>
        <div class="email">daviddonin@gmail.com</div>
      </div>
      <button class="icon-btn">⋮</button>
    </div>

    <div class="menu-section">
      <div class="menu-title">Menu</div>
      <ul>
        <li><span class="dot"></span>Dashboard</li>
        <li><span class="dot"></span>Inbox</li>
        <li><span class="dot"></span>Calendar</li>
      </ul>
    </div>

    <div class="menu-section">
      <div class="menu-title">Team spaces</div>
      <ul>
        <li class="active"><span class="dot"></span>Tasks</li>
        <li><span class="dot"></span>Docs</li>
        <li><span class="dot"></span>Meeting</li>
      </ul>
    </div>

    <div class="menu-section">
      <div class="menu-title">Other</div>
      <ul>
        <li><span class="dot"></span>Settings</li>
        <li><span class="dot"></span>Support</li>
      </ul>
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Sidebar',
})
</script>

<style scoped>
.sidebar {
  background: #f7f8fb;
  border-right: 1px solid #eef0f5;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #edf0f6;
  box-shadow: none;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #edeaff;
  color: #5a3fe2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.name {
  font-weight: 700;
  font-size: 13px;
}

.email {
  font-size: 11px;
  color: var(--ink-500);
}

.icon-btn {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--ink-500);
  font-size: 16px;
  cursor: pointer;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-title {
  font-size: 11px;
  color: var(--ink-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.menu-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--ink-700);
  font-weight: 600;
  font-size: 13px;
}

.menu-section li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  border-radius: 8px;
}

.menu-section li.active {
  background: #ffffff;
  border: 1px solid #edf0f6;
  color: var(--purple-600);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ink-300);
}
</style>
