<template>
  <div class="page-shell">
    <div class="header">
      <div>
        <router-link :to="{ name: 'AdminStoryList' }" class="back-link">
          ← Quay lại danh sách truyện
        </router-link>
        <h2>Danh sách chương</h2>
      </div>
      <router-link
        :to="{ name: 'AdminChapterNew', params: { storyId } }"
        class="btn-primary"
      >
        + Thêm chương
      </router-link>
    </div>

    <p v-if="loading">Đang tải...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <table v-else>
      <thead>
        <tr>
          <th>Số chương</th>
          <th>Tiêu đề</th>
          <th>Quyền truy cập</th>
          <th>Lượt xem</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in chapters" :key="c.id">
          <td>{{ c.chapterNumber }}</td>
          <td>{{ c.title }}</td>
          <td>{{ c.accessType === 0 ? "Public" : "Cần đăng nhập" }}</td>
          <td>{{ c.viewCount }}</td>
          <td class="actions">
            <router-link :to="{ name: 'AdminChapterEdit', params: { id: c.id } }">
              Sửa
            </router-link>
            <button class="link-btn danger" @click="handleDelete(c.id)">
              Xóa
            </button>
          </td>
        </tr>
        <tr v-if="chapters.length === 0">
          <td colspan="5" class="empty">Truyện này chưa có chương nào.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getChaptersByStory, deleteChapter } from "../../../api/chapterApi";

const props = defineProps({
  storyId: { type: [String, Number], required: true },
});

const chapters = ref([]);
const loading = ref(false);
const errorMessage = ref("");

async function fetchChapters() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const res = await getChaptersByStory(props.storyId);
    chapters.value = res.data;
  } catch (err) {
    errorMessage.value = "Không tải được danh sách chương.";
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm("Xóa chương này?")) return;
  try {
    await deleteChapter(id);
    fetchChapters();
  } catch (err) {
    alert(err.response?.data?.message || "Xóa thất bại.");
  }
}

onMounted(fetchChapters);
</script>

<style scoped>
.page-shell {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}

.back-link {
  display: inline-block;
  margin-bottom: 6px;
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
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
  height: fit-content;
}

.error {
  color: #dc2626;
}

.empty {
  text-align: center;
  color: #64748b;
}
</style>
