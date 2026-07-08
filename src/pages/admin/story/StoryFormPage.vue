<template>
  <div class="page-shell">
    <h2>{{ isEdit ? "Sửa truyện" : "Thêm truyện mới" }}</h2>

    <p v-if="loading">Đang tải...</p>

    <form v-else class="story-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Tên truyện *</label>
        <input v-model="form.title" required />
      </div>

      <div class="form-group">
        <label>Tác giả</label>
        <input v-model="form.author" />
      </div>

      <div class="form-group">
        <label>Mô tả</label>
        <textarea v-model="form.description" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label>Ảnh bìa (URL)</label>
        <input v-model="form.coverImageUrl" placeholder="https://..." />
        <img
          v-if="form.coverImageUrl"
          :src="form.coverImageUrl"
          class="preview"
          alt="preview"
        />
      </div>

      <div class="form-group">
        <label>Trạng thái</label>
        <select v-model="form.status">
          <option value="Đang ra">Đang ra</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Tạm ngưng">Tạm ngưng</option>
        </select>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <div class="form-actions">
        <button type="submit" :disabled="submitting">
          {{ submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới" }}
        </button>
        <router-link :to="{ name: 'AdminStoryList' }" class="btn-cancel">
          Hủy
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getStory, createStory, updateStory } from "../../../api/storyApi";

const props = defineProps({
  id: { type: [String, Number], default: null },
});

const router = useRouter();
const isEdit = computed(() => !!props.id);

const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref("");

const form = reactive({
  title: "",
  author: "",
  description: "",
  coverImageUrl: "",
  status: "Đang ra",
});

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true;
    try {
      const res = await getStory(props.id);
      Object.assign(form, res.data);
    } catch (err) {
      errorMessage.value = "Không tải được thông tin truyện.";
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

.story-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
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
}

.preview {
  margin-top: 10px;
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
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

.btn-cancel {
  padding: 10px 24px;
  color: #475569;
  text-decoration: none;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.error {
  color: #dc2626;
}
</style>
