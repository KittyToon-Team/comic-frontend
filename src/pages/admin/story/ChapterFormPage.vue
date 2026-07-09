<template>
  <div class="page-shell">
    <div class="header-section">
      <router-link
        v-if="currentStoryId"
        :to="{ name: 'AdminChapterList', params: { storyId: currentStoryId } }"
        class="back-link"
      >
        ← Quay lại danh sách chương
      </router-link>
      <h2>
        {{ isEdit ? "✏️ Chỉnh sửa chương" : "✨ Thêm chương truyện mới" }}
      </h2>
    </div>

    <div v-if="loading" class="status-message loading">
      <span class="spinner"></span> Đang tải thông tin chương truyện...
    </div>

    <form v-else class="chapter-form" @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label for="chapterNumber"
            >Số chương <span class="required">*</span></label
          >
          <input
            id="chapterNumber"
            v-model="form.chapterNumber"
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
        <label for="images"
          >Danh sách ảnh nội dung <span class="required">*</span></label
        >
        <span class="label-desc"
          >Chọn các file ảnh từ thiết bị của bạn. Các ảnh sẽ được tải lên theo
          thứ tự bạn chọn.</span
        >

        <div class="file-upload-area">
          <input
            id="images"
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileSelect"
            style="display: none"
          />
          <div class="upload-button-wrapper" @click="$refs.fileInput.click()">
            <span class="upload-icon">📤</span>
            <span class="upload-text">Nhấp để chọn ảnh từ thiết bị</span>
            <span class="upload-hint">hoặc kéo thả các file ảnh vào đây</span>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0" class="image-list">
          <div class="list-title">
            Các ảnh đã chọn ({{ uploadedFiles.length }})
          </div>
          <div class="image-items">
            <div
              v-for="(file, index) in uploadedFiles"
              :key="index"
              class="image-item"
            >
              <div class="item-preview">
                <img :src="file.preview" :alt="`Preview ${index + 1}`" />
              </div>
              <div class="item-info">
                <div class="item-index">Ảnh {{ index + 1 }}</div>
                <div class="item-name">{{ file.name }}</div>
                <div class="item-size">{{ formatFileSize(file.size) }}</div>
              </div>
              <button
                type="button"
                class="btn-remove"
                @click="removeFile(index)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div class="hint-badge">
          📸 Hệ thống ghi nhận:
          <strong class="text-main">{{ uploadedFiles.length }}</strong> ảnh minh
          họa.
        </div>
      </div>

      <div v-if="errorMessage" class="status-message error">
        ⚠️ {{ errorMessage }}
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="submitting">
          {{
            submitting
              ? "Đang xử lý..."
              : isEdit
                ? "Cập nhật dữ liệu"
                : "Tạo chương mới"
          }}
        </button>

        <router-link
          v-if="currentStoryId"
          :to="{
            name: 'AdminChapterList',
            params: { storyId: currentStoryId },
          }"
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
import { useRouter, useRoute } from "vue-router";
import {
  getChapter,
  createChapter,
  updateChapter,
} from "../../../api/chapterApi";

const props = defineProps({
  id: { type: [String, Number], default: null },
  storyId: { type: [String, Number], default: null },
});

const router = useRouter();
const route = useRoute();
const fileInput = ref(null);
const isEdit = computed(() => !!props.id);

const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const uploadedFiles = ref([]);

// 🌟 Chuyển thành ref linh hoạt để tiếp nhận ID từ API đổ về
const currentStoryId = ref(props.storyId || route.params.storyId || null);
const nextChapterSuggest = route.query.nextChapter;

const form = reactive({
  storyId: currentStoryId.value ? Number(currentStoryId.value) : null,
  chapterNumber: nextChapterSuggest ? Number(nextChapterSuggest) : 1,
  title: "",
  accessType: 0,
});

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files || []);
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedFiles.value.push({
          name: file.name,
          size: file.size,
          file: file,
          preview: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  });
  // Reset input
  event.target.value = "";
}

function removeFile(index) {
  uploadedFiles.value.splice(index, 1);
}

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true;
    errorMessage.value = "";
    try {
      const res = await getChapter(props.id);
      const data = res.data;

      // 🌟 Cập nhật lại storyId nhận từ database cho cả form và mốc điều hướng quay về
      if (data.story?.id) {
        currentStoryId.value = Number(data.story.id);
        form.storyId = Number(data.story.id);
      }

      form.chapterNumber = data.chapterNumber;
      form.title = data.title;
      form.accessType = data.accessType;

      // Load existing images as file objects
      if (data.images && data.images.length > 0) {
        for (const img of data.images) {
          try {
            const response = await fetch(img.imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `image-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            uploadedFiles.value.push({
              name: file.name,
              size: file.size,
              file: file,
              preview: img.imageUrl,
            });
          } catch (err) {
            console.error("Failed to load image:", img.imageUrl);
          }
        }
      }
    } catch (err) {
      errorMessage.value = "Không thể tải được thông tin chương truyện này.";
    } finally {
      loading.value = false;
    }
  }
});

async function handleSubmit() {
  if (uploadedFiles.value.length === 0) {
    errorMessage.value = "Vui lòng chọn ít nhất một ảnh.";
    return;
  }

  submitting.value = true;
  errorMessage.value = "";

  try {
    // Convert files to base64 URLs for sending to API
    const imageUrls = [];
    for (const fileObj of uploadedFiles.value) {
      if (fileObj.file) {
        // If it's a new file, convert to base64
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(fileObj.file);
        });
        imageUrls.push(base64);
      } else {
        // If it's existing image, use the URL
        imageUrls.push(fileObj.preview);
      }
    }

    const payload = {
      ...form,
      storyId: form.storyId || currentStoryId.value,
      chapterNumber: parseFloat(form.chapterNumber),
      imageUrls: imageUrls,
    };

    if (isEdit.value) {
      await updateChapter(props.id, payload);
    } else {
      await createChapter(payload);
    }

    router.push({
      name: "AdminChapterList",
      params: { storyId: currentStoryId.value },
    });
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Lưu dữ liệu chương thất bại.";
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
