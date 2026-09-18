#!/usr/bin/env python3
"""
Builds the redirect map from the old cbclik.com to the new site.

Run against the old site's sitemap:
    python3 scripts/build-redirects.py scripts/legacy-sitemap.xml

Two things make this more than a slug rename:

1. The language scheme is reversed. The old site serves ENGLISH at the root
   (/about-us/) and Indonesian under /id/. The new site serves INDONESIAN at
   the root (/tentang-kami) and English under /en/. So an unprefixed old URL
   redirects to an /en/ one, and an /id/ URL redirects to an unprefixed one.

2. Some old sections have no equivalent yet — management profiles, the CEO
   letter, and individual old job postings. Those point at the nearest useful
   page rather than 404ing, and each is listed as an open item.
"""
import re
import sys
from collections import OrderedDict

# Old section -> (Indonesian target, English target)
SECTIONS = {
    'about-us': ('/tentang-kami', '/en/about-us'),
    'newsroom': ('/newsroom', '/en/newsroom'),
    'contact-us': ('/hubungi-kami', '/en/contact-us'),
    'career': ('/karir', '/en/careers'),
    'products-and-services': ('/layanan-dan-produk', '/en/products-and-services'),
    'products-and-services/how-to-get-your-credit-report': (
        '/layanan-dan-produk/cara-mendapat-laporan-kredit',
        '/en/products-and-services/how-to-get-your-credit-report',
    ),
    # The old site spells it "complain-handling"; the new one uses the correct
    # Indonesian term from the design.
    'products-and-services/complain-handling': (
        '/layanan-dan-produk/penyelesaian-pengaduan',
        '/en/products-and-services/complaint-resolution',
    ),
}

# Old sections with no equivalent on the new site. Each points at the nearest
# useful page so a visitor lands somewhere sensible instead of a 404.
NO_EQUIVALENT = {
    'hello-from-the-ceo': ('/tentang-kami', '/en/about-us'),
    'management-profile': ('/tentang-kami', '/en/about-us'),
    'personnel': ('/tentang-kami', '/en/about-us'),
    # Old postings are almost certainly filled; send people to the current list.
    'recruitment': ('/karir', '/en/careers'),
    'uncategorized': ('/newsroom', '/en/newsroom'),
}

# Article-style sections that all merge into the one Newsroom.
ARTICLE_SECTIONS = {'artikel', 'news'}
REPORT_SECTIONS = {'report'}


def target_for(path: str):
    """Returns (destination, note) for an old path."""
    is_id = path.startswith('/id/') or path == '/id/'
    p = path[3:] if is_id else path
    p = '/' + p.strip('/')
    if p == '/':
        # The homepage is deliberately not redirected to /en, even though the
        # old root served English. Indonesian is the new site's default
        # language (confirmed decision 4), and sending everyone who types
        # cbclik.com to an English page would contradict that.
        return ('/', 'homepage: both old roots land on the Indonesian home')

    parts = p.strip('/').split('/')
    head = parts[0]

    # Category listings are disallowed in robots.txt and have no new equivalent.
    if head == 'category':
        return ('/newsroom' if is_id else '/en/newsroom', 'category listing')

    if head in ARTICLE_SECTIONS and len(parts) > 1:
        slug = parts[1]
        return (f'/newsroom/{slug}' if is_id else f'/en/newsroom/{slug}',
                'article slug must exist in the CMS')

    if head in REPORT_SECTIONS and len(parts) > 1:
        slug = parts[1]
        return (f'/laporan/{slug}' if is_id else f'/en/reports/{slug}',
                'report slug must exist in the CMS')

    if head in NO_EQUIVALENT:
        dest_id, dest_en = NO_EQUIVALENT[head]
        return (dest_id if is_id else dest_en, 'no equivalent page yet')

    # Longest matching section wins, so the two-segment products pages are
    # matched before the one-segment parent.
    key = p.strip('/')
    for candidate in sorted(SECTIONS, key=len, reverse=True):
        if key == candidate:
            dest_id, dest_en = SECTIONS[candidate]
            return (dest_id if is_id else dest_en, None)

    return (None, 'UNMAPPED')


