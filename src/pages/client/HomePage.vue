<template>
  <div class="home-page">
    <header class="site-header">
      <div class="top-header">
        <div class="container header-inner">
          <a href="#" class="brand">
            <img :src="logoUrl" alt="KittyToon Logo" class="brand-logo" />
            <div class="brand-text">
              <strong>KittyToon</strong>
              <span>Đọc truyện tranh online</span>
            </div>
          </a>

          <div class="search-box">
            <input type="text" placeholder="Tìm truyện, tác giả, thể loại..." />
            <button type="button">Tìm</button>
          </div>

          <div class="account-hint">
            <span>Tạo tài khoản để yêu thích truyện và donate dha nhá (sếp qa k cần donate)</span>
            <button type="button">Đăng nhập</button>
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

    <main class="container main-content">
      <section class="notice-bar">
        <span>💗</span>
        <p>KittyToon demo giao diện đọc truyện. Các nút trên trang chỉ để trang trí, chưa gắn chức năng.</p>
      </section>

      <section class="quick-categories">
        <button v-for="category in categories" :key="category" type="button">
          {{ category }}
        </button>
      </section>

      <section class="layout-grid">
        <div class="content-left">
          <div class="section-title">
            <h2>Truyện mới cập nhật</h2>
            <span>Danh sách demo</span>
          </div>

          <div class="story-list">
            <article v-for="story in latestStories" :key="story.title" class="story-row">
              <div class="story-cover">
                <span>{{ story.icon }}</span>
              </div>

              <div class="story-info">
                <h3>{{ story.title }}</h3>
                <p>{{ story.genres }}</p>
                <div class="story-meta">
                  <span>{{ story.time }}</span>
                  <span>{{ story.views }} lượt xem</span>
                </div>
              </div>

              <button type="button" class="chapter-btn">Chương {{ story.chapter }}</button>
            </article>
          </div>
        </div>

        <aside class="sidebar">
          <div class="side-card user-card">
            <img :src="logoUrl" alt="KittyToon" />
            <h3>Tủ truyện của bạn</h3>
            <p>Đăng nhập để lưu lịch sử đọc, truyện theo dõi và nhận thông báo chương mới.</p>
            <button type="button">Vào tủ truyện</button>
          </div>

          <div class="side-card ranking-card">
            <div class="side-heading">
              <h3>Truyện hot</h3>
              <span>Top ngày</span>
            </div>
            <ol>
              <li v-for="(story, index) in hotStories" :key="story.title">
                <strong>{{ index + 1 }}</strong>
                <div>
                  <span>{{ story.title }}</span>
                  <small>{{ story.views }} lượt xem</small>
                </div>
              </li>
            </ol>
          </div>

          <div class="side-card genre-card">
            <div class="side-heading">
              <h3>Thể loại</h3>
              <span>Demo</span>
            </div>
            <div class="genre-list">
              <a v-for="genre in sideGenres" :key="genre" href="#">{{ genre }}</a>
            </div>
          </div>
        </aside>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-about">
          <a href="#" class="footer-brand">
            <img :src="logoUrl" alt="KittyToon Logo" />
            <strong>KittyToon</strong>
          </a>
          <p>
            KittyToon là trang demo đọc truyện tranh online, cập nhật manga,
            manhwa, webtoon với giao diện đơn giản, dễ nhìn và cùng tone hồng cute.
          </p>
          <p>Chịu trách nhiệm nội dung: sếp qa</p>
          <p>Email liên hệ: ptqa_chacthe@gmail.com</p>
        </div>

        <div class="footer-links">
          <a href="#">Về chúng tôi</a>
          <a href="#">Liên hệ</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Tuyên bố miễn trừ trách nhiệm</a>
          <a href="#">Html Sitemap</a>
        </div>

        <div class="footer-social">
          <h3>Theo dõi chúng tôi</h3>
          <div class="social-row">
            <button type="button">f</button>
            <button type="button">💬</button>
          </div>
          <p>Copyright 2026 © All rights reserved</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import logoUrl from "../../images/Logo.png";

const categories = [
  "Action",
  "Comedy",
  "Fantasy",
  "Romance",
  "School Life",
  "Manhwa",
  "Manga",
  "Webtoon",
];

const latestStories = [
  {
    title: "Chainsmoker Cat",
    genres: "Comedy, Slice of life",
    chapter: "12",
    time: "5 phút trước",
    views: "8.2K",
    icon: "🐱",
  },
  {
    title: "Player",
    genres: "Fantasy, Comedy, Drama, Adventure",
    chapter: "264",
    time: "20 phút trước",
    views: "6.7K",
    icon: "⚔",
  },
  {
    title: "Bocchi The Rock!",
    genres: "School Life, Comedy",
    chapter: "8",
    time: "1 giờ trước",
    views: "5.4K",
    icon: "🎸",
  },
  {
    title: "My Deer Friend Nokotan",
    genres: "Comedy, Fantasy, School Life",
    chapter: "56",
    time: "2 giờ trước",
    views: "9.1K",
    icon: "🦌",
  },
  {
    title: "Haikyuu!!",
    genres: "Sports, Comedy",
    chapter: "402",
    time: "3 giờ trước",
    views: "7.6K",
    icon: "🏐",
  },
];

