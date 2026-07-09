<template>
  <div class="dashboard-header">
    <div class="header-content">
      <h1>📊 Dashboard</h1>
      <p class="subtitle">Chào mừng đến trang quản trị KittyToon</p>
    </div>
    <div class="header-meta">
      <span class="date">{{ currentDate }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const currentDate = ref("");

onMounted(() => {
  const today = new Date();
  currentDate.value = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<style scoped>
.dashboard-header {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  padding: 32px 28px;
  border-radius: 16px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.2);
}

.header-content h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 14px;
  opacity: 0.95;
  font-weight: 500;
}

.header-meta {
  text-align: right;
}

.date {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.9;
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .header-meta {
    text-align: left;
  }
}
</style>
