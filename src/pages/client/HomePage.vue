<template>
  <div class="home-page">
    <ClientHeader />

    <main class="container main-content">
      <section class="notice-bar">
        <span>💗</span>
        <p>
          KittyToon - Nơi đọc truyện tranh online với hàng ngàn đầu truyện hấp dẫn.
        </p>
      </section>

      <section class="quick-categories">
        <button 
          v-for="category in categories" 
          :key="category.id" 
          type="button"
          :class="{ active: route.query.category == category.id }"
          @click="filterByCategory(category.id)"
        >
          {{ category.name }}
        </button>
        <button v-if="route.query.category" type="button" class="clear-btn" @click="filterByCategory(null)">Xóa lọc</button>
      </section>

      <section class="layout-grid">
        <div class="content-left">
          <div class="section-title">
            <h2>{{ sectionTitle }}</h2>
            <span>{{ displayedStories.length }} truyện</span>
          </div>

          <div class="story-list">
            <div v-if="loading" class="loading">Đang tải dữ liệu...</div>
            <article
              v-else
              v-for="story in displayedStories"
              :key="story.id"
              class="story-row"
            >
              <div class="story-cover">
                <img v-if="story.coverImageUrl" :src="resolveImageUrl(story.coverImageUrl)" :alt="story.title" class="cover-img"/>
                <span v-else>📖</span>
              </div>

              <div class="story-info">
                <h3>{{ story.title }}</h3>
                <p>{{ story.categories?.map(c => c.name).join(', ') || 'Chưa phân loại' }}</p>
                <div class="story-meta">
                  <span>{{ story.viewCount || 0 }} lượt xem</span>
                  <span class="story-id">ID: {{ story.id }}</span>
                </div>
              </div>

              <button type="button" class="chapter-btn" @click="goToStoryDetail(story.id)">
                Đọc ngay
              </button>
            </article>
            <div v-if="!loading && displayedStories.length === 0" class="empty-state">
              Không tìm thấy truyện nào phù hợp.
            </div>
          </div>
        </div>

        <aside class="sidebar">
          <div class="side-card user-card" v-if="!currentUser">
            <img :src="logoUrl" alt="KittyToon" />
            <h3>Tủ truyện của bạn</h3>
            <p>
              Đăng nhập để lưu lịch sử đọc, truyện theo dõi và nhận thông báo chương mới.
            </p>
            <button type="button" @click="goToLogin">Vào tủ truyện</button>
          </div>

          <div class="side-card ranking-card">
            <div class="side-heading">
              <h3>Truyện hot</h3>
              <span>Top ngày</span>
            </div>
            <div v-if="loading" class="loading-sm">Đang tải...</div>
            <ol v-else>
              <li v-for="(story, index) in hotStories" :key="story.id">
                <strong>{{ index + 1 }}</strong>
                <div>
                  <span>{{ story.title }}</span>
                  <small>{{ story.viewCount || 0 }} lượt xem</small>
                </div>
              </li>
            </ol>
          </div>

          <div class="side-card genre-card">
            <div class="side-heading">
              <h3>Thể loại</h3>
              <span>Tất cả</span>
            </div>
            <div class="genre-list">
              <a href="#" v-for="category in categories" :key="category.id" @click.prevent="filterByCategory(category.id)">
                {{ category.name }}
              </a>
            </div>
          </div>
        </aside>
      </section>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../api/axios";
import ClientHeader from "../../components/client/ClientHeader.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";
import logoUrl from "../../images/Logo.png";

const router = useRouter();
const route = useRoute();

const categories = ref([]);
const allStories = ref([]);
const loading = ref(true);
const currentUser = ref(null);

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `http://localhost:8080${url}`;
  return `http://localhost:8080/${url}`;
};

onMounted(async () => {
  const raw = localStorage.getItem("currentUser");
  if (raw) {
    currentUser.value = JSON.parse(raw);
  }

  try {
    const [storiesRes, catsRes] = await Promise.all([
      api.get("/stories"),
      api.get("/categories")
    ]);
    allStories.value = storiesRes.data || [];
    categories.value = catsRes.data || [];
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  } finally {
    loading.value = false;
  }
});

const displayedStories = computed(() => {
  let result = [...allStories.value];
  const search = route.query.search;
  const categoryId = route.query.category;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => 
      (s.title && s.title.toLowerCase().includes(q)) || 
      (s.author && s.author.toLowerCase().includes(q))
    );
  }

  if (categoryId) {
    result = result.filter(s => s.categories && s.categories.some(c => c.id == categoryId));
  }

  return result.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
    return timeB - timeA;
  }).slice(0, 20); // Show max 20 results for now
});