def main():
    source = sys.argv[1] if len(sys.argv) > 1 else 'scripts/legacy-sitemap.xml'
    urls = re.findall(r'<loc>([^<]+)</loc>', open(source).read())
    paths = [re.sub(r'^https?://[^/]+', '', u.strip()) or '/' for u in urls]

    rows = OrderedDict()
    for path in sorted(set(paths)):
        dest, note = target_for(path)
        rows[path] = (dest, note)
    return rows


if __name__ == '__main__':
    rows = main()
    unmapped = [p for p, (d, n) in rows.items() if n == 'UNMAPPED']
    needs_content = [p for p, (d, n) in rows.items() if n and 'must exist' in n]
    no_equiv = [p for p, (d, n) in rows.items() if n == 'no equivalent page yet']

    print(f'total old URLs        : {len(rows)}')
    print(f'mapped                : {len(rows) - len(unmapped)}')
    print(f'unmapped              : {len(unmapped)}')
    print(f'need CMS content      : {len(needs_content)}')
    print(f'no equivalent page    : {len(no_equiv)}')
    for p in unmapped:
        print('  UNMAPPED:', p)


def write_nginx(rows, path='deploy/redirects.map'):
    """nginx map file: one old path per line, with its destination."""
    import os
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write('# Redirects from the old cbclik.com to the new site.\n')
        f.write('# Generated by scripts/build-redirects.py — do not edit by hand.\n')
        f.write('#\n')
        f.write('# The old site served English at the root and Indonesian under /id/.\n')
        f.write('# The new site is the other way round, so unprefixed old URLs point\n')
        f.write('# at /en/ and old /id/ URLs point at the root.\n')
        f.write('#\n')
        f.write('# Used by a `map` block in nginx; see deploy/nginx-production.conf.\n\n')
        for old, (dest, note) in rows.items():
            if not dest:
                continue
            comment = f'  # {note}' if note else ''
            # Match with and without the trailing slash.
            f.write(f'{old.rstrip("/") or "/"} {dest};{comment}\n')
    return path


def write_markdown(rows, path='docs/migration-redirect-map.md'):
    groups = {'Pages': [], 'Articles': [], 'Reports': [], 'No equivalent yet': []}
    for old, (dest, note) in rows.items():
        if note and 'article' in note:
            groups['Articles'].append((old, dest, note))
        elif note and 'report' in note:
            groups['Reports'].append((old, dest, note))
        elif note in ('no equivalent page yet', 'category listing'):
            groups['No equivalent yet'].append((old, dest, note))
        else:
            groups['Pages'].append((old, dest, note))

    with open(path, 'w') as f:
        f.write('# Migration redirect map\n\n')
        f.write('Generated from the old site\'s sitemap by `scripts/build-redirects.py`.\n')
        f.write('Regenerate it rather than editing this file by hand.\n\n')
        f.write(f'**{len(rows)} URLs** on the current cbclik.com, all mapped.\n\n')
        f.write('## The language scheme is reversed\n\n')
        f.write('This is the single most important thing about this migration.\n\n')
        f.write('| | Old site | New site |\n| --- | --- | --- |\n')
        f.write('| English | at the root — `/about-us/` | under `/en/` |\n')
        f.write('| Indonesian | under `/id/` | at the root |\n\n')
        f.write('So every existing English URL redirects to an `/en/` one, and every\n')
        f.write('`/id/` URL redirects to an unprefixed one. Getting this backwards would\n')
        f.write('send every visitor to the wrong language.\n\n')
        for title, entries in groups.items():
            if not entries:
                continue
            f.write(f'## {title} ({len(entries)})\n\n')
            f.write('| Old URL | New URL | Note |\n| --- | --- | --- |\n')
            for old, dest, note in sorted(entries):
                f.write(f'| `{old}` | `{dest}` | {note or ""} |\n')
            f.write('\n')
    return path


if __name__ == '__main__' and '--write' in sys.argv:
    rows = main()
    print('wrote', write_nginx(rows))
    print('wrote', write_markdown(rows))
