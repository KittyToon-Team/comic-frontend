<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">Admin Panel</div>
      <div class="user-info" v-if="currentUser">
        Xin chào, {{ currentUser.displayName || currentUser.username }}
      </div>

      <nav class="menu">
        <router-link :to="{ name: 'AdminDashboard' }">Dashboard</router-link>
        <router-link :to="{ name: 'AdminStoryList' }">Quản lý Truyện</router-link>
      </nav>

      <button class="logout-btn" @click="handleLogout">Đăng xuất</button>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const currentUser = computed(() => {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
});

function handleLogout() {
  localStorage.removeItem("currentUser");
  router.push({name: "Login"});
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #1e293b;
  color: white;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.user-info {
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 20px;
  word-break: break-word;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.menu a {
  color: #cbd5e1;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 6px;
}

.menu a:hover {
  background: #334155;
}

.menu a.router-link-exact-active {
  background: #2563eb;
  color: white;
  font-weight: 600;
}

.logout-btn {
  margin-top: auto;
  padding: 10px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  opacity: 0.9;
}

.content {
  flex: 1;
  padding: 24px;
  background: #f8fafc;
}
</style>
