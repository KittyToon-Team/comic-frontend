<template>
  <aside class="sidebar">
    <div class="brand">KittyToon Admin</div>

    <div class="user-info" v-if="currentUser">
      <span class="user-avatar">👑</span>
      <div class="user-text">
        <span class="role-tag">Quản trị viên</span>
        <p class="username">
          {{ currentUser.displayName || currentUser.username }}
        </p>
      </div>
    </div>

    <nav class="menu">
      <router-link :to="{ name: 'AdminDashboard' }">📊 Dashboard</router-link>
      <router-link :to="{ name: 'AdminStoryList' }"
      >📚 Quản lý Truyện</router-link
      >
      <router-link :to="{ name: 'AdminCategoryList' }"
      >🏷️ Quản lý Thể loại</router-link
      >
      <router-link :to="{ name: 'AdminUserList' }"
      >👤 Quản lý Tài khoản</router-link
      >
    </nav>

    <button class="logout-btn" @click="handleLogout">🚪 Đăng xuất</button>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const currentUser = computed(() => {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
});

function handleLogout() {
  localStorage.removeItem("currentUser");
  router.push({ name: "Login" });
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #fff5fb 0%, #ffe6f0 100%);
  color: #4c1d32;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(245, 184, 219, 0.6);
  box-shadow: 4px 0 20px rgba(236, 72, 153, 0.05);
}

.brand {
  font-size: 22px;
  font-weight: 800;
  color: #a21caf;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
  border-bottom: 2px dashed #fcd3e7;
  padding-bottom: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.8);
  padding: 12px;
  border-radius: 14px;
  margin-bottom: 24px;
  border: 1px solid #f5c6dc;
}

.user-avatar {
  font-size: 20px;
  background: #fff0f6;
  padding: 6px;
  border-radius: 10px;
  border: 1px solid #ffd6e6;
}

.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.role-tag {
  font-size: 11px;
  font-weight: 700;
  color: #db2777;
  background: #fdf2f8;
  padding: 2px 6px;
  border-radius: 6px;
}

.username {
  margin: 4px 0 0 0;
  font-size: 14px;
  font-weight: 600;
  color: #33121f;
  word-break: break-all;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.menu a {
  color: #933f83;
  text-decoration: none;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  transition: all 0.2s ease;
}

.menu a:hover {
  background: #fff0f6;
  color: #db2777;
  padding-left: 18px;
}

.menu a.router-link-exact-active {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.logout-btn {
  margin-top: auto;
  padding: 12px;
  background: #fff1f2;
  color: #e11d48;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #ffe4e6;
  color: #be185d;
}
</style>
