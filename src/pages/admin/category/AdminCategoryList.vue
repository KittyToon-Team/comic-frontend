<template>
  <div class="page-shell">
    <div class="header-section">
      <div class="title-block">
        <h2>🏷️ Quản lý Thể loại</h2>
        <p class="subtitle">Cấu hình danh mục thể loại truyện (Nhiều - Nhiều) hiển thị ngoài trang chủ.</p>
      </div>
      <button class="btn-primary" @click="openAddModal">
        + Thêm thể loại mới
      </button>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
        <tr>
          <th style="width: 80px">ID</th>
          <th style="width: 200px">Tên thể loại</th>
          <th>Mô tả chi tiết</th>
          <th style="width: 140px; text-align: center">Trạng thái</th>
          <th style="width: 140px; text-align: center">Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="cat in categories" :key="cat.id">
          <td class="font-bold">{{ cat.id }}</td>
          <td class="font-semibold text-main">{{ cat.name }}</td>
          <td class="text-desc">{{ cat.description || 'Chưa có mô tả chi tiết cho thể loại này.' }}</td>
          <td style="text-align: center">
            <span class="badge" :class="cat.isHidden ? 'badge-private' : 'badge-public'">
               {{ cat.isHidden ? 'Đang ẩn' : 'Hiển thị' }}
            </span>
          </td>
          <td>
            <div class="actions">
              <button class="btn-action" :class="cat.isHidden ? 'show' : 'hide'" @click="toggleVisibility(cat)">
                {{ cat.isHidden ? '👁️‍🗨️ Hiện' : '👁️ Ẩn' }}
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="categories.length === 0">
          <td colspan="5" class="empty-state">
            <div class="empty-icon">🏷️</div>
            <p>Chưa có thể loại nào trong hệ thống cơ sở dữ liệu.</p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <h3>{{ isEdit ? '✏️ Cập nhật thể loại' : '✨ Thêm thể loại mới' }}</h3>

        <div class="form-group">
          <label for="catName">Tên thể loại <span class="required">*</span></label>
          <input
              id="catName"
              type="text"
              v-model="form.name"
              placeholder="Ví dụ: Manhwa, Hệ Thống, Cổ Đại..."
              required
          />
        </div>

        <div class="form-group">
          <label for="catDesc">Mô tả ngắn</label>
          <textarea
              id="catDesc"
              v-model="form.description"
              rows="4"
              placeholder="Nhập mô tả đặc trưng của thể loại này để độc giả dễ phân biệt..."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">Hủy bỏ</button>
          <button class="btn-submit" @click="handleSubmit">Lưu lại</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../../api/axios';

const categories = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const form = reactive({
  name: '',
  description: ''
});

const fetchCategories = async () => {
  try {
    const res = await api.get('/admin/categories');
    categories.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách thể loại:", err);
  }
};

const openAddModal = () => {
  isEdit.value = false;
  currentId.value = null;
  form.name = '';
  form.description = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  if (!form.name.trim()) return alert("Tên thể loại bắt buộc không được để trống!");

  try {
    const payload = {
      name: form.name.trim(),
      description: form.description ? form.description.trim() : ""
    };

    if (isEdit.value) {
      await api.put(`/admin/categories/${currentId.value}`, payload);
    } else {
      await api.post('/admin/categories', payload);
    }

    closeModal();
    fetchCategories();
  } catch (err) {
    console.error("Chi tiết lỗi API Thể loại:", err.response || err);

    const serverMessage = err.response?.data?.message || err.response?.data;
    if (serverMessage) {
      alert(`Backend báo lỗi: ${JSON.stringify(serverMessage)}`);
    } else {
      alert(`Không thể kết nối hoặc lỗi hệ thống: ${err.message}`);
    }
  }
};

const toggleVisibility = async (cat) => {
  const actionName = cat.isHidden ? 'hiện lại' : 'ẩn';
  const confirmMsg = cat.isHidden 
    ? `Xác nhận hiện lại thể loại này?` 
    : `Xác nhận ẩn thể loại này? Mọi truyện gắn thẻ này cũng sẽ bị ẩn.`;
    
  if (confirm(confirmMsg)) {
    try {
      await api.put(`/admin/categories/${cat.id}/toggle-visibility`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || `Không thể ${actionName} thể loại này.`);
    }
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>

.page-shell {
  padding: 32px;
  background: #fffdfa;
  min-height: 100%;
  text-align: left;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  border-bottom: 2px dashed #fcd3e7;
  padding-bottom: 20px;
}

.title-block h2 {
  margin: 0;
  color: #a21caf;
  font-size: 28px;
  font-weight: 700;
}

.title-block .subtitle {
  margin: 6px 0 0 0;
  color: #933f83;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.2);
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.table-responsive {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(245, 184, 219, 0.5);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #fff0f6;
  color: #9f1239;
  font-weight: 700;
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid #f5c6dc;
  text-align: left;
}

td {
  padding: 16px;
  border-bottom: 1px solid #fff0f6;
  color: #4c1d32;
  font-size: 14px;
  text-align: left;
  vertical-align: middle;
}

tr:hover td {
  background: #fff9fc;
}

.text-main { color: #a21caf; }
.text-desc { color: #64748b; font-size: 13px; line-height: 1.5; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-action {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-action.show {
  background: #f0fdf4;
  color: #16a34a;
}
.btn-action.show:hover { background: #dcfce7; }

.btn-action.hide {
  background: #fff1f2;
  color: #e11d48;
}
.btn-action.hide:hover { background: #ffe4e6; }

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge-public {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.badge-private {
  background: #fff1f2;
  color: #e11d48;
  border: 1px solid #fecdd3;
}

.empty-state {
  text-align: center !important;
  padding: 60px 20px !important;
  color: #933f83;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(51, 18, 31, 0.35);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: #ffffff;
  padding: 28px;
  border-radius: 18px;
  width: 440px;
  border: 1px solid #f5c6dc;
  box-shadow: 0 15px 40px rgba(162, 28, 175, 0.12);
  text-align: left;
}

.modal-box h3 {
  color: #a21caf;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
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

.required { color: #ef4444; }

.form-group input,
.form-group textarea {
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
.form-group textarea:focus {
  border-color: #d946ef;
  box-shadow: 0 0 0 3px rgba(233, 65, 166, 0.12);
  background: #ffffff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 20px;
  color: #933f83;
  text-decoration: none;
  background: #fff1f2;
  border: 1px solid #fbcfe8;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #ffe4e6;
  color: #b91c1c;
}

.btn-submit {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
  transition: opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
}
</style>