<template>
  <div class="dashboard-stats">
    <StatCard
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
import { ref } from "vue";
import StatCard from "./StatCard.vue";

const stats = ref([
  {
    id: 1,
    icon: "📚",
    label: "Tổng Truyện",
    value: "156",
    bgColor: "#fff0f6",
  },
  {
    id: 2,
    icon: "📖",
    label: "Tổng Chương",
    value: "4.2K",
    bgColor: "#fef3c7",
  },
  {
    id: 3,
    icon: "👥",
    label: "Lượt Truy Cập",
    value: "28.5K",
    bgColor: "#dbeafe",
  },
  {
    id: 4,
    icon: "💬",
    label: "Bình Luận",
    value: "892",
    bgColor: "#e9d5ff",
  },
]);
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
