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
          <th style="width: 220px; text-align: center">Vai trò</th>
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
            <RoleActionButton
              :role="u.role"
              :username="u.username"
              :updating="updatingId === u.id"
              @toggle="$emit('toggle-role', u)"
            />
          </td>
        </tr>

        <tr v-if="users.length === 0">
          <td colspan="6" class="empty-state">
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
});
defineEmits(["toggle-role"]);

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
</style>
