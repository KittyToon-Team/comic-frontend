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
          <input type="text" placeholder="Tìm truyện, tác giả, thể loại..." />
          <button type="button">Tìm</button>
        </div>

        <div class="account-hint" v-if="!currentUser">
          <span>Tạo tài khoản để yêu thích truyện và nhận thông báo</span>
          <button type="button" @click="goToLogin">Đăng nhập</button>
        </div>
        <div class="user-profile" v-if="currentUser">
          <router-link :to="{ name: 'Profile', params: { id: currentUser.id } }" class="avatar" style="text-decoration: none;">👑</router-link>
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
        <a href="#">Lịch sử</a>
        <a href="#">Tìm truyện</a>
        <a href="#">Theo dõi</a>
        <a href="#">Thể loại ▾</a>
        <a href="#">Truyện hot</a>
        <a href="#">Truyện mới</a>
        <a href="#">Truyện full</a>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import logoUrl from "../../images/Logo.png";

const router = useRouter();
const currentUser = ref(null);

onMounted(() => {
  const raw = localStorage.getItem("currentUser");
  if (raw) {
    currentUser.value = JSON.parse(raw);
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
  font-size: 24px;
  background: #fff0f6;
  padding: 8px;
  border-radius: 50%;
  border: 1px solid #f5c6dc;
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
