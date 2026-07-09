<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-icon">
          <KeyRound class="icon" />
        </div>
        <h2>Quên Mật Khẩu</h2>
        <p>Nhập email của bạn để thiết lập lại mật khẩu mới</p>
      </div>

      <form @submit.prevent="handleResetPassword" class="auth-form">
        <div class="form-group">
          <label>Email đăng ký</label>
          <div class="input-wrapper">
            <Mail class="input-icon" />
            <input 
              type="email" 
              v-model="email" 
              placeholder="Nhập email của bạn..." 
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Mật khẩu mới</label>
          <div class="input-wrapper">
            <Lock class="input-icon" />
            <input 
              type="password" 
              v-model="newPassword" 
              placeholder="Nhập mật khẩu mới..." 
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Xác nhận mật khẩu</label>
          <div class="input-wrapper">
            <CheckCircle class="input-icon" />
            <input 
              type="password" 
              v-model="confirmPassword" 
              placeholder="Nhập lại mật khẩu mới..." 
              required
            />
          </div>
        </div>

        <div v-if="error" class="alert error">
          {{ error }}
        </div>
        <div v-if="message" class="alert success">
          {{ message }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Nhớ ra mật khẩu rồi?
          <router-link :to="{ name: 'Login' }">Đăng nhập</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { KeyRound, Mail, Lock, CheckCircle } from "lucide-vue-next";
import api from "../../api/axios";

const router = useRouter();

const email = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const message = ref("");

const handleResetPassword = async () => {
  error.value = "";
  message.value = "";

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Mật khẩu xác nhận không khớp!";
    return;
  }

  if (newPassword.value.length < 6) {
    error.value = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    return;
  }

  loading.value = true;
  try {
    const response = await api.post("/forgot-password", {
      email: email.value,
      newPassword: newPassword.value,
    });

    if (response.status === 200) {
      message.value = "Đổi mật khẩu thành công! Tự động chuyển hướng...";
      setTimeout(() => {
        router.push({ name: "Login" });
      }, 2000);
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    error.value = err.response?.data || "Email không tồn tại hoặc có lỗi xảy ra.";
  } finally {
    loading.value = false;
  }
};
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
  max-width: 440px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(236, 72, 153, 0.1);
  padding: 40px;
  border: 1px solid #fce7f3;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #831843;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #f472b6;
  stroke-width: 2.5px;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #fdf2f8;
  border-radius: 12px;
  font-size: 15px;
  color: #831843;
  transition: all 0.3s ease;
  background: #fffbfe;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #f472b6;
  background: white;
  box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.1);
}

.input-wrapper input::placeholder {
  color: #fbcfe8;
}

.alert {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert.error {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #ffe4e6;
}

.alert.success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #dcfce7;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.auth-footer {
  margin-top: 32px;
  text-align: center;
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

@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }
}
</style>
