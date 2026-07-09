<template>
  <div class="page-shell">
    <div class="header-section">
      <div class="title-block">
        <router-link :to="{ name: 'AdminStoryList' }" class="back-link">
          ← Quay lại danh sách truyện
        </router-link>
        <h2>Danh sách chương</h2>
        <p class="subtitle">Quản lý thứ tự chương, lượt xem và quyền truy cập đọc truyện.</p>
      </div>
      <router-link
          :to="{
                 name: 'AdminChapterNew',
                 params: { storyId },
                 query: { nextChapter: chapters.length > 0 ? chapters[0].chapterNumber + 1 : 1 }
               }"
          class="btn-primary"
      >
        + Thêm chương mới
      </router-link>
    </div>

    <div v-if="loading" class="status-message loading">
      <span class="spinner"></span> Đang tải danh sách chương...
    </div>
    <div v-else-if="errorMessage" class="status-message error">
      ⚠️ {{ errorMessage }}
    </div>

    <div v-else class="table-responsive">
      <table>
        <thead>
        <tr>
          <th style="width: 120px">Số chương</th>
          <th>Tiêu đề chương</th>
          <th style="width: 160px">Quyền truy cập</th>
          <th style="width: 140px">Lượt xem</th>
          <th style="width: 180px">Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="c in chapters" :key="c.id">
          <td class="font-bold text-main">Chương {{ c.chapterNumber }}</td>
          <td class="font-semibold">{{ c.title || "(Không có tiêu đề)" }}</td>
          <td>
              <span class="badge" :class="{ 'badge-public': c.accessType === 0, 'badge-private': c.accessType !== 0 }">
                {{ c.accessType === 0 ? "🔓 Public" : "🔒 Cần đăng nhập" }}
              </span>
          </td>
          <td class="view-count">👀 {{ c.viewCount?.toLocaleString() || 0 }}</td>
          <td class="actions">
            <router-link
                :to="{ name: 'AdminChapterEdit', params: { storyId: props.storyId, id: c.id } }"
                class="btn-action edit"
            >
              ✏️ Sửa
            </router-link>
            <button class="btn-action delete" @click="handleDelete(c.id)">
              🗑️ Xóa
            </button>
          </td>
        </tr>
        <tr v-if="chapters.length === 0">
          <td colspan="5" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>Truyện này chưa có chương nào trong hệ thống.</p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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
    errorMessage.value = "Không thể tải được danh sách chương từ máy chủ.";
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm("Xác nhận xóa chương này vĩnh viễn?")) return;
  try {
    await deleteChapter(id);
    fetchChapters();
  } catch (err) {
    alert(err.response?.data?.message || "Đã xảy ra lỗi khi xóa dữ liệu.");
  }
}

onMounted(fetchChapters);
</script>

<style scoped>

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

.title-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.back-link {
  display: inline-block;
  margin-bottom: 8px;
  color: #ec4899;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.2s;
}

.back-link:hover {
  color: #a21caf;
  text-decoration: underline;
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

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge-public {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.badge-private {
  background: #fff1f2;
  color: #e11d48;
  border: 1px solid #fecdd3;
}

.view-count {
  font-weight: 500;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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