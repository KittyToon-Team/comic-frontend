<template>
  <div class="dashboard">
    <DashboardHeader />
    <DashboardStats />
    <div class="dashboard-content">
      <div class="quick-actions">
        <h3>🚀 Hành Động Nhanh</h3>
        <div class="action-buttons">
          <router-link
            :to="{ name: 'AdminStoryNew' }"
            class="action-btn primary"
          >
            ➕ Thêm Truyện Mới
          </router-link>
          <router-link
            :to="{ name: 'AdminStoryList' }"
            class="action-btn secondary"
          >
            📚 Quản Lý Truyện
          </router-link>
          <router-link
            :to="{ name: 'AdminCategoryList' }"
            class="action-btn secondary"
          >
            🏷️ Quản Lý Thể Loại
          </router-link>
        </div>
      </div>

      <div class="info-box">
        <div class="info-icon">ℹ️</div>
        <div class="info-content">
          <h4>Thông Tin Hữu Ích</h4>
          <p>
            Chào mừng đến dashboard quản trị KittyToon! Bạn có thể quản lý tất
            cả truyện, chương, thể loại và nội dung từ đây. Hãy chọn các mục
            trong menu bên trái để bắt đầu.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DashboardHeader from "../../components/admin/DashboardHeader.vue";
import DashboardStats from "../../components/admin/DashboardStats.vue";
</script>

<style scoped>
.dashboard {
  padding: 32px;
  background: #fffdfa;
  min-height: 100vh;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 28px;
}

.quick-actions,
.info-box {
  background: white;
  border: 1px solid #f5c6dc;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.05);
}

.quick-actions h3,
.info-box h4 {
  margin: 0 0 16px 0;
  color: #a21caf;
  font-size: 16px;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  transition: all 0.2s ease;
  display: block;
}

.action-btn.primary {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.action-btn.primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: #fff5fb;
  color: #a21caf;
  border: 1px solid #fcd3e7;
}

.action-btn.secondary:hover {
  background: #fdf2f8;
  border-color: #d946ef;
}

.info-box {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.info-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 24px;
  }

  .dashboard-content {
    gap: 20px;
  }

  .quick-actions,
  .info-box {
    padding: 20px;
  }
}
</style>
