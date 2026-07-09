<template>
  <main class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-circle">
            {{ getInitial(user.displayName) }}
          </div>
          <div class="user-info">
            <h1>{{ user.displayName || user.username }}</h1>
            <p class="email">{{ user.email }}</p>
            <span class="role-badge">{{ user.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên' }}</span>
          </div>
        </div>
      </div>

      <div class="tabs-container">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          <History class="tab-icon" /> Lịch sử đọc
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'favorites' }"
          @click="activeTab = 'favorites'"
        >
          <Heart class="tab-icon" /> Truyện yêu thích
        </button>
      </div>

      <div class="tab-content">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- History Tab -->
        <div v-else-if="activeTab === 'history'" class="grid-layout">
          <div v-if="history.length === 0" class="empty-state">
            Bạn chưa đọc truyện nào. Hãy khám phá ngay nhé!
          </div>
          <div v-for="item in history" :key="item.id" class="story-card" @click="goToStory(item.story?.id)">
            <div class="cover-wrapper">
              <img v-if="item.story?.coverImageUrl" :src="item.story.coverImageUrl" :alt="item.story?.title" />
              <div v-else class="no-cover">No Pic</div>
            </div>
            <div class="story-info">
              <h3>{{ item.story?.title || 'Truyện không tồn tại' }}</h3>
              <p class="chapter-info" v-if="item.chapter">Đang đọc: Chương {{ item.chapter.chapterNumber }}</p>
              <p class="time-ago">Đọc lúc: {{ formatDate(item.lastReadAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Favorites Tab -->
        <div v-else-if="activeTab === 'favorites'" class="grid-layout">
          <div v-if="favorites.length === 0" class="empty-state">
            Bạn chưa có truyện yêu thích nào.
          </div>
          <div v-for="item in favorites" :key="item.id" class="story-card" @click="goToStory(item.story?.id)">
            <div class="cover-wrapper">
              <img v-if="item.story?.coverImageUrl" :src="item.story.coverImageUrl" :alt="item.story?.title" />
              <div v-else class="no-cover">No Pic</div>
            </div>
            <div class="story-info">
              <h3>{{ item.story?.title || 'Truyện không tồn tại' }}</h3>
              <p class="time-ago">Đã thêm: {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { History, Heart } from 'lucide-vue-next';
import api from '../../api/axios';

const route = useRoute();
const router = useRouter();

const user = ref({});
const activeTab = ref('history');
const history = ref([]);
const favorites = ref([]);
const loading = ref(true);

onMounted(async () => {
  const userId = route.params.id;
  
  // Lấy thông tin user từ localStorage nếu trùng khớp
  const localUser = JSON.parse(localStorage.getItem('currentUser'));
  if (localUser && localUser.id == userId) {
    user.value = localUser;
  } else {
    user.value = { displayName: 'Người dùng ẩn danh', role: 'USER' };
  }

  await fetchData(userId);
});

const fetchData = async (userId) => {
  loading.value = true;
  try {
    const [histRes, favRes] = await Promise.all([
      api.get(`/users/${userId}/reading-history`),
      api.get(`/users/${userId}/favorites`)
    ]);
    history.value = histRes.data || [];
    favorites.value = favRes.data || [];
  } catch (error) {
    console.error("Lỗi tải dữ liệu profile:", error);
  } finally {
    loading.value = false;
  }
};

const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const goToStory = (id) => {
  if (!id) return;
  // Giả sử có route StoryDetail
  // router.push({ name: 'StoryDetail', params: { id } });
  console.log("Go to story", id);
};
</script>

<style scoped>
.profile-page {
  padding: 40px 0;
  background: #fffdfa;
  min-height: 100vh;
}

.profile-header {
  background: linear-gradient(135deg, #fff0f6 0%, #fbcfe8 100%);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.1);
  border: 1px solid #fce7f3;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-circle {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(217, 70, 239, 0.3);
}

.user-info h1 {
  margin: 0 0 4px 0;
  font-size: 28px;
  color: #831843;
  font-weight: 800;
}

.user-info .email {
  margin: 0 0 12px 0;
  color: #9d174d;
  font-size: 15px;
}

.role-badge {
  background: white;
  color: #db2777;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #fbcfe8;
}

.tabs-container {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 2px solid #fdf2f8;
  padding-bottom: 16px;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #9d174d;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #fdf2f8;
}

.tab-btn.active {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.tab-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  stroke-width: 2.5px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.story-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 16px;
  border: 1px solid #fce7f3;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.15);
  border-color: #fbcfe8;
}

.cover-wrapper {
  width: 70px;
  height: 96px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #fdf2f8;
}

.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #f472b6;
}

.story-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.story-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #831843;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chapter-info {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #db2777;
  font-weight: 600;
}

.time-ago {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #9d174d;
  background: #fdf2f8;
  border-radius: 16px;
  font-style: italic;
}

.loading-state {
  text-align: center;
  padding: 60px;
  color: #d946ef;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 24px;
  }
  .avatar-circle {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }
  .user-info h1 {
    font-size: 22px;
  }
  .tabs-container {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  .tab-btn {
    white-space: nowrap;
  }
}
</style>
