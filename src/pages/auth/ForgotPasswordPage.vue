<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-icon">
          <KeyRound class="icon" />
        </div>
        <h2>Quên Mật Khẩu</h2>
        <p>Tính năng đặt lại mật khẩu</p>
      </div>

      <div class="security-notice">
        <div class="notice-icon">🛡️</div>
        <h3>Thông báo bảo mật</h3>
        <p>
          Để đảm bảo an toàn tuyệt đối cho tài khoản độc giả, tính năng đặt lại mật khẩu tự động không cần xác thực email đã được vô hiệu hóa.
        </p>
        <p class="sub-notice">
          Nếu bạn quên mật khẩu, vui lòng liên hệ trực tiếp với Ban Quản Trị qua email <strong>support@kittytoon.com</strong> để được hỗ trợ xác minh danh tính và khôi phục tài khoản.
        </p>
      </div>

      <div class="auth-footer">
        <p>
          Đã nhớ lại mật khẩu?
          <router-link :to="{ name: 'Login' }">Quay lại Đăng nhập</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { KeyRound } from "lucide-vue-next";
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff0f6 0%, #fbcfe8 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  width: 100%;
  max-width: 460px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(236, 72, 153, 0.1);
  padding: 40px;
  border: 1px solid #fce7f3;
  text-align: center;
}

.auth-header {
  margin-bottom: 24px;
}

.brand-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 16px rgba(236, 72, 153, 0.2);
}

.icon {
  width: 32px;
  height: 32px;
  color: white;
  stroke-width: 2.5px;
}

.auth-header h2 {
  color: #831843;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px;
}

.auth-header p {
  color: #9d174d;
  font-size: 15px;
  margin: 0;
}

.security-notice {
  background: #fff0f6;
  border: 1px solid #fbcfe8;
  border-radius: 16px;
  padding: 24px 20px;
  margin-bottom: 24px;
}

.notice-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.security-notice h3 {
  color: #9d174d;
  margin: 0 0 8px;
  font-size: 18px;
}

.security-notice p {
  color: #4c1d32;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px;
}

.sub-notice {
  font-size: 13px !important;
  color: #701a75 !important;
  border-top: 1px dashed #f5c6dc;
  padding-top: 12px;
  margin-bottom: 0 !important;
}

.auth-footer {
  margin-top: 24px;
}

.auth-footer p {
  color: #9d174d;
  font-size: 15px;
  margin: 0;
}

.auth-footer a {
  color: #d946ef;
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
