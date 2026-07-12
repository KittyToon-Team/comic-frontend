<template>
  <header class="site-header">
    <div class="top-header">
      <div class="container header-inner">
        <router-link :to="currentUser ? { name: 'UserHome', params: { id: currentUser.id } } : { name: 'Home' }" class="brand">
          <img :src="logoUrl" alt="KittyToon Logo" class="brand-logo" />
          <div class="brand-text">
            <strong>KittyToon</strong>
            <span>Đọc truyện tranh online</span>
          </div>
        </router-link>

        <div class="search-box">
          <input type="text" ref="searchInput" v-model="searchQuery" @keyup.enter="handleSearch" placeholder="Tìm truyện, tác giả, thể loại..." />
          <button type="button" @click="handleSearch">Tìm</button>
        </div>

        <div class="account-hint" v-if="!currentUser">
          <span>Tạo tài khoản để yêu thích truyện và nhận thông báo</span>
          <button type="button" @click="goToLogin">Đăng nhập</button>
        </div>
        <div class="user-profile" v-if="currentUser">
          <router-link :to="{ name: 'Profile', params: { id: currentUser.id } }" class="avatar" style="text-decoration: none;">
            <Crown class="avatar-icon" />
          </router-link>
          <div class="user-info">
            <strong>
              <router-link :to="{ name: 'Profile', params: { id: currentUser.id } }" style="color: inherit; text-decoration: none;">
                {{ currentUser.displayName || currentUser.username }}
              </router-link>
            </strong>
            <a href="#" @click.prevent="logout" class="logout-link">Đăng xuất</a>
          </div>
        </div>
      </div>
    </div>

    <nav class="main-nav">
      <div class="container nav-inner">
        <a href="#" @click.prevent="goToProfileTab('history')">Lịch sử</a>
        <a href="#" @click.prevent="focusSearch">Tìm truyện</a>
        <a href="#" @click.prevent="goToProfileTab('favorites')">Theo dõi</a>
        <div class="dropdown">
          <a href="#" @click.prevent class="dropbtn">Thể loại ▾</a>
          <div class="dropdown-content">
            <router-link :to="{ name: 'StoryFilter' }">Tất cả thể loại</router-link>
            <router-link 
              v-for="cat in categories" 
              :key="cat.id" 
              :to="{ name: 'StoryFilter', query: { cat: cat.id } }"
            >
              {{ cat.name }}
            </router-link>
          </div>
        </div>
        <router-link :to="{ name: 'StoryFilter', query: { sort: 'hot' } }">Truyện hot</router-link>
        <router-link :to="{ name: 'StoryFilter', query: { sort: 'new' } }">Truyện mới</router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Crown } from "lucide-vue-next";
import api from "../../api/axios";
import logoUrl from "../../images/Logo.png";

const router = useRouter();
const currentUser = ref(null);
const searchInput = ref(null);
const searchQuery = ref('');
const categories = ref([]);

onMounted(async () => {
  const raw = localStorage.getItem("currentUser");
  if (raw) {
    currentUser.value = JSON.parse(raw);
  }
  try {
    const res = await api.get("/categories");
    categories.value = res.data || [];
  } catch (err) {
    console.error("Lỗi tải thể loại:", err);
  }
});

const goToLogin = () => {
  router.push("/login");
};

const logout = () => {
  localStorage.removeItem("currentUser");
  currentUser.value = null;
  router.push("/login");
};

const goToProfileTab = (tab) => {
  if (!currentUser.value) {
    alert("Vui lòng đăng nhập để sử dụng tính năng này!");
    router.push("/login");
    return;
  }
  router.push({ name: 'Profile', params: { id: currentUser.value.id }, query: { tab } });
};

const focusSearch = () => {
  if (searchInput.value) {
    searchInput.value.focus();
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Home', query: { search: searchQuery.value.trim() } });
  } else {
    router.push({ name: 'Home' });
  }
};
</script>

<style scoped>
.site-header {
  background: #fff;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.08);
}

.top-header {
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.96);
}

.header-inner {
  display: grid;
  grid-template-columns: 260px 1fr 270px;
  align-items: center;
  gap: 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.brand-logo {
  width: 62px;
  height: 62px;
  object-fit: contain;
  border-radius: 18px;
  padding: 9px;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  border: 1px solid #f5c6dc;
}

.brand-text strong {
  display: block;
  color: #a21caf;
  font-size: 25px;
  line-height: 1;
}

.brand-text span {
  display: block;
  margin-top: 6px;
  color: #933f83;
  font-size: 13px;
}

.search-box {
  display: flex;
  height: 44px;
  border: 1px solid #f5c6dc;
  border-radius: 999px;
  background: #fff5fb;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 0 18px;
  color: #33121f;
  font-size: 14px;
}

.search-box button,
.account-hint button {
  border: 0;
  cursor: pointer;
  font-weight: 700;
}

.search-box button {
  min-width: 86px;
  color: #fff;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
}

.account-hint {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  color: #933f83;
  font-size: 13px;
}

.account-hint button {
  padding: 9px 16px;
  border-radius: 999px;
  color: #be185d;
  background: #fdf2f8;
  border: 1px solid #f5c6dc;
}

/* User Profile Styles */
.user-profile {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.user-profile .avatar {
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
  padding: 8px;
  border-radius: 50%;
  border: 2px solid #fce7f3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
  transition: all 0.3s ease;
}

.user-profile .avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.3);
}

.avatar-icon {
  width: 20px;
  height: 20px;
  color: white;
  stroke-width: 2.5px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-info strong {
  color: #a21caf;
  font-size: 15px;
  margin-bottom: 2px;
}

.user-info a {
  color: #db2777;
  font-size: 13px;
  text-decoration: none;
}

.user-info a:hover {
  text-decoration: underline;
}

.main-nav {
  background: #f5c6dc;
}

.nav-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  gap: 4px;
}

.nav-inner a {
  display: inline-flex;
  align-items: center;
  height: 50px;
  padding: 0 18px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  text-decoration: none;
}

.nav-inner a:hover {
  background: rgba(255, 255, 255, 0.16);
}

.dropdown {
  position: relative;
  display: inline-block;
  height: 100%;
}

.dropbtn {
  display: inline-flex;
  align-items: center;
  height: 50px;
  padding: 0 18px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  text-decoration: none;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff;
  min-width: 180px;
  box-shadow: 0px 8px 16px 0px rgba(236, 72, 153, 0.2);
  z-index: 100;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  border: 1px solid #f5c6dc;
  border-top: none;
}

.dropdown-content a {
  color: #9f1239;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-transform: none;
  font-weight: 600;
  height: auto;
  font-size: 14px;
}

.dropdown-content a:hover {
  background-color: #fdf2f8;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background: rgba(255, 255, 255, 0.16);
}

@media (max-width: 920px) {
  .header-inner {
    grid-template-columns: 1fr;
  }

  .account-hint, .user-profile {
    align-items: flex-start;
    justify-content: flex-start;
  }

  .user-info {
    align-items: flex-start;
  }

  .nav-inner {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .nav-inner a {
    flex: 0 0 auto;
  }
}

@media (max-width: 560px) {
  .top-header {
    padding: 16px 0;
  }
}
</style>
