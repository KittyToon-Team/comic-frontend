<template>
  <div class="page-shell">
    <div class="header">
      <h2>Quản lý Truyện</h2>
      <router-link :to="{ name: 'AdminStoryNew' }" class="btn-primary">
        + Thêm truyện
      </router-link>
    </div>

    <input
      v-model="keyword"
      class="search-input"
      placeholder="Tìm theo tên truyện..."
      @input="onSearch"
    />

    <p v-if="loading">Đang tải...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ảnh bìa</th>
          <th>Tên truyện</th>
          <th>Tác giả</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in stories" :key="s.id">
          <td>{{ s.id }}</td>
          <td>
            <img
              v-if="s.coverImageUrl"
              :src="s.coverImageUrl"
              class="cover-thumb"
              alt="cover"
            />
          </td>
          <td>{{ s.title }}</td>
          <td>{{ s.author }}</td>
          <td>{{ s.status }}</td>
          <td class="actions">
            <router-link :to="{ name: 'AdminStoryEdit', params: { id: s.id } }">
              Sửa
            </router-link>
            <router-link
              :to="{ name: 'AdminChapterList', params: { storyId: s.id } }"
            >
              Chương
            </router-link>
            <button class="link-btn danger" @click="handleDelete(s.id)">
              Xóa
            </button>
          </td>
        </tr>
        <tr v-if="stories.length === 0">
          <td colspan="6" class="empty">Chưa có truyện nào.</td>
        </tr>
      </tbody>
    </table>
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
      err.response?.data?.message || "Không tải được danh sách truyện.";
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchStories, 300);
}

async function handleDelete(id) {
  if (!confirm("Xác nhận xóa truyện này? Toàn bộ chương sẽ bị xóa theo.")) return;
  try {
    await deleteStory(id);
    fetchStories();
  } catch (err) {
    alert(err.response?.data?.message || "Xóa thất bại.");
  }
}

onMounted(fetchStories);
</script>

<style scoped>
.page-shell {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  max-width: 320px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th,
td {
  border: 1px solid #e2e8f0;
  padding: 10px;
  text-align: left;
  vertical-align: middle;
}

.cover-thumb {
  width: 48px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions a {
  color: #2563eb;
  text-decoration: none;
}

.link-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.link-btn.danger {
  color: #dc2626;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}

.error {
  color: #dc2626;
}

.empty {
  text-align: center;
  color: #64748b;
}
</style>
