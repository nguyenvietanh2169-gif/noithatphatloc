import os
import re
import json
from bs4 import BeautifulSoup

dist_dir = 'dist'
html_files = []

for root, dirs, files in os.walk(dist_dir):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))

print(f'Total HTML files found: {len(html_files)}')

security_violations = []
schema_issues = []
title_meta_status = []

# Sensitive keywords forbidden by security rule
forbidden_patterns = [
    r'\b\d{1,3}(?:\.\d{3}){2}\b', # e.g. 2.400.000
    r'\b\d{7,}\b', # big numbers that look like prices
    r'triệu\s*\/\s*(?:m2|md|mét|mét dài)',
    r'chi\s*phí\s*sản\s*xuất',
    r'giá\s*nhập',
    r'lợi\s*nhuận',
    r'chiết\s*khấu',
    r'đơn\s*giá\s*mét',
]

phone_and_mst_exceptions = ['3604065485', '0585338339', '0836084719', '0908938297', '8360847198', '84585338339', '84836084719']

for path in sorted(html_files):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check security
    for pat in forbidden_patterns:
        matches = re.findall(pat, content, re.IGNORECASE)
        # filter out phone numbers and MST
        real_matches = [m for m in matches if m not in phone_and_mst_exceptions]
        if real_matches:
            security_violations.append((path, pat, real_matches))

    soup = BeautifulSoup(content, 'html.parser')
    title = soup.title.string.strip() if soup.title and soup.title.string else 'NO TITLE'
    title_meta_status.append((path, len(title), title))

    # Check Schema JSON-LD
    scripts = soup.find_all('script', type='application/ld+json')
    for s in scripts:
        try:
            data = json.loads(s.string)
            # verify no price in schema
            dumped = json.dumps(data)
            if '"price"' in dumped:
                schema_issues.append((path, 'Contains "price" field!'))
        except Exception as e:
            schema_issues.append((path, f'JSON parse error: {e}'))

print('\n=== SECURITY AUDIT RESULT ===')
if security_violations:
    print('VIOLATIONS FOUND:')
    for v in security_violations:
        print('  -', v)
else:
    print('PASSED: 100% CLEAN - No price tables, unit rates, production costs, or discounts detected.')

print('\n=== SCHEMA AUDIT RESULT ===')
if schema_issues:
    print('SCHEMA ISSUES:')
    for s in schema_issues:
        print('  -', s)
else:
    print('PASSED: 100% CLEAN - All schemas valid JSON with zero pricing fields.')

print('\n=== TITLE AUDIT RESULT ===')
for path, length, title in title_meta_status:
    status = 'OK' if length <= 70 else 'TOO LONG'
    print(f'[{status}] ({length} chars) {path} -> {title}')
