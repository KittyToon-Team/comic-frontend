<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-icon">
          <KeyRound class="icon" />
        </div>
        <h2>Đăng nhập</h2>
        <p>Sử dụng email của bạn để đăng nhập vào hệ thống</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label>Email hoặc Tên đăng nhập</label>
          <div class="input-wrapper">
            <User class="input-icon" />
            <input 
              type="text" 
              v-model="email" 
              placeholder="Nhập email hoặc tên đăng nhập..." 
              autocomplete="username"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <div class="input-wrapper">
            <Lock class="input-icon" />
            <input 
              type="password" 
              v-model="password" 
              placeholder="••••••••" 
              autocomplete="current-password"
              required
            />
          </div>
          <div class="forgot-password-link">
            <router-link :to="{ name: 'ForgotPassword' }">Quên mật khẩu?</router-link>
          </div>
        </div>

        <div v-if="message" class="alert" :class="{ error: isError, success: !isError }">
          {{ message }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading || !email || !password">
          {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
        </button>

        <button type="button" class="guest-btn" @click="handleGuestLogin" :disabled="loading">
          <User class="guest-icon" />
          Tiếp tục dưới quyền Khách
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Chưa có tài khoản?
          <router-link :to="{ name: 'Register' }">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Mail, Lock, KeyRound, User } from "lucide-vue-next";
import api from "../../api/axios";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const message = ref("");
const isError = ref(false);

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    isError.value = true;
    message.value = "Vui lòng nhập tài khoản và mật khẩu.";
    return;
  }

  loading.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    if (response.status === 200) {
      const user = response.data;
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (user.role === "ADMIN") {
        message.value = "Đăng nhập Admin thành công! Đang chuyển hướng...";
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        message.value = "Đăng nhập thành công!";
        setTimeout(() => {
          router.push({ name: "UserHome", params: { id: user.id } });
        }, 1000);
      }
    }
  } catch (error) {
    isError.value = true;
    if (error.response?.status === 401 || error.response?.status === 400) {
      message.value = error.response.data?.message || "Sai email hoặc mật khẩu";
    } else {
      message.value = "Không thể kết nối tới máy chủ. Hãy chắc chắn backend đang chạy.";
    }
  } finally {
    loading.value = false;
  }
};

const handleGuestLogin = () => {
  localStorage.removeItem("currentUser");
  router.push({ name: "Home" });
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

.forgot-password-link {
  text-align: right;
  margin-top: 8px;
}

.forgot-password-link a {
  color: #db2777;
  font-size: 13px;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password-link a:hover {
  text-decoration: underline;
}

.alert {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
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
  margin-bottom: 12px;
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

.guest-btn {
  width: 100%;
  padding: 14px;
  background: white;
  color: #db2777;
  border: 2px solid #fbcfe8;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.guest-btn:hover {
  background: #fdf2f8;
  border-color: #f472b6;
}

.guest-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2.5px;
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
