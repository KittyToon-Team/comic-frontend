<template>
  <span
    v-if="isSuperAdmin"
    class="role-locked"
    title="Tài khoản admin duy nhất của hệ thống, không thể thay đổi"
  >
    🔒 Admin (cố định)
  </span>
  <button
    v-else
    class="role-btn"
    :class="isAdmin ? 'role-btn-admin' : 'role-btn-user'"
    :disabled="updating"
    @click="$emit('toggle')"
  >
    <span v-if="updating" class="spinner-sm"></span>
    <template v-else>{{ isAdmin ? "👑 Admin — hạ xuống User" : "👤 User — nâng lên Admin" }}</template>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  role: { type: String, required: true },
  username: { type: String, required: true },
  updating: { type: Boolean, default: false },
});
defineEmits(["toggle"]);

const isAdmin = computed(() => props.role === "ADMIN");
const isSuperAdmin = computed(() => props.username === "admin");
</script>

<style scoped>
.role-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.role-btn-admin {
  background: #fff1f2;
  color: #db2777;
  border-color: #fbcfe8;
}
.role-btn-admin:hover:not(:disabled) {
  background: #ffe4e6;
}

.role-btn-user {
  background: #f3e8ff;
  color: #a855f7;
  border-color: #e9d5ff;
}
.role-btn-user:hover:not(:disabled) {
  background: #e9d5ff;
}

.role-locked {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: #f4f0eb;
  color: #8a8578;
  border: 1px solid #e3ddcf;
}

.spinner-sm {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-top-color: #a855f7;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
