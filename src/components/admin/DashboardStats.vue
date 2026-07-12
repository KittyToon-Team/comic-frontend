<template>
  <div class="dashboard-stats">
    <div v-if="loading" style="grid-column: 1 / -1; text-align: center; color: #a21caf;">Đang tải thống kê...</div>
    <StatCard
      v-else
      v-for="stat in stats"
      :key="stat.id"
      :icon="stat.icon"
      :label="stat.label"
      :value="stat.value"
      :bg-color="stat.bgColor"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StatCard from "./StatCard.vue";
import api from "../../api/axios";

const stats = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [storiesRes, catsRes] = await Promise.all([
      api.get("/admin/stories"),
      api.get("/admin/categories")
    ]);
    
    const stories = storiesRes.data || [];
    const categories = catsRes.data || [];
    
    const totalViews = stories.reduce((sum, story) => sum + (story.viewCount || 0), 0);

    stats.value = [
      {
        id: 1,
        icon: "📚",
        label: "Tổng Truyện",
        value: stories.length.toString(),
        bgColor: "#fff0f6",
      },
      {
        id: 2,
        icon: "🏷️",
        label: "Tổng Thể Loại",
        value: categories.length.toString(),
        bgColor: "#fef3c7",
      },
      {
        id: 3,
        icon: "👥",
        label: "Lượt Truy Cập",
        value: totalViews.toString(),
        bgColor: "#dbeafe",
      },
      {
        id: 4,
        icon: "💬",
        label: "Bình Luận",
        value: "0",
        bgColor: "#e9d5ff",
      },
    ];
  } catch (err) {
    console.error("Lỗi khi tải thống kê", err);
    stats.value = [
      { id: 1, icon: "📚", label: "Tổng Truyện", value: "0", bgColor: "#fff0f6" },
      { id: 2, icon: "🏷️", label: "Tổng Thể Loại", value: "0", bgColor: "#fef3c7" },
      { id: 3, icon: "👥", label: "Lượt Truy Cập", value: "0", bgColor: "#dbeafe" },
      { id: 4, icon: "💬", label: "Bình Luận", value: "0", bgColor: "#e9d5ff" },
    ];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

@media (max-width: 1024px) {
  .dashboard-stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
