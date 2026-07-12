<template>
  <div class="table-responsive">
    <table>
      <thead>
        <tr>
          <th style="width: 60px">ID</th>
          <th>Tài khoản</th>
          <th>Tên hiển thị</th>
          <th>Email</th>
          <th style="width: 130px">Ngày tạo</th>
          <th style="width: 120px; text-align: center">Trạng thái</th>
          <th style="width: 160px; text-align: center">Vai trò</th>
          <th style="width: 140px; text-align: center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td class="font-bold">{{ u.id }}</td>
          <td class="font-semibold text-main">{{ u.username }}</td>
          <td>{{ u.displayName || "—" }}</td>
          <td>{{ u.email }}</td>
          <td>{{ formatDate(u.createdAt) }}</td>
          <td style="text-align: center">
            <span class="badge" :class="u.isLocked ? 'badge-locked' : 'badge-active'">
               {{ u.isLocked ? 'Bị khóa' : 'Hoạt động' }}
            </span>
          </td>
          <td style="text-align: center">
            <RoleActionButton
              :role="u.role"
              :username="u.username"
              :updating="updatingId === u.id"
              @toggle="$emit('toggle-role', u)"
            />
          </td>
          <td style="text-align: center">
            <button v-if="u.username !== 'admin'" class="btn-action" :class="u.isLocked ? 'unlock' : 'lock'" @click="$emit('toggle-lock', u)" :disabled="lockingId === u.id">
                {{ u.isLocked ? '🔓 Mở khóa' : '🔒 Khóa lại' }}
            </button>
          </td>
        </tr>

        <tr v-if="users.length === 0">
          <td colspan="8" class="empty-state">
            <div class="empty-icon">👤</div>
            <p>Không tìm thấy tài khoản nào khớp với tìm kiếm hiện tại.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import RoleActionButton from "./RoleActionButton.vue";

defineProps({
  users: { type: Array, required: true },
  updatingId: { type: [Number, String, null], default: null },
  lockingId: { type: [Number, String, null], default: null },
});
defineEmits(["toggle-role", "toggle-lock"]);

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN");
}
</script>

<style scoped>
.table-responsive {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(245, 184, 219, 0.5);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #fff0f6;
  color: #9f1239;
  font-weight: 700;
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid #f5c6dc;
  text-align: left;
}

td {
  padding: 16px;
  border-bottom: 1px solid #fff0f6;
  color: #4c1d32;
  font-size: 14px;
  text-align: left;
  vertical-align: middle;
}

tr:hover td {
  background: #fff9fc;
}

.font-bold {
  font-weight: 700;
}
.font-semibold {
  font-weight: 600;
}
.text-main {
  color: #a21caf;
}

.empty-state {
  text-align: center !important;
  padding: 60px 20px !important;
  color: #933f83;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge-active {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.badge-locked {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-action {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action.unlock {
  background: #f0fdf4;
  color: #16a34a;
}
.btn-action.unlock:hover:not(:disabled) { background: #dcfce7; }

.btn-action.lock {
  background: #fff1f2;
  color: #e11d48;
}
.btn-action.lock:hover:not(:disabled) { background: #ffe4e6; }
</style>
