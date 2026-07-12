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

          <!-- Image Viewer -->
          <div class="images-container">
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
import { ref, watch, onMounted } from "vue";
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

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `http://localhost:8080${url}`;
  return `http://localhost:8080/${url}`;
};

const handleImageError = (e) => {
  // If an image fails to load, we can hide it or show a placeholder
  console.error('Failed to load image:', e.target.src);
  e.target.style.display = 'none';
};

async function fetchChapter(id) {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get(`/chapters/${id}`);
    chapter.value = res.data;
    
    saveReadingHistory(chapter.value.storyId, id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    error.value = e.response?.data || "Không tìm thấy chương hoặc lỗi kết nối";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function saveReadingHistory(storyId, chapterId) {
  const raw = localStorage.getItem("currentUser");
  const user = raw ? JSON.parse(raw) : null;
  if (!user) return; // Only save history if user is logged in
  
  try {
    await api.post("/reading-history", {
      userId: user.id,
      storyId: storyId,
      lastChapterId: chapterId
    });
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử đọc:", error);
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