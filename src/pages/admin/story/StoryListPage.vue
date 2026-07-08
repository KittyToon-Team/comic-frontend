<template>
  <div class="page-shell">
    <div class="header-section">
      <div class="title-block">
        <h2>Quản lý Truyện</h2>
        <p class="subtitle">Xem, thêm mới và quản lý danh sách các bộ truyện trong hệ thống.</p>
      </div>
      <router-link :to="{ name: 'AdminStoryNew' }" class="btn-primary">
        + Thêm truyện mới
      </router-link>
    </div>

    <div class="filter-section">
      <label for="search" class="input-label">Tìm kiếm truyện</label>
      <input
          id="search"
          v-model="keyword"
          class="search-input"
          placeholder="Nhập tên truyện cần tìm..."
          @input="onSearch"
      />
    </div>

    <div v-if="loading" class="status-message loading">
      <span class="spinner"></span> Đang tải danh sách truyện...
    </div>
    <div v-else-if="errorMessage" class="status-message error">
      ⚠️ {{ errorMessage }}
    </div>

    <div v-else class="table-responsive">
      <table>
        <thead>
        <tr>
          <th style="width: 60px">ID</th>
          <th style="width: 100px">Ảnh bìa</th>
          <th>Tên truyện</th>
          <th>Thể loại</th>
          <th>Tác giả</th>
          <th style="width: 140px; text-align: center">Trạng thái</th> <th style="width: 220px; text-align: center">Hành động</th>  </tr>
        </thead>
        <tbody>
        <tr v-for="s in stories" :key="s.id">
          <td class="font-bold">{{ s.id }}</td>

          <td>
            <div class="cover-wrapper">
              <img v-if="s.coverImageUrl" :src="s.coverImageUrl" class="cover-thumb" alt="cover" />
              <div v-else class="no-cover">No Pic</div>
            </div>
          </td>

          <td class="font-semibold text-main">{{ s.title }}</td>

          <td>
            <div class="category-badges">
              <span v-for="cat in s.categories" :key="cat.id" class="cat-badge">
                {{ cat.name }}
              </span>
              <span v-if="!s.categories || s.categories.length === 0" class="text-muted">Chưa chọn</span>
            </div>
          </td>

          <td>{{ s.author }}</td>

          <td style="text-align: center">
            <span :class="['badge', s.status === 'Hoàn thành' ? 'badge-done' : 'badge-active']">
              {{ s.status || 'Đang ra' }}
            </span>
          </td>

          <td>
            <div class="actions">
              <router-link :to="{ name: 'AdminStoryEdit', params: { id: s.id } }" class="btn-action edit">
                ✏️ Sửa
              </router-link>

              <router-link :to="{ name: 'AdminChapterList', params: { storyId: s.id } }" class="btn-action chapter">
                📚 Chương
              </router-link>

              <button class="btn-action delete" @click="handleDelete(s.id)">
                🗑️ Xóa
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="stories.length === 0">
          <td colspan="7" class="empty-state">
            <div class="empty-icon">📚</div>
            <p>Chưa có bộ truyện nào khớp với tìm kiếm hiện tại.</p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getStories, deleteStory } from "../../../api/storyApi";

const stories = ref([]);
const keyword = ref("");
const loading = ref(false);
const errorMessage = ref("");
let debounceTimer = null;

async function fetchStories() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const res = await getStories(keyword.value);
    stories.value = res.data;
  } catch (err) {
    errorMessage.value =
        err.response?.data?.message || "Không thể tải được danh sách truyện từ hệ thống.";
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchStories, 300);
}

async function handleDelete(id) {
  if (!confirm("Xác nhận xóa truyện này? Toàn bộ chương liên quan cũng sẽ bị xóa vĩnh viễn.")) return;
  try {
    await deleteStory(id);
    fetchStories();
  } catch (err) {
    alert(err.response?.data?.message || "Đã xảy ra lỗi khi xóa dữ liệu.");
  }
}

onMounted(fetchStories);
</script>

<style scoped>
.category-badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.cat-badge {
  background: #fdf2f8;
  color: #db2777;
  border: 1px solid #fbcfe8;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}
.text-muted {
  color: #94a3b8;
  font-size: 12px;
  font-style: italic;
}

.page-shell {
  padding: 32px;
  background: #fffdfa;
  min-height: 100%;
  text-align: left;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  border-bottom: 2px dashed #fcd3e7;
  padding-bottom: 20px;
}

.title-block h2 {
  margin: 0;
  color: #a21caf;
  font-size: 28px;
  font-weight: 700;
}

.title-block .subtitle {
  margin: 6px 0 0 0;
  color: #933f83;
  font-size: 14px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 8px;
}

.input-label {
  font-weight: 700;
  color: #9f1239;
  font-size: 14px;
}

.search-input {
  width: 100%;
  max-width: 380px;
  padding: 12px 16px;
  border: 1px solid #f5c6dc;
  border-radius: 12px;
  background: #fff5fb;
  font-size: 14px;
  color: #33121f;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #d946ef;
  box-shadow: 0 0 0 3px rgba(233, 65, 166, 0.15);
  background: #ffffff;
}

.btn-primary {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.2);
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.table-responsive {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(245, 184, 219, 0.5);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #fff0f6;
  color: #9f1239;
  font-weight: 700;
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid #f5c6dc;
  text-align: left;
}

td {
  padding: 16px;
  border-bottom: 1px solid #fff0f6;
  color: #4c1d32;
  font-size: 14px;
  text-align: left;
  vertical-align: middle;
}

tr:hover td {
  background: #fff9fc;
}

.cover-wrapper {
  width: 50px;
  height: 68px;
  background: #fff0f6;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f5c6dc;
}

.cover-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-cover {
  font-size: 10px;
  color: #f472b6;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge-active {
  background: #fff1f2;
  color: #db2777;
  border: 1px solid #fbcfe8;
}
.badge-done {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.btn-action {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-action.edit {
  background: #fff1f2;
  color: #e11d48;
}
.btn-action.edit:hover { background: #ffe4e6; }

.btn-action.chapter {
  background: #f3e8ff;
  color: #a855f7;
}
.btn-action.chapter:hover { background: #e9d5ff; }

.btn-action.delete {
  background: #fef2f2;
  color: #dc2626;
}
.btn-action.delete:hover { background: #fee2e2; }

.empty-state {
  text-align: center !important;
  padding: 60px 20px !important;
  color: #933f83;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.text-main { color: #a21caf; }

.status-message {
  padding: 20px;
  border-radius: 12px;
  font-size: 14px;
}
.status-message.error {
  background: #fef2f2;
  color: #b91c1c;
}
.status-message.loading {
  color: #db2777;
}
</style>