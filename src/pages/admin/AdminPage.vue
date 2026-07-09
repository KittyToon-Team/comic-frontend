<template>
  <div class="admin-layout">
    <AdminNavigation />

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AdminNavigation from "./AdminNavigation.vue";
</script>


<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 24px;
  background: #fffdfa;
  overflow-y: auto;
}
</style>