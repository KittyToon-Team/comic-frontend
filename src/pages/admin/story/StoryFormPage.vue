<template>
  <div class="page-shell">
    <div class="header-section">
      <router-link :to="{ name: 'AdminStoryList' }" class="back-link">
        ← Quay lại danh sách truyện
      </router-link>
      <h2>{{ isEdit ? "✏️ Chỉnh sửa truyện" : "✨ Thêm bộ truyện mới" }}</h2>
    </div>

    <div v-if="loading" class="status-message loading">
      <span class="spinner"></span> Đang tải thông tin truyện...
    </div>

    <form v-else class="story-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Tên bộ truyện <span class="required">*</span></label>
        <input
            id="title"
            v-model="form.title"
            placeholder="Nhập tên truyện..."
            required
        />
      </div>

      <div class="form-group">
        <label for="author">Tác giả</label>
        <input
            id="author"
            v-model="form.author"
            placeholder="Tên tác giả hoặc nhóm dịch..."
        />
      </div>

      <div class="form-group">
        <label for="description">Mô tả chi tiết truyện</label>
        <textarea
            id="description"
            v-model="form.description"
            rows="5"
            placeholder="Viết tóm tắt nội dung câu chuyện tại đây..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="cover">Đường dẫn ảnh bìa (URL)</label>
        <div class="upload-wrapper">
          <input type="file" accept="image/*" @change="handleCoverUpload" ref="coverFileInput" style="display: none;" />
          <button type="button" class="btn-upload" @click="$refs.coverFileInput.click()" :disabled="uploadingCover">
            {{ uploadingCover ? 'Đang tải lên...' : 'Tải ảnh lên từ máy' }}
          </button>
          <input
              id="cover"
              v-model="form.coverImageUrl"
              placeholder="Hoặc nhập URL ảnh..."
          />
        </div>

        <div v-if="form.coverImageUrl" class="preview-box">
          <p class="preview-label">Xem trước ảnh bìa:</p>
          <img :src="resolveImageUrl(form.coverImageUrl)" class="preview-img" alt="preview" />
        </div>
      </div>

      <div class="form-group">
        <label>Chọn thể loại truyện</label>
        <span class="label-desc">Tích chọn một hoặc nhiều thể loại phù hợp với nội dung truyện.</span>

        <div class="categories-checkbox-group">
          <label v-for="cat in availableCategories" :key="cat.id" class="checkbox-item">
            <input
                type="checkbox"
                :value="cat.id"
                v-model="form.categoryIds"
            />
            <span class="checkbox-text">{{ cat.name }}</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="status">Trạng thái phát hành</label>
        <select id="status" v-model="form.status">
          <option value="Đang ra">📖 Đang ra</option>
          <option value="Hoàn thành">✅ Hoàn thành</option>
          <option value="Tạm ngưng">⏳ Tạm ngưng</option>
        </select>
      </div>

      <div v-if="errorMessage" class="status-message error">
        ⚠️ {{ errorMessage }}
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? "Đang xử lý..." : isEdit ? "Cập nhật dữ liệu" : "Tạo truyện mới" }}
        </button>
        <router-link :to="{ name: 'AdminStoryList' }" class="btn-cancel">
          Hủy bỏ
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getStory, createStory, updateStory, getCategories} from "../../../api/storyApi";
import { uploadSingleFile } from "../../../api/uploadApi";

const props = defineProps({
  id: { type: [String, Number], default: null },
});

const router = useRouter();
const isEdit = computed(() => !!props.id);

const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const uploadingCover = ref(false);

const availableCategories = ref([]);

const form = reactive({
  title: "",
  author: "",
  description: "",
  coverImageUrl: "",
  status: "Đang ra",
  categoryIds: []
});

onMounted(async () => {
  try {
    const catRes = await getCategories();
    availableCategories.value = catRes.data;
  } catch(err) {
    console.error("Không tải được danh mục");
  }

  if (isEdit.value) {
    loading.value = true;
    try {
      const res = await getStory(props.id);
      Object.assign(form, res.data);
      if(res.data.categories) {
        form.categoryIds = res.data.categories.map(c => c.id);
      }
    } catch (err) {
      errorMessage.value = "Không thể lấy dữ liệu bộ truyện này từ hệ thống.";
    } finally {
      loading.value = false;
    }
  }
});

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";
  try {
    if (isEdit.value) {
      await updateStory(props.id, form);
    } else {
      await createStory(form);
    }
    router.push({ name: "AdminStoryList" });
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Lưu thông tin thất bại. Vui lòng kiểm tra lại.";
  } finally {
    submitting.value = false;
  }
}

const handleCoverUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  uploadingCover.value = true;
  errorMessage.value = "";
  try {
    const res = await uploadSingleFile(file);
    form.coverImageUrl = res.data.url;
  } catch (error) {
    errorMessage.value = "Lỗi khi tải ảnh lên. Vui lòng thử lại.";
    console.error(error);
  } finally {
    uploadingCover.value = false;
    event.target.value = "";
  }
};

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `http://localhost:8080${url}`;
  return `http://localhost:8080/${url}`;
};
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  gap: 10px;
  width: 100%;
}
.btn-upload {
  padding: 12px 16px;
  background: #fdf2f8;
  color: #db2777;
  border: 1px solid #fbcfe8;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-upload:hover:not(:disabled) {
  background: #fce7f3;
  border-color: #f9a8d4;
}
.btn-upload:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.categories-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: #fff5fb;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f5c6dc;
  width: 100%;
  box-sizing: border-box;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #f5c6dc;
  transition: all 0.2s;
  user-select: none;
}

.checkbox-item:hover {
  border-color: #d946ef;
  background: #fff0f6;
}

.checkbox-item input[type="checkbox"] {
  width: auto !important;
  margin: 0;
  accent-color: #d946ef;
  cursor: pointer;
}

.checkbox-text {
  font-size: 13px;
  font-weight: 600;
  color: #4c1d32;
}

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

.story-form {
  background: #ffffff;
  padding: 28px;
  border-radius: 18px;
  border: 1px solid rgba(245, 184, 219, 0.5);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.03);
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
}

.preview-box {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.preview-label {
  font-size: 13px;
  color: #933f83;
  margin: 0 0 6px 0;
  font-weight: 600;
}

.preview-img {
  width: 110px;
  height: 154px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #f5c6dc;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
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
</style>