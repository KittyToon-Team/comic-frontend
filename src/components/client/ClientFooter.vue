<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-about">
        <a href="#" class="footer-brand">
          <img :src="logoUrl" alt="KittyToon Logo" />
          <strong>KittyToon</strong>
        </a>
        <p>
          KittyToon là trang demo đọc truyện tranh online, cập nhật manga,
          manhwa, webtoon với giao diện đơn giản, dễ nhìn và cùng tone hồng
          cute.
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
</template>

<script setup>
import logoUrl from "../../images/Logo.png";
</script>

<style scoped>
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

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
  margin-bottom: 16px;
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
  margin: 0 0 10px;
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
  .footer-inner {
    grid-template-columns: 1fr;
  }
}
</style>
