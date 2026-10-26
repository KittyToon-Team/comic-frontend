<template>
  <div class="chapter-reader-page">
    <ClientHeader />

    <main class="container main-content">
      <div v-if="loading" class="loading">Đang tải nội dung chương...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <template v-else-if="chapter">
        <div class="reader-container">
          <!-- Breadcrumb & Header -->
          <div class="chapter-header">
            <div class="breadcrumb">
              <router-link to="/">Trang chủ</router-link> &raquo;
              <router-link :to="`/story/${chapter.storyId}`">{{ chapter.storyTitle }}</router-link>
            </div>
            <h1 class="chapter-title">Chương {{ chapter.chapterNumber }}<span v-if="chapter.title">: {{ chapter.title }}</span></h1>
          </div>

          <!-- Top Navigation -->
          <div class="nav-buttons top-nav">
            <button class="nav-btn" :disabled="!chapter.prevChapterId" @click="goToChapter(chapter.prevChapterId)">
              <span class="icon">⬅️</span> Chương trước
            </button>
            <button class="nav-btn" :disabled="!chapter.nextChapterId" @click="goToChapter(chapter.nextChapterId)">
              Chương sau <span class="icon">➡️</span>
            </button>
          </div>

          <!-- Lock Banner if No Access -->
          <div v-if="!chapter.hasAccess" class="lock-banner">
            <div class="lock-icon">{{ chapter.accessType === 2 ? '💎' : '🔒' }}</div>
            <h2 class="lock-title">
              {{ chapter.accessType === 2 ? 'Chương truyện trả phí (PAID)' : 'Yêu cầu đăng nhập tài khoản' }}
            </h2>
            <p class="lock-desc">
              {{ chapter.message || (chapter.accessType === 2 ? 'Bạn cần sở hữu chương này để có thể đọc tiếp.' : 'Vui lòng đăng nhập để tiếp tục đọc chương này.') }}
            </p>
            <div class="lock-actions">
              <button v-if="!isLoggedIn" class="btn-login-prompt" @click="router.push('/login')">
                Đăng nhập ngay
              </button>
              <div v-else-if="chapter.accessType === 2" class="paid-notice">
                <span>Hệ thống ví Point và mở khóa chương đang được chuẩn bị ra mắt. Vui lòng quay lại sau!</span>
              </div>
            </div>
          </div>

          <!-- Image Viewer (Only render when hasAccess is true) -->
          <div v-else class="images-container">
            <div v-if="!chapter.images || chapter.images.length === 0" class="empty-images">
              Chương này chưa có ảnh.
            </div>
            <img
                v-for="(img, index) in chapter.images"
                :key="index"
                :src="resolveImageUrl(img)"
                :alt="`Trang ${index + 1}`"
                class="comic-page"
                @error="handleImageError"
            />
          </div>

          <!-- Bottom Navigation -->
          <div class="nav-buttons bottom-nav">
            <button class="nav-btn" :disabled="!chapter.prevChapterId" @click="goToChapter(chapter.prevChapterId)">
              <span class="icon">⬅️</span> Chương trước
            </button>
            <button class="nav-btn" :disabled="!chapter.nextChapterId" @click="goToChapter(chapter.nextChapterId)">
              Chương sau <span class="icon">➡️</span>
            </button>
          </div>
        </div>
      </template>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/axios";
import ClientHeader from "../../components/client/ClientHeader.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";

const props = defineProps({
  id: { type: [String, Number], required: true },
});

const router = useRouter();

const chapter = ref(null);
const loading = ref(true);
const error = ref(null);

const isLoggedIn = computed(() => {
  const raw = localStorage.getItem("currentUser");
  return !!raw;
});

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `http://localhost:8080${url}`;
  return `http://localhost:8080/${url}`;
};

const handleImageError = (e) => {
  console.error('Failed to load image:', e.target.src);
  e.target.style.display = 'none';
};

async function fetchChapter(id) {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get(`/chapters/${id}`);
    chapter.value = res.data;
    
    if (chapter.value.hasAccess) {
      saveReadingHistory(chapter.value.storyId, id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    error.value = e.response?.data?.message || e.response?.data || "Không tìm thấy chương hoặc lỗi kết nối";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function saveReadingHistory(storyId, chapterId) {
  const raw = localStorage.getItem("currentUser");
  const user = raw ? JSON.parse(raw) : null;
  if (!user || !user.token) return; // Only save history if authenticated
  
  try {
    await api.post("/reading-history", {
      storyId: storyId,
      lastChapterId: chapterId
    });
  } catch (error) {
    // Slient fail for reading history logging
  }
}

function goToChapter(id) {
  if (!id) return;
  router.push(`/doc/${id}`);
}

onMounted(() => fetchChapter(props.id));
watch(() => props.id, (newId) => fetchChapter(newId));
</script>

<style scoped>
.chapter-reader-page {
  min-height: 100vh;
  background: #111827; /* Dark background is better for reading comics */
  color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding: 20px 0 60px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading, .error-message, .empty-images {
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
}

.loading {
  color: #fbcfe8;
}

.error-message {
  color: #fda4af;
  background: #881337;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #be123c;
}

.reader-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chapter-header {
  background: #1f2937;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.breadcrumb {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 10px;
}

.breadcrumb a {
  color: #f472b6;
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.chapter-title {
  margin: 0;
  color: #f9fafb;
  font-size: 24px;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.nav-btn {
  flex: 1;
  padding: 14px 20px;
  background: #374151;
  color: #f9a8d4;
  border: 1px solid #4b5563;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.nav-btn:hover:not(:disabled) {
  background: #4b5563;
  border-color: #6b7280;
  transform: translateY(-2px);
}

.nav-btn:disabled {
  background: #1f2937;
  color: #4b5563;
  border-color: #374151;
  cursor: not-allowed;
}

.lock-banner {
  background: #1e1b4b;
  border: 2px dashed #a855f7;
  border-radius: 20px;
  padding: 50px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.lock-icon {
  font-size: 54px;
}

.lock-title {
  margin: 0;
  color: #e9d5ff;
  font-size: 22px;
  font-weight: 700;
}

.lock-desc {
  margin: 0;
  color: #c4b5fd;
  font-size: 15px;
  max-width: 500px;
  line-height: 1.6;
}

.lock-actions {
  margin-top: 12px;
}

.btn-login-prompt {
  background: linear-gradient(135deg, #d946ef 0%, #a855f7 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
  transition: all 0.2s;
}

.btn-login-prompt:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6);
}

.paid-notice {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid #c084fc;
  padding: 12px 20px;
  border-radius: 12px;
  color: #f3e8ff;
  font-size: 14px;
}

.images-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000;
  min-height: 500px;
}

.comic-page {
  width: 100%;
  max-width: 800px;
  display: block;
  object-fit: contain;
  margin: 0;
  padding: 0;
}
</style>
