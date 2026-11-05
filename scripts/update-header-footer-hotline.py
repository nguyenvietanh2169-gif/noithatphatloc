import os
import re

files_info = [
    ('public/gioi-thieu/index.html', 'gioi-thieu'),
    ('public/dich-vu/thi-cong-noi-that-bien-hoa/index.html', 'thi-cong'),
    ('public/dich-vu/thiet-ke-noi-that-dong-nai/index.html', 'thiet-ke'),
    ('public/dich-vu/dong-tu-bep-bien-hoa/index.html', 'san-pham'),
    ('public/du-an/index.html', 'du-an'),
    ('public/quy-trinh-bao-gia/index.html', 'bao-gia'),
    ('public/chinh-sach-bao-hanh/index.html', 'bao-hanh'),
    ('public/404.html', '404')
]

hotline_modal_html = """  <!-- Hotline Interactive Modal -->
  <div id="hotlineModal" class="hotline-modal-overlay" onclick="closeHotlineModal(event)">
    <div class="hotline-modal-card" onclick="event.stopPropagation()">
      <div class="hotline-modal-header">
        <div class="hotline-modal-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D0E8" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Hotline Tư Vấn Trực Tiếp</span>
        </div>
        <button type="button" class="hotline-modal-close" onclick="closeHotlineModal()" aria-label="Đóng danh sách">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <p class="hotline-modal-desc">Đội ngũ kỹ thuật & xưởng sản xuất sẵn sàng hỗ trợ khảo sát và tư vấn:</p>
      <div class="hotline-list">
        <div class="hotline-item">
          <div class="hotline-info">
            <span class="hotline-name">Mr. Lợi — Phụ trách Xưởng & Khảo sát</span>
            <span class="hotline-number">0585 338 339</span>
          </div>
          <a href="tel:0585338339" class="btn-call-item">Gọi ngay</a>
        </div>
        <div class="hotline-item">
          <div class="hotline-info">
            <span class="hotline-name">Mr. Lộc — Tư vấn Thiết kế 3D & Vật liệu</span>
            <span class="hotline-number">0836 084 719</span>
          </div>
          <a href="tel:0836084719" class="btn-call-item">Gọi ngay</a>
        </div>
        <div class="hotline-item">
          <div class="hotline-info">
            <span class="hotline-name">Mr. Huấn — Kỹ thuật Thi công & Bảo hành</span>
            <span class="hotline-number">090 893 8297</span>
          </div>
          <a href="tel:0908938297" class="btn-call-item">Gọi ngay</a>
        </div>
      </div>
    </div>
  </div>

  <script>
    function toggleMenu() {
      var m = document.getElementById('mobileMenu');
      if (m) m.classList.toggle('active');
    }
    function toggleHotlineModal() {
      var modal = document.getElementById('hotlineModal');
      if (modal) modal.classList.toggle('active');
    }
    function closeHotlineModal(e) {
      if (!e || e.target.id === 'hotlineModal' || e.target.closest('.hotline-modal-close')) {
        var modal = document.getElementById('hotlineModal');
        if (modal) modal.classList.remove('active');
      }
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeHotlineModal();
    });
  </script>"""

floating_mobile_bar = """  <!-- Floating Action Buttons for Mobile -->
  <div class="floating-contact-bar">
    <button type="button" class="floating-btn-phone" onclick="toggleHotlineModal()" style="border:none; cursor:pointer;">GỌI HOTLINE</button>
    <a href="https://zalo.me/0585338339" target="_blank" rel="noreferrer" class="floating-btn-zalo" style="text-decoration:none;">NHẮN TIN ZALO</a>
  </div>"""

footer_links_html = """        <div class="footer-col">
          <h4>DANH MỤC DỊCH VỤ & CHÍNH SÁCH</h4>
          <ul class="footer-links">
            <li><a href="/gioi-thieu/">Giới thiệu xưởng</a></li>
            <li><a href="/dich-vu/thiet-ke-noi-that-dong-nai/">Thiết kế nội thất</a></li>
            <li><a href="/dich-vu/thi-cong-noi-that-bien-hoa/">Thi công trọn gói</a></li>
            <li><a href="/dich-vu/dong-tu-bep-bien-hoa/">Tủ bếp & Tủ quần áo</a></li>
            <li><a href="/dich-vu/thi-cong-noi-that-bien-hoa/#phong-ngu-ke-tivi">Giường ngủ & Kệ tivi</a></li>
            <li><a href="/dich-vu/dong-tu-bep-bien-hoa/#da-bep-vach-trang-tri">Đá bếp & Vách trang trí</a></li>
            <li><a href="/du-an/">Dự án thực tế</a></li>
            <li><a href="/quy-trinh-bao-gia/">Quy trình báo giá</a></li>
            <li><a href="/chinh-sach-bao-hanh/">Bảo hành</a></li>
          </ul>
        </div>"""

