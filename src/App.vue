<template>
  <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
    <h1>Trang Chủ Web Truyện</h1>
    
    <h2 style="color: green;">{{ message }}</h2>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Biến lưu trữ dữ liệu trả về từ backend
const message = ref('Đang kết nối đến server...')

// Hàm này sẽ tự động chạy ngay khi trang web load xong
onMounted(async () => {
  try {
    // Gọi sang port 8080 của Spring Boot
    const response = await axios.get('http://localhost:8080/api/test')
    // Gán dữ liệu nhận được vào biến message
    message.value = response.data
  } catch (error) {
    message.value = "Lỗi kết nối! Hãy kiểm tra lại Backend."
    console.error(error)
  }
})
</script>