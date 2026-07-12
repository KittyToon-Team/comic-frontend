<template>
  <div class="page-shell">
    <div class="header-section">
      <div class="title-block">
        <h2>Quản lý Tài khoản</h2>
        <p class="subtitle">
          Tìm kiếm, xem thông tin và phân quyền tài khoản khách hàng trong hệ thống.
        </p>
      </div>
    </div>

    <UserSearchBar v-model="keyword" />

    <transition name="fade">
      <div v-if="toast" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition>

    <div v-if="loading" class="status-message loading">
      <span class="spinner"></span> Đang tải danh sách tài khoản...
    </div>
    <div v-else-if="errorMessage" class="status-message error">
      ⚠️ {{ errorMessage }}
    </div>
    <UserTable
      v-else
      :users="users"
      :updating-id="updatingId"
      :locking-id="lockingId"
      @toggle-role="handleToggleRole"
      @toggle-lock="handleToggleLock"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import UserSearchBar from "../../../components/admin/users/UserSearchBar.vue";
import UserTable from "../../../components/admin/users/UserTable.vue";
import { getUsers, updateUserRole } from "../../../api/userApi";
import api from "../../../api/axios";

const users = ref([]);
const keyword = ref("");
const loading = ref(false);
const errorMessage = ref("");
const updatingId = ref(null);
const lockingId = ref(null);
const toast = ref(null);
let debounceTimer = null;
let toastTimer = null;

async function fetchUsers() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const res = await getUsers(keyword.value);
    users.value = res.data;
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Không thể tải được danh sách tài khoản từ hệ thống.";
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchUsers, 300);
}

function showToast(type, message) {
  toast.value = { type, message };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 3000);
}

async function handleToggleRole(user) {
  if (user.username === "admin") return;
  const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
  updatingId.value = user.id;
  try {
    const res = await updateUserRole(user.id, nextRole);
    const updated = res.data;
    const idx = users.value.findIndex((u) => u.id === user.id);
    if (idx !== -1) users.value[idx] = updated;
    showToast(
      "success",
      nextRole === "ADMIN"
        ? `Đã nâng "${user.displayName || user.username}" lên Admin`
        : `Đã hạ "${user.displayName || user.username}" xuống User`
    );
  } catch (err) {
    showToast("error", err.response?.data?.message || "Không thể cập nhật vai trò tài khoản.");
  } finally {
    updatingId.value = null;
  }
}

async function handleToggleLock(user) {
  if (user.username === "admin") return;
  const confirmMsg = user.isLocked 
    ? `Xác nhận MỞ KHÓA tài khoản "${user.displayName || user.username}"?` 
    : `Xác nhận KHÓA tài khoản "${user.displayName || user.username}"? Người dùng này sẽ bị đăng xuất ngay lập tức và không thể truy cập lại.`;
    
  if (!confirm(confirmMsg)) return;
  
  lockingId.value = user.id;
  try {
    const res = await api.put(`/admin/users/${user.id}/toggle-lock`);
    const isLocked = res.data.isLocked;
    const idx = users.value.findIndex((u) => u.id === user.id);
    if (idx !== -1) users.value[idx].isLocked = isLocked;
    
    showToast("success", res.data.message);
  } catch (err) {
    showToast("error", err.response?.data?.message || "Không thể thực hiện thao tác này.");
  } finally {
    lockingId.value = null;
  }
}

watch(keyword, onSearch);
onMounted(fetchUsers);
</script>

<style scoped>
.page-shell {
  padding: 32px;
  background: #fffdfa;
  min-height: 100%;
  text-align: left;
}

.header-section {
  margin-bottom: 28px;
  border-bottom: 2px dashed #fcd3e7;
  padding-bottom: 20px;
}

.title-block h2 {
  margin: 0;
  color: #a21caf;
  font-size: 28px;
  font-weight: 700;
}

.title-block .subtitle {
  margin: 6px 0 0 0;
  color: #933f83;
  font-size: 14px;
}

.toast {
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  border: 1px solid transparent;
}
.toast.success {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}
.toast.error {
  background: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.status-message {
  padding: 20px;
  border-radius: 12px;
  font-size: 14px;
}
.status-message.error {
  background: #fef2f2;
  color: #b91c1c;
}
.status-message.loading {
  color: #db2777;
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(219, 39, 119, 0.25);
  border-top-color: #db2777;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
