<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand-block">
        <img :src="logoUrl" alt="Logo" class="logo" />
      </div>

      <h1>Đăng nhập</h1>
      <p class="info">Sử dụng email của bạn để đăng nhập vào hệ thống.</p>

      <form class="login-form" @submit.prevent="handleSubmit">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="email@example.com"
          autocomplete="email"
          required
        />

        <label for="password">Mật khẩu</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          required
        />

        <button type="submit" :disabled="loading || !email || !password">
          {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
        </button>
      </form>

      <p
        v-if="message"
        class="feedback"
        :class="{ error: isError, success: !isError }"
      >
        {{ message }}
      </p>

      <div class="helper-links">
        <a href="#">Quên mật khẩu?</a>
        <a href="#">Đăng ký</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import logoUrl from "../../images/Logo.png";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const message = ref("");
const isError = ref(false);

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    isError.value = true;
    message.value = "Vui lòng nhập email và mật khẩu.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    isError.value = true;
    message.value = "Vui lòng nhập địa chỉ email hợp lệ.";
    return;
  }

  loading.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await axios.post("http://localhost:8080/api/login", {
      email: email.value,
      password: password.value,
    });

    if (response.status === 200) {
      const user = response.data;
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push({ name: "Home" });
    }
  } catch (error) {
    isError.value = true;
    if (error.response?.status === 401) {
      message.value = error.response.data || "Sai email hoặc mật khẩu";
    } else {
      message.value =
        "Không thể kết nối tới máy chủ. Hãy chắc chắn backend đang chạy.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(255, 215, 230, 0.4), transparent 35%),
    linear-gradient(180deg, #fff7fb 0%, #ffe6f0 100%);
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 36px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 60px rgba(236, 72, 153, 0.14);
  border: 1px solid rgba(245, 184, 219, 0.75);
}

.brand-block {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  width: 88px;
  height: 88px;
  object-fit: contain;
  border-radius: 24px;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  padding: 14px;
}

h1 {
  margin: 0;
  color: #a21caf;
  font-size: 30px;
  text-align: center;
}

.info {
  margin: 10px 0 0;
  color: #933f83;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 24px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
  color: #9f1239;
  font-size: 0.95rem;
}

input {
  padding: 14px 16px;
  border: 1px solid #f5c6dc;
  border-radius: 14px;
  background: #fff5fb;
  font-size: 15px;
  color: #33121f;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input:focus {
  border-color: #d946ef;
  box-shadow: 0 0 0 3px rgba(233, 65, 166, 0.18);
}

button {
  margin-top: 8px;
  padding: 14px 16px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.95;
}

button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.feedback {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
}

.feedback.success {
  background: #fdf2f8;
  color: #be185d;
}

.feedback.error {
  background: #fef2f2;
  color: #b91c1c;
}

.helper-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 18px;
  font-size: 14px;
}

.helper-links a {
  color: #ec4899;
  text-decoration: none;
}

.helper-links a:hover {
  text-decoration: underline;
}
</style>