const sectionTitle = computed(() => {
  if (route.query.search) return `Kết quả tìm kiếm cho: "${route.query.search}"`;
  if (route.query.category) {
    const cat = categories.value.find(c => c.id == route.query.category);
    if (cat) return `Thể loại: ${cat.name}`;
  }
  return "Truyện mới cập nhật";
});

const hotStories = computed(() => {
  return [...allStories.value].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
});

const filterByCategory = (categoryId) => {
  if (categoryId) {
    router.push({ name: 'Home', query: { category: categoryId } });
  } else {
    router.push({ name: 'Home' });
  }
};

const goToLogin = () => {
  router.push("/login");
};

const goToStoryDetail = (id) => {
  router.push(`/story/${id}`);
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 215, 230, 0.35), transparent 32%),
    linear-gradient(180deg, #fff7fb 0%, #fff 42%, #fff7fb 100%);
  color: #27111c;
  display: flex;
  flex-direction: column;
}

.home-page > :deep(.site-footer) {
  margin-top: auto;
}

.main-content {
  padding: 24px 0 54px;
}

.notice-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px 18px;
  border: 1px solid #f5c6dc;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 34px rgba(236, 72, 153, 0.08);
}

.notice-bar p {
  margin: 0;
  color: #7c2d63;
  font-size: 14px;
}

.quick-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
}

.quick-categories button {
  padding: 9px 14px;
  border: 1px solid #f5c6dc;
  border-radius: 999px;
  background: #fff;
  color: #9f1239;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.quick-categories button:hover {
  background: #fdf2f8;
}

.quick-categories button.active {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  border-color: #d946ef;
}

.quick-categories button.clear-btn {
  background: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 24px;
}

.content-left,
.side-card {
  border: 1px solid rgba(245, 184, 219, 0.78);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 44px rgba(236, 72, 153, 0.1);
}

.content-left {
  padding: 18px;
}

.section-title,
.side-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f8d9e9;
}

.section-title h2,
.side-heading h3 {
  margin: 0;
  color: #a21caf;
  font-size: 22px;
}

.section-title span,
.side-heading span {
  color: #933f83;
  font-size: 13px;
}

.story-list {
  display: flex;
  flex-direction: column;
}

.loading, .empty-state, .loading-sm {
  padding: 20px;
  text-align: center;
  color: #933f83;
}

.story-row {
  display: grid;
  grid-template-columns: 74px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f8d9e9;
}

.story-row:last-child {
  border-bottom: 0;
}

.story-cover {
  display: grid;
  place-items: center;
  width: 74px;
  height: 96px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  border: 1px solid #f5c6dc;
  font-size: 32px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-info h3 {
  margin: 0 0 6px;
  color: #33121f;
  font-size: 17px;
}

.story-info p {
  margin: 0 0 10px;
  color: #933f83;
  font-size: 14px;
}

.story-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #8f516f;
  font-size: 13px;
  align-items: center;
}

.story-id {
  font-weight: bold;
  color: #db2777;
  background: #fdf2f8;
  padding: 2px 6px;
  border-radius: 4px;
}

.chapter-btn {
  padding: 10px 14px;
  border-radius: 12px;
  color: #be185d;
  background: #fdf2f8;
  border: 1px solid #f5c6dc;
  white-space: nowrap;
  border: 0;
  cursor: pointer;
  font-weight: 700;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-card {
  padding: 18px;
}

.user-card {
  text-align: center;
}

.user-card img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 20px;
  padding: 10px;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  border: 1px solid #f5c6dc;
}

.user-card h3 {
  margin: 12px 0 8px;
  color: #a21caf;
}

.user-card p {
  margin: 0 0 14px;
  color: #7c2d63;
  line-height: 1.55;
  font-size: 14px;
}

.user-card button {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  border: 0;
  cursor: pointer;
  font-weight: 700;
}

.ranking-card ol {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
}

.ranking-card li {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #f8d9e9;
}

.ranking-card li:last-child {
  border-bottom: 0;
}

.ranking-card li > strong {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  background: #ff7f1a;
  font-size: 13px;
}

.ranking-card span {
  display: block;
  color: #33121f;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ranking-card small {
  color: #8f516f;
}

.genre-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  margin-top: 14px;
}

.genre-list a {
  color: #be185d;
  text-decoration: none;
  font-size: 14px;
}

.genre-list a:hover {
  text-decoration: underline;
}

@media (max-width: 920px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .story-row {
    grid-template-columns: 60px 1fr;
  }

  .story-cover {
    width: 60px;
    height: 78px;
    font-size: 26px;
  }

  .chapter-btn {
    grid-column: 2;
    justify-self: flex-start;
  }
}
</style>
