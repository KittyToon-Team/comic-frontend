<template>
  <div class="filter-section">
    <label for="user-search" class="input-label">Tìm kiếm tài khoản</label>
    <input
      id="user-search"
      class="search-input"
      :value="modelValue"
      placeholder="Nhập username, tên hiển thị hoặc email..."
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.filter-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 8px;
}

.input-label {
  font-weight: 700;
  color: #9f1239;
  font-size: 14px;
}

.search-input {
  width: 100%;
  max-width: 380px;
  padding: 12px 16px;
  border: 1px solid #f5c6dc;
  border-radius: 12px;
  background: #fff5fb;
  font-size: 14px;
  color: #33121f;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #d946ef;
  box-shadow: 0 0 0 3px rgba(233, 65, 166, 0.15);
  background: #ffffff;
}
</style>
