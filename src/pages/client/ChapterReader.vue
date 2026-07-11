<template>
  <div class="chapter-reader">
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">{{ error }}</div>

    <template v-else-if="chapter">
      <div class="chapter-header">
        <router-link :to="`/truyen/${chapter.storyId}`">{{ chapter.storyTitle }}</router-link>
        <h2>Chương {{ chapter.chapterNumber }}: {{ chapter.title }}</h2>
      </div>

      <div class="images">
        <img
            v-for="(img, index) in chapter.images"
            :key="index"
            :src="img"
            :alt="`Trang ${index + 1}`"
        />
      </div>

      <div class="nav-buttons">
        <button :disabled="!chapter.prevChapterId" @click="goToChapter(chapter.prevChapterId)">
          ← Chương trước
        </button>
        <button :disabled="!chapter.nextChapterId" @click="goToChapter(chapter.nextChapterId)">
          Chương sau →
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  id: { type: [String, Number], required: true },
});

const router = useRouter();

const chapter = ref(null);
const loading = ref(true);
const error = ref(null);

async function fetchChapter(id) {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(`http://localhost:8080/api/chapters/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy chương");
    chapter.value = await res.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

function goToChapter(id) {
  if (!id) return;
  router.push(`/doc/${id}`);
}

onMounted(() => fetchChapter(props.id));
watch(() => props.id, (newId) => fetchChapter(newId));
</script>

<style scoped>
.images img {
  width: 100%;
  display: block;
}
.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 16px 0;
}
.chapter-header {
  text-align: center;
  padding: 16px 0;
}
</style>