<template>
  <div class="filter-page-wrapper">
    <ClientHeader />

    <main class="filter-page">
      <div class="container">
        
        <div class="filter-header">
          <h2>Danh sách truyện</h2>
          
          <div class="filter-controls">
            <div class="control-group">
              <label for="categoryFilter">Thể loại:</label>
              <select id="categoryFilter" v-model="selectedCategory" @change="updateRoute">
                <option value="">Tất cả thể loại</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="control-group">
              <label for="sortFilter">Sắp xếp theo:</label>
              <select id="sortFilter" v-model="selectedSort" @change="updateRoute">
                <option value="new">Mới cập nhật</option>
                <option value="hot">Xem nhiều nhất</option>
                <option value="az">Tên A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="displayedStories.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>Không tìm thấy truyện nào phù hợp với bộ lọc hiện tại.</p>
          <button @click="resetFilters" class="btn-reset">Xóa bộ lọc</button>
        </div>

        <div v-else class="grid-layout">
          <div v-for="story in displayedStories" :key="story.id" class="story-card" @click="goToStory(story.id)">
            <div class="cover-wrapper">
              <img v-if="story.coverImageUrl" :src="story.coverImageUrl" :alt="story.title" />
              <div v-else class="no-cover">No Pic</div>
            </div>
            <div class="story-info">
              <h3>{{ story.title }}</h3>
              <div class="category-badges">
                <span v-for="cat in story.categories" :key="cat.id" class="cat-badge">
                  {{ cat.name }}
                </span>
              </div>
              <div class="story-meta">
                <span class="view-count">👀 {{ story.viewCount?.toLocaleString() || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../api/axios';
import ClientHeader from '../../components/client/ClientHeader.vue';
import ClientFooter from '../../components/client/ClientFooter.vue';

const route = useRoute();
const router = useRouter();

const allStories = ref([]);
const categories = ref([]);
const loading = ref(true);

const selectedCategory = ref('');
const selectedSort = ref('new');

const fetchInitialData = async () => {
  loading.value = true;
  try {
    const [storiesRes, catsRes] = await Promise.all([
      api.get('/stories'),
      api.get('/categories')
    ]);
    allStories.value = storiesRes.data || [];
    categories.value = catsRes.data || [];
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
  } finally {
    loading.value = false;
  }
};

const applyRouteQueries = () => {
  if (route.query.cat) {
    selectedCategory.value = Number(route.query.cat);
  } else {
    selectedCategory.value = '';
  }

  if (route.query.sort) {
    selectedSort.value = route.query.sort;
  } else {
    selectedSort.value = 'new';
  }
};

onMounted(async () => {
  applyRouteQueries();
  await fetchInitialData();
});

watch(() => route.query, () => {
  applyRouteQueries();
});

const updateRoute = () => {
  const query = {};
  if (selectedCategory.value) query.cat = selectedCategory.value;
  if (selectedSort.value !== 'new') query.sort = selectedSort.value;
  
  router.push({ name: 'StoryFilter', query });
};

const resetFilters = () => {
  selectedCategory.value = '';
  selectedSort.value = 'new';
  updateRoute();
};

const displayedStories = computed(() => {
  let result = [...allStories.value];

  // Lọc theo thể loại
  if (selectedCategory.value) {
    result = result.filter(s => s.categories && s.categories.some(c => c.id === selectedCategory.value));
  }

  // Sắp xếp
  result.sort((a, b) => {
    if (selectedSort.value === 'hot') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    } else if (selectedSort.value === 'az') {
      return (a.title || '').localeCompare(b.title || '');
    } else {
      // 'new' - mặc định
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
      return timeB - timeA;
    }
  });

  return result;
});

const goToStory = (id) => {
  router.push({ name: 'StoryDetail', params: { id } });
};
</script>

<style scoped>
.filter-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.filter-page {
  flex: 1;
  padding: 40px 0;
  background: #fffdfa;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #fce7f3;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.05);
}

.filter-header h2 {
  margin: 0;
  color: #a21caf;
  font-size: 24px;
  font-weight: 800;
}

.filter-controls {
  display: flex;
  gap: 16px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  font-weight: 600;
  color: #831843;
}

.control-group select {
  padding: 10px 36px 10px 16px;
  border-radius: 12px;
  border: 1px solid #fbcfe8;
  background-color: #fff0f6;
  color: #9d174d;
  font-size: 14px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23db2777' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: all 0.2s;
}

.control-group select:hover {
  background-color: #fce7f3;
  border-color: #f9a8d4;
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
  width: 80px;
  height: 110px;
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
  font-size: 12px;
  color: #f472b6;
}

.story-info {
  display: flex;
  flex-direction: column;
  flex: 1;
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

.category-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.cat-badge {
  background: #fff0f6;
  color: #db2777;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #fce7f3;
}

.story-meta {
  margin-top: auto;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 1px dashed #fbcfe8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #9d174d;
  font-size: 16px;
  margin-bottom: 24px;
}

.btn-reset {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.loading-state {
  text-align: center;
  padding: 60px;
  color: #d946ef;
}

@media (max-width: 768px) {
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .filter-controls {
    width: 100%;
    flex-direction: column;
  }
  .control-group {
    width: 100%;
  }
  .control-group select {
    flex: 1;
  }
}
</style>