const hotStories = [
  { title: "Player", views: "12.5K" },
  { title: "Chainsmoker Cat", views: "10.2K" },
  { title: "My Deer Friend Nokotan", views: "9.8K" },
  { title: "Bocchi The Rock!", views: "8.9K" },
  { title: "Haikyuu!!", views: "7.4K" },
];

const sideGenres = [
  "Ngôn tình",
  "Xuyên không",
  "Đam mỹ",
  "Truyện màu",
  "Học đường",
  "Hài hước",
  "Phiêu lưu",
  "Đời thường",
];
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background:
      radial-gradient(circle at top, rgba(255, 215, 230, 0.35), transparent 32%),
      linear-gradient(180deg, #fff7fb 0%, #fff 42%, #fff7fb 100%);
  color: #27111c;
  font-family:
      Inter,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
}

.container {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

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

.brand,
.footer-brand {
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
.account-hint button,
.chapter-btn,
.user-card button {
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

.main-content {
  padding: 24px 0 54px;
}

.notice-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px 18px;
  border: 1px solid #f5c6dc;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 34px rgba(236, 72, 153, 0.08);
}

.notice-bar p {
  margin: 0;
  color: #7c2d63;
  font-size: 14px;
}

.quick-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
}

.quick-categories button {
  padding: 9px 14px;
  border: 1px solid #f5c6dc;
  border-radius: 999px;
  background: #fff;
  color: #9f1239;
  font-weight: 700;
  cursor: pointer;
}

.quick-categories button:hover {
  background: #fdf2f8;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 24px;
}

.content-left,
.side-card {
  border: 1px solid rgba(245, 184, 219, 0.78);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 44px rgba(236, 72, 153, 0.1);
}

.content-left {
  padding: 18px;
}

.section-title,
.side-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f8d9e9;
}

.section-title h2,
.side-heading h3 {
  margin: 0;
  color: #a21caf;
  font-size: 22px;
}

.section-title span,
.side-heading span {
  color: #933f83;
  font-size: 13px;
}

.story-list {
  display: flex;
  flex-direction: column;
}

.story-row {
  display: grid;
  grid-template-columns: 74px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f8d9e9;
}

.story-row:last-child {
  border-bottom: 0;
}

.story-cover {
  display: grid;
  place-items: center;
  width: 74px;
  height: 96px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  border: 1px solid #f5c6dc;
  font-size: 32px;
}

.story-info h3 {
  margin: 0 0 6px;
  color: #33121f;
  font-size: 17px;
}

.story-info p {
  margin: 0 0 10px;
  color: #933f83;
  font-size: 14px;
}

.story-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #8f516f;
  font-size: 13px;
}

.chapter-btn {
  padding: 10px 14px;
  border-radius: 12px;
  color: #be185d;
  background: #fdf2f8;
  border: 1px solid #f5c6dc;
  white-space: nowrap;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.side-card {
  padding: 18px;
}

.user-card {
  text-align: center;
}

.user-card img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 20px;
  padding: 10px;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  border: 1px solid #f5c6dc;
}

.user-card h3 {
  margin: 12px 0 8px;
  color: #a21caf;
}

.user-card p {
  margin: 0 0 14px;
  color: #7c2d63;
  line-height: 1.55;
  font-size: 14px;
}

.user-card button {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, #d946ef 0%, #f472b6 100%);
}

.ranking-card ol {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
}

.ranking-card li {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #f8d9e9;
}

.ranking-card li:last-child {
  border-bottom: 0;
}

.ranking-card li > strong {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  background: #ff7f1a;
  font-size: 13px;
}

.ranking-card span {
  display: block;
  color: #33121f;
  font-weight: 700;
  font-size: 14px;
}

.ranking-card small {
  color: #8f516f;
}

.genre-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  margin-top: 14px;
}

.genre-list a {
  color: #be185d;
  text-decoration: none;
  font-size: 14px;
}

.genre-list a:hover {
  text-decoration: underline;
}

.site-footer {
  padding: 58px 0;
  background: #fff;
  border-top: 1px solid #f5c6dc;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.25fr 1fr 0.95fr;
  gap: 54px;
}

.footer-brand img {
  width: 76px;
  height: 76px;
  object-fit: contain;
  border-radius: 20px;
  padding: 10px;
  background: linear-gradient(135deg, #fff0f6 0%, #ffd6e6 100%);
  border: 1px solid #f5c6dc;
}

.footer-brand strong {
  color: #a21caf;
  font-size: 34px;
}

.footer-about p,
.footer-social p {
  color: #33121f;
  line-height: 1.7;
  font-size: 15px;
}

.footer-links {
  display: flex;
  flex-direction: column;
}

.footer-links a {
  padding: 12px 0;
  color: #33121f;
  text-decoration: none;
  border-bottom: 1px solid #f1e4eb;
}

.footer-links a:hover {
  color: #ec4899;
}

.footer-social h3 {
  margin: 0 0 14px;
  color: #33121f;
  font-size: 22px;
  text-transform: uppercase;
}

.social-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.social-row button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #8f516f;
  cursor: pointer;
}

@media (max-width: 920px) {
  .header-inner,
  .layout-grid,
  .footer-inner {
    grid-template-columns: 1fr;
  }

  .account-hint {
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

  .story-row {
    grid-template-columns: 60px 1fr;
  }

  .story-cover {
    width: 60px;
    height: 78px;
    font-size: 26px;
  }

  .chapter-btn {
    grid-column: 2;
    justify-self: flex-start;
  }
}
</style>
