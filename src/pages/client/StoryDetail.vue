<template>
  <div class="story-detail-page">
    <ClientHeader />

    <main class="container main-content">
      <div v-if="loading" class="loading">Đang tải thông tin truyện...</div>
      
      <div v-else-if="!story" class="empty-state">
        Không tìm thấy truyện này.
      </div>

      <div v-else class="detail-container">
        <!-- Story Info Card -->
        <section class="story-info-card">
          <div class="cover-wrapper">
            <img v-if="story.coverImageUrl" :src="resolveImageUrl(story.coverImageUrl)" :alt="story.title" class="cover-img"/>
            <div v-else class="cover-placeholder">📖</div>
          </div>
          
          <div class="info-content">
            <h1 class="story-title">{{ story.title }}</h1>
            
            <div class="meta-row">
              <span class="meta-item"><i class="icon">👁️</i> {{ story.viewCount || 0 }} lượt xem</span>
              <span class="meta-item status-badge" v-if="story.status">{{ story.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang ra' }}</span>
            </div>

            <div class="categories-list">
              <span v-for="category in story.categories" :key="category.id" class="category-tag">
                {{ category.name }}
              </span>
              <span v-if="!story.categories || story.categories.length === 0" class="category-tag">Chưa phân loại</span>
            </div>

            <div class="description-box" v-if="story.description">
              <h3>Giới thiệu</h3>
              <p>{{ story.description }}</p>
            </div>

            <div class="action-buttons">
              <button 
                class="btn-primary read-btn" 
                @click="readFirstChapter" 
                :disabled="chapters.length === 0"
              >
                {{ chapters.length > 0 ? 'Đọc truyện' : 'Chưa có chương' }}
              </button>
              
              <button 
                class="btn-secondary favorite-btn" 
                @click="toggleFavorite"
              >
                <span class="heart-icon">{{ isFavorited ? '💖' : '🤍' }}</span>
                {{ isFavorited ? 'Đã yêu thích' : 'Yêu thích' }}
              </button>
            </div>
          </div>
        </section>

        <!-- Chapter List -->
        <section class="chapter-list-section">
          <div class="section-header">
            <h2>Danh sách chương ({{ chapters.length }})</h2>
          </div>
          
          <div v-if="loadingChapters" class="loading-sm">Đang tải danh sách chương...</div>
          
          <div v-else-if="chapters.length === 0" class="empty-chapters">
            Truyện chưa được cập nhật chương nào.
          </div>
          
          <div v-else class="chapters-grid">
            <button 
              v-for="chapter in chapters" 
              :key="chapter.id" 
              class="chapter-item"
              @click="goToChapter(chapter.id)"
            >
              <span class="chapter-number">Chương {{ chapter.chapterNumber }}</span>
              <span v-if="chapter.title" class="chapter-title">- {{ chapter.title }}</span>
            </button>
          </div>
        </section>
      </div>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api/axios";
import ClientHeader from "../../components/client/ClientHeader.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";

const route = useRoute();
const router = useRouter();
const storyId = route.params.id;

const story = ref(null);
const chapters = ref([]);
const loading = ref(true);
const loadingChapters = ref(true);
const isFavorited = ref(false);

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `http://localhost:8080${url}`;
  return `http://localhost:8080/${url}`;
};

const currentUser = computed(() => {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
});

const loadStoryDetails = async () => {
  try {
    const res = await api.get(`/stories/${storyId}`);
    story.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải thông tin truyện:", error);
  } finally {
    loading.value = false;
  }
};

const loadChapters = async () => {
  try {
    const res = await api.get(`/stories/${storyId}/chapters`);
    chapters.value = res.data || [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách chương:", error);
  } finally {
    loadingChapters.value = false;
  }
};

const checkFavoriteStatus = async () => {
  if (!currentUser.value) return;
  try {
    // We get all favorites for the user and check if this story is in it
    const res = await api.get(`/users/${currentUser.value.id}/favorites`);
    const favorites = res.data || [];
    isFavorited.value = favorites.some(fav => fav.story && fav.story.id === parseInt(storyId));
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
  }
};

onMounted(() => {
  loadStoryDetails();
  loadChapters();
  checkFavoriteStatus();
});

const readFirstChapter = () => {
  if (chapters.value.length > 0) {
    // Đọc chương đầu tiên trong danh sách (thường là chương nhỏ nhất)
    router.push(`/doc/${chapters.value[0].id}`);
  }
};

const goToChapter = (chapterId) => {
  router.push(`/doc/${chapterId}`);
};

const toggleFavorite = async () => {
  if (!currentUser.value) {
    alert("Vui lòng đăng nhập để sử dụng tính năng này!");
    router.push("/login");
    return;
  }

  try {
    await api.post("/favorites", {
      userId: currentUser.value.id,
      storyId: parseInt(storyId)
    });
    isFavorited.value = !isFavorited.value;
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
    alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
  }
};
</script>

<style scoped>
.story-detail-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 215, 230, 0.35), transparent 32%),
    linear-gradient(180deg, #fff7fb 0%, #fff 42%, #fff7fb 100%);
  color: #27111c;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding: 30px 0 60px;
  flex: 1;
}

.loading, .empty-state, .loading-sm {
  text-align: center;
  padding: 40px;
  color: #933f83;
  font-size: 1.1rem;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.story-info-card {
  display: flex;
  gap: 30px;
  padding: 24px;
  border: 1px solid rgba(245, 184, 219, 0.78);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 44px rgba(236, 72, 153, 0.1);
}

.cover-wrapper {
  flex-shrink: 0;
  width: 220px;
  height: 290px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(162, 28, 175, 0.15);
  border: 2px solid #fdf2f8;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cover-wrapper:hover .cover-img {
  transform: scale(1.05);
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  font-size: 64px;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.story-title {
  margin: 0 0 12px;
  color: #86198f;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.3;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  color: #701a75;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-badge {
  background: #fdf4ff;
  color: #c026d3;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid #fae8ff;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.category-tag {
  background: #fdf2f8;
  color: #be185d;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #fce7f3;
}

.description-box {
  background: #faf5f8;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px dashed #f5c6dc;
}

.description-box h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #831843;
}

.description-box p {
  margin: 0;
  color: #4c1d95;
  line-height: 1.6;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(217, 70, 239, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 70, 239, 0.4);
}

.btn-primary:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background: white;
  color: #be185d;
  border: 2px solid #fce7f3;
}

.btn-secondary:hover {
  background: #fdf2f8;
  border-color: #fbcfe8;
}

.heart-icon {
  font-size: 18px;
}

/* Chapter List Styles */
.chapter-list-section {
  padding: 24px;
  border: 1px solid rgba(245, 184, 219, 0.78);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 44px rgba(236, 72, 153, 0.1);
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f8d9e9;
}

.section-header h2 {
  margin: 0;
  color: #86198f;
  font-size: 20px;
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.chapter-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px 16px;
  background: #faf5f8;
  border: 1px solid #fce7f3;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.chapter-item:hover {
  background: #fdf2f8;
  border-color: #f9a8d4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.1);
}

.chapter-number {
  font-weight: 700;
  color: #9d174d;
  font-size: 15px;
}

.chapter-title {
  color: #831843;
  font-size: 13px;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.empty-chapters {
  text-align: center;
  padding: 30px;
  color: #9ca3af;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e7eb;
}

@media (max-width: 768px) {
  .story-info-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .cover-wrapper {
    width: 180px;
    height: 240px;
  }

  .meta-row, .categories-list, .action-buttons {
    justify-content: center;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
