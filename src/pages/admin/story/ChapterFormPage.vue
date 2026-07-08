<template>
  <div class="page-shell">
    <!-- Tiêu đề và nút quay lại căn trái hoàn toàn -->
    <div class="header-section">
      <router-link
          v-if="form.storyId"
          :to="{ name: 'AdminChapterList', params: { storyId: form.storyId } }"
          class="back-link"
      >
        ← Quay lại danh sách chương
      </router-link>
      <h2>{{ isEdit ? "✏️ Chỉnh sửa chương" : "✨ Thêm chương truyện mới" }}</h2>
    </div>

    <!-- Trạng thái đang tải dữ liệu cũ (chế độ Sửa) -->
    <div v-if="loading" class="status-message loading">
      <span class="spinner"></span> Đang tải thông tin chương truyện...
    </div>

    <!-- Form nhập liệu phong cách Hồng - Trắng căn trái tuyệt đối -->
    <form v-else class="chapter-form" @submit.prevent="handleSubmit">

      <div class="form-row">
        <div class="form-group">
          <label for="chapterNumber">Số chương <span class="required">*</span></label>
          <input
              id="chapterNumber"
              v-model.number="form.chapterNumber"
              type="number"
              step="0.1"
              required
          />
        </div>

        <div class="form-group">
          <label for="accessType">Quyền truy cập đọc</label>
          <select id="accessType" v-model.number="form.accessType">
            <option :value="0">🔓 Public (Miễn phí)</option>
            <option :value="1">🔒 Cần đăng nhập tài khoản</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="title">Tiêu đề chương</label>
        <input
            id="title"
            v-model="form.title"
            placeholder="VD: Khởi đầu mới, Cuộc chạm trán bất ngờ..."
        />
      </div>

      <div class="form-group">
        <label for="images">Danh sách ảnh nội dung <span class="required">*</span></label>
        <span class="label-desc">Mỗi dòng ứng với 1 đường dẫn URL ảnh, sắp xếp đúng theo thứ tự từ trên xuống dưới.</span>
        <textarea
            id="images"
            v-model="imageUrlsText"
            rows="12"
            placeholder="https://example.com/page1.jpg&#10;https://example.com/page2.jpg"
        ></textarea>

        <!-- Nhãn đếm số lượng ảnh thiết kế nổi bật -->
        <div class="hint-badge">
          📸 Hệ thống ghi nhận: <strong class="text-main">{{ imageCount }}</strong> ảnh minh họa.
        </div>
      </div>

      <!-- Khối hiển thị lỗi hệ thống -->
      <div v-if="errorMessage" class="status-message error">
        ⚠️ {{ errorMessage }}
      </div>

      <!-- Cụm nút bấm lưu dữ liệu căn trái -->
      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? "Đang xử lý..." : isEdit ? "Cập nhật dữ liệu" : "Tạo chương mới" }}
        </button>
        <router-link
            v-if="form.storyId"
            :to="{ name: 'AdminChapterList', params: { storyId: form.storyId } }"
            class="btn-cancel"
        >
          Hủy bỏ
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getChapter, createChapter, updateChapter } from "../../../api/chapterApi";

const props = defineProps({
  id: { type: [String, Number], default: null },
  storyId: { type: [String, Number], default: null },
});

const router = useRouter();
const isEdit = computed(() => !!props.id);

const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const imageUrlsText = ref("");

const form = reactive({
  storyId: props.storyId ? Number(props.storyId) : null,
  chapterNumber: 1,
  title: "",
  accessType: 0,
});

const imageCount = computed(
    () => imageUrlsText.value.split("\n").map((s) => s.trim()).filter(Boolean).length
);

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true;
    try {
      const res = await getChapter(props.id);
      const data = res.data;
      form.storyId = data.story?.id ?? form.storyId;
      form.chapterNumber = data.chapterNumber;
      form.title = data.title;
      form.accessType = data.accessType;
      imageUrlsText.value = (data.images || [])
          .map((img) => img.imageUrl)
          .join("\n");
    } catch (err) {
      errorMessage.value = "Không thể tải được thông tin chương truyện này.";
    } finally {
      loading.value = false;
    }
  }
});

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";
  const payload = {
    ...form,
    imageUrls: imageUrlsText.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
  };

  try {
    if (isEdit.value) {
      await updateChapter(props.id, payload);
    } else {
      await createChapter(payload);
    }
    router.push({ name: "AdminChapterList", params: { storyId: form.storyId } });
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Lưu dữ liệu chương thất bại.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>

.page-shell {
  padding: 32px;
  background: #fffdfa;
  min-height: 100%;
  max-width: 720px;
  text-align: left;
}

.header-section {
  margin-bottom: 24px;
  border-bottom: 2px dashed #fcd3e7;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.back-link {
  color: #ec4899;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.back-link:hover {
  color: #a21caf;
  text-decoration: underline;
}

.header-section h2 {
  margin: 0;
  color: #a21caf;
  font-size: 26px;
  font-weight: 700;
}

.chapter-form {
  background: #ffffff;
  padding: 28px;
  border-radius: 18px;
  border: 1px solid rgba(245, 184, 219, 0.5);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.03);
}

.form-row {
  display: flex;
  gap: 20px;
  width: 100%;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.form-group label {
  font-weight: 700;
  color: #9f1239;
  font-size: 14px;
  margin-bottom: 8px;
}

.label-desc {
  font-size: 12px;
  color: #933f83;
  margin-bottom: 8px;
  text-align: left;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #f5c6dc;
  border-radius: 12px;
  background: #fff5fb;
  font-size: 14px;
  color: #33121f;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #d946ef;
  box-shadow: 0 0 0 3px rgba(233, 65, 166, 0.12);
  background: #ffffff;
}

.form-group textarea {
  resize: vertical;
  line-height: 1.6;
}

.hint-badge {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #4c1d32;
  background: #fff0f6;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ffd6e6;
  display: inline-block;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  justify-content: flex-start;
}

.btn-submit {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  padding: 12px 28px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.2);
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-submit:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 12px 24px;
  color: #933f83;
  text-decoration: none;
  background: #fff1f2;
  border: 1px solid #fbcfe8;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #ffe4e6;
  color: #b91c1c;
}

.status-message {
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  margin-top: 16px;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}

.status-message.error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}

.status-message.loading {
  color: #db2777;
  font-weight: 600;
}

.text-main {
  color: #d946ef;
}
</style>