import os
import re
import json
from bs4 import BeautifulSoup

dist_dir = 'dist'
pages = [
    {
        'path': 'dist/index.html',
        'url': 'https://noithatphatloc.com/',
        'name': 'Trang Chủ',
        'type': 'SPA'
    },
    {
        'path': 'dist/gioi-thieu/index.html',
        'url': 'https://noithatphatloc.com/gioi-thieu/',
        'name': 'Giới Thiệu Xưởng',
        'type': 'Static'
    },
    {
        'path': 'dist/dich-vu/thi-cong-noi-that-bien-hoa/index.html',
        'url': 'https://noithatphatloc.com/dich-vu/thi-cong-noi-that-bien-hoa/',
        'name': 'Thi Công Nội Thất Biên Hòa',
        'type': 'Static'
    },
    {
        'path': 'dist/dich-vu/thiet-ke-noi-that-dong-nai/index.html',
        'url': 'https://noithatphatloc.com/dich-vu/thiet-ke-noi-that-dong-nai/',
        'name': 'Thiết Kế Nội Thất Đồng Nai',
        'type': 'Static'
    },
    {
        'path': 'dist/dich-vu/dong-tu-bep-bien-hoa/index.html',
        'url': 'https://noithatphatloc.com/dich-vu/dong-tu-bep-bien-hoa/',
        'name': 'Đóng Tủ Bếp Biên Hòa',
        'type': 'Static'
    },
    {
        'path': 'dist/quy-trinh-bao-gia/index.html',
        'url': 'https://noithatphatloc.com/quy-trinh-bao-gia/',
        'name': 'Quy Trình Khảo Sát & Báo Giá',
        'type': 'Static'
    },
    {
        'path': 'dist/du-an/index.html',
        'url': 'https://noithatphatloc.com/du-an/',
        'name': 'Dự Án Thực Tế',
        'type': 'Static'
    },
    {
        'path': 'dist/chinh-sach-bao-hanh/index.html',
        'url': 'https://noithatphatloc.com/chinh-sach-bao-hanh/',
        'name': 'Chính Sách Bảo Hành',
        'type': 'Static'
    },
    {
        'path': 'dist/404.html',
        'url': 'https://noithatphatloc.com/404.html',
        'name': 'Trang 404',
        'type': 'Static'
    }
]

print("=====================================================================")
print("          KIỂM THỬ TOÀN BỘ BẢN BUILD LEAN SEO PHÁT LỘC              ")
print("=====================================================================")

results = []

for p in pages:
    file_path = p['path']
    if not os.path.exists(file_path):
        results.append({
            'page': p['name'],
            'url': p['url'],
            'error': f'File not found: {file_path}'
        })
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    # 1. Title
    title = soup.title.string.strip() if soup.title and soup.title.string else 'KHÔNG CÓ TITLE'
    title_len = len(title)

    # 2. Description
    desc_tag = soup.find('meta', attrs={'name': 'description'})
    desc = desc_tag['content'].strip() if desc_tag and desc_tag.get('content') else 'KHÔNG CÓ DESCRIPTION'
    desc_len = len(desc)

    # 3. Canonical
    canonical_tag = soup.find('link', attrs={'rel': 'canonical'})
    canonical = canonical_tag['href'] if canonical_tag and canonical_tag.get('href') else 'KHÔNG CÓ CANONICAL'

    # 4. Headings
    h1_tags = [h.get_text(strip=True) for h in soup.find_all('h1')]
    h2_tags = [h.get_text(strip=True) for h in soup.find_all('h2')]

    # 5. Schema
    schema_tags = soup.find_all('script', type='application/ld+json')
    schema_types = []
    schema_valid = True
    has_price = False

    for s in schema_tags:
        try:
            data = json.loads(s.string)
            dumped = json.dumps(data)
            if '"price"' in dumped:
                has_price = True
            if '@graph' in data:
                for item in data['@graph']:
                    t = item.get('@type')
                    schema_types.append(t if isinstance(t, str) else '/'.join(t))
            else:
                t = data.get('@type')
                schema_types.append(t if isinstance(t, str) else '/'.join(t))
        except Exception as e:
            schema_valid = False

    # 6. Address check
    has_long_binh_addr = bool(re.search(r'(?:Khu phố 13|KP 13)[,\s]+(?:Phường\s+)?Long Bình', html))
    has_tam_hiep_addr = bool(re.search(r'(?:Khu phố 13|KP 13)[,\s]+(?:Phường\s+)?Tam Hiệp', html))

    # 7. Contact CTA check
    has_tel = 'tel:0585338339' in html
    has_zalo = 'zalo.me/0585338339' in html

    # 8. Images check
    imgs = soup.find_all('img')
    img_count = len(imgs)
    imgs_no_alt = [img.get('src') for img in imgs if not img.get('alt')]

    res = {
        'page': p['name'],
        'url': p['url'],
        'title': title,
        'title_len': title_len,
        'desc_len': desc_len,
        'desc': desc[:90] + '...' if len(desc) > 90 else desc,
        'canonical_ok': canonical == p['url'] or p['name'] == 'Trang 404',
        'h1_count': len(h1_tags),
        'h1_text': h1_tags[0] if h1_tags else 'KHÔNG CÓ H1',
        'h2_count': len(h2_tags),
        'schema_types': schema_types,
        'schema_valid': schema_valid,
        'has_price': has_price,
        'has_long_binh_addr': has_long_binh_addr,
        'has_tam_hiep_addr': has_tam_hiep_addr,
        'has_tel': has_tel,
        'has_zalo': has_zalo,
        'img_count': img_count,
        'imgs_no_alt_count': len(imgs_no_alt)
    }
    results.append(res)

for r in results:
    print(f"\n--- [{r['page']}] ({r['url']}) ---")
    print(f"  * Title ({r['title_len']} ký tự): {r['title']}")
    print(f"  * Meta Description ({r['desc_len']} ký tự): {r['desc']}")
    print(f"  * Canonical: {'ĐÚNG' if r['canonical_ok'] else 'SAI LỆCH'}")
    print(f"  * H1 (Số lượng: {r['h1_count']}): {r['h1_text']}")
    print(f"  * H2 (Số lượng: {r['h2_count']})")
    print(f"  * Schema JSON-LD: Types={r['schema_types']} | Hợp lệ={r['schema_valid']} | Có giá nội bộ={r['has_price']}")
    print(f"  * Địa chỉ: Có Long Bình={r['has_long_binh_addr']} | Còn sót địa chỉ Tam Hiệp={r['has_tam_hiep_addr']}")
    print(f"  * Chức năng liên hệ: Hotline (0585 338 339)={r['has_tel']} | Zalo={r['has_zalo']}")
    print(f"  * Hình ảnh: Tổng số={r['img_count']} | Thiếu Alt={r['imgs_no_alt_count']}")