for path, page_key in files_info:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Generate nav-desktop
    def nav_class(target):
        return ' class="nav-link active"' if page_key == target else ' class="nav-link"'

    nav_desktop = f"""      <nav class="nav-desktop">
        <a href="/"{nav_class('home')}>Trang Chủ</a>
        <a href="/gioi-thieu/"{nav_class('gioi-thieu')}>Giới Thiệu</a>
        <a href="/dich-vu/thi-cong-noi-that-bien-hoa/"{nav_class('thi-cong')}>Thi Công Nội Thất</a>
        <a href="/dich-vu/thiet-ke-noi-that-dong-nai/"{nav_class('thiet-ke')}>Thiết Kế Nội Thất</a>
        <div class="nav-item-dropdown">
          <a href="/dich-vu/dong-tu-bep-bien-hoa/" class="nav-link dropdown-toggle{' active' if page_key == 'san-pham' else ''}">
            <span>Sản Phẩm Nội Thất</span>
            <svg class="dropdown-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </a>
          <div class="dropdown-menu">
            <a href="/dich-vu/dong-tu-bep-bien-hoa/">Tủ bếp</a>
            <a href="/dich-vu/thi-cong-noi-that-bien-hoa/#tu-quan-ao">Tủ quần áo</a>
            <a href="/dich-vu/thi-cong-noi-that-bien-hoa/#giuong-ngu">Giường ngủ</a>
            <a href="/dich-vu/thi-cong-noi-that-bien-hoa/#ke-tivi">Kệ tivi</a>
            <a href="/dich-vu/dong-tu-bep-bien-hoa/#da-bep">Đá bếp, đá trang trí</a>
            <a href="/dich-vu/thi-cong-noi-that-bien-hoa/#vach-trang-tri">Vách ngăn, vách trang trí</a>
          </div>
        </div>
        <a href="/du-an/"{nav_class('du-an')}>Dự Án</a>
        <a href="/quy-trinh-bao-gia/"{nav_class('bao-gia')}>Báo Giá</a>
        <a href="/chinh-sach-bao-hanh/"{nav_class('bao-hanh')}>Bảo Hành</a>
      </nav>"""

    # Replace <nav class="nav-desktop">...</nav>
    html = re.sub(r'<nav class="nav-desktop">.*?</nav>', nav_desktop, html, flags=re.DOTALL)

    # Header CTA with interactive Hotline button
    header_cta = """      <div class="header-cta">
        <button type="button" class="btn-hotline" onclick="toggleHotlineModal()" aria-label="Mở danh sách Hotline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Hotline</span>
        </button>
        <button class="btn-mobile-toggle" onclick="toggleMenu()" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>"""
    html = re.sub(r'<div class="header-cta">.*?</div>\s*</div>\s*<!-- Mobile Menu -->', header_cta + '\n    </div>\n\n    <!-- Mobile Menu -->', html, flags=re.DOTALL)

    # Mobile menu
    mobile_menu = """    <!-- Mobile Menu -->
    <div id="mobileMenu" class="mobile-menu">
      <ul class="mobile-nav-list">
        <li><a href="/">Trang Chủ</a></li>
        <li><a href="/gioi-thieu/">Giới Thiệu Xưởng</a></li>
        <li><a href="/dich-vu/thi-cong-noi-that-bien-hoa/">Thi Công Nội Thất</a></li>
        <li><a href="/dich-vu/thiet-ke-noi-that-dong-nai/">Thiết Kế Nội Thất</a></li>
        <li class="mobile-submenu-group">
          <div class="mobile-submenu-header">Sản Phẩm Nội Thất</div>
          <ul class="mobile-submenu-items">
            <li><a href="/dich-vu/dong-tu-bep-bien-hoa/">• Tủ bếp</a></li>
            <li><a href="/dich-vu/thi-cong-noi-that-bien-hoa/#tu-quan-ao">• Tủ quần áo</a></li>
            <li><a href="/dich-vu/thi-cong-noi-that-bien-hoa/#giuong-ngu">• Giường ngủ</a></li>
            <li><a href="/dich-vu/thi-cong-noi-that-bien-hoa/#ke-tivi">• Kệ tivi</a></li>
            <li><a href="/dich-vu/dong-tu-bep-bien-hoa/#da-bep">• Đá bếp, đá trang trí</a></li>
            <li><a href="/dich-vu/thi-cong-noi-that-bien-hoa/#vach-trang-tri">• Vách ngăn, vách trang trí</a></li>
          </ul>
        </li>
        <li><a href="/du-an/">Dự Án Thực Tế</a></li>
        <li><a href="/quy-trinh-bao-gia/">Quy Trình Báo Giá</a></li>
        <li><a href="/chinh-sach-bao-hanh/">Chính Sách Bảo Hành</a></li>
      </ul>
    </div>"""
    html = re.sub(r'<!-- Mobile Menu -->\s*<div id="mobileMenu".*?</ul>\s*</div>', mobile_menu, html, flags=re.DOTALL)

    # Footer links replacement
    html = re.sub(r'<div class="footer-col">\s*<h4>DANH MỤC TRANG</h4>.*?</ul>\s*</div>', footer_links_html, html, flags=re.DOTALL)
    html = re.sub(r'<div class="footer-col">\s*<h4>DANH MỤC DỊCH VỤ & CHÍNH SÁCH</h4>.*?</ul>\s*</div>', footer_links_html, html, flags=re.DOTALL)

    # Clean up existing floating bars, modals and scripts before </body>
    html = re.sub(r'<!-- Floating Action Buttons for Mobile -->.*?</div>\s*</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<!-- Floating Mobile Bar -->.*?</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<div class="floating-contact-bar".*?</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<!-- Hotline Interactive Modal -->.*?</div>\s*</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<div id="hotlineModal".*?</div>\s*</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<script>\s*function toggleMenu\(\).*?</script>', '', html, flags=re.DOTALL)

    # Now append floating_mobile_bar and hotline_modal_html before </body>
    body_close = '\n' + floating_mobile_bar + '\n' + hotline_modal_html + '\n</body>'
    html = re.sub(r'\s*</body>', body_close, html)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'Cleanly updated: {path}')

print('Done cleaning and updating all 8 files!')
