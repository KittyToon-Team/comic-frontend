<template>
  <div class="page-shell">
    <router-link
      v-if="form.storyId"
      :to="{ name: 'AdminChapterList', params: { storyId: form.storyId } }"
      class="back-link"
    >
      ← Quay lại danh sách chương
    </router-link>

    <h2>{{ isEdit ? "Sửa chương" : "Thêm chương mới" }}</h2>

    <p v-if="loading">Đang tải...</p>

    <form v-else class="chapter-form" @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group">
          <label>Số chương *</label>
          <input v-model.number="form.chapterNumber" type="number" step="0.1" required />
        </div>

        <div class="form-group">
          <label>Quyền truy cập</label>
          <select v-model.number="form.accessType">
            <option :value="0">Public</option>
            <option :value="1">Cần đăng nhập</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Tiêu đề chương</label>
        <input v-model="form.title" placeholder="VD: Khởi đầu mới" />
      </div>

      <div class="form-group">
        <label>Danh sách ảnh (mỗi dòng 1 URL, theo đúng thứ tự hiển thị)</label>
        <textarea
          v-model="imageUrlsText"
          rows="10"
          placeholder="https://.../page1.jpg&#10;https://.../page2.jpg"
        ></textarea>
        <p class="hint">{{ imageCount }} ảnh</p>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <div class="form-actions">
        <button type="submit" :disabled="submitting">
          {{ submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới" }}
        </button>
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
      errorMessage.value = "Không tải được thông tin chương.";
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
    errorMessage.value = err.response?.data?.message || "Lưu thất bại.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.page-shell {
  padding: 20px;
  max-width: 640px;
}

.back-link {
  display: inline-block;
  margin-bottom: 10px;
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
}

.chapter-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
}

.hint {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.form-actions {
  margin-top: 20px;
}

button[type="submit"] {
  padding: 10px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
}
</style>
