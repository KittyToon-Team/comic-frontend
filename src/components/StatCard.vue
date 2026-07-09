<template>
  <div class="stat-card">
    <div class="stat-icon" :style="{ backgroundColor: bgColor }">
      {{ icon }}
    </div>
    <div class="stat-content">
      <p class="stat-label">{{ label }}</p>
      <h3 class="stat-value">{{ value }}</h3>
    </div>
    <div class="stat-arrow">→</div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  bgColor: { type: String, default: "#fff0f6" },
});
</script>

<style scoped>
.stat-card {
  background: white;
  border: 1px solid #f5c6dc;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  border-color: #d946ef;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #933f83;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 6px 0 0 0;
  font-size: 24px;
  font-weight: 800;
  color: #a21caf;
}

.stat-arrow {
  font-size: 20px;
  color: #d946ef;
  opacity: 0.5;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>
